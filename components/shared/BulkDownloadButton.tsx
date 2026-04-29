"use client";

import { useState } from "react";
import { buildAndDownloadZip } from "@/lib/zip/buildZip";

interface BulkEntry {
  filename: string;
  blob: Blob;
}

interface BulkDownloadButtonProps {
  entries: BulkEntry[];
  zipName: string;
  disabled?: boolean;
}

export default function BulkDownloadButton({ entries, zipName, disabled = false }: BulkDownloadButtonProps) {
  const [isZipping, setIsZipping] = useState(false);

  const handleClick = async () => {
    if (isZipping || disabled || entries.length === 0) return;
    setIsZipping(true);
    try {
      await buildAndDownloadZip(entries, zipName);
    } finally {
      setIsZipping(false);
    }
  };

  const isDisabled = disabled || entries.length === 0 || isZipping;

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={[
        "flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-200",
        isDisabled
          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
          : "bg-accent text-white hover:bg-accent/90 active:scale-95 shadow-sm hover:shadow-md",
      ].join(" ")}
    >
      {isZipping ? (
        <>
          <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Building ZIP…
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download {entries.length} file{entries.length !== 1 ? "s" : ""} as ZIP
        </>
      )}
    </button>
  );
}
