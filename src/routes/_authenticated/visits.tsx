import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Calendar, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, useRoles, type AppRole } from "@/hooks/use-auth";
import { PortalShell, PageHeader } from "@/components/portal/PortalShell";
import { EmptyState } from "@/components/portal/EmptyState";
import { Button } from "@/components/ui/button";


export const Route = createFileRoute("/_authenticated/visits")({
  head: () => ({ meta: [{ title: "Visits — Close Eye" }] }),
  component: VisitsPage,
});

type Visit = {
  id: string;
  status: string;
  visit_type: string;
  scheduled_at: string | null;
  loved_ones: { full_name: string; city: string } | null;
};

const statusStyles: Record<string, string> = {
  requested: "bg-accent text-accent-foreground",
  assigned: "bg-brand text-brand-foreground",
  in_progress: "bg-brand-accent text-primary",
  completed: "bg-muted text-muted-foreground",
  cancelled: "bg-destructive/10 text-destructive",
};

function VisitsPage() {
  const { user } = useAuth();
  const { roles } = useRoles(user?.id);
  const role: AppRole = roles.includes("admin") ? "admin" : roles.includes("companion") ? "companion" : "customer";
  const [visits, setVisits] = useState<Visit[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("visits")
      .select("id, status, visit_type, scheduled_at, loved_ones(full_name, city)")
      .eq("customer_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setVisits((data ?? []) as unknown as Visit[]));
  }, [user]);

  return (
    <PortalShell role={role}>
      <PageHeader
        title="Visits"
        description="Track requested, ongoing and past visits."
        action={<Button asChild><Link to="/visits/new"><Plus className="h-4 w-4 mr-1" /> Request a visit</Link></Button>}
      />

      {visits.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No visits yet"
          description="Request your first visit or book a one-time companion. You'll see all activity here."
          action={
            <Button asChild>
              <Link to="/visits/new"><Plus className="h-4 w-4 mr-1" /> Request a visit</Link>
            </Button>
          }
        />
      ) : (
        <div className="rounded-2xl border border-border bg-card overflow-x-auto shadow-soft">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-muted/60 text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Loved one</th>
                <th className="text-left px-4 py-3 font-medium">Type</th>
                <th className="text-left px-4 py-3 font-medium">Scheduled</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {visits.map((v) => (
                <tr key={v.id} className="border-t border-border transition-colors hover:bg-accent/40">
                  <td className="px-4 py-3">
                    <div className="font-medium text-primary">{v.loved_ones?.full_name ?? "—"}</div>
                    <div className="text-xs text-muted-foreground">{v.loved_ones?.city ?? ""}</div>
                  </td>
                  <td className="px-4 py-3 capitalize">{v.visit_type.replace("_", " ")}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {v.scheduled_at ? new Date(v.scheduled_at).toLocaleString() : "TBD"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[v.status] ?? ""}`}>
                      {v.status.replace("_", " ")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </PortalShell>
  );
}
