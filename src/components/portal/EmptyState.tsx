import { type ComponentType, type ReactNode } from "react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon?: ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
      {Icon && (
        <div className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-full bg-accent text-brand">
          <Icon className="h-5 w-5" />
        </div>
      )}
      <h3 className="font-serif text-lg text-primary">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">{description}</p>
      )}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}
