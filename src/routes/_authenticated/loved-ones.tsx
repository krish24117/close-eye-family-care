import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, useRoles, type AppRole } from "@/hooks/use-auth";
import { PortalShell, PageHeader } from "@/components/portal/PortalShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/loved-ones")({
  head: () => ({ meta: [{ title: "Loved ones — Close Eye" }] }),
  component: LovedOnesPage,
});

type LovedOne = {
  id: string;
  full_name: string;
  relationship: string | null;
  city: string;
  phone: string | null;
  notes: string | null;
};

const schema = z.object({
  full_name: z.string().trim().min(1).max(120),
  relationship: z.string().trim().max(60).optional().or(z.literal("")),
  city: z.string().trim().min(1).max(80),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

function LovedOnesPage() {
  const { user } = useAuth();
  const { roles } = useRoles(user?.id);
  const role: AppRole = roles.includes("admin") ? "admin" : roles.includes("companion") ? "companion" : "customer";

  const [items, setItems] = useState<LovedOne[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    if (!user) return;
    const { data } = await supabase.from("loved_ones").select("id, full_name, relationship, city, phone, notes").eq("customer_id", user.id).order("created_at", { ascending: false });
    setItems((data ?? []) as LovedOne[]);
  }
  useEffect(() => { refresh(); }, [user]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) { toast.error(parsed.error.issues[0]?.message ?? "Invalid input"); return; }
    setLoading(true);
    const { error } = await supabase.from("loved_ones").insert({ ...parsed.data, customer_id: user.id });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Loved one added");
    setOpen(false);
    refresh();
  }

  async function remove(id: string) {
    if (!confirm("Remove this loved one and all related visits?")) return;
    const { error } = await supabase.from("loved_ones").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    refresh();
  }

  return (
    <PortalShell role={role}>
      <PageHeader
        title="Loved ones"
        description="Add the family members you'd like Close Eye to visit."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1" /> Add loved one</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add a loved one</DialogTitle></DialogHeader>
              <form onSubmit={onSubmit} className="grid gap-4">
                <div className="grid gap-2"><Label>Full name</Label><Input name="full_name" required /></div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="grid gap-2"><Label>Relationship</Label><Input name="relationship" placeholder="Mother" /></div>
                  <div className="grid gap-2"><Label>City</Label><Input name="city" required placeholder="Bengaluru" /></div>
                </div>
                <div className="grid gap-2"><Label>Phone</Label><Input name="phone" placeholder="+91 …" /></div>
                <div className="grid gap-2"><Label>Notes</Label><Textarea name="notes" rows={3} placeholder="Likes morning visits, lives alone." /></div>
                <Button type="submit" disabled={loading}>{loading ? "Saving…" : "Save"}</Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center bg-card/50">
          <p className="text-muted-foreground">No loved ones added yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((lo) => (
            <div key={lo.id} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-serif text-xl text-primary">{lo.full_name}</h3>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
                    {lo.relationship ?? "Family"} · {lo.city}
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => remove(lo.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
              {lo.phone && <p className="mt-3 text-sm text-muted-foreground">📞 {lo.phone}</p>}
              {lo.notes && <p className="mt-2 text-sm text-muted-foreground">{lo.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </PortalShell>
  );
}
