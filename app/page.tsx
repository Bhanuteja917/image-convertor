import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { ConverterPanel } from "@/components/converter/ConverterPanel";
import { PrivacyBanner } from "@/components/PrivacyBanner";

export const metadata: Metadata = {
  title: "Free Online Image Converter — HEIC, PNG, JPG, WebP",
  description:
    "Convert JPG, PNG, WebP, HEIC/HEIF, BMP and GIF images for free, entirely in your browser. Batch convert, strip EXIF/GPS data, and download as a ZIP — nothing is ever uploaded to a server.",
  alternates: { canonical: "/" },
};

const FAQS = [
  {
    question: "Is this actually private, or does it just say that?",
    answer:
      "It's private by construction: there is no upload endpoint in this app at all. Every conversion runs with the Canvas API and WebAssembly directly in your browser tab. Open your browser's Network tab while converting a file and you'll see no request carrying image data — see /how-it-works for exact steps.",
  },
  {
    question: "What image formats can I convert?",
    answer:
      "You can convert from JPG, PNG, WebP, HEIC/HEIF, BMP, and GIF. You can convert to JPG, PNG, or WebP.",
  },
  {
    question: "Is there a file size or batch limit?",
    answer:
      "Individual files up to 50MB are supported. Batch size is capped higher on desktop browsers; on mobile Safari we cap batches more conservatively because iOS aggressively kills browser tabs that use too much memory.",
  },
  {
    question: "Does converting remove my photo's GPS location?",
    answer:
      "Yes, by default. The EXIF-stripping toggle is on by default and removes GPS coordinates and camera metadata from the output. You can turn it off if you specifically want to keep that metadata for a JPG-to-JPG conversion.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

export default function Home() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-10 px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="flex flex-col gap-3 text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">Convert images without uploading them anywhere</h1>
        <p className="mx-auto max-w-2xl text-gray-600">
          JPG, PNG, WebP, HEIC/HEIF, BMP and GIF — convert to JPG, PNG, or WebP. Batch convert dozens of
          files, strip location data, and download instantly. Everything happens on your device.
        </p>
      </div>

      <PrivacyBanner />

      <ConverterPanel />

      <AdSlot variant="result" />

      <section className="flex flex-col gap-4 border-t border-gray-100 pt-10">
        <h2 className="text-xl font-semibold">Why convert in the browser instead of uploading?</h2>
        <p className="text-gray-600">
          Most online image converters work by uploading your file to a server, converting it there, and
          sending it back. That means your photos — including ones with embedded GPS coordinates — pass
          through a company&apos;s infrastructure and may sit in logs or temporary storage you can&apos;t see.
          This tool decodes and re-encodes images using your browser&apos;s own Canvas API and a
          WebAssembly HEIC decoder, so the bytes never leave your device. You can verify this yourself: see{" "}
          <Link href="/how-it-works" className="text-brand-600 underline underline-offset-2">
            how to check in your browser&apos;s Network tab
          </Link>
          .
        </p>

        <h2 className="mt-4 text-xl font-semibold">Popular conversions</h2>
        <ul className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
          <li>
            <Link href="/heic-to-jpg" className="text-brand-600 underline underline-offset-2">
              HEIC to JPG
            </Link>
          </li>
          <li>
            <Link href="/png-to-jpg" className="text-brand-600 underline underline-offset-2">
              PNG to JPG
            </Link>
          </li>
          <li>
            <Link href="/jpg-to-webp" className="text-brand-600 underline underline-offset-2">
              JPG to WebP
            </Link>
          </li>
          <li>
            <Link href="/png-to-webp" className="text-brand-600 underline underline-offset-2">
              PNG to WebP
            </Link>
          </li>
          <li>
            <Link href="/webp-to-png" className="text-brand-600 underline underline-offset-2">
              WebP to PNG
            </Link>
          </li>
        </ul>
      </section>

      <AdSlot variant="in-content" />

      <section className="flex flex-col gap-4 border-t border-gray-100 pt-10">
        <h2 className="text-xl font-semibold">Frequently asked questions</h2>
        <dl className="flex flex-col gap-4">
          {FAQS.map((faq) => (
            <div key={faq.question}>
              <dt className="font-medium text-gray-900">{faq.question}</dt>
              <dd className="mt-1 text-gray-600">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
}
