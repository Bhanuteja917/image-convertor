import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  extractExifSegment,
  hasExif,
  injectExifSegment,
  readOrientation,
  stripExif,
} from "../../lib/convert/exif";

const FIXTURES = join(__dirname, "..", "fixtures");

function load(name: string): Uint8Array<ArrayBuffer> {
  return new Uint8Array(readFileSync(join(FIXTURES, name))) as Uint8Array<ArrayBuffer>;
}

describe("EXIF handling", () => {
  it("detects EXIF presence on a JPEG that carries it", () => {
    expect(hasExif(load("sample.jpg"))).toBe(true);
  });

  it("detects EXIF absence on a JPEG that doesn't carry it", () => {
    expect(hasExif(load("sample-no-exif.jpg"))).toBe(false);
  });

  it("reads the orientation tag baked into the fixture (6)", () => {
    expect(readOrientation(load("sample.jpg"))).toBe(6);
  });

  it("defaults orientation to 1 when there is no EXIF", () => {
    expect(readOrientation(load("sample-no-exif.jpg"))).toBe(1);
  });

  it("strips the APP1/EXIF segment from the output bytes", () => {
    const stripped = stripExif(load("sample.jpg"));
    expect(hasExif(stripped)).toBe(false);
    // Stripping must not corrupt the rest of the JPEG structure.
    expect(stripped[0]).toBe(0xff);
    expect(stripped[1]).toBe(0xd8);
  });

  it("stripExif is a no-op (byte-for-byte) on a JPEG with no EXIF", () => {
    const original = load("sample-no-exif.jpg");
    const stripped = stripExif(original);
    expect(Array.from(stripped)).toEqual(Array.from(original));
  });

  it("extracts an EXIF segment that can be re-injected to restore metadata", () => {
    const original = load("sample.jpg");
    const exifSegment = extractExifSegment(original);
    expect(exifSegment).not.toBeNull();

    const stripped = stripExif(original);
    expect(hasExif(stripped)).toBe(false);

    const restored = injectExifSegment(stripped, exifSegment!);
    expect(hasExif(restored)).toBe(true);
    expect(readOrientation(restored)).toBe(6);
  });

  it("extractExifSegment returns null when there is nothing to extract", () => {
    expect(extractExifSegment(load("sample-no-exif.jpg"))).toBeNull();
  });

  it("does not choke on a non-JPEG buffer", () => {
    const bytes = load("sample.png");
    expect(() => stripExif(bytes)).not.toThrow();
    expect(readOrientation(bytes)).toBe(1);
    expect(extractExifSegment(bytes)).toBeNull();
  });
});
