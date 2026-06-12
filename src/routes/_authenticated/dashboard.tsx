import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Calendar, Plus, Users, CreditCard, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, useRoles, type AppRole } from "@/hooks/use-auth";
import { PortalShell, PageHeader } from "@/components/portal/PortalShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAccountOverview, createPortalSession, type AccountOverview } from "@/lib/payments.functions";
import { getStripeEnvironment } from "@/lib/stripe";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Close Eye" }] }),
  component: Dashboard,
});

function formatINR(minor: number, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency?.toUpperCase() || "INR",
    maximumFractionDigits: 0,
  }).format(minor / 100);
}

function Dashboard() {
  const { user } = useAuth();
  const { roles } = useRoles(user?.id);
  const role: AppRole = roles.includes("admin") ? "admin" : roles.includes("companion") ? "companion" : "customer";

  const [counts, setCounts] = useState({ lovedOnes: 0, upcoming: 0, completed: 0 });
  const [account, setAccount] = useState<AccountOverview | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from("loved_ones").select("id", { count: "exact", head: true }).eq("customer_id", user.id),
      supabase.from("visits").select("id", { count: "exact", head: true }).eq("customer_id", user.id).in("status", ["requested", "assigned", "in_progress"]),
      supabase.from("visits").select("id", { count: "exact", head: true }).eq("customer_id", user.id).eq("status", "completed"),
    ]).then(([a, b, c]) => {
      setCounts({ lovedOnes: a.count ?? 0, upcoming: b.count ?? 0, completed: c.count ?? 0 });
    });
    let env: "sandbox" | "live";
    try { env = getStripeEnvironment(); } catch { return; }
    getAccountOverview({ data: { environment: env } })
      .then(setAccount)
      .catch((e) => console.error("getAccountOverview", e));
  }, [user]);

  async function openPortal() {
    setPortalLoading(true);
    try {
      const env = getStripeEnvironment();
      const res = await createPortalSession({
        data: { environment: env, returnUrl: window.location.href },
      });
      if ("error" in res) throw new Error(res.error);
      window.open(res.url, "_blank");
    } catch (e: any) {
      toast.error(e?.message ?? "Could not open billing portal");
    } finally {
      setPortalLoading(false);
    }
  }

  const sub = account?.subscription;
  const ent = account?.entitlement;
  const isActivePlan = sub && ["active", "trialing", "past_due"].includes(sub.status);

  return (
    <PortalShell role={role}>
      <PageHeader
        title={`Welcome${user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name.split(" ")[0]}` : ""}.`}
        description="Your family's visits and updates, all in one place."
        action={
          <div className="flex gap-2">
            <Button asChild variant="outline"><Link to="/book">Book a visit</Link></Button>
            <Button asChild><Link to="/visits/new"><Plus className="h-4 w-4 mr-1" /> Use plan visit</Link></Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: Users, label: "Loved ones", value: counts.lovedOnes, to: "/loved-ones" },
          { icon: Calendar, label: "Upcoming visits", value: counts.upcoming, to: "/visits" },
          { icon: Calendar, label: "Completed visits", value: counts.completed, to: "/visits" },
        ].map((s) => (
          <Link key={s.label} to={s.to} className="rounded-2xl border border-border bg-card p-6 hover:shadow-soft transition-shadow">
            <s.icon className="h-5 w-5 text-brand" />
            <div className="mt-4 font-serif text-3xl text-primary">{s.value}</div>
            <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
          </Link>
        ))}
      </div>

      {/* Care plan card */}
      <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-soft">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-brand" />
              <h2 className="font-serif text-xl text-primary">Your care plan</h2>
            </div>
            {isActivePlan && sub ? (
              <div className="mt-3 text-sm">
                <div className="text-primary font-semibold">{sub.price_id?.replace(/_/g, " ")}</div>
                <div className="mt-1 flex items-center gap-2 flex-wrap">
                  <Badge variant={sub.status === "active" ? "default" : "secondary"}>{sub.status}</Badge>
                  {sub.cancel_at_period_end && (
                    <Badge variant="outline">Cancels at period end</Badge>
                  )}
                  {ent && (
                    <span className="text-muted-foreground">
                      {ent.visits_remaining}/{ent.visits_total} visits left this month
                    </span>
                  )}
                </div>
                {sub.current_period_end && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    {sub.cancel_at_period_end ? "Access ends" : "Renews"} on{" "}
                    {new Date(sub.current_period_end).toLocaleDateString()}
                  </div>
                )}
              </div>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                No active Care Plan. Start one for 4, 8 or 12 visits per month.
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {isActivePlan ? (
              <Button onClick={openPortal} disabled={portalLoading} variant="outline">
                <ExternalLink className="h-4 w-4 mr-1" />
                {portalLoading ? "Opening…" : "Manage billing"}
              </Button>
            ) : (
              <Button asChild><Link to="/services">View plans</Link></Button>
            )}
          </div>
        </div>
      </div>

      {/* Recent bookings */}
      {account?.bookings && account.bookings.length > 0 && (
        <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="font-serif text-xl text-primary">Recent bookings</h2>
          <ul className="mt-4 divide-y divide-border">
            {account.bookings.map((b) => (
              <li key={b.id} className="py-3 flex items-center justify-between gap-3 text-sm">
                <div>
                  <div className="text-primary font-medium">{b.service_label}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(b.created_at).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      b.status === "paid" || b.status === "active" ? "default"
                      : b.status === "pending" ? "secondary"
                      : "outline"
                    }
                  >
                    {b.status}
                  </Badge>
                  <span className="text-primary font-semibold">
                    {formatINR(b.amount_minor, b.currency)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </PortalShell>
  );
}
