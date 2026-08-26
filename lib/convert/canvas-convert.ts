import { decodeFailedError, encodeFailedError, missingCodecError } from "./errors";
import type { OutputFormat, RawImageData } from "./types";

const OUTPUT_MIME: Record<OutputFormat, string> = {
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

/** Canvas dimensions after correcting for an EXIF orientation (5-8 rotate 90/270 degrees, swapping w/h). */
function orientedSize(orientation: number, width: number, height: number): { width: number; height: number } {
  return orientation >= 5 && orientation <= 8 ? { width: height, height: width } : { width, height };
}

/**
 * Applies the canvas transform matrix for a given EXIF orientation (1-8) so
 * that drawing the still-"raw" source image afterwards produces
 * right-side-up pixels. `width`/`height` are the *source* image's own
 * (pre-correction) dimensions.
 */
function applyOrientationTransform(
  ctx: OffscreenCanvasRenderingContext2D,
  orientation: number,
  width: number,
  height: number,
): void {
  switch (orientation) {
    case 2:
      ctx.transform(-1, 0, 0, 1, width, 0);
      break;
    case 3:
      ctx.transform(-1, 0, 0, -1, width, height);
      break;
    case 4:
      ctx.transform(1, 0, 0, -1, 0, height);
      break;
    case 5:
      ctx.transform(0, 1, 1, 0, 0, 0);
      break;
    case 6:
      ctx.transform(0, 1, -1, 0, height, 0);
      break;
    case 7:
      ctx.transform(0, -1, -1, 0, height, width);
      break;
    case 8:
      ctx.transform(0, -1, 1, 0, 0, width);
      break;
    default:
      break; // 1 = normal, no transform needed
  }
}

/**
 * Decodes an encoded image (JPEG/PNG/WebP/BMP/GIF/natively-supported HEIC)
 * into raw RGBA pixels via OffscreenCanvas, applying an EXIF orientation
 * correction if one is given (JPEGs only - other formats pass orientation 1).
 */
export async function decodeToImageData(
  bytes: Uint8Array<ArrayBuffer>,
  mimeType: string,
  orientation = 1,
): Promise<RawImageData> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(new Blob([new Uint8Array(bytes)], { type: mimeType }), {
      imageOrientation: "none",
    });
  } catch (cause) {
    throw decodeFailedError(mimeType, cause);
  }

  const { width, height } = orientedSize(orientation, bitmap.width, bitmap.height);
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw encodeFailedError(new Error("2D canvas context unavailable"));

  applyOrientationTransform(ctx, orientation, bitmap.width, bitmap.height);
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();

  const imageData = ctx.getImageData(0, 0, width, height);
  return { width, height, data: imageData.data };
}

/** Encodes raw RGBA pixels to a JPEG/PNG/WebP blob via OffscreenCanvas. */
export async function encodeFromImageData(
  image: RawImageData,
  format: OutputFormat,
  quality: number,
): Promise<Blob> {
  if (format === "webp" && typeof OffscreenCanvas === "undefined") {
    throw missingCodecError("WebP encoding");
  }

  const canvas = new OffscreenCanvas(image.width, image.height);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw encodeFailedError(new Error("2D canvas context unavailable"));

  const imageData = new ImageData(image.data, image.width, image.height);
  ctx.putImageData(imageData, 0, 0);

  try {
    return await canvas.convertToBlob({
      type: OUTPUT_MIME[format],
      quality: format === "png" ? undefined : quality,
    });
  } catch (cause) {
    throw encodeFailedError(cause);
  }
}
