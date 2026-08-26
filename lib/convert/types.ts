export type InputFormat = "jpeg" | "png" | "webp" | "heic" | "bmp" | "gif";

export type OutputFormat = "jpeg" | "png" | "webp";

/**
 * Structurally identical to DOM `ImageData` (width/height/RGBA byte buffer)
 * but declared locally so lib/convert has no dependency on `lib.dom` types
 * and stays testable under plain Node. Real `ImageData` instances satisfy
 * this interface at runtime.
 */
export interface RawImageData {
  width: number;
  height: number;
  data: Uint8ClampedArray<ArrayBuffer>;
}

export interface ConvertOptions {
  outputFormat: OutputFormat;
  /** 0-1, only meaningful for jpeg/webp output. Defaults to 0.85. */
  quality?: number;
  /** Strip EXIF metadata (GPS, camera info) from the output. Defaults to true. */
  stripExif?: boolean;
  /** Background color used when flattening transparency onto a non-alpha format. Defaults to '#ffffff'. */
  backgroundColor?: string;
}

export interface ConvertResult {
  blob: Blob;
  width: number;
  height: number;
  originalSize: number;
  outputSize: number;
}

export interface DetectedFormat {
  format: InputFormat | "unknown";
  mimeType: string;
}

export interface SizeEstimateParams {
  originalSize: number;
  width: number;
  height: number;
  format: OutputFormat;
  quality: number;
}
