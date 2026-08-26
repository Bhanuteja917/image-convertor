import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Image Convertor's privacy policy: what data is collected (none of your files), and why.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-12">
      <h1 className="text-3xl font-bold sm:text-4xl">Privacy Policy</h1>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Your images</h2>
        <p className="text-gray-600">
          Image Convertor does not upload, transmit, receive, or store the images you convert. There is no
          server-side component in this application that processes image files — all decoding, converting,
          and encoding happens locally in your browser. See{" "}
          <Link href="/how-it-works" className="text-brand-600 underline underline-offset-2">
            how it works
          </Link>{" "}
          for exactly how to verify this yourself.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">What we don&apos;t collect</h2>
        <ul className="list-disc space-y-1 pl-5 text-gray-600">
          <li>We don&apos;t require an account, sign-up, or login.</li>
          <li>We don&apos;t store your files or any metadata extracted from them, anywhere.</li>
          <li>We don&apos;t use local storage or cookies for the conversion tool itself to function.</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Hosting and basic web logs</h2>
        <p className="text-gray-600">
          Like virtually any website, the static hosting provider serving these pages may keep standard
          access logs (e.g. IP address, requested URL, timestamp, browser user agent) for security and
          reliability purposes. These logs cover which pages were requested — never the contents of any image
          you convert, since that never leaves your device.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Advertising</h2>
        <p className="text-gray-600">
          This site is designed to support advertising to stay free, though no ad network is active yet.
          Space is reserved in the layout for future ad placements. When ads are enabled, the ad network
          (e.g. Google AdSense) may set its own cookies and collect data according to its own privacy policy,
          independent of anything described here. This page will be updated when that happens.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Changes to this policy</h2>
        <p className="text-gray-600">
          If this policy changes — for example, when advertising or analytics are added — this page will be
          updated to reflect that.
        </p>
      </section>
    </main>
  );
}
