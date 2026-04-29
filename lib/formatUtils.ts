import type { TargetFormat } from "@/types";
import { FORMAT_EXTENSION, FORMAT_MIME, VALID_TARGET_FORMATS } from "./constants";

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function getMimeType(format: TargetFormat): string {
  return FORMAT_MIME[format];
}

export function getExtension(format: TargetFormat): string {
  return FORMAT_EXTENSION[format];
}

export function replaceExtension(filename: string, newExt: string): string {
  const dot = filename.lastIndexOf(".");
  const base = dot >= 0 ? filename.slice(0, dot) : filename;
  return `${base}.${newExt}`;
}

export function isHeic(file: File): boolean {
  return (
    file.type === "image/heic" ||
    file.name.toLowerCase().endsWith(".heic") ||
    file.name.toLowerCase().endsWith(".heif")
  );
}

export function getAvailableTargetFormats(sourceMime: string, isHeicFile: boolean): TargetFormat[] {
  if (isHeicFile) return ["jpeg", "png", "webp"];
  if (sourceMime === "image/jpeg") return VALID_TARGET_FORMATS.filter((f) => f !== "jpeg");
  if (sourceMime === "image/png") return VALID_TARGET_FORMATS.filter((f) => f !== "png");
  if (sourceMime === "image/webp") return VALID_TARGET_FORMATS.filter((f) => f !== "webp");
  if (sourceMime === "image/avif") return VALID_TARGET_FORMATS.filter((f) => f !== "avif");
  return VALID_TARGET_FORMATS;
}

export function calcSavedPercent(original: number, compressed: number): number {
  if (original === 0) return 0;
  return Math.max(0, ((original - compressed) / original) * 100);
}

export function sanitizeFilename(name: string): string {
  // Strip characters that would break the Content-Disposition header or filesystem
  return name.replace(/["\\\r\n]/g, "_");
}
