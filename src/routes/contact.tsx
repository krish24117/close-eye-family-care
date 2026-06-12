import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { PageShell } from "@/components/marketing/PageShell";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Close Eye" },
      { name: "description", content: "Reach Close Eye on email or WhatsApp. We respond within one business day." },
      { property: "og:title", content: "Contact — Close Eye" },
      { property: "og:description", content: "Reach Close Eye on email or WhatsApp." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <PageShell
      eyebrow="Contact"
      title="We'd love to hear from your family."
      intro="Tell us a little about your situation and we'll get back within one business day."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {[
          { icon: Mail, label: "Email", value: "hello@closeeye.in", href: "mailto:hello@closeeye.in" },
          { icon: MessageCircle, label: "WhatsApp", value: "+91 00000 00000", href: "https://wa.me/910000000000" },
          { icon: Phone, label: "Book a call", value: "Schedule a consultation", href: "/waitlist" },
        ].map((c) => (
          <a key={c.label} href={c.href} className="rounded-2xl border border-border bg-card p-6 hover:shadow-elevated transition-shadow">
            <c.icon className="h-6 w-6 text-brand" />
            <div className="mt-4 text-xs tracking-widest uppercase text-muted-foreground">{c.label}</div>
            <div className="mt-1 font-medium text-foreground">{c.value}</div>
          </a>
        ))}
      </div>
    </PageShell>
  );
}
