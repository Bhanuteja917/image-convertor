import { AdSlot } from "@/components/AdSlot";
import { ConverterPanel } from "@/components/converter/ConverterPanel";
import { PrivacyBanner } from "@/components/PrivacyBanner";
import type { OutputFormat } from "@/lib/convert";

export interface LandingFaq {
  question: string;
  answer: string;
}

export interface LandingSection {
  heading: string;
  body: React.ReactNode;
}

interface FormatLandingPageProps {
  h1: string;
  intro: string;
  outputFormat: OutputFormat;
  sections: LandingSection[];
  faqs: LandingFaq[];
}

export function FormatLandingPage({ h1, intro, outputFormat, sections, faqs }: FormatLandingPageProps) {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-10 px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="flex flex-col gap-3 text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">{h1}</h1>
        <p className="mx-auto max-w-2xl text-gray-600">{intro}</p>
      </div>

      <PrivacyBanner />

      <ConverterPanel initialOutputFormat={outputFormat} lockOutputFormat />

      <AdSlot variant="result" />

      {sections.map((section, i) => (
        <section key={section.heading} className="flex flex-col gap-4 border-t border-gray-100 pt-10">
          <h2 className="text-xl font-semibold">{section.heading}</h2>
          <div className="flex flex-col gap-3 text-gray-600">{section.body}</div>
          {i === 0 && <AdSlot variant="in-content" className="mt-2" />}
        </section>
      ))}

      <section className="flex flex-col gap-4 border-t border-gray-100 pt-10">
        <h2 className="text-xl font-semibold">Frequently asked questions</h2>
        <dl className="flex flex-col gap-4">
          {faqs.map((faq) => (
            <div key={faq.question}>
              <dt className="font-medium text-gray-900">{faq.question}</dt>
              <dd className="mt-1 text-gray-600">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
}
