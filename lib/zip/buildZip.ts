import JSZip from "jszip";

interface ZipEntry {
  filename: string;
  blob: Blob;
}

export async function buildAndDownloadZip(entries: ZipEntry[], zipName: string): Promise<void> {
  const zip = new JSZip();

  for (const entry of entries) {
    const arrayBuffer = await entry.blob.arrayBuffer();
    zip.file(entry.filename, arrayBuffer);
  }

  const blob = await zip.generateAsync({ type: "blob", compression: "STORE" });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = zipName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
