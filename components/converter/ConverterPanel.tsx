"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  canEncodeWebp,
  DEFAULT_MAX_BATCH_FILES,
  estimateOutputSize,
  MOBILE_SAFARI_MAX_BATCH_FILES,
  type OutputFormat,
} from "@/lib/convert";
import { dedupeFileName, outputFileName } from "@/lib/filename";
import { isProbablyMobileSafari } from "@/lib/mobile";
import { ConvertWorkerPool, WorkerJobError } from "@/lib/worker/pool";
import { BackgroundColorPicker } from "./BackgroundColorPicker";
import { DropZone } from "./DropZone";
import { ExifToggle } from "./ExifToggle";
import { FileQueueItem } from "./FileQueueItem";
import { FormatSelector } from "./FormatSelector";
import { QualitySlider } from "./QualitySlider";
import type { QueueItem } from "./types";

interface ConverterPanelProps {
  initialOutputFormat?: OutputFormat;
  lockOutputFormat?: boolean;
}

function makeId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function triggerDownload(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

export function ConverterPanel({ initialOutputFormat = "jpeg", lockOutputFormat = false }: ConverterPanelProps) {
  const [outputFormat, setOutputFormat] = useState<OutputFormat>(initialOutputFormat);
  const [quality, setQuality] = useState(0.85);
  const [stripExif, setStripExif] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [webpAvailable] = useState(() => canEncodeWebp());
  const [batchWarning, setBatchWarning] = useState<string | null>(null);
  const [isZipping, setIsZipping] = useState(false);

  const poolRef = useRef<ConvertWorkerPool | null>(null);

  useEffect(() => {
    return () => {
      poolRef.current?.destroy();
      poolRef.current = null;
    };
  }, []);

  const getPool = useCallback(() => {
    if (!poolRef.current) {
      poolRef.current = new ConvertWorkerPool();
    }
    return poolRef.current;
  }, []);

  const probeDimensions = useCallback((id: string, file: File) => {
    createImageBitmap(file)
      .then((bitmap) => {
        setQueue((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, dimensions: { width: bitmap.width, height: bitmap.height } } : item,
          ),
        );
        bitmap.close();
      })
      .catch(() => {
        // Best-effort only - used for the live size estimate. A browser that
        // can't decode this file client-side simply won't get a preview
        // estimate; the worker will still attempt the real conversion.
      });
  }, []);

  const addFiles = useCallback(
    (files: File[]) => {
      const cap = isProbablyMobileSafari() ? MOBILE_SAFARI_MAX_BATCH_FILES : DEFAULT_MAX_BATCH_FILES;
      const room = Math.max(0, cap - queue.length);
      const accepted = files.slice(0, room);

      if (accepted.length < files.length) {
        setBatchWarning(
          `Safari on iPhone/iPad limits how many images can be converted in one batch to avoid crashing the tab. Added ${accepted.length} of ${files.length} files — convert these, then add the rest.`,
        );
      } else {
        setBatchWarning(null);
      }

      const newItems: QueueItem[] = accepted.map((file) => ({ id: makeId(), file, status: "queued" }));
      setQueue((prev) => [...prev, ...newItems]);
      newItems.forEach((item) => probeDimensions(item.id, item.file));
    },
    [queue.length, probeDimensions],
  );

  const convertAll = useCallback(() => {
    const options = { outputFormat, quality, stripExif, backgroundColor };
    const pool = getPool();

    setQueue((prev) =>
      prev.map((item) => (item.status === "queued" || item.status === "error" ? { ...item, status: "converting" as const, errorMessage: undefined } : item)),
    );

    queue
      .filter((item) => item.status === "queued" || item.status === "error")
      .forEach((item) => {
        item.file
          .arrayBuffer()
          .then((bytes) => pool.convert(item.file.name, bytes, options))
          .then((result) => {
            setQueue((prev) => prev.map((q) => (q.id === item.id ? { ...q, status: "done", result } : q)));
          })
          .catch((error: unknown) => {
            const message =
              error instanceof WorkerJobError ? error.message : "Something went wrong converting this file.";
            setQueue((prev) => prev.map((q) => (q.id === item.id ? { ...q, status: "error", errorMessage: message } : q)));
          });
      });
  }, [queue, outputFormat, quality, stripExif, backgroundColor, getPool]);

  const removeItem = useCallback((id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setQueue([]);
    setBatchWarning(null);
  }, []);

  const downloadItem = useCallback(
    (item: QueueItem) => {
      if (!item.result) return;
      triggerDownload(item.result.blob, outputFileName(item.file.name, outputFormat));
    },
    [outputFormat],
  );

  const downloadAllAsZip = useCallback(async () => {
    const doneItems = queue.filter((item) => item.status === "done" && item.result);
    if (doneItems.length === 0) return;
    setIsZipping(true);
    try {
      const { createZip } = await import("@/lib/zip");
      const usedNames = new Set<string>();
      const blob = await createZip(
        doneItems.map((item) => ({
          name: dedupeFileName(outputFileName(item.file.name, outputFormat), usedNames),
          blob: item.result!.blob,
        })),
      );
      triggerDownload(blob, "converted-images.zip");
    } finally {
      setIsZipping(false);
    }
  }, [queue, outputFormat]);

  const pendingCount = queue.filter((item) => item.status === "queued" || item.status === "error").length;
  const doneCount = queue.filter((item) => item.status === "done").length;
  const convertingCount = queue.filter((item) => item.status === "converting").length;

  const estimateBytes = useMemo(() => {
    if (outputFormat === "png") return null;
    const withDimensions = queue.find((item) => item.dimensions);
    if (!withDimensions?.dimensions) return null;
    return estimateOutputSize({
      originalSize: withDimensions.file.size,
      width: withDimensions.dimensions.width,
      height: withDimensions.dimensions.height,
      format: outputFormat,
      quality,
    });
  }, [queue, outputFormat, quality]);

  const liveStatusMessage =
    convertingCount > 0
      ? `Converting… ${doneCount} of ${queue.length} done.`
      : doneCount > 0 && doneCount === queue.length
        ? `All ${doneCount} file${doneCount === 1 ? "" : "s"} converted.`
        : "";

  return (
    <div className="flex flex-col gap-6">
      <DropZone onFiles={addFiles} />

      {batchWarning && (
        <p role="alert" className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {batchWarning}
        </p>
      )}

      <div aria-live="polite" className="sr-only">
        {liveStatusMessage}
      </div>

      {queue.length > 0 && (
        <>
          <div className="grid gap-4 rounded-xl border border-gray-200 p-4 sm:grid-cols-2">
            <FormatSelector
              value={outputFormat}
              onChange={setOutputFormat}
              webpAvailable={webpAvailable}
              locked={lockOutputFormat}
            />
            {outputFormat !== "png" && (
              <QualitySlider quality={quality} onChange={setQuality} estimateBytes={estimateBytes} />
            )}
            <div className="sm:col-span-2">
              <ExifToggle stripExif={stripExif} onChange={setStripExif} />
            </div>
            {outputFormat === "jpeg" && (
              <div className="sm:col-span-2">
                <BackgroundColorPicker color={backgroundColor} onChange={setBackgroundColor} />
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={convertAll}
              disabled={pendingCount === 0}
              className="rounded-md bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
            >
              Convert {pendingCount > 0 ? `${pendingCount} file${pendingCount === 1 ? "" : "s"}` : "all"}
            </button>
            {doneCount > 1 && (
              <button
                type="button"
                onClick={downloadAllAsZip}
                disabled={isZipping}
                className="rounded-md border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:border-brand-400 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              >
                {isZipping ? "Zipping…" : `Download all (${doneCount}) as ZIP`}
              </button>
            )}
            <button
              type="button"
              onClick={clearAll}
              className="text-sm text-gray-500 underline underline-offset-2 hover:text-gray-700"
            >
              Clear all
            </button>
          </div>

          <ul className="flex flex-col gap-2">
            {queue.map((item) => (
              <FileQueueItem
                key={item.id}
                item={item}
                outputFormat={outputFormat}
                onDownload={downloadItem}
                onRemove={removeItem}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
