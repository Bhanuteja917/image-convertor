const SOI = 0xd8;
const APP1 = 0xe1;
const SOS = 0xda;
const EOI = 0xd9;
const EXIF_HEADER = "Exif\0\0";

function isStandaloneMarker(marker: number): boolean {
  // RST0-RST7 and TEM carry no length/payload.
  return (marker >= 0xd0 && marker <= 0xd7) || marker === 0x01;
}

function readAscii(bytes: Uint8Array<ArrayBuffer>, start: number, length: number): string {
  let out = "";
  for (let i = 0; i < length && start + i < bytes.length; i++) {
    out += String.fromCharCode(bytes[start + i]!);
  }
  return out;
}

interface JpegSegment {
  marker: number;
  /** Offset of the 0xFF byte that starts this segment. */
  start: number;
  /** Offset one past the end of this segment (marker + length bytes + payload). */
  end: number;
  /** Offset of the payload, i.e. start + 4 (marker + 2 length bytes). */
  payloadStart: number;
}

/**
 * Walks a JPEG's marker segments up to (not including) the start-of-scan.
 * EXIF/APP1 always appears before SOS, so we never need to touch the
 * entropy-coded image data itself.
 */
function* iterateSegments(bytes: Uint8Array<ArrayBuffer>): Generator<JpegSegment> {
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== SOI) return;

  let pos = 2;
  while (pos + 1 < bytes.length) {
    if (bytes[pos] !== 0xff) return; // malformed - stop scanning defensively
    const marker = bytes[pos + 1]!;

    if (marker === SOS || marker === EOI) return;

    if (isStandaloneMarker(marker)) {
      pos += 2;
      continue;
    }

    if (pos + 3 >= bytes.length) return;
    const length = (bytes[pos + 2]! << 8) | bytes[pos + 3]!;
    const start = pos;
    const payloadStart = pos + 4;
    const end = pos + 2 + length;
    if (end > bytes.length) return;

    yield { marker, start, end, payloadStart };
    pos = end;
  }
}

function isExifApp1(bytes: Uint8Array<ArrayBuffer>, segment: JpegSegment): boolean {
  return segment.marker === APP1 && readAscii(bytes, segment.payloadStart, EXIF_HEADER.length) === EXIF_HEADER;
}

/**
 * Returns the raw bytes of the JPEG's EXIF APP1 segment (including the
 * marker and length header), or null if it has none.
 */
export function extractExifSegment(bytes: Uint8Array<ArrayBuffer>): Uint8Array<ArrayBuffer> | null {
  for (const segment of iterateSegments(bytes)) {
    if (isExifApp1(bytes, segment)) {
      return bytes.slice(segment.start, segment.end);
    }
  }
  return null;
}

/** Returns a copy of the JPEG with any EXIF APP1 segment(s) removed. */
export function stripExif(bytes: Uint8Array<ArrayBuffer>): Uint8Array<ArrayBuffer> {
  const cuts: Array<{ start: number; end: number }> = [];
  for (const segment of iterateSegments(bytes)) {
    if (isExifApp1(bytes, segment)) {
      cuts.push(segment);
    }
  }
  if (cuts.length === 0) return bytes.slice();

  const out = new Uint8Array(bytes.length - cuts.reduce((sum, c) => sum + (c.end - c.start), 0));
  let src = 0;
  let dst = 0;
  for (const cut of cuts) {
    out.set(bytes.subarray(src, cut.start), dst);
    dst += cut.start - src;
    src = cut.end;
  }
  out.set(bytes.subarray(src), dst);
  return out;
}

/**
 * Re-inserts a previously-extracted EXIF APP1 segment into a (metadata-free)
 * JPEG, immediately after the SOI marker. Used to preserve EXIF through a
 * canvas re-encode, which always strips metadata on its own.
 */
export function injectExifSegment(bytes: Uint8Array<ArrayBuffer>, exifSegment: Uint8Array<ArrayBuffer>): Uint8Array<ArrayBuffer> {
  if (bytes.length < 2 || bytes[0] !== 0xff || bytes[1] !== SOI) return bytes.slice();

  const out = new Uint8Array(bytes.length + exifSegment.length);
  out.set(bytes.subarray(0, 2), 0);
  out.set(exifSegment, 2);
  out.set(bytes.subarray(2), 2 + exifSegment.length);
  return out;
}

/**
 * Reads the EXIF orientation tag (1-8) from a JPEG, defaulting to 1
 * (normal, no rotation/flip needed) when absent or unparsable.
 */
export function readOrientation(bytes: Uint8Array<ArrayBuffer>): number {
  const exifSegment = extractExifSegment(bytes);
  if (!exifSegment) return 1;

  const tiffStart = 4 + EXIF_HEADER.length; // skip APP1 marker(2) + length(2) + "Exif\0\0"
  if (exifSegment.length < tiffStart + 8) return 1;

  const view = new DataView(exifSegment.buffer, exifSegment.byteOffset, exifSegment.byteLength);
  const byteOrderMark = readAscii(exifSegment, tiffStart, 2);
  const littleEndian = byteOrderMark === "II";
  if (!littleEndian && byteOrderMark !== "MM") return 1;

  const magic = view.getUint16(tiffStart + 2, littleEndian);
  if (magic !== 42) return 1;

  const ifd0Offset = view.getUint32(tiffStart + 4, littleEndian);
  const ifd0Start = tiffStart + ifd0Offset;
  if (ifd0Start + 2 > exifSegment.length) return 1;

  const entryCount = view.getUint16(ifd0Start, littleEndian);
  for (let i = 0; i < entryCount; i++) {
    const entryOffset = ifd0Start + 2 + i * 12;
    if (entryOffset + 12 > exifSegment.length) break;
    const tag = view.getUint16(entryOffset, littleEndian);
    if (tag === 0x0112) {
      const value = view.getUint16(entryOffset + 8, littleEndian);
      return value >= 1 && value <= 8 ? value : 1;
    }
  }
  return 1;
}

export function hasExif(bytes: Uint8Array<ArrayBuffer>): boolean {
  return extractExifSegment(bytes) !== null;
}
