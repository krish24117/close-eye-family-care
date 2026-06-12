import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { PageShell } from "@/components/marketing/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

const schema = z.object({
  full_name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(320),
  whatsapp: z.string().trim().min(4).max(40),
  country: z.string().trim().min(1).max(80),
  loved_one_city: z.string().trim().min(1).max(80),
  support_required: z.string().trim().max(1000).optional().or(z.literal("")),
});

function WaitlistPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse(Object.fromEntries(fd));
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
        <div className="rounded-2xl border border-border bg-muted/30 p-10 text-center">
          <h2 className="font-serif text-3xl text-primary">Thank you 🌿</h2>
          <p className="mt-3 text-muted-foreground">
            You're on the Close Eye waitlist. We'll reach out on WhatsApp within
            a few days.
          </p>
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
            <Label htmlFor="support_required">What support would help?</Label>
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
