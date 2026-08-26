import { decodeFailedError } from "./errors";
import type { RawImageData } from "./types";

interface HeifDisplayTarget {
  data: Uint8ClampedArray<ArrayBuffer>;
  width: number;
  height: number;
}

interface HeifImageHandle {
  get_width(): number;
  get_height(): number;
  display(target: HeifDisplayTarget, callback: (result: HeifDisplayTarget | null) => void): void;
  free?(): void;
}

interface HeifDecoderInstance {
  decode(bytes: Uint8Array): HeifImageHandle[];
}

interface LibheifModule {
  HeifDecoder: new () => HeifDecoderInstance;
}

let libheifPromise: Promise<LibheifModule> | null = null;

/** Lazily loads the ~1-2MB libheif WASM bundle. Only ever called when a HEIC file actually needs decoding. */
async function loadLibheif(): Promise<LibheifModule> {
  if (!libheifPromise) {
    libheifPromise = import("libheif-js/wasm-bundle").then((mod) => mod.default) as Promise<LibheifModule>;
  }
  return libheifPromise;
}

/**
 * Decodes the primary image in a HEIC/HEIF file into raw RGBA pixels.
 * libheif applies any internal rotation/mirror transform properties itself,
 * so the result needs no further EXIF-orientation handling.
 */
export async function decodeHeic(bytes: Uint8Array<ArrayBuffer>): Promise<RawImageData> {
  const libheif = await loadLibheif();
  const decoder = new libheif.HeifDecoder();

  let images: HeifImageHandle[];
  try {
    images = decoder.decode(bytes);
  } catch (cause) {
    throw decodeFailedError("HEIC image", cause);
  }

  const image = images[0];
  if (!image) {
    throw decodeFailedError("HEIC image");
  }

  try {
    const width = image.get_width();
    const height = image.get_height();
    const data = new Uint8ClampedArray(width * height * 4);

    const result = await new Promise<HeifDisplayTarget | null>((resolve) => {
      image.display({ data, width, height }, resolve);
    });

    if (!result) {
      throw decodeFailedError("HEIC image");
    }

    return { width, height, data: result.data };
  } finally {
    image.free?.();
  }
}
