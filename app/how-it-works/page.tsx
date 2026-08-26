import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works — Verify Nothing Is Uploaded",
  description:
    "How Image Convertor converts files entirely in your browser using WebAssembly and the Canvas API, and exactly how to verify it yourself in your browser's Network tab.",
  alternates: { canonical: "/how-it-works" },
};

export default function HowItWorksPage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-12">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold sm:text-4xl">How it works</h1>
        <p className="text-gray-600">
          The short version: there is no server in this application that receives your images. Everything
          happens on your device. Here&apos;s what actually runs, and how to check it yourself.
        </p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">What actually happens when you convert a file</h2>
        <ol className="list-decimal space-y-2 pl-5 text-gray-600">
          <li>
            Your browser reads the file you dropped or selected directly from disk, using the standard
            File API — no network request is involved in this step.
          </li>
          <li>
            The file&apos;s bytes are handed to a Web Worker running on your device. For JPG, PNG, WebP, BMP,
            and GIF, the browser&apos;s built-in Canvas API decodes the image. For HEIC/HEIF, a WebAssembly
            build of{" "}
            <a
              href="https://github.com/strukturag/libheif"
              className="text-brand-600 underline underline-offset-2"
              rel="noopener noreferrer"
            >
              libheif
            </a>{" "}
            decodes it — a roughly 1-2MB module that downloads once, the first time you convert a HEIC file
            (never on initial page load, and not at all if your browser can already decode HEIC natively).
          </li>
          <li>
            The decoded pixels are re-encoded to your chosen output format, again using the Canvas API,
            directly in the worker.
          </li>
          <li>
            The result is handed back to the page as an in-memory Blob. Downloading it uses a local{" "}
            <code className="rounded bg-gray-100 px-1 py-0.5 text-sm">blob:</code> URL — still no network
            request.
          </li>
        </ol>
        <p className="text-gray-600">
          Running conversion in a Web Worker also means it doesn&apos;t freeze the page while it works, and a
          pool of workers (sized to your device&apos;s CPU cores) lets batch conversions run in parallel.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Verify it yourself in under a minute</h2>
        <ol className="list-decimal space-y-2 pl-5 text-gray-600">
          <li>Open this site in Chrome, Firefox, Safari, or Edge.</li>
          <li>
            Open Developer Tools (<kbd className="rounded border border-gray-300 px-1">F12</kbd>, or{" "}
            <kbd className="rounded border border-gray-300 px-1">Cmd</kbd>+
            <kbd className="rounded border border-gray-300 px-1">Option</kbd>+
            <kbd className="rounded border border-gray-300 px-1">I</kbd> on a Mac) and switch to the{" "}
            <strong>Network</strong> tab.
          </li>
          <li>Clear the network log, then drop a photo into the converter and click Convert.</li>
          <li>
            Watch the request list. You&apos;ll see the page&apos;s own assets that already loaded, and — the
            first time only — a request for the HEIC decoder if you converted a HEIC file. You will not see
            any outgoing request whose payload is your image. Filter by size: your original photo is likely
            several hundred KB to several MB; no request of that size will appear after you hit Convert.
          </li>
          <li>
            For extra confidence, disconnect your device from the internet after the page has loaded, then
            try converting a file. It will still work, because nothing about the conversion itself needs a
            network connection.
          </li>
        </ol>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Why build it this way</h2>
        <p className="text-gray-600">
          Most online image converters upload your file to a server, process it there, and send back a
          result — which means your photo (and any embedded metadata, like GPS location) passes through
          infrastructure you can&apos;t inspect. Running everything client-side removes that step entirely:
          there&apos;s no server-side code in this app that could see, log, or store your images even if it
          wanted to, because it doesn&apos;t exist.
        </p>
      </section>
    </main>
  );
}
