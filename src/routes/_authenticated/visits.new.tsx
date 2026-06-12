import { createFileRoute, useNavigate } from "@tanstack/react-router";
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

  useEffect(() => {
    if (!user) return;
    supabase.from("loved_ones").select("id, full_name").eq("customer_id", user.id).then(({ data }) => setLovedOnes(data ?? []));
  }, [user]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user || !lovedOneId) { toast.error("Select a loved one first."); return; }
    const fd = new FormData(e.currentTarget);
    const scheduled_at = String(fd.get("scheduled_at") ?? "");
    const special_requests = String(fd.get("special_requests") ?? "");
    setLoading(true);
    const loved = lovedOnes.find((l) => l.id === lovedOneId);
    const whenLabel = scheduled_at ? new Date(scheduled_at).toLocaleString() : "to be scheduled";
    const { data: visit, error } = await supabase.from("visits").insert({
      customer_id: user.id,
      loved_one_id: lovedOneId,
      visit_type: visitType as any,
      scheduled_at: scheduled_at ? new Date(scheduled_at).toISOString() : null,
      special_requests,
      status: "requested",
    }).select("id").single();
    if (error) { setLoading(false); toast.error(error.message); return; }

    // Booking confirmation notification (in-app)
    await supabase.from("notifications").insert({
      user_id: user.id,
      title: "Booking confirmed",
      body: `Your ${visitType.replace("_", " ")} for ${loved?.full_name ?? "your loved one"} (${whenLabel}) has been received. We'll assign a verified companion shortly and send a WhatsApp update.`,
      type: "success",
      link: "/visits",
    });

    setLoading(false);
    toast.success("Booking confirmed — a confirmation has been sent to your notifications and WhatsApp.");
    navigate({ to: "/visits" });
  }

  return (
    <PortalShell role={role}>
      <PageHeader title="Request a visit" description="Tell us what you need. We'll match a verified local companion." />
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
        <Button type="submit" disabled={loading || !lovedOneId}>{loading ? "Requesting…" : "Request visit"}</Button>
      </form>
    </PortalShell>
  );
}
