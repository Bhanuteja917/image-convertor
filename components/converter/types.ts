export type QueueItemStatus = "queued" | "converting" | "done" | "error";

export interface QueueItem {
  id: string;
  file: File;
  status: QueueItemStatus;
  errorMessage?: string;
  /** Decoded lazily (best-effort) purely to drive the live quality/size estimate. */
  dimensions?: { width: number; height: number };
  result?: {
    blob: Blob;
    width: number;
    height: number;
    originalSize: number;
    outputSize: number;
  };
}
