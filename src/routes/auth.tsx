import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Logo } from "@/components/brand/Logo";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — Close Eye" }, { name: "description", content: "Sign in to Close Eye." }] }),
  component: AuthPage,
});

const emailSchema = z.string().trim().email().max(320);
const passwordSchema = z.string().min(8).max(128);

function AuthPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"customer" | "companion">("customer");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = emailSchema.safeParse(fd.get("email"));
    const password = passwordSchema.safeParse(fd.get("password"));
    const fullName = String(fd.get("full_name") ?? "").trim();
    if (!email.success || !password.success) {
      toast.error("Enter a valid email and a password of 8+ characters.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email.data,
      password: password.data,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: fullName, role },
      },
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Account created. Check your email to confirm.");
    navigate({ to: "/dashboard" });
  }

  async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = emailSchema.safeParse(fd.get("email"));
    const password = passwordSchema.safeParse(fd.get("password"));
    if (!email.success || !password.success) {
      toast.error("Enter a valid email and password.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.data,
      password: password.data,
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    navigate({ to: "/dashboard" });
  }

  async function handleGoogle() {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/dashboard" });
    if (result.error) {
      setLoading(false);
      toast.error("Google sign-in failed. Please try again.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:flex bg-brand-radial text-brand-foreground p-12 flex-col justify-between">
        <Logo tone="light" />
        <div>
          <h1 className="font-serif text-5xl tracking-tight max-w-md">
            Your trusted presence in India.
          </h1>
          <p className="mt-4 text-brand-foreground/80 max-w-md">
            Sign in to request visits, view reports and keep close to your loved
            ones — wherever you are in the world.
          </p>
        </div>
        <p className="text-xs tracking-widest uppercase text-brand-foreground/60">Made with care in India</p>
      </div>

      <div className="flex flex-col items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-sm">
          <div className="md:hidden mb-8"><Logo /></div>
          <h2 className="font-serif text-3xl text-primary">Welcome</h2>
          <p className="mt-1 text-sm text-muted-foreground">Sign in or create your Close Eye account.</p>

          <Tabs defaultValue="signin" className="mt-8">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Create account</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="mt-6">
              <form onSubmit={handleSignIn} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="si-email">Email</Label>
                  <Input id="si-email" name="email" type="email" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="si-password">Password</Label>
                  <Input id="si-password" name="password" type="password" required />
                </div>
                <Button type="submit" disabled={loading}>{loading ? "…" : "Sign in"}</Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="mt-6">
              <form onSubmit={handleSignUp} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="su-name">Full name</Label>
                  <Input id="su-name" name="full_name" required maxLength={120} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="su-email">Email</Label>
                  <Input id="su-email" name="email" type="email" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="su-password">Password (8+ characters)</Label>
                  <Input id="su-password" name="password" type="password" required minLength={8} />
                </div>
                <div className="grid gap-2">
                  <Label>I am a…</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["customer", "companion"] as const).map((r) => (
                      <button
                        type="button"
                        key={r}
                        onClick={() => setRole(r)}
                        className={`rounded-md border px-3 py-2 text-sm capitalize transition-colors ${
                          role === r
                            ? "border-brand bg-brand text-brand-foreground"
                            : "border-input bg-background hover:bg-accent"
                        }`}
                      >
                        {r === "customer" ? "Family member" : "Companion"}
                      </button>
                    ))}
                  </div>
                </div>
                <Button type="submit" disabled={loading}>{loading ? "…" : "Create account"}</Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <Button type="button" variant="outline" className="w-full" onClick={handleGoogle} disabled={loading}>
            Continue with Google
          </Button>

          <p className="mt-8 text-xs text-muted-foreground text-center">
            By continuing you agree to our terms.{" "}
            <Link to="/" className="text-brand hover:underline">Back to site</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
