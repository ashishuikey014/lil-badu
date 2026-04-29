"use client";

import { useCompressFiles } from "@/hooks/useCompressFiles";
import DropZone from "@/components/shared/DropZone";
import BulkDownloadButton from "@/components/shared/BulkDownloadButton";
import CompressFileCard from "@/components/compress/CompressFileCard";

export default function CompressPanel() {
  const { entries, addFiles, downloadEntry, removeEntry, clearAll, doneEntries } =
    useCompressFiles();

  const bulkEntries = doneEntries.map((e) => {
    const ext = e.compressedBlob!.type.split("/")[1].replace("jpeg", "jpg");
    const dot = e.file.name.lastIndexOf(".");
    const base = dot >= 0 ? e.file.name.slice(0, dot) : e.file.name;
    return { filename: `${base}.${ext}`, blob: e.compressedBlob! };
  });

  return (
    <div className="flex flex-col gap-6">
      <DropZone onFilesAdded={addFiles} />

      {entries.length > 0 && (
        <>
          <div className="flex flex-col gap-2">
            {entries.map((entry) => (
              <CompressFileCard
                key={entry.id}
                entry={entry}
                onDownload={downloadEntry}
                onRemove={removeEntry}
              />
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <BulkDownloadButton
              entries={bulkEntries}
              zipName="lil-badu-compressed.zip"
            />
            <button
              onClick={clearAll}
              className="rounded-xl border border-border-light px-5 py-3 text-sm font-medium text-text-secondary transition-all hover:border-gray-300 hover:text-text-primary"
            >
              Clear all
            </button>
          </div>
        </>
      )}
    </div>
  );
}
