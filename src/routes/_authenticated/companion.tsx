import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, Calendar, Camera } from "lucide-react";
import { EmptyState } from "@/components/portal/EmptyState";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, useRoles } from "@/hooks/use-auth";
import { PortalShell, PageHeader } from "@/components/portal/PortalShell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createNotification } from "@/lib/notifications.functions";

export const Route = createFileRoute("/_authenticated/companion")({
  head: () => ({ meta: [{ title: "Companion — Close Eye" }] }),
  component: CompanionPage,
});

type Visit = {
  id: string;
  status: string;
  visit_type: string;
  scheduled_at: string | null;
  loved_ones: { full_name: string; address: string | null; city: string } | null;
};

function CompanionPage() {
  const { user } = useAuth();
  const { roles } = useRoles(user?.id);
  const [visits, setVisits] = useState<Visit[]>([]);

  async function refresh() {
    if (!user) return;
    const { data } = await supabase
      .from("visits")
      .select("id, status, visit_type, scheduled_at, loved_ones(full_name, address, city)")
      .or(`companion_id.eq.${user.id},and(companion_id.is.null,status.eq.requested)`)
      .order("scheduled_at", { ascending: true, nullsFirst: false });
    setVisits((data ?? []) as unknown as Visit[]);
  }
  useEffect(() => { refresh(); }, [user]);

  async function accept(id: string) {
    if (!user) return;
    const { error } = await supabase.from("visits").update({ companion_id: user.id, status: "assigned" }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Visit accepted"); refresh();
  }

  async function setStatus(id: string, status: "in_progress" | "completed") {
    const patch = status === "in_progress"
      ? { status, started_at: new Date().toISOString() }
      : { status, completed_at: new Date().toISOString() };
    const { error } = await supabase.from("visits").update(patch).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success(`Visit ${status.replace("_", " ")}`); refresh();
  }

  async function submitReport(visitId: string, summary: string, score: number) {
    if (!user) return;
    const { error } = await supabase.from("reports").insert({
      visit_id: visitId, companion_id: user.id, summary, wellbeing_score: score, photo_urls: [],
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Report submitted");
    setStatus(visitId, "completed");
  }

  async function triggerEmergency(visitId: string) {
    if (!confirm("Trigger emergency escalation? Admin and family will be alerted.")) return;
    const { error } = await supabase.from("visits").update({ status: "in_progress" }).eq("id", visitId);
    if (error) { toast.error(error.message); return; }
    if (user) {
      try {
        await createNotification({
          data: { title: "Emergency escalation triggered", body: "Admin notified for visit " + visitId, type: "emergency", link: "/companion" },
        });
      } catch (e) {
        console.error("notification failed", e);
      }
    }
    toast.success("Emergency escalation triggered");
  }

  if (!roles.includes("companion") && !roles.includes("admin")) {
    return (
      <PortalShell role="companion">
        <PageHeader title="Companion portal" />
        <div className="rounded-2xl border border-border bg-card p-8">
          <p className="text-muted-foreground">Your account isn't set up as a companion yet. Contact Close Eye to get verified.</p>
        </div>
      </PortalShell>
    );
  }

  return (
    <PortalShell role="companion">
      <PageHeader title="My visits" description="Open assignments and ongoing visits." />
      {visits.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No visits available right now"
          description="You'll see new assignments here as soon as they come in."
        />

      ) : (
        <div className="grid gap-4">
          {visits.map((v) => (
            <article key={v.id} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <h3 className="font-serif text-xl text-primary">{v.loved_ones?.full_name ?? "—"}</h3>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
                    {v.visit_type.replace("_", " ")} · {v.loved_ones?.city}
                  </p>
                  {v.scheduled_at && <p className="mt-2 text-sm text-muted-foreground">Scheduled: {new Date(v.scheduled_at).toLocaleString()}</p>}
                  {v.loved_ones?.address && <p className="text-sm text-muted-foreground">{v.loved_ones.address}</p>}
                </div>
                <span className="inline-flex h-fit rounded-full bg-accent text-accent-foreground px-2 py-0.5 text-xs font-medium capitalize">
                  {v.status.replace("_", " ")}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {v.status === "requested" && <Button size="sm" onClick={() => accept(v.id)}>Accept</Button>}
                {v.status === "assigned" && <Button size="sm" onClick={() => setStatus(v.id, "in_progress")}>Start visit</Button>}
                {v.status === "in_progress" && (
                  <Dialog>
                    <DialogTrigger asChild><Button size="sm"><Camera className="h-4 w-4 mr-1" /> Submit report</Button></DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>Submit visit report</DialogTitle></DialogHeader>
                      <ReportForm onSubmit={(summary, score) => submitReport(v.id, summary, score)} />
                    </DialogContent>
                  </Dialog>
                )}
                <Button size="sm" variant="destructive" onClick={() => triggerEmergency(v.id)}>
                  <AlertTriangle className="h-4 w-4 mr-1" /> Emergency
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </PortalShell>
  );
}

function ReportForm({ onSubmit }: { onSubmit: (summary: string, score: number) => void }) {
  const [score, setScore] = useState(4);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        onSubmit(String(fd.get("summary") ?? ""), score);
      }}
      className="grid gap-4"
    >
      <div className="grid gap-2">
        <Label>Wellbeing score (1–5)</Label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              type="button" key={n} onClick={() => setScore(n)}
              className={`h-10 w-10 rounded-md border text-sm font-medium ${score === n ? "bg-brand text-brand-foreground border-brand" : "border-input bg-background"}`}
            >{n}</button>
          ))}
        </div>
      </div>
      <div className="grid gap-2">
        <Label>Summary for the family</Label>
        <Textarea name="summary" rows={5} required placeholder="Had tea with auntie. Spirits were high. Reminded her about evening medication." />
      </div>
      <p className="text-xs text-muted-foreground">Photo uploads will appear here once storage is enabled.</p>
      <Button type="submit">Submit report</Button>
    </form>
  );
}
