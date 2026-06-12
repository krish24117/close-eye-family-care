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
import {
  MapPin,
  Loader2,
  ShieldCheck,
  Clock,
  HeartHandshake,
  CheckCircle2,
  CalendarClock,
  Phone,
  User,
  Home,
  MessageSquare,
  Lock,
} from "lucide-react";
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

function SectionCard({
  step,
  title,
  description,
  children,
}: {
  step: number;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border/70 bg-card p-5 sm:p-6 shadow-sm">
      <div className="mb-5 flex items-start gap-3">
        <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
          {step}
        </div>
        <div className="min-w-0">
          <h3 className="text-base font-semibold tracking-tight">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
      </div>
      <div className="grid gap-5">{children}</div>
    </section>
  );
}

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

  const isSub = selected.kind === "subscription";

  return (
    <PortalShell role={role}>
      <PaymentTestModeBanner />
      <PageHeader
        title="Book a visit"
        description="A trusted local companion at your loved one's door — usually within 24 hours."
      />

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-primary">
          <MapPin className="h-3.5 w-3.5" /> Hyderabad only
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5" /> Background-checked companions
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          <Clock className="h-3.5 w-3.5" /> Free cancellation 24h before
        </span>
      </div>

      <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        {/* LEFT: form sections */}
        <div className="grid gap-5 min-w-0">
          <SectionCard step={1} title="Choose your service" description="One-time visits or a monthly care plan.">
            <div className="grid gap-3 sm:grid-cols-2">
              {SERVICES.map((s) => {
                const active = s.priceId === priceId;
                return (
                  <button
                    key={s.priceId}
                    type="button"
                    onClick={() => setPriceId(s.priceId)}
                    className={`relative text-left rounded-xl border p-4 transition-all ${
                      active
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm"
                        : "border-border hover:border-primary/40 hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold leading-tight">{s.label}</div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {s.kind === "subscription" ? "Monthly plan" : "One-time visit"}
                        </div>
                      </div>
                      {active && <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />}
                    </div>
                    <div className="mt-3 text-lg font-bold text-foreground">
                      {formatINR(s.amount_minor)}
                      {s.kind === "subscription" && (
                        <span className="text-xs font-normal text-muted-foreground"> / mo</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard step={2} title="Who is the visit for?" description="Pick a saved loved one or skip for now.">
            <div className="grid gap-2">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">Loved one (optional)</Label>
              <Select value={lovedOneId} onValueChange={setLovedOneId}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder={lovedOnes.length ? "Pick a profile" : "No loved ones yet"} />
                </SelectTrigger>
                <SelectContent>
                  {lovedOnes.map((l) => (
                    <SelectItem key={l.id} value={l.id}>{l.full_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                <Link to="/loved-ones" className="text-primary underline-offset-4 hover:underline">+ Add a loved one</Link>{" "}
                to save details for next time.
              </p>
            </div>
          </SectionCard>

          <SectionCard step={3} title="When & how to reach you">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="scheduled_at" className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                  <CalendarClock className="h-3.5 w-3.5" /> Preferred date & time
                </Label>
                <Input id="scheduled_at" name="scheduled_at" type="datetime-local" className="h-11" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contact_phone" className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" /> Contact phone (India)
                </Label>
                <Input
                  id="contact_phone"
                  name="contact_phone"
                  placeholder="+91 9xxxxxxxxx"
                  className="h-11"
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact_name" className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" /> Contact name at the home
              </Label>
              <Input id="contact_name" name="contact_name" required minLength={2} className="h-11" placeholder="e.g. Mrs. Sharma" />
            </div>
          </SectionCard>

          <SectionCard step={4} title="Visit address" description="We currently serve Hyderabad pincodes (500xxx–503xxx).">
            <div className="grid gap-2">
              <Label htmlFor="address_line" className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                <Home className="h-3.5 w-3.5" /> Address
              </Label>
              <Input id="address_line" name="address_line" placeholder="House / flat, street" className="h-11" required />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="grid gap-2">
                <Label htmlFor="area" className="text-xs uppercase tracking-wide text-muted-foreground">Area</Label>
                <Input id="area" name="area" placeholder="e.g. Madhapur" className="h-11" />
              </div>
              <div className="grid gap-2">
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">City</Label>
                <Input value="Hyderabad" disabled className="h-11" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="pincode" className="text-xs uppercase tracking-wide text-muted-foreground">Pincode</Label>
                <Input
                  id="pincode"
                  name="pincode"
                  inputMode="numeric"
                  pattern="\d{6}"
                  placeholder="500081"
                  className="h-11"
                  required
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard step={5} title="Anything we should know?" description="Optional — helps us match the right companion.">
            <div className="grid gap-2">
              <Label htmlFor="special_requests" className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5" /> Notes for the companion
              </Label>
              <Textarea
                id="special_requests"
                name="special_requests"
                maxLength={800}
                rows={4}
                placeholder="Mobility, language preferences, medication reminders, doctor instructions…"
              />
            </div>
          </SectionCard>
        </div>

        {/* RIGHT: sticky summary */}
        <aside className="lg:sticky lg:top-6">
          <div className="rounded-2xl border border-border/70 bg-gradient-to-br from-card to-muted/30 p-5 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Order summary
            </div>

            <div className="mt-4 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-semibold leading-tight">{selected.label}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {isSub ? "Recurring monthly · cancel anytime" : "One-time visit"}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-lg font-bold">{formatINR(selected.amount_minor)}</div>
                {isSub && <div className="text-[11px] text-muted-foreground">/ month</div>}
              </div>
            </div>

            <div className="my-5 h-px bg-border" />

            <div className="flex items-end justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
                  {isSub ? "Today" : "Total"}
                </div>
                <div className="text-3xl font-extrabold tracking-tight text-foreground">
                  {formatINR(selected.amount_minor)}
                </div>
                {isSub && (
                  <div className="text-xs text-muted-foreground">then monthly</div>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              size="lg"
              className="mt-5 w-full h-12 text-base font-semibold"
            >
              {submitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Preparing…</>
              ) : (
                <>Continue to payment</>
              )}
            </Button>

            <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
              <Lock className="h-3 w-3" /> Secure checkout · You won't be charged yet
            </p>

            <ul className="mt-5 grid gap-2.5 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <HeartHandshake className="mt-0.5 h-3.5 w-3.5 text-primary shrink-0" />
                Vetted, trained local companions
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-3.5 w-3.5 text-primary shrink-0" />
                Live updates on WhatsApp during the visit
              </li>
              <li className="flex items-start gap-2">
                <Clock className="mt-0.5 h-3.5 w-3.5 text-primary shrink-0" />
                Full refund if cancelled 24h before
              </li>
            </ul>

            <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
              By continuing you agree to our{" "}
              <Link to="/terms" className="underline underline-offset-2">Terms</Link>.
            </p>
          </div>
        </aside>
      </form>
    </PortalShell>
  );
}
