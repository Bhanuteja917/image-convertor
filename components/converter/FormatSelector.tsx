"use client";

import type { OutputFormat } from "@/lib/convert";

interface FormatSelectorProps {
  value: OutputFormat;
  onChange: (format: OutputFormat) => void;
  webpAvailable: boolean;
  locked?: boolean;
}

const FORMATS: Array<{ value: OutputFormat; label: string }> = [
  { value: "jpeg", label: "JPG" },
  { value: "png", label: "PNG" },
  { value: "webp", label: "WebP" },
];

export function FormatSelector({ value, onChange, webpAvailable, locked }: FormatSelectorProps) {
  const options = FORMATS.filter((f) => f.value !== "webp" || webpAvailable);

  if (locked) {
    return (
      <div>
        <span className="block text-sm font-medium text-gray-700">Output format</span>
        <p className="mt-1 text-base font-semibold text-brand-700">
          {FORMATS.find((f) => f.value === value)?.label}
        </p>
      </div>
    );
  }

  return (
    <fieldset>
      <legend className="text-sm font-medium text-gray-700">Output format</legend>
      <div role="radiogroup" className="mt-2 flex gap-2">
        {options.map((format) => (
          <button
            key={format.value}
            type="button"
            role="radio"
            aria-checked={value === format.value}
            onClick={() => onChange(format.value)}
            className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 ${
              value === format.value
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-gray-300 bg-white text-gray-700 hover:border-brand-400"
            }`}
          >
            {format.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
