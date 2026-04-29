"use client";

import { useRef, useState, useCallback } from "react";
import { ACCEPTED_EXTENSIONS, ACCEPTED_MIME_TYPES } from "@/lib/constants";

interface DropZoneProps {
  onFilesAdded: (files: File[]) => void;
  disabled?: boolean;
}

export default function DropZone({ onFilesAdded, disabled = false }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [rejectedNames, setRejectedNames] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  // Tracks drag depth so onDragLeave doesn't fire when cursor crosses child elements
  const dragDepth = useRef(0);

  const processFiles = useCallback(
    (rawFiles: FileList | File[]) => {
      const files = Array.from(rawFiles);
      const valid: File[] = [];
      const rejected: string[] = [];

      for (const f of files) {
        const lowerName = f.name.toLowerCase();
        const isHeicByExtension =
          lowerName.endsWith(".heic") || lowerName.endsWith(".heif");
        if (
          (ACCEPTED_MIME_TYPES as readonly string[]).includes(f.type) ||
          isHeicByExtension
        ) {
          valid.push(f);
        } else {
          rejected.push(f.name);
        }
      }

      if (rejected.length > 0) setRejectedNames(rejected);
      else setRejectedNames([]);

      if (valid.length > 0) onFilesAdded(valid);
    },
    [onFilesAdded]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      dragDepth.current = 0;
      setIsDragging(false);
      if (disabled) return;
      processFiles(e.dataTransfer.files);
    },
    [disabled, processFiles]
  );

  const onDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    dragDepth.current += 1;
    if (!disabled) setIsDragging(true);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDragLeave = () => {
    dragDepth.current -= 1;
    if (dragDepth.current === 0) setIsDragging(false);
  };

  const onClick = () => {
    if (!disabled) inputRef.current?.click();
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files);
    e.target.value = "";
  };

  return (
    <div className="w-full">
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Drop images here or click to browse"
        onClick={onClick}
        onDrop={onDrop}
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onKeyDown={(e) => e.key === "Enter" && onClick()}
        className={[
          "relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed px-8 py-16 text-center transition-all duration-200 cursor-pointer select-none",
          isDragging
            ? "border-brand bg-brand-light scale-[1.01]"
            : "border-border-light bg-white hover:border-brand hover:bg-brand-light/50",
          disabled ? "opacity-50 cursor-not-allowed" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div
          className={[
            "flex h-16 w-16 items-center justify-center rounded-full transition-colors duration-200",
            isDragging ? "bg-brand/20" : "bg-brand-light",
          ].join(" ")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-brand"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
        </div>

        <div>
          <p className="text-lg font-semibold text-text-primary">
            {isDragging ? "Release to upload" : "Drop images here"}
          </p>
          <p className="mt-1 text-sm text-text-secondary">
            or <span className="font-medium text-brand">click to browse</span>
          </p>
        </div>

        <p className="text-xs text-text-secondary">
          PNG · JPG · WebP · AVIF · HEIC &nbsp;·&nbsp; No file size limit
        </p>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED_EXTENSIONS}
          className="sr-only"
          onChange={onInputChange}
          disabled={disabled}
        />
      </div>

      {rejectedNames.length > 0 && (
        <div className="mt-3 rounded-lg border border-error/30 bg-red-50 px-4 py-2 text-sm text-error">
          <span className="font-medium">Unsupported format:</span>{" "}
          {rejectedNames.join(", ")}
        </div>
      )}
    </div>
  );
}
