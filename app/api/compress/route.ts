import { NextRequest, NextResponse } from "next/server";
import { compressImage } from "@/lib/compression/compressImage";
import { calcSavedPercent, replaceExtension, sanitizeFilename } from "@/lib/formatUtils";
import { ACCEPTED_MIME_TYPES } from "@/lib/constants";

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

  const mimeType = file.type;
  if (!(ACCEPTED_MIME_TYPES as readonly string[]).includes(mimeType)) {
    return NextResponse.json(
      { error: "Unsupported format", detail: `${mimeType} is not supported` },
      { status: 400 }
    );
  }

  if (mimeType === "image/heic") {
    return NextResponse.json(
      { error: "Unsupported format", detail: "HEIC cannot be compressed; use the Convert tool to convert it first." },
      { status: 400 }
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const inputBuffer = Buffer.from(arrayBuffer as ArrayBuffer);
  const originalSize = inputBuffer.byteLength;

  let outputBuffer: Buffer;
  let outputMimeType: string;

  try {
    const result = await compressImage(inputBuffer, mimeType);
    outputBuffer = result.outputBuffer;
    outputMimeType = result.outputMimeType;
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: "Processing failed", detail: msg }, { status: 422 });
  }

  const compressedSize = outputBuffer.byteLength;
  const savedPercent =
    compressedSize >= originalSize
      ? 0
      : calcSavedPercent(originalSize, compressedSize);

  const finalBuffer = compressedSize >= originalSize ? inputBuffer : outputBuffer;
  const finalSize = compressedSize >= originalSize ? originalSize : compressedSize;

  const ext = outputMimeType.split("/")[1].replace("jpeg", "jpg");
  const outputFilename = sanitizeFilename(replaceExtension(file.name, ext));

  return new NextResponse(new Uint8Array(finalBuffer), {
    status: 200,
    headers: {
      "Content-Type": outputMimeType,
      "Content-Disposition": `attachment; filename="${outputFilename}"`,
      "X-Original-Size": String(originalSize),
      "X-Compressed-Size": String(finalSize),
      "X-Saved-Percent": savedPercent.toFixed(2),
    },
  });
}
