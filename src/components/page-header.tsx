export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="flex items-end justify-between gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-title-page font-bold">{title}</h1>
        {subtitle && (
          <p className="text-subtitle text-ink-secondary">{subtitle}</p>
        )}
      </div>
      {action}
    </header>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-note text-ink-secondary pl-5">{children}</h2>;
}
