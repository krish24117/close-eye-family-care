import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, useRoles, type AppRole } from "@/hooks/use-auth";
import { PortalShell, PageHeader } from "@/components/portal/PortalShell";
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
import { Badge } from "@/components/ui/badge";
import { MapPin, Loader2 } from "lucide-react";
import { createBooking, PRICE_CATALOG } from "@/lib/bookings.functions";
import { StripeEmbeddedCheckoutForBooking } from "@/components/StripeEmbeddedCheckout";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";

type SearchParams = { service?: string };

export const Route = createFileRoute("/_authenticated/book")({
  head: () => ({
    meta: [
      { title: "Book a visit — Close Eye" },
      { name: "description", content: "Book a wellbeing visit, hospital companion or care plan in Hyderabad." },
    ],
  }),
  validateSearch: (s: Record<string, unknown>): SearchParams => ({
    service: typeof s.service === "string" ? s.service : undefined,
  }),
  component: BookPage,
});

const SERVICES = Object.entries(PRICE_CATALOG).map(([priceId, c]) => ({
  priceId,
  label: c.label,
  amount_minor: c.amount_minor,
  kind: c.kind,
}));

function formatINR(minor: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(minor / 100);
}

const HYD_PINCODE_RE = /^5(0[0-3])\d{3}$/;

function BookPage() {
  const { service } = Route.useSearch();
  const { user } = useAuth();
  const { roles } = useRoles(user?.id);
  const role: AppRole = roles.includes("admin")
    ? "admin"
    : roles.includes("companion")
      ? "companion"
      : "customer";
  const navigate = useNavigate();

  const initialPrice = useMemo(() => {
    if (service && service in PRICE_CATALOG) return service;
    return "companion_visit_single";
  }, [service]);

  const [priceId, setPriceId] = useState<string>(initialPrice);
  const [lovedOnes, setLovedOnes] = useState<{ id: string; full_name: string }[]>([]);
  const [lovedOneId, setLovedOneId] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("loved_ones")
      .select("id, full_name")
      .eq("customer_id", user.id)
      .then(({ data }) => setLovedOnes(data ?? []));
  }, [user]);

  const selected = PRICE_CATALOG[priceId as keyof typeof PRICE_CATALOG];

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    const fd = new FormData(e.currentTarget);
    const pincode = String(fd.get("pincode") ?? "").trim();
    if (!HYD_PINCODE_RE.test(pincode)) {
      toast.error("We currently only serve Hyderabad pincodes (500xxx–503xxx).");
      return;
    }
    const scheduledRaw = String(fd.get("scheduled_at") ?? "");
    setSubmitting(true);
    try {
      const res = await createBooking({
        data: {
          priceId,
          loved_one_id: lovedOneId || undefined,
          scheduled_at: scheduledRaw ? new Date(scheduledRaw).toISOString() : undefined,
          contact_name: String(fd.get("contact_name") ?? "").trim(),
          contact_phone: String(fd.get("contact_phone") ?? "").trim(),
          address_line: String(fd.get("address_line") ?? "").trim(),
          area: String(fd.get("area") ?? "").trim() || undefined,
          pincode,
          special_requests: String(fd.get("special_requests") ?? "").trim() || undefined,
        },
      });
      setBookingId(res.bookingId);
    } catch (err: any) {
      toast.error(err?.message ?? "Could not create booking");
    } finally {
      setSubmitting(false);
    }
  }

  if (bookingId) {
    const returnUrl = `${window.location.origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}&booking=${bookingId}`;
    return (
      <PortalShell role={role}>
        <PaymentTestModeBanner />
        <PageHeader
          title="Complete your payment"
          description={`${selected.label} — ${formatINR(selected.amount_minor)}${
            selected.kind === "subscription" ? " / month" : ""
          }`}
        />
        <div className="max-w-3xl">
          <StripeEmbeddedCheckoutForBooking
            bookingId={bookingId}
            priceId={priceId}
            returnUrl={returnUrl}
          />
          <p className="mt-4 text-sm text-muted-foreground">
            Need to change something?{" "}
            <button
              type="button"
              className="underline"
              onClick={() => setBookingId(null)}
            >
              Edit booking details
            </button>
          </p>
        </div>
      </PortalShell>
    );
  }

  return (
    <PortalShell role={role}>
      <PaymentTestModeBanner />
      <PageHeader
        title="Book a visit"
        description="A trusted local companion at your loved one's door, on the day you need."
      />

      <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1.5 text-sm text-primary">
        <MapPin className="h-4 w-4" /> Currently serving Hyderabad only
      </div>

      <form onSubmit={onSubmit} className="grid gap-6 max-w-3xl">
        <div className="grid gap-2">
          <Label>Service</Label>
          <Select value={priceId} onValueChange={setPriceId}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {SERVICES.map((s) => (
                <SelectItem key={s.priceId} value={s.priceId}>
                  {s.label} — {formatINR(s.amount_minor)}
                  {s.kind === "subscription" ? " / month" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selected.kind === "subscription" && (
            <p className="text-xs text-muted-foreground">
              Recurring monthly — cancel anytime from your dashboard.
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label>Loved one (optional)</Label>
          <Select value={lovedOneId} onValueChange={setLovedOneId}>
            <SelectTrigger>
              <SelectValue placeholder={lovedOnes.length ? "Pick a profile" : "No loved ones yet"} />
            </SelectTrigger>
            <SelectContent>
              {lovedOnes.map((l) => (
                <SelectItem key={l.id} value={l.id}>{l.full_name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            You can{" "}
            <Link to="/loved-ones" className="underline">add a loved one</Link>{" "}
            from the dashboard.
          </p>
        </div>

        <div className="grid gap-2 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="scheduled_at">Preferred date & time</Label>
            <Input id="scheduled_at" name="scheduled_at" type="datetime-local" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="contact_phone">Contact phone (India)</Label>
            <Input
              id="contact_phone"
              name="contact_phone"
              placeholder="+91 9xxxxxxxxx"
              required
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="contact_name">Contact name at the home</Label>
          <Input id="contact_name" name="contact_name" required minLength={2} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="address_line">Address</Label>
          <Input id="address_line" name="address_line" placeholder="House / flat, street" required />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="grid gap-2 md:col-span-1">
            <Label htmlFor="area">Area</Label>
            <Input id="area" name="area" placeholder="e.g. Madhapur" />
          </div>
          <div className="grid gap-2">
            <Label>City</Label>
            <Input value="Hyderabad" disabled />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="pincode">Pincode</Label>
            <Input
              id="pincode"
              name="pincode"
              inputMode="numeric"
              pattern="\d{6}"
              placeholder="500xxx"
              required
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="special_requests">Anything we should know?</Label>
          <Textarea
            id="special_requests"
            name="special_requests"
            maxLength={800}
            placeholder="Mobility, language, medication reminders, doctor instructions…"
          />
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Total</div>
            <div className="text-2xl font-semibold text-primary">
              {formatINR(selected.amount_minor)}
              {selected.kind === "subscription" && (
                <span className="text-sm text-muted-foreground"> / month</span>
              )}
            </div>
          </div>
          <Button type="submit" disabled={submitting} size="lg">
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Continue to payment
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          You'll be charged only after you complete payment on the next step.
          Cancellations more than 24 hours before the visit are fully refunded
          (see <Link to="/terms" className="underline">Terms</Link>).
        </p>
      </form>
    </PortalShell>
  );
}
