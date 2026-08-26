import type { Metadata } from "next";
import { FormatLandingPage } from "@/components/FormatLandingPage";

export const metadata: Metadata = {
  title: "PNG to WebP Converter — Keep Transparency, Shrink File Size",
  description:
    "Convert PNG to WebP and keep transparency intact while cutting file size. Ideal for logos, icons, and UI screenshots on the web. Converts entirely in your browser.",
  alternates: { canonical: "/png-to-webp" },
};

export default function PngToWebpPage() {
  return (
    <FormatLandingPage
      h1="PNG to WebP Converter"
      intro="Unlike JPG, WebP supports transparency — so you can shrink a transparent PNG logo or icon for the web without losing its transparent background."
      outputFormat="webp"
      sections={[
        {
          heading: "The best of both PNG and JPG, sort of",
          body: (
            <p>
              PNG&apos;s two biggest strengths are lossless quality and alpha transparency — but that comes at the
              cost of file size. WebP was designed to close that gap: it supports transparency just like PNG,
              but with much more efficient compression, so a transparent logo, icon, or UI screenshot saved as
              WebP is typically noticeably smaller than the same image as PNG, transparency and all. WebP can
              also do lossless compression the way PNG does, or lossy compression the way JPG does — this
              converter uses lossy WebP with a quality slider, which is usually the better tradeoff unless
              you&apos;re archiving pixel-perfect source art.
            </p>
          ),
        },
        {
          heading: "Good candidates for this conversion",
          body: (
            <p>
              Website logos, app icons, UI screenshots with transparent backgrounds, illustrations with
              transparent areas — anything you&apos;d currently keep as PNG specifically for the transparency, but
              that&apos;s part of a web page or app where every extra kilobyte affects load time. If your PNG has
              no transparency and is mostly a photograph, converting to WebP still helps, but you&apos;d get a
              similar benefit either way.
            </p>
          ),
        },
        {
          heading: "One thing to check first",
          body: (
            <p>
              A small number of older tools and some non-web contexts still don&apos;t handle WebP well. If the
              image is going straight into a web page or app you control, WebP is close to a strict upgrade
              over PNG. If it needs to work in, say, an email client or a design tool with spotty WebP
              support, test it there first or keep a PNG copy as a fallback.
            </p>
          ),
        },
      ]}
      faqs={[
        {
          question: "Does WebP support transparency like PNG?",
          answer:
            "Yes — WebP has full alpha-channel transparency support, so converting a transparent PNG to WebP keeps the transparent areas transparent.",
        },
        {
          question: "How much smaller will the file be?",
          answer:
            "It varies by image, but transparent PNGs commonly shrink noticeably when converted to WebP at a similar visual quality, since WebP's compression is more efficient than PNG's.",
        },
        {
          question: "Is WebP good for icons and logos?",
          answer:
            "Yes, especially when file size matters for page load speed. For very small, simple icons the size difference may be modest, but for larger graphics with transparency it's usually significant.",
        },
        {
          question: "Will this work if my browser is older?",
          answer:
            "This tool checks whether your browser can actually encode WebP before offering it as an output option, so you won't run into a failed conversion.",
        },
      ]}
    />
  );
}
