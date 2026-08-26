import type { RawImageData } from "./types";

/** Parses '#rgb', '#rrggbb' (with or without leading '#') into 0-255 channel values. */
export function parseHexColor(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace(/^#/, "");
  if (clean.length === 3) {
    const r = parseInt(clean[0]! + clean[0], 16);
    const g = parseInt(clean[1]! + clean[1], 16);
    const b = parseInt(clean[2]! + clean[2], 16);
    if ([r, g, b].some(Number.isNaN)) throw new Error(`Invalid color: ${hex}`);
    return { r, g, b };
  }
  if (clean.length === 6) {
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    if ([r, g, b].some(Number.isNaN)) throw new Error(`Invalid color: ${hex}`);
    return { r, g, b };
  }
  throw new Error(`Invalid color: ${hex}`);
}

/** True if any pixel has an alpha value less than fully opaque (255). */
export function hasTransparency(image: RawImageData): boolean {
  const { data } = image;
  for (let i = 3; i < data.length; i += 4) {
    if (data[i]! < 255) return true;
  }
  return false;
}

/**
 * Alpha-composites `image` over a solid background color, returning a new
 * fully-opaque RawImageData. Used before encoding to a format with no alpha
 * channel (JPEG), so transparent pixels don't silently turn black.
 */
export function flattenAlpha(image: RawImageData, backgroundColor: string): RawImageData {
  const { r: bgR, g: bgG, b: bgB } = parseHexColor(backgroundColor);
  const src = image.data;
  const out = new Uint8ClampedArray(src.length);

  for (let i = 0; i < src.length; i += 4) {
    const alpha = src[i + 3]! / 255;
    out[i] = Math.round(src[i]! * alpha + bgR * (1 - alpha));
    out[i + 1] = Math.round(src[i + 1]! * alpha + bgG * (1 - alpha));
    out[i + 2] = Math.round(src[i + 2]! * alpha + bgB * (1 - alpha));
    out[i + 3] = 255;
  }

  return { width: image.width, height: image.height, data: out };
}
