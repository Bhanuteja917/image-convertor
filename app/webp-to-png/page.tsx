import type { Metadata } from "next";
import { FormatLandingPage } from "@/components/FormatLandingPage";

export const metadata: Metadata = {
  title: "WebP to PNG Converter — For Maximum Compatibility",
  description:
    "Convert WebP images to PNG when you need maximum compatibility with older software, design tools, or upload forms that don't accept WebP. Free and entirely browser-based.",
  alternates: { canonical: "/webp-to-png" },
};

export default function WebpToPngPage() {
  return (
    <FormatLandingPage
      h1="WebP to PNG Converter"
      intro="WebP is great for the web, but not every tool accepts it yet. Convert back to PNG for maximum compatibility with design software, older apps, and upload forms."
      outputFormat="png"
      sections={[
        {
          heading: "Why would I need to convert away from WebP?",
          body: (
            <p>
              WebP has excellent support in web browsers, but that doesn&apos;t mean universal support everywhere.
              Some versions of design and editing software handle WebP inconsistently or not at all, some
              content management systems and upload forms still reject it outright, and some print or
              publishing workflows simply expect PNG or JPG. If you&apos;ve downloaded a WebP image from a website
              and need to use it somewhere less web-native — a document, a presentation, an older editor — PNG
              is the safer, more universally accepted format.
            </p>
          ),
        },
        {
          heading: "Will I lose any quality going back to PNG?",
          body: (
            <p>
              It depends on how the WebP file was created. If it was saved as <em>lossless</em> WebP, converting
              to PNG is essentially lossless too — no further quality is lost. If the WebP was saved with lossy
              compression (the more common case for photos), some detail was already discarded when it was
              first compressed; converting to PNG at that point preserves exactly what&apos;s left, but can&apos;t
              recover detail lost during the original lossy encoding. Either way, converting to PNG won&apos;t
              introduce any additional compression artifacts of its own, since PNG is lossless.
            </p>
          ),
        },
        {
          heading: "Transparency carries over correctly",
          body: (
            <p>
              If your WebP image has a transparent background, that transparency is preserved when converting
              to PNG — both formats support a full alpha channel, so nothing needs to be flattened or filled
              in during this particular conversion (unlike converting to JPG, which has no transparency
              support at all).
            </p>
          ),
        },
      ]}
      faqs={[
        {
          question: "Why would I convert a WebP image to PNG?",
          answer:
            "Some software, design tools, and upload forms don't support WebP well or at all. Converting to PNG maximizes compatibility, especially outside of web browsers.",
        },
        {
          question: "Does converting WebP to PNG lose quality?",
          answer:
            "If the original WebP was lossless, no further quality is lost. If it was lossy, whatever detail was already discarded during the original compression can't be recovered, but no additional loss happens during this conversion since PNG is lossless.",
        },
        {
          question: "Does transparency carry over?",
          answer:
            "Yes — both WebP and PNG support alpha-channel transparency, so transparent areas in your WebP image stay transparent in the converted PNG.",
        },
        {
          question: "Is there a downside to PNG compared to WebP?",
          answer:
            "PNG files are typically larger than equivalent WebP files, which matters for web page load times but usually doesn't matter for local use, printing, or software compatibility.",
        },
      ]}
    />
  );
}
