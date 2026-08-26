import Link from "next/link";

const NAV_LINKS = [
  { href: "/heic-to-jpg", label: "HEIC to JPG" },
  { href: "/png-to-jpg", label: "PNG to JPG" },
  { href: "/jpg-to-webp", label: "JPG to WebP" },
  { href: "/how-it-works", label: "How it works" },
];

export function Header() {
  return (
    <header className="border-b border-gray-100">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="text-lg font-bold text-gray-900">
          Image Convertor
        </Link>
        <nav aria-label="Main" className="hidden gap-6 text-sm text-gray-600 sm:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-brand-600">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
