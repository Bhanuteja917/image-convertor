import type { Metadata } from "next";
import { FormatLandingPage } from "@/components/FormatLandingPage";

export const metadata: Metadata = {
  title: "HEIC to JPG Converter — Free, Private, No Upload",
  description:
    "Convert iPhone HEIC/HEIF photos to JPG for free, right in your browser. Fixes 'can't open this photo' errors on Windows, email, and old apps. Nothing is ever uploaded.",
  alternates: { canonical: "/heic-to-jpg" },
};

export default function HeicToJpgPage() {
  return (
    <FormatLandingPage
      h1="HEIC to JPG Converter"
      intro="Turn iPhone photos that won't open anywhere else into JPGs that open everywhere. Fully private — your photos never leave your device."
      outputFormat="jpeg"
      sections={[
        {
          heading: "Why won't my iPhone photo open on Windows?",
          body: (
            <>
              <p>
                Since iOS 11, iPhones save photos in a format called HEIC (High Efficiency Image Container) by
                default instead of JPG. It&apos;s an Apple-favored standard built on HEIF that compresses
                photos to roughly half the file size of a JPG at similar visual quality — great for saving
                space in iCloud and on your phone. The tradeoff is compatibility: HEIC support is inconsistent
                outside Apple&apos;s ecosystem. Windows only added limited HEIC support in fairly recent
                versions, older versions can&apos;t open it at all without installing a codec pack, and a huge
                number of web forms, job application portals, and older desktop software simply reject the
                file outright with no useful error message.
              </p>
              <p>
                Converting to JPG sidesteps all of that. JPG has been the universal photo format since the
                1990s — every browser, operating system, printer, and upload form on Earth understands it.
              </p>
            </>
          ),
        },
        {
          heading: "Can I stop my iPhone from creating HEIC files in the first place?",
          body: (
            <p>
              Yes — go to <strong>Settings → Camera → Formats</strong> and choose{" "}
              <strong>&quot;Most Compatible&quot;</strong> instead of &quot;High Efficiency.&quot; New photos
              will save as JPG going forward. That doesn&apos;t help with photos you&apos;ve already taken,
              though, which is where a converter like this one comes in — especially for a whole camera roll
              at once.
            </p>
          ),
        },
        {
          heading: "What happens to Live Photos and quality?",
          body: (
            <>
              <p>
                A Live Photo is actually a HEIC still frame paired with a short video clip. Converting to JPG
                keeps the still frame — the photo you&apos;d actually see and share — but the motion/audio
                portion isn&apos;t part of a JPG and won&apos;t carry over. If you need the motion, keep the
                original HEIC/Live Photo as your archive copy and use the JPG for sharing or uploading.
              </p>
              <p>
                Quality-wise, this tool decodes the full-resolution HEIC image and re-encodes it as JPG at the
                quality level you choose (85% by default, adjustable with the slider) — there&apos;s no resize
                or recompression beyond that single step.
              </p>
            </>
          ),
        },
        {
          heading: "Your location data stays out of it",
          body: (
            <p>
              iPhone photos usually embed the exact GPS coordinates of where they were taken. That&apos;s
              convenient for organizing your own library, but it&apos;s not something most people mean to
              hand over when they upload a photo to a website or send it to someone. This converter strips
              that EXIF/GPS metadata by default — you&apos;ll see the toggle above, on by default, before you
              convert.
            </p>
          ),
        },
      ]}
      faqs={[
        {
          question: "Why won't my HEIC photo open on my Windows PC?",
          answer:
            "Windows added partial HEIC support only in newer versions via an optional codec from the Microsoft Store, and many apps and websites don't support HEIC at all. Converting to JPG guarantees it will open anywhere.",
        },
        {
          question: "Can I convert multiple HEIC photos at once?",
          answer:
            "Yes. Drop as many files as you like into the converter above and they'll queue up; each one converts independently, and you can download them individually or all together as a ZIP.",
        },
        {
          question: "Does this upload my photos anywhere?",
          answer:
            "No. Conversion happens with WebAssembly and the Canvas API directly in your browser tab. See /how-it-works for exact steps to verify this yourself in your browser's Network tab.",
        },
        {
          question: "Will converting reduce my photo's quality?",
          answer:
            "JPG uses lossy compression, so there is some quality loss compared to the original HEIC, controlled by the quality slider (85% by default is visually close to lossless for most photos). The image is not resized or cropped.",
        },
      ]}
    />
  );
}
