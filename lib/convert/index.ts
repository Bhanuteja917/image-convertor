import { canDecodeHeicNatively, canEncodeWebp } from "./capabilities";
import { decodeToImageData, encodeFromImageData } from "./canvas-convert";
import { detectFormat, mimeTypeFor } from "./detect";
import { corruptFileError, memoryLimitError, missingCodecError, unsupportedFormatError } from "./errors";
import { extractExifSegment, injectExifSegment, readOrientation } from "./exif";
import { decodeHeic } from "./heic-decode";
import { MAX_INPUT_FILE_BYTES } from "./limits";
import { flattenAlpha, hasTransparency } from "./transparency";
import type { ConvertOptions, ConvertResult, InputFormat, RawImageData } from "./types";

export * from "./types";
export * from "./errors";
export { detectFormat, mimeTypeFor } from "./detect";
export { canDecodeHeicNatively, canEncodeWebp } from "./capabilities";
export { estimateOutputSize } from "./size-estimate";
export { hasTransparency, parseHexColor } from "./transparency";
export { hasExif, readOrientation } from "./exif";
export * from "./limits";

/** Sniffs the file's real format and throws a user-facing error if it isn't one we support. */
export function detectAndValidateFormat(bytes: Uint8Array<ArrayBuffer>, fileName: string): InputFormat {
  const { format } = detectFormat(bytes);
  if (format === "unknown") {
    throw unsupportedFormatError(fileName);
  }
  return format;
}

/**
 * Converts a single image file to the requested output format. This is the
 * one function the worker calls - decode, orient, flatten, encode, and
 * (optionally) preserve EXIF are all sequenced here so every input format
 * shares the same pipeline.
 */
export async function convertImage(
  fileBytes: ArrayBuffer,
  fileName: string,
  options: ConvertOptions,
): Promise<ConvertResult> {
  const bytes = new Uint8Array(fileBytes);

  if (bytes.byteLength > MAX_INPUT_FILE_BYTES) {
    throw memoryLimitError(fileName);
  }

  if (options.outputFormat === "webp" && !canEncodeWebp()) {
    throw missingCodecError("WebP encoding");
  }

  const sourceFormat = detectAndValidateFormat(bytes, fileName);
  const quality = options.quality ?? 0.85;
  const stripExif = options.stripExif ?? true;
  const backgroundColor = options.backgroundColor ?? "#ffffff";

  // Real EXIF preservation (toggle off) is implemented for the common
  // JPEG -> JPEG case, where we can losslessly copy the original APP1
  // segment into the freshly-encoded output. Canvas re-encoding strips
  // metadata unconditionally for every other input/output combination
  // (PNG/WebP encoders have no equivalent APP1-style slot we write to, and
  // HEIC's EXIF lives in a different container box we don't parse), so
  // those conversions always come out metadata-free regardless of the toggle.
  const preserveExif = sourceFormat === "jpeg" && options.outputFormat === "jpeg" && !stripExif;
  const exifSegment = preserveExif ? extractExifSegment(bytes) : null;
  const orientation = sourceFormat === "jpeg" ? readOrientation(bytes) : 1;

  let raw: RawImageData;
  try {
    if (sourceFormat === "heic") {
      raw = (await canDecodeHeicNatively())
        ? await decodeToImageData(bytes, "image/heic")
        : await decodeHeic(bytes);
    } else {
      raw = await decodeToImageData(bytes, mimeTypeFor(sourceFormat), orientation);
    }
  } catch (cause) {
    throw corruptFileError(fileName, cause);
  }

  if (options.outputFormat === "jpeg" && hasTransparency(raw)) {
    raw = flattenAlpha(raw, backgroundColor);
  }

  let blob = await encodeFromImageData(raw, options.outputFormat, quality);

  if (exifSegment) {
    const encodedBytes = new Uint8Array(await blob.arrayBuffer());
    blob = new Blob([injectExifSegment(encodedBytes, exifSegment)], { type: "image/jpeg" });
  }

  return {
    blob,
    width: raw.width,
    height: raw.height,
    originalSize: bytes.byteLength,
    outputSize: blob.size,
  };
}
