import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { CheckCircle2, MessageCircle } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/waitlist")({
  head: () => ({
    meta: [
      { title: "Join the Waitlist — Close Eye" },
      { name: "description", content: "Join the Close Eye waitlist to bring trusted wellbeing visits to your loved ones in India." },
      { property: "og:title", content: "Join the Waitlist — Close Eye" },
      { property: "og:description", content: "Be first in your city when Close Eye opens." },
    ],
  }),
  component: WaitlistPage,
});

const URGENCY_OPTIONS = [
  { value: "within_week", label: "Within a week" },
  { value: "one_to_three_months", label: "In 1–3 months" },
  { value: "exploring", label: "Just exploring" },
] as const;

const schema = z.object({
  full_name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(320),
  whatsapp: z.string().trim().min(4).max(40),
  country: z.string().trim().min(1).max(80),
  loved_one_city: z.string().trim().min(1).max(80),
  urgency: z.enum(["within_week", "one_to_three_months", "exploring"]),
  support_required: z.string().trim().max(1000).optional().or(z.literal("")),
});

// Public WhatsApp number for instant follow-up after waitlist signup.
const WHATSAPP_NUMBER = "919000000000"; // TODO: replace with the real Close Eye number
const WHATSAPP_PREFILL = encodeURIComponent(
  "Hi Close Eye team — I just joined the waitlist and would love to hear what's next.",
);

function WaitlistPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [urgency, setUrgency] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({ ...Object.fromEntries(fd), urgency });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check your details.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("waitlist").insert(parsed.data);
    setSubmitting(false);
    if (error) {
      toast.error("Could not submit. Please try again.");
      return;
    }
    setSubmitted(true);
    toast.success("You're on the list. We'll be in touch soon.");
  }

  return (
    <PageShell
      eyebrow="Waitlist"
      title="Be first in your city."
      intro="Tell us where your loved one lives in India and what kind of support would help. We'll reach out as we open visits in their city."
    >
      {submitted ? (
        <div className="rounded-2xl border border-border bg-muted/30 p-8 sm:p-10 text-center max-w-2xl">
          <div className="mx-auto h-14 w-14 rounded-full bg-brand/10 flex items-center justify-center">
            <CheckCircle2 className="h-7 w-7 text-brand" />
          </div>
          <h2 className="mt-5 font-serif text-3xl text-primary">You're on the list 🌿</h2>
          <p className="mt-3 text-muted-foreground">
            We've received your request. A member of the Close Eye team will reach out on
            WhatsApp within 24 hours to understand your family's needs.
          </p>
          <div className="mt-7 grid gap-3 text-left rounded-xl border border-border bg-background/60 p-5">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">What happens next</p>
            <ol className="space-y-2 text-sm text-foreground">
              <li><span className="font-medium">1.</span> We confirm your loved one's city and timing.</li>
              <li><span className="font-medium">2.</span> We share a recommended care plan and a verified companion match.</li>
              <li><span className="font-medium">3.</span> Your first visit is scheduled — usually within 48 hours in Hyderabad.</li>
            </ol>
          </div>
          <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_PREFILL}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="mr-2 h-4 w-4" /> Message us on WhatsApp
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/">Back to home</Link>
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="grid gap-5 rounded-2xl border border-border bg-muted/20 p-8 shadow-soft max-w-2xl">
          <div className="grid gap-2">
            <Label htmlFor="full_name">Your full name</Label>
            <Input id="full_name" name="full_name" required maxLength={120} className="bg-background/60" />
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required maxLength={320} className="bg-background/60" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="whatsapp">WhatsApp number</Label>
              <Input id="whatsapp" name="whatsapp" required maxLength={40} placeholder="+1 555 000 0000" className="bg-background/60" />
            </div>
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="country">Your country</Label>
              <Input id="country" name="country" required maxLength={80} placeholder="USA" className="bg-background/60" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="loved_one_city">Loved one's city in India</Label>
              <Input id="loved_one_city" name="loved_one_city" required maxLength={80} placeholder="Bengaluru" className="bg-background/60" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="urgency">How soon do you need support?</Label>
            <Select value={urgency} onValueChange={setUrgency} required>
              <SelectTrigger id="urgency" className="bg-background/60">
                <SelectValue placeholder="Choose a timeframe" />
              </SelectTrigger>
              <SelectContent>
                {URGENCY_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="support_required">What support would help? <span className="text-muted-foreground font-normal">(optional)</span></Label>
            <Textarea id="support_required" name="support_required" rows={4} maxLength={1000} placeholder="A weekly visit to my mother, help with doctor visits, etc." className="bg-background/60" />
          </div>
          <Button type="submit" disabled={submitting} size="lg">
            {submitting ? "Joining…" : "Join Waitlist"}
          </Button>
        </form>
      )}
    </PageShell>
  );
}

