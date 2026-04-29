export type ProcessingStatus = "idle" | "queued" | "processing" | "done" | "error";

export type TargetFormat = "jpeg" | "png" | "webp" | "avif";

export interface FileEntry {
  id: string;
  file: File;
  originalSize: number;
  status: ProcessingStatus;
  errorMessage?: string;
}

export interface CompressEntry extends FileEntry {
  compressedBlob?: Blob;
  compressedSize?: number;
  savedPercent?: number;
}

export interface ConvertEntry extends FileEntry {
  targetFormat: TargetFormat;
  convertedBlob?: Blob;
  outputFilename?: string;
}

export type ActiveTab = "compress" | "convert";
