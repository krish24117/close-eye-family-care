import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MessageCircle, Phone, Send, Check } from "lucide-react";
import { z } from "zod";
import { PageShell } from "@/components/marketing/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const WHATSAPP_NUMBER = "919000221261";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  email: z.string().trim().email("Enter a valid email").max(160),
  phone: z.string().trim().min(6, "Enter a valid phone number").max(24),
  topic: z.enum(["consultation", "services", "pricing", "partnership", "other"]),
  message: z.string().trim().min(10, "Tell us a little more (10+ chars)").max(1000),
});

type FormState = z.infer<typeof contactSchema>;
type FieldErrors = Partial<Record<keyof FormState, string>>;

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Close Eye" },
      { name: "description", content: "Talk to Close Eye before you commit. Send a message, email, or WhatsApp us — we reply within one business day." },
      { property: "og:title", content: "Contact — Close Eye" },
      { property: "og:description", content: "Talk to Close Eye before you commit. We reply within one business day." },
    ],
  }),
  component: ContactPage,
});

const topicLabels: Record<FormState["topic"], string> = {
  consultation: "Book a free 15-min consultation",
  services: "Question about a service",
  pricing: "Pricing & plans",
  partnership: "Partnership / press",
  other: "Something else",
};

function ContactPage() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    topic: "consultation",
    message: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrs: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof FormState;
        if (k && !fieldErrs[k]) fieldErrs[k] = issue.message;
      }
      setErrors(fieldErrs);
      return;
    }
    const d = parsed.data;
    const subject = `Close Eye enquiry — ${topicLabels[d.topic]}`;
    const body = [
      `Name: ${d.name}`,
      `Email: ${d.email}`,
      `Phone: ${d.phone}`,
      `Topic: ${topicLabels[d.topic]}`,
      "",
      d.message,
    ].join("\n");

    const mailto = `mailto:hello@closeeye.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const waText = `Hi Close Eye 👋%0A%0A${encodeURIComponent(body)}`;
    const wa = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;

    // Open email draft for the user; also stash a WhatsApp link in the success state.
    window.location.href = mailto;
    setSubmitted(true);
    sessionStorage.setItem("closeeye:contact:wa", wa);
  };

  return (
    <PageShell
      eyebrow="Contact"
      title="We'd love to hear from your family."
      intro="Talk to us before you commit. Send a message below, email, or WhatsApp — we respond within one business day."
    >
      <div className="grid gap-6 md:grid-cols-3 mb-12">
        {[
          { icon: Mail, label: "Email", value: "hello@closeeye.in", href: "mailto:hello@closeeye.in" },
          { icon: MessageCircle, label: "WhatsApp", value: "+91 90002 21261", href: `https://wa.me/${WHATSAPP_NUMBER}` },
          { icon: Phone, label: "Phone", value: "Mon–Sat, 9am–7pm IST", href: "tel:+919000221261" },
        ].map((c) => (
          <a
            key={c.label}
            href={c.href}
            className="rounded-2xl border border-border bg-card p-6 hover:shadow-elevated transition-shadow"
            target={c.href.startsWith("http") ? "_blank" : undefined}
            rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
          >
            <c.icon className="h-6 w-6 text-brand" />
            <div className="mt-4 text-xs tracking-widest uppercase text-muted-foreground">{c.label}</div>
            <div className="mt-1 font-medium text-foreground">{c.value}</div>
          </a>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 sm:p-10 shadow-soft">
        {submitted ? (
          <div className="text-center py-8">
            <div className="mx-auto h-12 w-12 rounded-full bg-brand/10 flex items-center justify-center">
              <Check className="h-6 w-6 text-brand" />
            </div>
            <h2 className="mt-5 font-serif text-2xl sm:text-3xl text-primary">Message ready to send</h2>
            <p className="mt-3 text-muted-foreground max-w-md mx-auto">
              We opened your email app with your message pre-filled. Prefer WhatsApp? Tap below — we usually reply within a few hours.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
              <Button asChild className="bg-brand-accent text-primary hover:bg-brand-accent/90">
                <a
                  href={sessionStorage.getItem("closeeye:contact:wa") ?? `https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-1 h-4 w-4" /> Send via WhatsApp
                </a>
              </Button>
              <Button variant="outline" onClick={() => setSubmitted(false)}>
                Send another message
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-5" noValidate>
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl text-primary">Send us a message</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Want to speak with us before joining the waitlist? Fill this out and we'll be in touch within 24 hours.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Your name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Priya Sharma"
                  maxLength={80}
                  aria-invalid={!!errors.name}
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="you@example.com"
                  maxLength={160}
                  aria-invalid={!!errors.email}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone / WhatsApp</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="+1 555 123 4567"
                  maxLength={24}
                  aria-invalid={!!errors.phone}
                />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="topic">What's this about?</Label>
                <Select value={form.topic} onValueChange={(v) => update("topic", v as FormState["topic"])}>
                  <SelectTrigger id="topic">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(topicLabels) as FormState["topic"][]).map((k) => (
                      <SelectItem key={k} value={k}>{topicLabels[k]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Your message</Label>
              <Textarea
                id="message"
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                placeholder="Tell us about your loved one and where they live, and the best time to reach you."
                rows={5}
                maxLength={1000}
                aria-invalid={!!errors.message}
              />
              <div className="flex justify-between text-xs">
                <span className={errors.message ? "text-destructive" : "text-muted-foreground"}>
                  {errors.message ?? "We reply within one business day."}
                </span>
                <span className="text-muted-foreground">{form.message.length}/1000</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button type="submit" size="lg" className="bg-primary text-brand-foreground hover:bg-primary/90">
                <Send className="mr-1 h-4 w-4" /> Send message
              </Button>
              <Button asChild type="button" size="lg" variant="outline">
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-1 h-4 w-4" /> Or message on WhatsApp
                </a>
              </Button>
            </div>
          </form>
        )}
      </div>
    </PageShell>
  );
}
