import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, useRoles } from "@/hooks/use-auth";
import { PortalShell, PageHeader } from "@/components/portal/PortalShell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — Close Eye" }] }),
  component: AdminPage,
});

function AdminPage() {
  const { user } = useAuth();
  const { roles, loading } = useRoles(user?.id);
  const isAdmin = roles.includes("admin");

  const [waitlist, setWaitlist] = useState<any[]>([]);
  const [visits, setVisits] = useState<any[]>([]);
  const [stats, setStats] = useState({ customers: 0, companions: 0, waitlist: 0, visits: 0 });
  const [cityDemand, setCityDemand] = useState<{ city: string; count: number }[]>([]);

  useEffect(() => {
    if (!isAdmin) return;
    Promise.all([
      supabase.from("waitlist").select("*").order("created_at", { ascending: false }).limit(50),
      supabase.from("visits").select("id, status, visit_type, created_at, loved_ones(full_name, city), profiles!visits_customer_id_fkey(full_name)").order("created_at", { ascending: false }).limit(50),
      supabase.from("user_roles").select("role"),
      supabase.from("waitlist").select("loved_one_city"),
    ]).then(([w, v, r, wAll]) => {
      setWaitlist(w.data ?? []);
      setVisits(v.data ?? []);
      const roles = r.data ?? [];
      setStats({
        customers: roles.filter((x: any) => x.role === "customer").length,
        companions: roles.filter((x: any) => x.role === "companion").length,
        waitlist: (wAll.data ?? []).length,
        visits: (v.data ?? []).length,
      });
      const counts: Record<string, number> = {};
      (wAll.data ?? []).forEach((row: any) => { counts[row.loved_one_city] = (counts[row.loved_one_city] ?? 0) + 1; });
      setCityDemand(Object.entries(counts).map(([city, count]) => ({ city, count })).sort((a, b) => b.count - a.count).slice(0, 10));
    });
  }, [isAdmin]);

  if (loading) return null;
  if (!isAdmin) {
    return (
      <PortalShell role="customer">
        <PageHeader title="Admin" />
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <Shield className="h-8 w-8 text-muted-foreground mx-auto" />
          <p className="mt-3 text-muted-foreground">Admin access required. Ask the Close Eye team to grant your account the admin role.</p>
        </div>
      </PortalShell>
    );
  }

  return (
    <PortalShell role="admin">
      <PageHeader title="Admin dashboard" description="Overview of customers, companions and demand." />

      <div className="grid gap-4 sm:grid-cols-4">
        {[
          ["Customers", stats.customers],
          ["Companions", stats.companions],
          ["Waitlist", stats.waitlist],
          ["Visits", stats.visits],
        ].map(([l, v]) => (
          <div key={l as string} className="rounded-2xl border border-border bg-card p-6">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">{l}</div>
            <div className="mt-2 font-serif text-3xl text-primary">{v}</div>
          </div>
        ))}
      </div>

      <Tabs defaultValue="waitlist" className="mt-10">
        <TabsList>
          <TabsTrigger value="waitlist">Waitlist</TabsTrigger>
          <TabsTrigger value="visits">Visits</TabsTrigger>
          <TabsTrigger value="demand">City demand</TabsTrigger>
        </TabsList>

        <TabsContent value="waitlist" className="mt-6">
          <div className="rounded-2xl border border-border bg-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  {["Name", "Email", "WhatsApp", "Country", "City in India", "Status", "Submitted"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {waitlist.map((w) => (
                  <tr key={w.id} className="border-t border-border">
                    <td className="px-4 py-3 font-medium">{w.full_name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{w.email}</td>
                    <td className="px-4 py-3 text-muted-foreground">{w.whatsapp}</td>
                    <td className="px-4 py-3">{w.country}</td>
                    <td className="px-4 py-3">{w.loved_one_city}</td>
                    <td className="px-4 py-3 capitalize">{w.status}</td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(w.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {waitlist.length === 0 && <tr><td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">No waitlist entries.</td></tr>}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="visits" className="mt-6">
          <div className="rounded-2xl border border-border bg-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  {["Loved one", "City", "Type", "Status", "Created"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visits.map((v) => (
                  <tr key={v.id} className="border-t border-border">
                    <td className="px-4 py-3 font-medium">{v.loved_ones?.full_name ?? "—"}</td>
                    <td className="px-4 py-3">{v.loved_ones?.city ?? "—"}</td>
                    <td className="px-4 py-3 capitalize">{v.visit_type?.replace("_", " ")}</td>
                    <td className="px-4 py-3 capitalize">{v.status?.replace("_", " ")}</td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(v.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {visits.length === 0 && <tr><td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">No visits yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="demand" className="mt-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-serif text-xl text-primary">Top requested cities</h3>
            <p className="text-sm text-muted-foreground">Based on waitlist submissions.</p>
            <div className="mt-6 space-y-3">
              {cityDemand.length === 0 && <p className="text-sm text-muted-foreground">No data yet.</p>}
              {cityDemand.map((c) => {
                const max = cityDemand[0]?.count || 1;
                return (
                  <div key={c.city}>
                    <div className="flex justify-between text-sm"><span>{c.city}</span><span className="text-muted-foreground">{c.count}</span></div>
                    <div className="mt-1 h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-brand" style={{ width: `${(c.count / max) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </PortalShell>
  );
}
