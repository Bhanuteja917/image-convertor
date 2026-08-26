import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { detectFormat, mimeTypeFor } from "../../lib/convert/detect";

const FIXTURES = join(__dirname, "..", "fixtures");

function load(name: string): Uint8Array<ArrayBuffer> {
  return new Uint8Array(readFileSync(join(FIXTURES, name))) as Uint8Array<ArrayBuffer>;
}

describe("detectFormat", () => {
  it("detects JPEG by magic bytes", () => {
    expect(detectFormat(load("sample.jpg")).format).toBe("jpeg");
  });

  it("detects PNG by magic bytes", () => {
    expect(detectFormat(load("sample.png")).format).toBe("png");
  });

  it("detects WebP (RIFF....WEBP)", () => {
    expect(detectFormat(load("sample.webp")).format).toBe("webp");
  });

  it("detects BMP", () => {
    expect(detectFormat(load("sample.bmp")).format).toBe("bmp");
  });

  it("detects GIF", () => {
    expect(detectFormat(load("sample.gif")).format).toBe("gif");
  });

  it("detects HEIC via ftyp brand", () => {
    expect(detectFormat(load("sample.heic")).format).toBe("heic");
  });

  it("ignores a lying file extension and sniffs real bytes instead", () => {
    // sample.png's actual bytes, regardless of what a caller names the file.
    const bytes = load("sample.png");
    expect(detectFormat(bytes).format).toBe("png");
  });

  it("reports unknown for a non-image / garbage buffer", () => {
    const bytes = new TextEncoder().encode("this is definitely not an image");
    expect(detectFormat(bytes).format).toBe("unknown");
  });

  it("reports unknown for an empty buffer", () => {
    expect(detectFormat(new Uint8Array(0)).format).toBe("unknown");
  });

  it("does not misclassify an AVIF ftyp brand as HEIC", () => {
    const bytes = new Uint8Array(16);
    // box size (4) + "ftyp" + "avif" brand
    bytes.set([0, 0, 0, 20], 0);
    bytes.set(new TextEncoder().encode("ftyp"), 4);
    bytes.set(new TextEncoder().encode("avif"), 8);
    expect(detectFormat(bytes).format).toBe("unknown");
  });

  it("returns the matching mime type alongside the format", () => {
    expect(detectFormat(load("sample.jpg")).mimeType).toBe("image/jpeg");
    expect(mimeTypeFor("heic")).toBe("image/heic");
  });
});
