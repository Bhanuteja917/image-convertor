/**
 * Mobile Safari has by far the tightest per-tab memory ceiling of any major
 * browser and will silently kill the tab rather than surface an error, so we
 * proactively cap batch size there. This is the one place in the app that
 * reaches for UA sniffing instead of feature detection: there's no API that
 * reports "how much memory is this tab allowed before it gets killed",
 * so a heuristic is the only option.
 */
export function isProbablyMobileSafari(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const isIOS = /iP(hone|od|ad)/.test(ua) || (ua.includes("Macintosh") && navigator.maxTouchPoints > 1);
  const isWebKit = /WebKit/.test(ua);
  const isChromeOrFirefoxOnIOS = /CriOS|FxiOS|EdgiOS|OPiOS/.test(ua);
  return isIOS && isWebKit && !isChromeOrFirefoxOnIOS;
}
