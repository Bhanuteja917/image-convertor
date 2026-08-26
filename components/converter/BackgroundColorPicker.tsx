"use client";

interface BackgroundColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export function BackgroundColorPicker({ color, onChange }: BackgroundColorPickerProps) {
  return (
    <div className="flex items-center gap-3">
      <label htmlFor="bg-color" className="text-sm font-medium text-gray-700">
        Background color for transparent areas
      </label>
      <input
        id="bg-color"
        type="color"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-12 cursor-pointer rounded border border-gray-300"
      />
      <span className="text-sm text-gray-500">{color}</span>
    </div>
  );
}
