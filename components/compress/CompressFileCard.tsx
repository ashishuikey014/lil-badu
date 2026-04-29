"use client";

import { useEffect, useState } from "react";
import type { CompressEntry } from "@/types";
import { formatBytes } from "@/lib/formatUtils";

interface CompressFileCardProps {
  entry: CompressEntry;
  onDownload: (entry: CompressEntry) => void;
  onRemove: (id: string) => void;
}

function SavingsBadge({ percent }: { percent: number }) {
  if (percent === 0) {
    return (
      <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-600">
        Already optimized
      </span>
    );
  }
  const color =
    percent >= 40
      ? "bg-success text-white"
      : percent >= 15
      ? "bg-green-400 text-white"
      : "bg-yellow-400 text-gray-800";

  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${color}`}>
      -{percent.toFixed(0)}%
    </span>
  );
}

export default function CompressFileCard({ entry, onDownload, onRemove }: CompressFileCardProps) {
  const [thumbUrl, setThumbUrl] = useState<string | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(entry.file);
    setThumbUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [entry.file]);

  return (
    <div
      className={[
        "group flex items-center gap-4 rounded-xl border px-4 py-3 transition-all duration-200 animate-fade-in",
        entry.status === "error"
          ? "border-error/40 bg-red-50"
          : "border-border-light bg-white hover:border-brand/30 hover:shadow-sm",
      ].join(" ")}
    >
      {thumbUrl && (
        <img
          src={thumbUrl}
          alt={entry.file.name}
          className="hidden sm:block h-12 w-12 rounded-lg object-cover flex-shrink-0"
        />
      )}

      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-medium text-text-primary">{entry.file.name}</p>

        {entry.status === "processing" || entry.status === "queued" ? (
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-brand-light">
            <div className="h-full w-1/2 rounded-full shimmer-bg" />
          </div>
        ) : entry.status === "done" ? (
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-text-secondary">
            <span>{formatBytes(entry.originalSize)}</span>
            <span className="text-gray-400">→</span>
            <span className="font-medium text-text-primary">{formatBytes(entry.compressedSize ?? 0)}</span>
            <SavingsBadge percent={entry.savedPercent ?? 0} />
          </div>
        ) : entry.status === "error" ? (
          <p className="mt-1 text-xs text-error">{entry.errorMessage ?? "Processing failed"}</p>
        ) : (
          <p className="mt-1 text-xs text-text-secondary">{formatBytes(entry.originalSize)}</p>
        )}
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {entry.status === "done" && (
          <button
            onClick={() => onDownload(entry)}
            title="Download"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white transition-all hover:bg-accent/90 active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        )}
        <button
          onClick={() => onRemove(entry.id)}
          title="Remove"
          className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 opacity-0 transition-all hover:bg-gray-100 hover:text-gray-600 group-hover:opacity-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}
