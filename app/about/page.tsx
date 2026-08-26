import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "Why Image Convertor exists and how it's different from other online image converters.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-12">
      <h1 className="text-3xl font-bold sm:text-4xl">About Image Convertor</h1>
      <p className="text-gray-600">
        Image Convertor is a free tool for converting everyday image formats — JPG, PNG, WebP, HEIC/HEIF,
        BMP, and GIF — without uploading anything to a server. It started from a simple, common frustration:
        someone takes a photo on an iPhone, tries to open it on a Windows PC or upload it to a form, and gets
        a confusing error because the file is HEIC instead of JPG. Most tools that solve this ask you to
        upload your photo to a website first, which felt backwards for something this simple and personal.
      </p>
      <p className="text-gray-600">
        Every conversion here runs directly in your browser using WebAssembly and the Canvas API. See{" "}
        <Link href="/how-it-works" className="text-brand-600 underline underline-offset-2">
          how it works
        </Link>{" "}
        for the technical details and exactly how to verify that for yourself.
      </p>
      <p className="text-gray-600">
        This site is ad-supported (space is reserved for ads, though none are running yet) rather than
        subscription-based, so the core conversion tools stay free and don&apos;t require an account.
      </p>
    </main>
  );
}
