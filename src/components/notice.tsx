import { Info } from "lucide-react";
import { cn } from "cn";

const tones = {
  brand: { box: "bg-brand-soft", title: "text-brand" },
  warning: { box: "bg-white ring-1 ring-border", title: "text-warning" },
  success: { box: "bg-white ring-1 ring-border", title: "text-brand" },
  danger: { box: "bg-destructive-soft", title: "text-destructive" },
} as const;

/** Aviso do Figma: círculo branco com ícone, título e texto. */
export function Notice({
  title,
  tone = "brand",
  icon: Icon = Info,
  className,
  children,
}: {
  title: string;
  tone?: keyof typeof tones;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      role="status"
      className={cn(
        "flex items-start gap-3 rounded-[10px] p-4",
        tones[tone].box,
        className,
      )}
    >
      <span className="bg-background text-brand flex size-9 shrink-0 items-center justify-center rounded-full">
        <Icon className="size-[18px]" />
      </span>
      <div className="flex flex-col gap-1">
        <p className={cn("text-subtitle font-semibold", tones[tone].title)}>
          {title}
        </p>
        {children && (
          <p className="text-note text-subtle-foreground">{children}</p>
        )}
      </div>
    </div>
  );
}

/** Mensagem de erro com opção de tentar de novo. */
export function ErrorNotice({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="bg-destructive-soft text-destructive text-subtitle flex items-center justify-between gap-4 rounded-[10px] px-4 py-3"
    >
      <span>{message}</span>
      {onRetry && (
        <button type="button" onClick={onRetry} className="font-semibold">
          Tentar de novo
        </button>
      )}
    </div>
  );
}
