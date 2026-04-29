import heicConvert from "heic-convert";

export async function heicToJpegBuffer(inputBuffer: Buffer): Promise<Buffer> {
  const outputArrayBuffer = await heicConvert({
    buffer: inputBuffer,
    format: "JPEG",
    quality: 1,
  });
  return Buffer.from(outputArrayBuffer as ArrayBuffer);
}
