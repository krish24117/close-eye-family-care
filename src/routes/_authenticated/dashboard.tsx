import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Calendar, Plus, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, useRoles, type AppRole } from "@/hooks/use-auth";
import { PortalShell, PageHeader } from "@/components/portal/PortalShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Close Eye" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  const { roles } = useRoles(user?.id);
  const role: AppRole = roles.includes("admin") ? "admin" : roles.includes("companion") ? "companion" : "customer";

  const [counts, setCounts] = useState({ lovedOnes: 0, upcoming: 0, completed: 0 });

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from("loved_ones").select("id", { count: "exact", head: true }).eq("customer_id", user.id),
      supabase.from("visits").select("id", { count: "exact", head: true }).eq("customer_id", user.id).in("status", ["requested", "assigned", "in_progress"]),
      supabase.from("visits").select("id", { count: "exact", head: true }).eq("customer_id", user.id).eq("status", "completed"),
    ]).then(([a, b, c]) => {
      setCounts({ lovedOnes: a.count ?? 0, upcoming: b.count ?? 0, completed: c.count ?? 0 });
    });
  }, [user]);

  return (
    <PortalShell role={role}>
      <PageHeader
        title={`Welcome${user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name.split(" ")[0]}` : ""}.`}
        description="Your family's visits and updates, all in one place."
        action={
          <Button asChild>
            <Link to="/visits/new"><Plus className="h-4 w-4 mr-1" /> Request a visit</Link>
          </Button>
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

      <div className="mt-10 rounded-2xl border border-dashed border-border p-8 text-center bg-card/50">
        <h2 className="font-serif text-xl text-primary">Ready when you are.</h2>
        <p className="mt-2 text-sm text-muted-foreground">Add a loved one's profile, then request a visit.</p>
        <div className="mt-5 flex justify-center gap-2">
          <Button asChild variant="outline"><Link to="/loved-ones">Add loved one</Link></Button>
          <Button asChild><Link to="/visits/new">Request a visit</Link></Button>
        </div>
      </div>
    </PortalShell>
  );
}
