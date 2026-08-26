// Feature-detection helpers. These call browser globals (createImageBitmap,
// document, OffscreenCanvas) and are only ever invoked from the browser at
// runtime - never at module-import time - so importing this file in a
// non-browser environment (e.g. a test runner) is safe.

// A real, minimal (32x32) HEIC file, embedded as base64 so the native-decode
// probe never requires a network request and stays tiny (~750B encoded).
// Used only to test whether the browser's built-in image decoder already
// understands HEIC (e.g. Safari), so we can skip downloading the ~1-2MB
// libheif WASM decoder entirely when it's not needed.
const TINY_HEIC_BASE64 =
  "AAAAHGZ0eXBoZWljAAAAAG1pZjFoZWljbWlhZgAAAX1tZXRhAAAAAAAAACFoZGxyAAAAAAAAAABwaWN0AAAAAAAAAAAAAAAAAAAAACJpbG9jAAAAAERAAAEAAQAAAAABoQABAAAAAAAAAJQAAAAjaWluZgAAAAAAAQAAABVpbmZlAgAAAAABAABodmMxAAAAAA5waXRtAAAAAAABAAAA/WlwcnAAAADdaXBjbwAAAHZodmNDAQNwAAAAAAAAAAAAHvAA/P34+AAADwNgAAEAGEABDAH//wNwAAADAJAAAAMAAAMAHroCQGEAAQAqQgEBA3AAAAMAkAAAAwAAAwAeoCCBBZbq5Ka5uAhoMCAAAAMDIAAAAwAhYgABAAZEAcFzwIkAAAATY29scm5jbHgAAQANAAaAAAAAFGlzcGUAAAAAAAAAQAAAAEAAAAAoY2xhcAAAACAAAAABAAAAIAAAAAH////gAAAAAv///+AAAAACAAAAEHBpeGkAAAAAAwgICAAAABhpcG1hAAAAAAAAAAEAAQWBAgMFhAAAAJxtZGF0AAAAkCgBrwT4cW7aw8sDS2x9PktH1AwI0M/ozzY8gyPb4RT9OxZ/eP3s/iv/iTpMW5hQv1BvcA8vUVLqdgT0l1E8m/w9/pP31ifd+tLtHg2uzlvPwfbOzm8dJ3EphCmtrDVj0hsSlqD8pTD0qW1Qng31kudM5Jc+oxOila69Q/yHxvD092bN+AxEdCeVygWCCs/f4A==";

let heicNativeSupport: Promise<boolean> | null = null;
let webpEncodeSupport: boolean | null = null;

function base64ToBytes(base64: string): Uint8Array<ArrayBuffer> {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/**
 * Whether the browser's built-in image decoder can already handle HEIC
 * (Safari sometimes can). Result is memoized for the life of the page.
 */
export async function canDecodeHeicNatively(): Promise<boolean> {
  if (heicNativeSupport) return heicNativeSupport;

  heicNativeSupport = (async () => {
    if (typeof createImageBitmap !== "function") return false;
    try {
      const blob = new Blob([base64ToBytes(TINY_HEIC_BASE64)], { type: "image/heic" });
      const bitmap = await createImageBitmap(blob);
      bitmap.close();
      return true;
    } catch {
      return false;
    }
  })();

  return heicNativeSupport;
}

/** Whether the browser can encode WebP via canvas. Memoized. */
export function canEncodeWebp(): boolean {
  if (webpEncodeSupport !== null) return webpEncodeSupport;

  if (typeof document === "undefined") {
    webpEncodeSupport = typeof OffscreenCanvas !== "undefined";
    return webpEncodeSupport;
  }

  try {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    webpEncodeSupport = canvas.toDataURL("image/webp").startsWith("data:image/webp");
  } catch {
    webpEncodeSupport = false;
  }
  return webpEncodeSupport;
}

/** Test-only: clears memoized capability results. */
export function resetCapabilityCacheForTests(): void {
  heicNativeSupport = null;
  webpEncodeSupport = null;
}
