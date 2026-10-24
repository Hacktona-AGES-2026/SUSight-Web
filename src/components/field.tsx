import { useId } from "react";
import { cn } from "cn";

const box =
  "bg-background border-border focus-visible:ring-ring/50 focus-visible:border-ring w-full rounded-2xl border px-4 py-3.5 text-body outline-none focus-visible:ring-3";

type Common = { label: string; hint?: string; className?: string };

export function TextField({
  label,
  className,
  ...props
}: Common & React.ComponentProps<"input">) {
  const id = useId();
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-note text-ink-secondary">
        {label}
      </label>
      <input id={id} className={box} {...props} />
    </div>
  );
}

export function TextArea({
  label,
  className,
  ...props
}: Common & React.ComponentProps<"textarea">) {
  const id = useId();
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-note text-ink-secondary">
        {label}
      </label>
      <textarea id={id} rows={3} className={cn(box, "resize-y")} {...props} />
    </div>
  );
}

export function SelectField({
  label,
  className,
  children,
  ...props
}: Common & React.ComponentProps<"select">) {
  const id = useId();
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-note text-ink-secondary">
        {label}
      </label>
      <select id={id} className={box} {...props}>
        {children}
      </select>
    </div>
  );
}
