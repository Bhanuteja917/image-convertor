import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/", label: "Converter" },
  { href: "/heic-to-jpg", label: "HEIC to JPG" },
  { href: "/png-to-jpg", label: "PNG to JPG" },
  { href: "/jpg-to-webp", label: "JPG to WebP" },
  { href: "/png-to-webp", label: "PNG to WebP" },
  { href: "/webp-to-png", label: "WebP to PNG" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy-policy", label: "Privacy policy" },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-100">
      <div className="mx-auto max-w-5xl px-4 py-10 text-sm text-gray-500">
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
          {FOOTER_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-brand-600">
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="mt-6">
          &copy; {new Date().getFullYear()} Image Convertor. All conversions run locally in your browser.
        </p>
      </div>
    </footer>
  );
}
