import { describe, expect, it } from "vitest";
import { dedupeFileName, outputFileName } from "../lib/filename";

describe("outputFileName", () => {
  it("replaces the extension with the target format", () => {
    expect(outputFileName("photo.HEIC", "jpeg")).toBe("photo.jpg");
    expect(outputFileName("graphic.jpg", "png")).toBe("graphic.png");
  });

  it("falls back to a sane name when there's no extension or name", () => {
    expect(outputFileName("noext", "webp")).toBe("noext.webp");
  });
});

describe("dedupeFileName", () => {
  it("returns the name unchanged when it hasn't been used", () => {
    const used = new Set<string>();
    expect(dedupeFileName("photo.jpg", used)).toBe("photo.jpg");
  });

  it("appends a numeric suffix on collision, preserving the extension", () => {
    const used = new Set<string>();
    dedupeFileName("photo.jpg", used);
    expect(dedupeFileName("photo.jpg", used)).toBe("photo (2).jpg");
  });

  it("keeps incrementing past existing numbered collisions", () => {
    const used = new Set(["photo.jpg", "photo (2).jpg"]);
    expect(dedupeFileName("photo.jpg", used)).toBe("photo (3).jpg");
  });

  it("regression: converting sample.jpg, sample.png, sample.bmp, sample.gif to the same output format never collides", () => {
    const used = new Set<string>();
    const names = ["sample.jpg", "sample.png", "sample.bmp", "sample.gif"].map((name) =>
      dedupeFileName(outputFileName(name, "jpeg"), used),
    );
    expect(new Set(names).size).toBe(4);
  });
});
