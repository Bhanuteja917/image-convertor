import { describe, expect, it } from "vitest";
import { flattenAlpha, hasTransparency, parseHexColor } from "../../lib/convert/transparency";
import type { RawImageData } from "../../lib/convert/types";

function makeImage(pixels: Array<[number, number, number, number]>): RawImageData {
  const data = new Uint8ClampedArray(pixels.length * 4);
  pixels.forEach(([r, g, b, a], i) => {
    data.set([r, g, b, a], i * 4);
  });
  return { width: pixels.length, height: 1, data };
}

describe("parseHexColor", () => {
  it("parses 6-digit hex", () => {
    expect(parseHexColor("#ff0080")).toEqual({ r: 255, g: 0, b: 128 });
  });

  it("parses 3-digit hex shorthand", () => {
    expect(parseHexColor("#f08")).toEqual({ r: 255, g: 0, b: 136 });
  });

  it("tolerates a missing leading #", () => {
    expect(parseHexColor("ffffff")).toEqual({ r: 255, g: 255, b: 255 });
  });

  it("throws on garbage input", () => {
    expect(() => parseHexColor("not-a-color")).toThrow();
  });
});

describe("hasTransparency", () => {
  it("is false for a fully opaque image", () => {
    const image = makeImage([
      [10, 20, 30, 255],
      [40, 50, 60, 255],
    ]);
    expect(hasTransparency(image)).toBe(false);
  });

  it("is true when any pixel has alpha < 255", () => {
    const image = makeImage([
      [10, 20, 30, 255],
      [40, 50, 60, 254],
    ]);
    expect(hasTransparency(image)).toBe(true);
  });

  it("is true for a fully transparent image", () => {
    const image = makeImage([[0, 0, 0, 0]]);
    expect(hasTransparency(image)).toBe(true);
  });
});

describe("flattenAlpha", () => {
  it("leaves a fully opaque pixel's color untouched", () => {
    const image = makeImage([[200, 100, 50, 255]]);
    const flattened = flattenAlpha(image, "#000000");
    expect(Array.from(flattened.data)).toEqual([200, 100, 50, 255]);
  });

  it("replaces a fully transparent pixel with the background color", () => {
    const image = makeImage([[200, 100, 50, 0]]);
    const flattened = flattenAlpha(image, "#00ff00");
    expect(Array.from(flattened.data)).toEqual([0, 255, 0, 255]);
  });

  it("blends a half-transparent pixel proportionally over the background", () => {
    const image = makeImage([[255, 255, 255, 128]]);
    const flattened = flattenAlpha(image, "#000000");
    // alpha ~0.502 -> ~128 for each channel blended toward black background
    expect(flattened.data[0]).toBeGreaterThan(120);
    expect(flattened.data[0]).toBeLessThan(135);
    expect(flattened.data[3]).toBe(255);
  });

  it("defaults background handling produces fully opaque output for every pixel", () => {
    const image = makeImage([
      [1, 2, 3, 0],
      [4, 5, 6, 100],
      [7, 8, 9, 255],
    ]);
    const flattened = flattenAlpha(image, "#ffffff");
    expect(hasTransparency(flattened)).toBe(false);
  });

  it("does not mutate the input image", () => {
    const image = makeImage([[10, 20, 30, 100]]);
    const original = Array.from(image.data);
    flattenAlpha(image, "#ffffff");
    expect(Array.from(image.data)).toEqual(original);
  });
});
