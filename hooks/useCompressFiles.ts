"use client";

import { useCallback, useState } from "react";
import type { CompressEntry } from "@/types";

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

export function useCompressFiles() {
  const [entries, setEntries] = useState<CompressEntry[]>([]);

  const updateEntry = useCallback((id: string, patch: Partial<CompressEntry>) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }, []);

  const processEntry = useCallback(
    async (entry: CompressEntry) => {
      updateEntry(entry.id, { status: "processing" });

      const formData = new FormData();
      formData.append("file", entry.file);

      try {
        const res = await fetch("/api/compress", { method: "POST", body: formData });

        if (!res.ok) {
          const json = await res.json().catch(() => ({}));
          throw new Error(json.detail || json.error || `HTTP ${res.status}`);
        }

        const originalSize = parseInt(res.headers.get("X-Original-Size") ?? "0", 10);
        const compressedSize = parseInt(res.headers.get("X-Compressed-Size") ?? "0", 10);
        const savedPercent = parseFloat(res.headers.get("X-Saved-Percent") ?? "0");
        const blob = await res.blob();

        updateEntry(entry.id, {
          status: "done",
          compressedBlob: blob,
          originalSize,
          compressedSize,
          savedPercent,
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        updateEntry(entry.id, { status: "error", errorMessage: msg });
      }
    },
    [updateEntry]
  );

  const addFiles = useCallback(
    (files: File[]) => {
      const existingKeys = new Set(entries.map((e) => `${e.file.name}-${e.file.size}`));
      const toAdd: CompressEntry[] = files
        .filter((f) => !existingKeys.has(`${f.name}-${f.size}`))
        .map((file) => ({
          id: crypto.randomUUID(),
          file,
          originalSize: file.size,
          status: "queued" as const,
        }));

      if (toAdd.length === 0) return;

      setEntries((prev) => [...prev, ...toAdd]);

      for (const entry of toAdd) {
        processEntry(entry);
      }
    },
    [entries, processEntry]
  );

  const downloadEntry = useCallback((entry: CompressEntry) => {
    if (!entry.compressedBlob) return;
    const ext = entry.compressedBlob.type.split("/")[1].replace("jpeg", "jpg");
    const dot = entry.file.name.lastIndexOf(".");
    const base = dot >= 0 ? entry.file.name.slice(0, dot) : entry.file.name;
    triggerDownload(entry.compressedBlob, `${base}.${ext}`);
  }, []);

  const removeEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setEntries([]);
  }, []);

  const doneEntries = entries.filter((e) => e.status === "done" && e.compressedBlob);

  return { entries, addFiles, downloadEntry, removeEntry, clearAll, doneEntries };
}
