"use client";

import type { TargetFormat } from "@/types";
import { FORMAT_LABELS, VALID_TARGET_FORMATS } from "@/lib/constants";

interface FormatSelectorProps {
  value: TargetFormat;
  onChange: (fmt: TargetFormat) => void;
}

export default function FormatSelector({ value, onChange }: FormatSelectorProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-medium text-text-secondary">Convert to:</span>
      <div className="flex gap-2">
        {VALID_TARGET_FORMATS.map((fmt) => (
          <button
            key={fmt}
            onClick={() => onChange(fmt)}
            className={[
              "rounded-lg border px-4 py-1.5 text-sm font-semibold transition-all duration-150",
              value === fmt
                ? "border-brand bg-brand text-white"
                : "border-border-light bg-white text-text-secondary hover:border-brand/50 hover:text-brand",
            ].join(" ")}
          >
            {FORMAT_LABELS[fmt]}
          </button>
        ))}
      </div>
    </div>
  );
}
