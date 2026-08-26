"use client";

interface ExifToggleProps {
  stripExif: boolean;
  onChange: (stripExif: boolean) => void;
}

export function ExifToggle({ stripExif, onChange }: ExifToggleProps) {
  return (
    <label className="flex items-start gap-3 rounded-lg border border-gray-200 p-3">
      <input
        type="checkbox"
        checked={stripExif}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 accent-brand-600"
      />
      <span>
        <span className="flex items-center gap-2 text-sm font-medium text-gray-900">
          Remove location &amp; camera data (EXIF)
          <span className="rounded bg-brand-100 px-1.5 py-0.5 text-xs font-semibold text-brand-700">
            Recommended
          </span>
        </span>
        <span className="mt-0.5 block text-sm text-gray-500">
          Phone photos often embed GPS coordinates. We strip this by default so you don&apos;t share your
          location by accident.
        </span>
      </span>
    </label>
  );
}
