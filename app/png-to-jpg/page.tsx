import type { Metadata } from "next";
import { FormatLandingPage } from "@/components/FormatLandingPage";

export const metadata: Metadata = {
  title: "PNG to JPG Converter — Shrink File Size, Free & Private",
  description:
    "Convert PNG images to JPG in your browser to cut file size dramatically. Choose a background color for transparent areas. No upload, no watermark, no signup.",
  alternates: { canonical: "/png-to-jpg" },
};

export default function PngToJpgPage() {
  return (
    <FormatLandingPage
      h1="PNG to JPG Converter"
      intro="Turn large, lossless PNGs into much smaller JPGs — ideal for uploads, email attachments, and anywhere file size matters more than pixel-perfect edges."
      outputFormat="jpeg"
      sections={[
        {
          heading: "Why is my PNG so much bigger than it needs to be?",
          body: (
            <p>
              PNG is a <em>lossless</em> format — it stores every pixel exactly, with no quality loss, which
              is exactly why screenshots, UI mockups, and text-heavy images look crisp as PNGs. The cost is
              file size: a lossless encoding of a busy photo can easily run 5-10x larger than a JPG that looks
              nearly identical to the eye. JPG achieves its smaller size with lossy compression tuned for how
              human vision actually works, discarding detail you&apos;re unlikely to notice. For photographs, that
              trade is usually a clear win; for flat-color graphics or text, PNG (or WebP) tends to stay the
              better choice.
            </p>
          ),
        },
        {
          heading: "What happens to transparent areas?",
          body: (
            <p>
              This is the part most converters get wrong. JPG has no concept of transparency — every pixel
              must have a solid color. Naively converting a transparent PNG to JPG often turns transparent
              areas solid black. This tool instead flattens transparency onto a background color you choose
              (white by default) before encoding, so a logo with a transparent background comes out looking
              correct on a white page instead of ruined by a black box. Use the color picker above if your
              target background isn&apos;t white.
            </p>
          ),
        },
        {
          heading: "When PNG is still the better choice",
          body: (
            <p>
              If your image has sharp edges, flat colors, or text — a screenshot, a diagram, a logo — PNG
              usually compresses better and stays perfectly crisp. JPG&apos;s lossy compression tends to introduce
              visible &quot;blocky&quot; artifacts around hard edges and text. Reach for this converter when you have a
              genuine photograph, or when a specific upload form or size limit requires JPG regardless of
              content type.
            </p>
          ),
        },
      ]}
      faqs={[
        {
          question: "Will I lose my PNG's transparency?",
          answer:
            "JPG doesn't support transparency at all, so transparent areas are filled with a background color you choose (white by default) rather than turning black, which is what happens with many naive converters.",
        },
        {
          question: "How much smaller will the JPG be?",
          answer:
            "It depends heavily on the image, but photographic PNGs commonly shrink by 60-90% when converted to JPG at a reasonable quality setting. Flat-color graphics see less benefit and sometimes end up larger.",
        },
        {
          question: "Can I control the JPG quality?",
          answer:
            "Yes — use the quality slider to trade off file size against visual fidelity, with a live estimated file size as you adjust it.",
        },
        {
          question: "Is this better than my image editor's 'export as JPG'?",
          answer:
            "The output is comparable, but this handles transparency flattening and batch conversion for you without opening an editor, and never uploads your files anywhere.",
        },
      ]}
    />
  );
}
