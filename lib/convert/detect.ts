import type { DetectedFormat, InputFormat } from "./types";

const HEIC_BRANDS = new Set([
  "heic",
  "heix",
  "hevc",
  "hevx",
  "heim",
  "heis",
  "hevm",
  "hevs",
  "mif1",
  "msf1",
]);

function ascii(bytes: Uint8Array<ArrayBuffer>, start: number, length: number): string {
  if (start < 0 || start + length > bytes.length) return "";
  let out = "";
  for (let i = 0; i < length; i++) {
    out += String.fromCharCode(bytes[start + i]!);
  }
  return out;
}

function matches(bytes: Uint8Array<ArrayBuffer>, offset: number, sequence: number[]): boolean {
  if (offset + sequence.length > bytes.length) return false;
  for (let i = 0; i < sequence.length; i++) {
    if (bytes[offset + i] !== sequence[i]) return false;
  }
  return true;
}

const MIME_TYPES: Record<InputFormat, string> = {
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  heic: "image/heic",
  bmp: "image/bmp",
  gif: "image/gif",
};

/**
 * Sniffs an image's real format from its magic bytes, ignoring any
 * (possibly wrong or missing) file extension / declared MIME type.
 */
export function detectFormat(bytes: Uint8Array<ArrayBuffer>): DetectedFormat {
  if (matches(bytes, 0, [0xff, 0xd8, 0xff])) {
    return { format: "jpeg", mimeType: MIME_TYPES.jpeg };
  }

  if (matches(bytes, 0, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return { format: "png", mimeType: MIME_TYPES.png };
  }

  if (matches(bytes, 0, [0x47, 0x49, 0x46, 0x38]) && (bytes[4] === 0x37 || bytes[4] === 0x39) && bytes[5] === 0x61) {
    return { format: "gif", mimeType: MIME_TYPES.gif };
  }

  if (matches(bytes, 0, [0x42, 0x4d])) {
    return { format: "bmp", mimeType: MIME_TYPES.bmp };
  }

  if (ascii(bytes, 0, 4) === "RIFF" && ascii(bytes, 8, 4) === "WEBP") {
    return { format: "webp", mimeType: MIME_TYPES.webp };
  }

  if (ascii(bytes, 4, 4) === "ftyp") {
    const brand = ascii(bytes, 8, 4).trim().toLowerCase();
    if (HEIC_BRANDS.has(brand)) {
      return { format: "heic", mimeType: MIME_TYPES.heic };
    }
    // Explicitly not HEIC (e.g. "avif"/"avis" or other ISOBMFF brands) -
    // fall through to unknown rather than misreporting the format.
  }

  return { format: "unknown", mimeType: "application/octet-stream" };
}

export function mimeTypeFor(format: InputFormat): string {
  return MIME_TYPES[format];
}
