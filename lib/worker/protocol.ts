import type { ConvertErrorCode } from "../convert/errors";
import type { ConvertOptions } from "../convert/types";

export interface WorkerRequest {
  id: string;
  fileName: string;
  fileBytes: ArrayBuffer;
  options: ConvertOptions;
}

export interface WorkerResultPayload {
  blob: Blob;
  width: number;
  height: number;
  originalSize: number;
  outputSize: number;
}

export type WorkerResponse =
  | { id: string; ok: true; result: WorkerResultPayload }
  | { id: string; ok: false; error: { code: ConvertErrorCode; message: string } };
