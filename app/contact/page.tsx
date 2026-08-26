import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch about Image Convertor.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-12">
      <h1 className="text-3xl font-bold sm:text-4xl">Contact</h1>
      <p className="text-gray-600">
        Found a bug, have a feature request, or a format you&apos;d like to see supported? Reach out at{" "}
        <a href="mailto:hello@imageconvertor.example" className="text-brand-600 underline underline-offset-2">
          hello@imageconvertor.example
        </a>
        .
      </p>
      <p className="text-sm text-gray-500">
        (Replace this placeholder address with your real contact email before deploying.)
      </p>
    </main>
  );
}
