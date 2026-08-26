import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://image-convertor.pages.dev"),
  title: {
    default: "Image Convertor — Convert HEIC, PNG, JPG & WebP in Your Browser",
    template: "%s | Image Convertor",
  },
  description:
    "Convert HEIC, PNG, JPG, WebP, BMP and GIF images entirely in your browser. Nothing is ever uploaded — fast, private, and free.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-white text-gray-900 antialiased">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
