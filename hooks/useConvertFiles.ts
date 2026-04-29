"use client";

import { useCallback, useState } from "react";
import type { ConvertEntry, TargetFormat } from "@/types";
import { FORMAT_EXTENSION } from "@/lib/constants";
import { replaceExtension } from "@/lib/formatUtils";

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function useConvertFiles() {
  const [entries, setEntries] = useState<ConvertEntry[]>([]);
  const [globalTargetFormat, setGlobalTargetFormatState] = useState<TargetFormat>("jpeg");

  const updateEntry = useCallback((id: string, patch: Partial<ConvertEntry>) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }, []);

  const processEntry = useCallback(
    async (entry: ConvertEntry) => {
      updateEntry(entry.id, { status: "processing" });

      const formData = new FormData();
      formData.append("file", entry.file);
      formData.append("targetFormat", entry.targetFormat);

      try {
        const res = await fetch("/api/convert", { method: "POST", body: formData });

        if (!res.ok) {
          const json = await res.json().catch(() => ({}));
          throw new Error(json.detail || json.error || `HTTP ${res.status}`);
        }

        const blob = await res.blob();
        const outputFilename = replaceExtension(entry.file.name, FORMAT_EXTENSION[entry.targetFormat]);

        updateEntry(entry.id, {
          status: "done",
          convertedBlob: blob,
          outputFilename,
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        updateEntry(entry.id, { status: "error", errorMessage: msg });
      }
    },
    [updateEntry]
  );

  const setGlobalTargetFormat = useCallback((fmt: TargetFormat) => {
    setGlobalTargetFormatState(fmt);
    setEntries((prev) =>
      prev.map((e) => (e.status === "idle" || e.status === "queued" ? { ...e, targetFormat: fmt } : e))
    );
  }, []);

  const addFiles = useCallback(
    (files: File[]) => {
      const existingKeys = new Set(entries.map((e) => `${e.file.name}-${e.file.size}`));
      const toAdd: ConvertEntry[] = files
        .filter((f) => !existingKeys.has(`${f.name}-${f.size}`))
        .map((file) => ({
          id: crypto.randomUUID(),
          file,
          originalSize: file.size,
          status: "queued" as const,
          targetFormat: globalTargetFormat,
        }));

      if (toAdd.length === 0) return;

      setEntries((prev) => [...prev, ...toAdd]);

      for (const entry of toAdd) {
        processEntry(entry);
      }
    },
    [entries, globalTargetFormat, processEntry]
  );

  const downloadEntry = useCallback((entry: ConvertEntry) => {
    if (!entry.convertedBlob || !entry.outputFilename) return;
    triggerDownload(entry.convertedBlob, entry.outputFilename);
  }, []);

  const removeEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setEntries([]);
  }, []);

  const doneEntries = entries.filter((e) => e.status === "done" && e.convertedBlob);

  return {
    entries,
    globalTargetFormat,
    setGlobalTargetFormat,
    addFiles,
    downloadEntry,
    removeEntry,
    clearAll,
    doneEntries,
  };
}
