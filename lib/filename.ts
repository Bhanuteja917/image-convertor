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
