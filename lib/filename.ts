import type { OutputFormat } from "./convert";

const EXTENSION: Record<OutputFormat, string> = {
  jpeg: "jpg",
  png: "png",
  webp: "webp",
};

export function outputFileName(originalName: string, format: OutputFormat): string {
  const base = originalName.replace(/\.[^./\\]+$/, "") || "converted";
  return `${base}.${EXTENSION[format]}`;
}

/**
 * Returns a filename guaranteed not to be in `usedNames`, appending " (2)",
 * " (3)", etc. before the extension when there's a collision (e.g. two
 * source files with the same base name but different input formats, like
 * "photo.jpg" and "photo.heic", both converting to "photo.jpg"). Mutates
 * `usedNames` to record the name it returns.
 */
export function dedupeFileName(name: string, usedNames: Set<string>): string {
  if (!usedNames.has(name)) {
    usedNames.add(name);
    return name;
  }

  const dotIndex = name.lastIndexOf(".");
  const base = dotIndex === -1 ? name : name.slice(0, dotIndex);
  const ext = dotIndex === -1 ? "" : name.slice(dotIndex);

  let attempt = 2;
  let candidate = `${base} (${attempt})${ext}`;
  while (usedNames.has(candidate)) {
    attempt += 1;
    candidate = `${base} (${attempt})${ext}`;
  }
  usedNames.add(candidate);
  return candidate;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[unitIndex]}`;
}
