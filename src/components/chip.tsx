import { cn } from "cn";

const tones = {
  neutral: "bg-muted text-brand",
  gray: "bg-muted text-subtle-foreground",
  brand: "bg-brand-soft text-brand",
  warning: "bg-white text-warning",
  danger: "bg-destructive-soft text-destructive",
} as const;

export type ChipTone = keyof typeof tones;

export const priorityTone: Record<"Alta" | "Moderada" | "Baixa", ChipTone> = {
  Alta: "danger",
  Moderada: "warning",
  Baixa: "gray",
};

export function Chip({
  tone = "neutral",
  className,
  children,
}: {
  tone?: ChipTone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "text-caption inline-flex w-fit items-center rounded-md px-2.5 py-1 font-medium whitespace-nowrap",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
