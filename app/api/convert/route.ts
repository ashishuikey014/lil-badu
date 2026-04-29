import { NextRequest, NextResponse } from "next/server";
import { convertImage, getOutputMime } from "@/lib/conversion/convertImage";
import { heicToJpegBuffer } from "@/lib/conversion/heicToBuffer";
import { isHeic, replaceExtension, sanitizeFilename } from "@/lib/formatUtils";
import { VALID_TARGET_FORMATS, FORMAT_EXTENSION } from "@/lib/constants";
import type { TargetFormat } from "@/types";

export async function POST(request: NextRequest) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Missing file field" }, { status: 400 });
  }

  const targetFormatRaw = formData.get("targetFormat");
  if (!targetFormatRaw || typeof targetFormatRaw !== "string") {
    return NextResponse.json({ error: "Missing targetFormat" }, { status: 400 });
  }

  const targetFormat = targetFormatRaw as TargetFormat;
  if (!(VALID_TARGET_FORMATS as string[]).includes(targetFormat)) {
    return NextResponse.json(
      { error: "Invalid targetFormat", allowed: VALID_TARGET_FORMATS },
      { status: 400 }
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let inputBuffer: Buffer<any> = Buffer.from(arrayBuffer as ArrayBuffer);

  if (isHeic(file)) {
    try {
      inputBuffer = await heicToJpegBuffer(inputBuffer);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      return NextResponse.json(
        { error: "HEIC decoding failed", detail: msg },
        { status: 422 }
      );
    }
  }

  let outputBuffer: Buffer;
  try {
    outputBuffer = await convertImage(inputBuffer, targetFormat);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: "Processing failed", detail: msg }, { status: 422 });
  }

  const outputMime = getOutputMime(targetFormat);
  const outputFilename = sanitizeFilename(replaceExtension(file.name, FORMAT_EXTENSION[targetFormat]));

  return new NextResponse(new Uint8Array(outputBuffer), {
    status: 200,
    headers: {
      "Content-Type": outputMime,
      "Content-Disposition": `attachment; filename="${outputFilename}"`,
    },
  });
}
