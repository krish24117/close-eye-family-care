import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { PageShell } from "@/components/marketing/PageShell";
import { Button } from "@/components/ui/button";

type Search = { session_id?: string; booking?: string };

export const Route = createFileRoute("/checkout/return")({
  head: () => ({ meta: [{ title: "Booking confirmed — Close Eye" }] }),
  validateSearch: (s: Record<string, unknown>): Search => ({
    session_id: typeof s.session_id === "string" ? s.session_id : undefined,
    booking: typeof s.booking === "string" ? s.booking : undefined,
  }),
  component: ReturnPage,
});

function ReturnPage() {
  const { booking } = Route.useSearch();
  return (
    <PageShell eyebrow="Payment complete" title="Thank you — your visit is being arranged.">
      <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-soft max-w-2xl mx-auto">
        <CheckCircle2 className="mx-auto h-12 w-12 text-brand-accent" />
        <h2 className="font-serif text-2xl text-primary mt-4">We've received your payment</h2>
        <p className="mt-3 text-muted-foreground">
          Our team in Hyderabad will reach out on your contact number within a
          few hours to confirm the companion and exact arrival time. You'll
          also receive updates on WhatsApp.
        </p>
        {booking && (
          <p className="mt-2 text-xs text-muted-foreground">
            Booking ref: <span className="font-mono">{booking.slice(0, 8)}</span>
          </p>
        )}
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild>
            <Link to="/dashboard">Go to dashboard</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/services">Browse services</Link>
          </Button>
        </div>
      </div>
    </PageShell>
  );
}
