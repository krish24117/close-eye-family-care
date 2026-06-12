import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, useRoles, type AppRole } from "@/hooks/use-auth";
import { PortalShell, PageHeader } from "@/components/portal/PortalShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createNotification } from "@/lib/notifications.functions";
import { sendWhatsApp, sendAdminWhatsApp } from "@/lib/whatsapp.functions";
import { requestPlanVisit } from "@/lib/bookings.functions";
import { getStripeEnvironment } from "@/lib/stripe";

export const Route = createFileRoute("/_authenticated/visits/new")({
  head: () => ({ meta: [{ title: "Request a visit — Close Eye" }] }),
  component: NewVisitPage,
});

function NewVisitPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { roles } = useRoles(user?.id);
  const role: AppRole = roles.includes("admin") ? "admin" : roles.includes("companion") ? "companion" : "customer";

  const [lovedOnes, setLovedOnes] = useState<{ id: string; full_name: string }[]>([]);
  const [lovedOneId, setLovedOneId] = useState<string>("");
  const [visitType, setVisitType] = useState<string>("companion_visit");
  const [loading, setLoading] = useState(false);
  const [remaining, setRemaining] = useState<{ remaining: number; total: number } | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from("loved_ones").select("id, full_name").eq("customer_id", user.id).then(({ data }) => setLovedOnes(data ?? []));
    supabase
      .from("plan_entitlements")
      .select("visits_total, visits_remaining")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setRemaining({ remaining: data.visits_remaining, total: data.visits_total });
      });
  }, [user]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user || !lovedOneId) { toast.error("Select a loved one first."); return; }
    const fd = new FormData(e.currentTarget);
    const scheduled_at = String(fd.get("scheduled_at") ?? "");
    const special_requests = String(fd.get("special_requests") ?? "");
    setLoading(true);

    try {
      const res = await requestPlanVisit({
        data: {
          loved_one_id: lovedOneId,
          visit_type: visitType as any,
          scheduled_at: scheduled_at ? new Date(scheduled_at).toISOString() : undefined,
          special_requests: special_requests || undefined,
          environment: getStripeEnvironment(),
        },
      });
      setRemaining((r) => r ? { ...r, remaining: res.visitsRemaining } : null);

      const loved = lovedOnes.find((l) => l.id === lovedOneId);
      const whenLabel = scheduled_at ? new Date(scheduled_at).toLocaleString() : "to be scheduled";

      try {
        await createNotification({
          data: {
            title: "Visit requested",
            body: `Your ${visitType.replace("_", " ")} for ${loved?.full_name ?? "your loved one"} (${whenLabel}) has been received. ${res.visitsRemaining} visit${res.visitsRemaining === 1 ? "" : "s"} left this month.`,
            type: "success",
            link: "/visits",
          },
        });
      } catch (e) { console.error(e); }

      try {
        await sendWhatsApp({ data: { body: `Close Eye — visit requested ✅\n${visitType.replace("_", " ")} for ${loved?.full_name ?? "your loved one"}\nWhen: ${whenLabel}\nVisits left this month: ${res.visitsRemaining}` } });
      } catch (e) { console.error(e); }

      try {
        await sendAdminWhatsApp({ data: { body: `🔔 Plan visit request\nCustomer: ${user.email ?? user.id}\nLoved one: ${loved?.full_name ?? "—"}\nType: ${visitType.replace("_", " ")}\nWhen: ${whenLabel}${special_requests ? `\nNotes: ${special_requests}` : ""}` } });
      } catch (e) { console.error(e); }

      toast.success("Visit requested — we'll assign a companion shortly.");
      navigate({ to: "/visits" });
    } catch (err: any) {
      toast.error(err?.message ?? "Could not request visit");
    } finally {
      setLoading(false);
    }
  }

  const noPlan = remaining === null;
  const exhausted = remaining !== null && remaining.remaining <= 0;

  return (
    <PortalShell role={role}>
      <PageHeader title="Request a visit" description="Draws one visit from your active Care Plan." />

      {remaining && (
        <div className="mb-6 rounded-2xl border border-border bg-card p-4 text-sm">
          <span className="text-muted-foreground">Care Plan visits left this month:</span>{" "}
          <span className="font-semibold text-primary">{remaining.remaining}/{remaining.total}</span>
        </div>
      )}

      {(noPlan || exhausted) && (
        <div className="mb-6 rounded-2xl border border-dashed border-border bg-card/60 p-6">
          <h3 className="font-serif text-lg text-primary">
            {noPlan ? "No active Care Plan" : "You've used all your plan visits this month"}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Book a one-time visit, or start a Care Plan for predictable monthly visits.
          </p>
          <div className="mt-4 flex gap-2">
            <Button asChild><Link to="/book">Book a one-time visit</Link></Button>
            <Button asChild variant="outline"><Link to="/services">View plans</Link></Button>
          </div>
        </div>
      )}

      <form onSubmit={onSubmit} className="grid gap-5 rounded-2xl border border-border bg-card p-8 shadow-soft max-w-2xl">
        <div className="grid gap-2">
          <Label>Loved one</Label>
          <Select value={lovedOneId} onValueChange={setLovedOneId}>
            <SelectTrigger><SelectValue placeholder={lovedOnes.length ? "Select a loved one" : "Add a loved one first"} /></SelectTrigger>
            <SelectContent>
              {lovedOnes.map((l) => <SelectItem key={l.id} value={l.id}>{l.full_name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label>Visit type</Label>
          <Select value={visitType} onValueChange={setVisitType}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="companion_visit">Companion visit</SelectItem>
              <SelectItem value="hospital_companion">Hospital companion</SelectItem>
              <SelectItem value="emergency_visit">Emergency visit</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="scheduled_at">Preferred date & time</Label>
          <Input id="scheduled_at" name="scheduled_at" type="datetime-local" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="special_requests">Special requests</Label>
          <Textarea id="special_requests" name="special_requests" rows={4} maxLength={1000} placeholder="Bring tea, sit for an hour, ask about medication." />
        </div>
        <Button type="submit" disabled={loading || !lovedOneId || noPlan || exhausted}>
          {loading ? "Requesting…" : "Request visit"}
        </Button>
      </form>
    </PortalShell>
  );
}
