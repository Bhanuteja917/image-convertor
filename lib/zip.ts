import JSZip from "jszip";

export async function createZip(files: Array<{ name: string; blob: Blob }>): Promise<Blob> {
  const zip = new JSZip();
  for (const file of files) {
    zip.file(file.name, file.blob);
  }
  return zip.generateAsync({ type: "blob" });
}
