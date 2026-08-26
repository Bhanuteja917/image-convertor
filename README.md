# Image Convertor

A free, ad-supported image converter that runs **entirely in the browser** — JPG, PNG, WebP, HEIC/HEIF, BMP,
and GIF in; JPG, PNG, or WebP out. No backend, no upload endpoint, no per-conversion cost. Every decode/encode
happens with the Canvas API and WebAssembly in a pool of Web Workers on the visitor's own device; see
[`/how-it-works`](app/how-it-works/page.tsx) for exactly how to verify that yourself in a browser's Network tab.

## Stack

- Next.js 16 (App Router), static export (`output: 'export'`)
- TypeScript, Tailwind CSS v4
- Vitest for unit tests
- `libheif-js` (WASM) for HEIC/HEIF decoding, lazy-loaded only when a HEIC file is actually dropped
- `jszip` for batch ZIP downloads, lazy-loaded only when the ZIP button is clicked

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

**Important:** dev and build both explicitly pass `--webpack` (see `package.json`). Turbopack — the default
bundler in Next 16 — has an unresolved bug where `new Worker(new URL(...))` either copies the worker's
TypeScript source as a raw, unbundled static asset or fails to strip TypeScript syntax from the worker entry
point during a static-export build (confirmed by direct testing, not assumed). Webpack bundles the worker
correctly and keeps the ~1.4MB HEIC WASM chunk properly lazy. Don't drop `--webpack` without re-verifying the
worker still bundles correctly under Turbopack.

## Testing

```bash
npm test          # run the lib/convert/ unit test suite once
npm run test:watch
```

Unit tests cover the pure, framework-free logic in `lib/convert/`: format detection by magic bytes, EXIF
read/strip/preserve, transparency flattening, and output size estimation. Fixture images (JPEG with real GPS
EXIF, PNG, WebP, BMP, GIF, and a real HEIC file) live in `tests/fixtures/` and were generated with
`scripts/gen-fixtures.py` (requires `pillow-heif` and `piexif`; only needed if you want to regenerate them).

The full conversion pipeline (`convertImage`, which needs `OffscreenCanvas`/`createImageBitmap`) is
inherently browser-only and isn't covered by the Node-based unit tests — it was instead verified with a real
headless-Chromium run against the production static export: HEIC → JPG (via the lazy-loaded WASM decoder),
PNG-with-transparency → JPG (background flattening), batch conversion + ZIP download, and the EXIF
strip-by-default / preserve-on-toggle-off behavior all confirmed working, with zero non-local network
requests made during conversion.

**Not verified: real mobile Safari / WebKit.** This environment has no WebKit engine available, so testing
was limited to Chromium (including mobile-viewport emulation and mobile Lighthouse runs). The conversion
pipeline depends on `OffscreenCanvas` inside a Web Worker, which is a relatively recent Safari capability
(Safari 16.4+) — on an older Safari it will fail gracefully with a "browser doesn't support this" error
per file rather than crashing, but this has not been confirmed on a real device. **Please test on an actual
iPhone/Safari before shipping**, particularly: HEIC conversion, the WebP output option showing/hiding
correctly, and batch conversion near the `MOBILE_SAFARI_MAX_BATCH_FILES` cap (`lib/convert/limits.ts`).

## Building

```bash
npm run build
```

Outputs a fully static site to `out/`. To sanity-check it locally:

```bash
npx serve out
```

## Deploying

Any static host works. For Cloudflare Pages: set the build command to `npm run build` and the output
directory to `out`. For Vercel: Vercel auto-detects `output: 'export'` and serves `out/` directly — no
serverless functions are used or needed.

Before going live:

- Replace the placeholder domain `https://image-convertor.pages.dev` in `app/layout.tsx` (metadataBase),
  `app/sitemap.ts`, and `app/robots.ts` with your real domain.
- Replace the placeholder contact address in `app/contact/page.tsx`.
- Ad slots (`components/AdSlot.tsx`) are empty, fixed-height placeholders reserved for a future AdSense
  integration (intentionally not wired up yet, per project scope) — this keeps CLS at 0 when ads are added
  later, since the containers already have their final size.

## Project structure

```
app/                    Routes: /, 5 format landing pages, /how-it-works, /about, /contact, /privacy-policy
components/converter/   DropZone, format/quality/EXIF/background-color controls, file queue
components/             Shared layout, AdSlot, PrivacyBanner, FormatLandingPage template
lib/convert/            Pure, framework-free conversion engine (unit-tested)
lib/worker/             Web Worker pool + protocol that calls into lib/convert/
lib/                    filename/zip/mobile-detection helpers used by the UI
tests/                  Vitest suite + generated fixture images
public/sw.js            Minimal offline-after-first-visit service worker
```

See `lib/convert/index.ts` for the single `convertImage()` entry point every input format goes through.

## Known limitations (by design, see the build spec)

AVIF/PDF output, resize/crop, target-file-size mode, accounts, and any server-side processing are explicitly
out of scope for this version.
