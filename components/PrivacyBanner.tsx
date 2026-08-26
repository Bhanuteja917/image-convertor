import Link from "next/link";

export function PrivacyBanner() {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-gray-700">
      <svg
        className="h-5 w-5 shrink-0 text-brand-600"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 1.5a5.5 5.5 0 00-5.5 5.5v2A2.5 2.5 0 002 11.5v5A2.5 2.5 0 004.5 19h11a2.5 2.5 0 002.5-2.5v-5A2.5 2.5 0 0015.5 9v-2A5.5 5.5 0 0010 1.5zm-3.5 7V7a3.5 3.5 0 117 0v1.5h-7z"
          clipRule="evenodd"
        />
      </svg>
      <p>
        Processing happens entirely in your browser. Your files are never uploaded.{" "}
        <Link href="/how-it-works" className="font-medium underline underline-offset-2 hover:text-brand-700">
          See how to verify this
        </Link>
        .
      </p>
    </div>
  );
}
