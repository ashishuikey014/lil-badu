import type { TargetFormat } from "@/types";

export const ACCEPTED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/avif",
] as const;

export const ACCEPTED_EXTENSIONS = ".jpg,.jpeg,.png,.webp,.heic,.avif";

export const COMPRESS_QUALITY_PRESETS = {
  jpeg: { quality: 82, mozjpeg: true },
  png: { compressionLevel: 9, palette: true },
  webp: { quality: 80, effort: 6 },
  avif: { quality: 65, effort: 6 },
} as const;

export const VALID_TARGET_FORMATS: TargetFormat[] = ["jpeg", "png", "webp", "avif"];

export const FORMAT_LABELS: Record<TargetFormat, string> = {
  jpeg: "JPEG",
  png: "PNG",
  webp: "WebP",
  avif: "AVIF",
};

export const FORMAT_MIME: Record<TargetFormat, string> = {
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
};

export const FORMAT_EXTENSION: Record<TargetFormat, string> = {
  jpeg: "jpg",
  png: "png",
  webp: "webp",
  avif: "avif",
};

export const MIME_TO_FORMAT: Record<string, TargetFormat> = {
  "image/jpeg": "jpeg",
  "image/jpg": "jpeg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};
