import sharp from "sharp";
import type { TargetFormat } from "@/types";
import { COMPRESS_QUALITY_PRESETS, FORMAT_MIME } from "@/lib/constants";

export async function convertImage(
  inputBuffer: Buffer,
  targetFormat: TargetFormat
): Promise<Buffer> {
  switch (targetFormat) {
    case "jpeg":
      return sharp(inputBuffer).jpeg(COMPRESS_QUALITY_PRESETS.jpeg).toBuffer();
    case "png":
      return sharp(inputBuffer).png({ compressionLevel: 6 }).toBuffer();
    case "webp":
      return sharp(inputBuffer).webp(COMPRESS_QUALITY_PRESETS.webp).toBuffer();
    case "avif":
      return sharp(inputBuffer).avif(COMPRESS_QUALITY_PRESETS.avif).toBuffer();
    default:
      throw new Error(`Unsupported target format: ${targetFormat}`);
  }
}

export function getOutputMime(targetFormat: TargetFormat): string {
  return FORMAT_MIME[targetFormat];
}
