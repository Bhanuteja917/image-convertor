"use client";

import { useEffect, useState } from "react";
import { formatBytes } from "@/lib/filename";

interface QualitySliderProps {
  quality: number;
  onChange: (quality: number) => void;
  estimateBytes: number | null;
}

/** Debounces the visible size estimate so dragging the slider stays smooth. */
export function QualitySlider({ quality, onChange, estimateBytes }: QualitySliderProps) {
  const [debouncedEstimate, setDebouncedEstimate] = useState(estimateBytes);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedEstimate(estimateBytes), 150);
    return () => clearTimeout(timer);
  }, [estimateBytes]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <label htmlFor="quality-slider" className="text-sm font-medium text-gray-700">
          Quality
        </label>
        <span className="text-sm text-gray-500">
          {Math.round(quality * 100)}%
          {debouncedEstimate !== null && <> &middot; ~{formatBytes(debouncedEstimate)} per file</>}
        </span>
      </div>
      <input
        id="quality-slider"
        type="range"
        min={0.1}
        max={1}
        step={0.01}
        value={quality}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-brand-600"
        aria-valuetext={`${Math.round(quality * 100)} percent`}
      />
    </div>
  );
}
