import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/** Opção de escolha do Figma: radio (uma opção) ou caixa (várias). */
export function Choice({
  type,
  checked,
  onChange,
  name,
  children,
}: {
  type: "radio" | "checkbox";
  checked: boolean;
  onChange: () => void;
  name?: string;
  children: React.ReactNode;
}) {
  return (
    <label
      className={cn(
        "border-border text-body has-focus-visible:ring-ring/50 flex cursor-pointer items-center gap-3 rounded-[10px] border px-4 py-3.5 has-focus-visible:ring-3",
        checked ? "bg-brand-soft" : "bg-card",
      )}
    >
      <input
        type={type}
        name={name}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span
        aria-hidden
        className={cn(
          "flex size-6 shrink-0 items-center justify-center",
          type === "radio" ? "rounded-full" : "rounded-[7px]",
          checked ? "bg-brand" : "border-line-strong border-[1.5px]",
        )}
      >
        {checked &&
          (type === "radio" ? (
            <span className="size-2 rounded-full bg-white" />
          ) : (
            <Check className="size-3.5 text-white" strokeWidth={3} />
          ))}
      </span>
      {children}
    </label>
  );
}
