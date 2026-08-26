import type { OutputFormat, SizeEstimateParams } from "./types";

// Rough empirical bytes-per-pixel bounds for photographic content. These are
// deliberately simple - good enough to drive a live "estimated size" readout
// while dragging the quality slider, not a guarantee of actual encoder output
// (which depends on image complexity we don't attempt to model here).
const MAX_BYTES_PER_PIXEL: Record<OutputFormat, number> = {
  jpeg: 0.9,
  webp: 0.65, // WebP is consistently smaller than JPEG at comparable quality
  png: 3,
};

const MIN_BYTES_PER_PIXEL: Record<OutputFormat, number> = {
  jpeg: 0.05,
  webp: 0.03,
  png: 3,
};

function clampQuality(quality: number): number {
  if (Number.isNaN(quality)) return 0.85;
  return Math.min(1, Math.max(0, quality));
}

/**
 * Estimates output file size in bytes for the given target format/quality.
 * PNG is lossless, so its estimate ignores quality and instead blends a
 * pixel-count-based estimate with the original file size as an anchor.
 */
export function estimateOutputSize(params: SizeEstimateParams): number {
  const { width, height, format, originalSize } = params;
  const pixels = Math.max(0, width) * Math.max(0, height);

  if (format === "png") {
    const base = pixels * MAX_BYTES_PER_PIXEL.png;
    return Math.round(originalSize > 0 ? (base + originalSize) / 2 : base);
  }

  const quality = clampQuality(params.quality);
  const min = MIN_BYTES_PER_PIXEL[format];
  const max = MAX_BYTES_PER_PIXEL[format];
  // Quality maps roughly super-linearly onto size for typical JPEG/WebP encoders.
  const bytesPerPixel = min + (max - min) * quality ** 1.7;
  return Math.round(pixels * bytesPerPixel);
}
