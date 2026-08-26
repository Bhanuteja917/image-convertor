"use client";

import type { OutputFormat } from "@/lib/convert";
import { formatBytes, outputFileName } from "@/lib/filename";
import type { QueueItem } from "./types";

interface FileQueueItemProps {
  item: QueueItem;
  outputFormat: OutputFormat;
  onDownload: (item: QueueItem) => void;
  onRemove: (id: string) => void;
}

export function FileQueueItem({ item, outputFormat, onDownload, onRemove }: FileQueueItemProps) {
  const { file, status, result, errorMessage } = item;

  return (
    <li className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 px-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900">{file.name}</p>
        <p className="text-xs text-gray-500">
          {formatBytes(file.size)}
          {status === "done" && result && (
            <>
              {" "}
              &rarr; {formatBytes(result.outputSize)} ({outputFileName(file.name, outputFormat)})
            </>
          )}
          {status === "error" && errorMessage && <span className="text-red-600"> &middot; {errorMessage}</span>}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {status === "queued" && <span className="text-xs text-gray-400">Waiting&hellip;</span>}
        {status === "converting" && (
          <span className="flex items-center gap-2 text-xs text-brand-600">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            Converting&hellip;
          </span>
        )}
        {status === "done" && (
          <button
            type="button"
            onClick={() => onDownload(item)}
            className="rounded-md bg-brand-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            Download
          </button>
        )}
        {status === "error" && (
          <span className="rounded bg-red-50 px-2 py-1 text-xs font-medium text-red-700">Failed</span>
        )}
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          aria-label={`Remove ${file.name}`}
          className="text-gray-400 hover:text-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </button>
      </div>
    </li>
  );
}
