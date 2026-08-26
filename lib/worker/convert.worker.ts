/// <reference lib="webworker" />

import { convertImage } from "../convert";
import { ConvertError } from "../convert/errors";
import type { WorkerRequest, WorkerResponse } from "./protocol";

const worker = self as unknown as DedicatedWorkerGlobalScope;

worker.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const { id, fileName, fileBytes, options } = event.data;

  try {
    const result = await convertImage(fileBytes, fileName, options);
    const response: WorkerResponse = {
      id,
      ok: true,
      result: {
        blob: result.blob,
        width: result.width,
        height: result.height,
        originalSize: result.originalSize,
        outputSize: result.outputSize,
      },
    };
    worker.postMessage(response);
  } catch (error) {
    const convertError = error instanceof ConvertError ? error : null;
    const response: WorkerResponse = {
      id,
      ok: false,
      error: {
        code: convertError?.code ?? "decode_failed",
        message: convertError?.message ?? `Something went wrong converting "${fileName}".`,
      },
    };
    worker.postMessage(response);
  }
};
