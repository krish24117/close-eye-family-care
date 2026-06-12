import { type ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

type Props = {
  eyebrow?: string;
  title: string;
  intro?: string;
  children: ReactNode;
};

export function PageShell({ eyebrow, title, intro, children }: Props) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      <section className="bg-cream border-b border-border">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          {eyebrow && (
            <p className="text-xs tracking-widest uppercase text-brand">{eyebrow}</p>
          )}
          <h1 className="mt-3 font-serif text-4xl md:text-6xl tracking-tight text-primary">
            {title}
          </h1>
          {intro && (
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">{intro}</p>
          )}
        </div>
      </section>
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-16">{children}</main>
      <SiteFooter />
    </div>
  );
}
