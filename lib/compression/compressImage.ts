import sharp from "sharp";
import { COMPRESS_QUALITY_PRESETS } from "@/lib/constants";

interface CompressResult {
  outputBuffer: Buffer;
  outputMimeType: string;
}

export async function compressImage(
  inputBuffer: Buffer,
  mimeType: string
): Promise<CompressResult> {
  const normalizedMime = mimeType === "image/jpg" ? "image/jpeg" : mimeType;

  switch (normalizedMime) {
    case "image/jpeg": {
      const outputBuffer = await sharp(inputBuffer)
        .jpeg(COMPRESS_QUALITY_PRESETS.jpeg)
        .toBuffer();
      return { outputBuffer, outputMimeType: "image/jpeg" };
    }
    case "image/png": {
      const outputBuffer = await sharp(inputBuffer)
        .png(COMPRESS_QUALITY_PRESETS.png)
        .toBuffer();
      return { outputBuffer, outputMimeType: "image/png" };
    }
    case "image/webp": {
      const outputBuffer = await sharp(inputBuffer)
        .webp(COMPRESS_QUALITY_PRESETS.webp)
        .toBuffer();
      return { outputBuffer, outputMimeType: "image/webp" };
    }
    case "image/avif": {
      const outputBuffer = await sharp(inputBuffer)
        .avif(COMPRESS_QUALITY_PRESETS.avif)
        .toBuffer();
      return { outputBuffer, outputMimeType: "image/avif" };
    }
    default:
      throw new Error(`Unsupported format: ${mimeType}`);
  }
}
