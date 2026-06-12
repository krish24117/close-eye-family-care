import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { type ReactNode } from "react";
import { Bell, Calendar, FileText, Home, LogOut, Settings, Shield, Users } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { AppRole } from "@/hooks/use-auth";

type NavItem = { to: string; label: string; icon: React.ComponentType<{ className?: string }> };

const navByRole: Record<AppRole, NavItem[]> = {
  customer: [
    { to: "/dashboard", label: "Dashboard", icon: Home },
    { to: "/loved-ones", label: "Loved ones", icon: Users },
    { to: "/visits", label: "Visits", icon: Calendar },
    { to: "/notifications", label: "Notifications", icon: Bell },
  ],
  companion: [
    { to: "/companion", label: "My visits", icon: Calendar },
    { to: "/notifications", label: "Notifications", icon: Bell },
  ],
  admin: [
    { to: "/admin", label: "Admin", icon: Shield },
    { to: "/notifications", label: "Notifications", icon: Bell },
  ],
};

export function PortalShell({ role, children }: { role: AppRole; children: ReactNode }) {
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const items = navByRole[role];

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Logo size="md" />
            <span className="hidden sm:inline-block text-xs uppercase tracking-widest text-brand bg-accent px-2 py-1 rounded-full">{role}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-2" /> Sign out
          </Button>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 grid gap-6 md:gap-8 md:grid-cols-[220px_1fr]">
        <aside className="md:sticky md:top-24 self-start -mx-4 px-4 sm:mx-0 sm:px-0">
          <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-1 md:pb-0 scrollbar-none">
            {items.map((i) => {
              const active = path === i.to;
              return (
                <Link
                  key={i.to}
                  to={i.to}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? "bg-brand text-brand-foreground shadow-soft"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <i.icon className="h-4 w-4 shrink-0" /> {i.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 sm:mb-8">
      <div className="min-w-0">
        <h1 className="font-serif text-3xl md:text-4xl text-primary tracking-tight truncate">{title}</h1>
        {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action && <div className="flex flex-wrap gap-2 shrink-0">{action}</div>}
    </div>
  );
}

