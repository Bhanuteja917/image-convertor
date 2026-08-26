import { ogImageContentType, ogImageSize, renderOgImage } from "@/lib/og-image";

export const dynamic = "force-static";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function Image() {
  return renderOgImage("HEIC to JPG Converter", "HEIC → JPG");
}
