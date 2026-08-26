import { describe, expect, it } from "vitest";
import { estimateOutputSize } from "../../lib/convert/size-estimate";

const DIMENSIONS = { width: 1000, height: 1000 };

describe("estimateOutputSize", () => {
  it("increases as JPEG quality increases", () => {
    const low = estimateOutputSize({ ...DIMENSIONS, format: "jpeg", quality: 0.2, originalSize: 0 });
    const high = estimateOutputSize({ ...DIMENSIONS, format: "jpeg", quality: 0.9, originalSize: 0 });
    expect(high).toBeGreaterThan(low);
  });

  it("increases as WebP quality increases", () => {
    const low = estimateOutputSize({ ...DIMENSIONS, format: "webp", quality: 0.2, originalSize: 0 });
    const high = estimateOutputSize({ ...DIMENSIONS, format: "webp", quality: 0.9, originalSize: 0 });
    expect(high).toBeGreaterThan(low);
  });

  it("estimates WebP smaller than JPEG at the same quality and dimensions", () => {
    const jpeg = estimateOutputSize({ ...DIMENSIONS, format: "jpeg", quality: 0.8, originalSize: 0 });
    const webp = estimateOutputSize({ ...DIMENSIONS, format: "webp", quality: 0.8, originalSize: 0 });
    expect(webp).toBeLessThan(jpeg);
  });

  it("scales roughly with pixel count", () => {
    const small = estimateOutputSize({ width: 100, height: 100, format: "jpeg", quality: 0.8, originalSize: 0 });
    const big = estimateOutputSize({ width: 1000, height: 1000, format: "jpeg", quality: 0.8, originalSize: 0 });
    // 100x area -> roughly 100x estimated bytes
    expect(big).toBeGreaterThan(small * 50);
    expect(big).toBeLessThan(small * 200);
  });

  it("ignores quality for PNG (lossless)", () => {
    const low = estimateOutputSize({ ...DIMENSIONS, format: "png", quality: 0.1, originalSize: 0 });
    const high = estimateOutputSize({ ...DIMENSIONS, format: "png", quality: 0.9, originalSize: 0 });
    expect(low).toBe(high);
  });

  it("returns a non-negative finite number for zero-sized input", () => {
    const result = estimateOutputSize({ width: 0, height: 0, format: "jpeg", quality: 0.5, originalSize: 0 });
    expect(result).toBe(0);
  });

  it("clamps out-of-range quality instead of producing nonsense", () => {
    const overOne = estimateOutputSize({ ...DIMENSIONS, format: "jpeg", quality: 5, originalSize: 0 });
    const maxQuality = estimateOutputSize({ ...DIMENSIONS, format: "jpeg", quality: 1, originalSize: 0 });
    expect(overOne).toBe(maxQuality);

    const negative = estimateOutputSize({ ...DIMENSIONS, format: "jpeg", quality: -5, originalSize: 0 });
    const minQuality = estimateOutputSize({ ...DIMENSIONS, format: "jpeg", quality: 0, originalSize: 0 });
    expect(negative).toBe(minQuality);
  });
});
