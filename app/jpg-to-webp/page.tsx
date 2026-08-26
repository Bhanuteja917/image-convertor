import type { Metadata } from "next";
import { FormatLandingPage } from "@/components/FormatLandingPage";

export const metadata: Metadata = {
  title: "JPG to WebP Converter — Smaller Files for Faster Websites",
  description:
    "Convert JPG photos to WebP for typically 25-35% smaller files at the same visual quality. Great for website performance and Core Web Vitals. Runs entirely in your browser.",
  alternates: { canonical: "/jpg-to-webp" },
};

export default function JpgToWebpPage() {
  return (
    <FormatLandingPage
      h1="JPG to WebP Converter"
      intro="WebP is Google's modern image format — usually 25-35% smaller than an equivalent-quality JPG. If you're optimizing a website, this is one of the highest-leverage changes you can make."
      outputFormat="webp"
      sections={[
        {
          heading: "Why bother switching from JPG?",
          body: (
            <p>
              Every major browser has supported WebP for years now, and search engines and site-speed tools
              (Google PageSpeed Insights, Lighthouse, Core Web Vitals) specifically flag JPG/PNG images as an
              optimization opportunity when a smaller WebP equivalent exists. Smaller image payloads mean
              faster page loads, which affects both user experience and, for many sites, search ranking.
              Photographers, bloggers, and anyone running an image-heavy website are the most common
              beneficiaries — smaller files without a visible quality hit.
            </p>
          ),
        },
        {
          heading: "Do all browsers actually support WebP now?",
          body: (
            <p>
              Yes, as of the last several years — Chrome, Firefox, Safari, and Edge all display WebP images
              natively, including on mobile. This was a real concern in WebP&apos;s early years when Safari
              lagged behind, but it&apos;s no longer a practical blocker for displaying WebP images on the
              web. This converter also feature-detects the browser&apos;s WebP encoding support before
              offering it as an option, so you&apos;ll only see it as a choice when your specific browser can
              actually produce it.
            </p>
          ),
        },
        {
          heading: "What's the catch?",
          body: (
            <p>
              WebP is excellent for web delivery, but it&apos;s a newer, less universally supported format
              outside browsers — some older image editors, some print workflows, and some non-web software
              still expect JPG or PNG. If you&apos;re producing an image purely for a web page or app, WebP is
              usually the better choice; if it needs to work everywhere else too (print shops, older desktop
              software, email attachments some recipients may struggle to open), keep a JPG version on hand as
              well.
            </p>
          ),
        },
      ]}
      faqs={[
        {
          question: "Do all browsers support WebP?",
          answer:
            "Yes — every major browser (Chrome, Firefox, Safari, Edge) has supported viewing WebP images for years, including on mobile devices.",
        },
        {
          question: "Will my photos look noticeably different?",
          answer:
            "At the same quality setting, WebP typically produces smaller files than JPG with comparable visual quality — most people can't tell the difference at normal viewing sizes.",
        },
        {
          question: "Should I use WebP for photos I plan to print?",
          answer:
            "JPG remains the safer choice for print workflows and older software. WebP is best suited to web and app delivery where every browser involved supports it.",
        },
        {
          question: "What if my browser can't create WebP files?",
          answer:
            "This tool checks your browser's actual WebP encoding support before showing it as an option, so you won't hit a failed conversion — the option simply won't appear if unsupported.",
        },
      ]}
    />
  );
}
