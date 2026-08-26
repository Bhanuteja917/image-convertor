/**
 * Reserved space for a future AdSense unit. Rendered as an empty,
 * fixed-height container now so that wiring up real ads later causes zero
 * cumulative layout shift - the box is already the right size.
 */
export function AdSlot({ variant, className = "" }: { variant: "result" | "in-content"; className?: string }) {
  const height = variant === "result" ? "h-24" : "h-64";
  return (
    <div
      className={`w-full ${height} flex items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 text-xs text-gray-600 ${className}`}
      data-ad-slot={variant}
      aria-hidden="true"
    >
      Ad space
    </div>
  );
}
