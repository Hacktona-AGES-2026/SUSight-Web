import { cn } from "@/lib/utils";

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  className?: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn("bg-muted flex rounded-lg p-[3px]", className)}
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={o.value === value}
          onClick={() => onChange(o.value)}
          className={cn(
            "text-note flex-1 rounded-[11px] px-3 py-2",
            o.value === value
              ? "bg-brand-highlight font-semibold"
              : "text-subtle-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
