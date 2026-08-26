export type ConvertErrorCode =
  | "unsupported_format"
  | "corrupt_file"
  | "memory_limit"
  | "missing_codec"
  | "decode_failed"
  | "encode_failed";

export class ConvertError extends Error {
  readonly code: ConvertErrorCode;

  constructor(code: ConvertErrorCode, message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "ConvertError";
    this.code = code;
  }
}

export function unsupportedFormatError(fileName: string): ConvertError {
  return new ConvertError(
    "unsupported_format",
    `"${fileName}" isn't a format we support. We can convert JPG, PNG, WebP, HEIC/HEIF, BMP and GIF.`,
  );
}

export function corruptFileError(fileName: string, cause?: unknown): ConvertError {
  return new ConvertError(
    "corrupt_file",
    `"${fileName}" looks damaged or isn't a valid image file, so it couldn't be read.`,
    { cause },
  );
}

export function memoryLimitError(fileName: string): ConvertError {
  return new ConvertError(
    "memory_limit",
    `"${fileName}" is too large to process in this browser tab. Try a smaller image or, on iPhone/Safari, convert fewer files at once.`,
  );
}

export function missingCodecError(what: string): ConvertError {
  return new ConvertError(
    "missing_codec",
    `Your browser doesn't support ${what}. Try updating your browser or use a different output format.`,
  );
}

export function decodeFailedError(fileName: string, cause?: unknown): ConvertError {
  return new ConvertError("decode_failed", `Couldn't decode "${fileName}".`, { cause });
}

export function encodeFailedError(cause?: unknown): ConvertError {
  return new ConvertError("encode_failed", "Couldn't encode the converted image.", { cause });
}
