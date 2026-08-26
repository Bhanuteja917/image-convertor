import type { ConvertErrorCode } from "../convert/errors";
import type { ConvertOptions } from "../convert/types";
import type { WorkerRequest, WorkerResponse, WorkerResultPayload } from "./protocol";

const MAX_POOL_SIZE = 4;

export class WorkerJobError extends Error {
  readonly code: ConvertErrorCode;
  constructor(code: ConvertErrorCode, message: string) {
    super(message);
    this.name = "WorkerJobError";
    this.code = code;
  }
}

interface QueuedJob {
  request: WorkerRequest;
  resolve: (value: WorkerResultPayload) => void;
  reject: (reason: unknown) => void;
}

function makeJobId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/**
 * A small pool of persistent conversion workers, sized to the device's core
 * count (capped at 4) so batch conversions run in parallel without freezing
 * the tab or oversubscribing low-end devices.
 */
export class ConvertWorkerPool {
  private readonly workers: Worker[] = [];
  private readonly busy: boolean[] = [];
  private readonly queue: QueuedJob[] = [];
  private readonly pending = new Map<
    string,
    { resolve: (value: WorkerResultPayload) => void; reject: (reason: unknown) => void; workerIndex: number }
  >();

  constructor(size?: number) {
    const poolSize = Math.max(1, Math.min(size ?? navigator.hardwareConcurrency ?? 2, MAX_POOL_SIZE));
    for (let i = 0; i < poolSize; i++) {
      const worker = new Worker(new URL("./convert.worker.ts", import.meta.url), { type: "module" });
      worker.onmessage = (event: MessageEvent<WorkerResponse>) => this.handleMessage(i, event.data);
      worker.onerror = (event) => this.handleWorkerCrash(i, event);
      this.workers.push(worker);
      this.busy.push(false);
    }
  }

  /** Converts one file, transferring its bytes into a free worker (or queueing until one frees up). */
  convert(fileName: string, fileBytes: ArrayBuffer, options: ConvertOptions): Promise<WorkerResultPayload> {
    return new Promise((resolve, reject) => {
      const request: WorkerRequest = { id: makeJobId(), fileName, fileBytes, options };
      this.queue.push({ request, resolve, reject });
      this.pump();
    });
  }

  private pump(): void {
    if (this.queue.length === 0) return;
    const workerIndex = this.busy.findIndex((b) => !b);
    if (workerIndex === -1) return;

    const job = this.queue.shift()!;
    this.busy[workerIndex] = true;
    this.pending.set(job.request.id, { resolve: job.resolve, reject: job.reject, workerIndex });
    this.workers[workerIndex]!.postMessage(job.request, [job.request.fileBytes]);
  }

  private handleMessage(workerIndex: number, data: WorkerResponse): void {
    const pending = this.pending.get(data.id);
    this.pending.delete(data.id);
    this.busy[workerIndex] = false;

    if (pending) {
      if (data.ok) {
        pending.resolve(data.result);
      } else {
        pending.reject(new WorkerJobError(data.error.code, data.error.message));
      }
    }
    this.pump();
  }

  private handleWorkerCrash(workerIndex: number, event: ErrorEvent): void {
    // Fail whichever job this worker was running, then let it keep serving
    // future jobs - a single decode crashing the underlying script (a wasm
    // trap, for instance) shouldn't take the whole pool offline.
    this.busy[workerIndex] = false;
    for (const [id, pending] of this.pending) {
      if (pending.workerIndex === workerIndex) {
        this.pending.delete(id);
        pending.reject(new WorkerJobError("decode_failed", event.message || "The conversion worker crashed."));
      }
    }
    this.pump();
  }

  /** Terminates all workers and rejects anything still queued. Call when the converter UI unmounts. */
  destroy(): void {
    for (const job of this.queue.splice(0)) {
      job.reject(new WorkerJobError("decode_failed", "Conversion cancelled."));
    }
    for (const [id, pending] of this.pending) {
      this.pending.delete(id);
      pending.reject(new WorkerJobError("decode_failed", "Conversion cancelled."));
    }
    for (const worker of this.workers) {
      worker.terminate();
    }
  }
}
