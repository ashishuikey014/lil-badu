"use client";

import { useConvertFiles } from "@/hooks/useConvertFiles";
import DropZone from "@/components/shared/DropZone";
import BulkDownloadButton from "@/components/shared/BulkDownloadButton";
import ConvertFileCard from "@/components/convert/ConvertFileCard";
import FormatSelector from "@/components/convert/FormatSelector";

export default function ConvertPanel() {
  const {
    entries,
    globalTargetFormat,
    setGlobalTargetFormat,
    addFiles,
    downloadEntry,
    removeEntry,
    clearAll,
    doneEntries,
  } = useConvertFiles();

  const bulkEntries = doneEntries.map((e) => ({
    filename: e.outputFilename ?? e.file.name,
    blob: e.convertedBlob!,
  }));

  return (
    <div className="flex flex-col gap-6">
      <FormatSelector value={globalTargetFormat} onChange={setGlobalTargetFormat} />

      <DropZone onFilesAdded={addFiles} />

      {entries.length > 0 && (
        <>
          <div className="flex flex-col gap-2">
            {entries.map((entry) => (
              <ConvertFileCard
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
              zipName="lil-badu-converted.zip"
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
