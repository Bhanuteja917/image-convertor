/** Above this input size we refuse to even attempt decoding - large HEIC/PNG
 * files can expand to gigabytes of raw RGBA in memory and crash the tab
 * before we get a useful error out of the decoder. */
export const MAX_INPUT_FILE_BYTES = 50 * 1024 * 1024; // 50MB

/** Mobile Safari has by far the tightest per-tab memory ceiling; cap how many
 * files we queue into a single batch there so the tab doesn't get killed
 * mid-conversion. Desktop/other mobile browsers are far more tolerant. */
export const MOBILE_SAFARI_MAX_BATCH_FILES = 8;

export const DEFAULT_MAX_BATCH_FILES = 50;
