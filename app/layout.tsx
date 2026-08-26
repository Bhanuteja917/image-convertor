import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Image Convertor",
  description: "Convert HEIC, PNG, JPG, WebP and more, entirely in your browser. Nothing is ever uploaded.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
