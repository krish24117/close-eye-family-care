import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, useRoles, type AppRole } from "@/hooks/use-auth";
import { PortalShell, PageHeader } from "@/components/portal/PortalShell";
import { EmptyState } from "@/components/portal/EmptyState";

export const Route = createFileRoute("/_authenticated/notifications")({
  head: () => ({ meta: [{ title: "Notifications — Close Eye" }] }),
  component: NotificationsPage,
});

type N = { id: string; title: string; body: string | null; type: string; read: boolean; created_at: string };

function NotificationsPage() {
  const { user } = useAuth();
  const { roles } = useRoles(user?.id);
  const role: AppRole = roles.includes("admin") ? "admin" : roles.includes("companion") ? "companion" : "customer";
  const [items, setItems] = useState<N[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false })
      .then(({ data }) => setItems((data ?? []) as N[]));
  }, [user]);

  return (
    <PortalShell role={role}>
      <PageHeader title="Notifications" description="Visit updates, reports and alerts." />
      {items.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications yet"
          description="Visit updates, reports and alerts will appear here. Web, Android and iOS push are wired and ready for Phase 2."
        />
      ) : (

        <ul className="space-y-3">
          {items.map((n) => (
            <li key={n.id} className="rounded-2xl border border-border bg-card p-5 flex gap-4 shadow-soft transition-colors hover:border-brand/30">
              <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${n.read ? "bg-muted" : "bg-brand-accent"}`} />
              <div className="flex-1">
                <h3 className="font-medium">{n.title}</h3>
                {n.body && <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>}
                <p className="mt-2 text-xs text-muted-foreground">{new Date(n.created_at).toLocaleString()}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </PortalShell>
  );
}
