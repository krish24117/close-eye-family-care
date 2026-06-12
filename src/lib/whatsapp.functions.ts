import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/twilio";
// Twilio sandbox WhatsApp sender. Replace with your approved sender when out of sandbox.
const FROM = "whatsapp:+14155238886";
// Fallback admin number used only if ADMIN_WHATSAPP_TO secret is not set.
const ADMIN_WHATSAPP_FALLBACK = "+919000221261";

function toWhatsAppAddress(num: string) {
  const cleaned = num.trim().replace(/[^\d+]/g, "");
  const e164 = cleaned.startsWith("+") ? cleaned : `+${cleaned}`;
  return `whatsapp:${e164}`;
}

async function logDelivery(entry: {
  visit_id?: string | null;
  direction: "admin" | "customer";
  recipient: string;
  body: string;
  status: "sent" | "failed" | "skipped";
  twilio_sid?: string | null;
  error?: string | null;
}) {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("whatsapp_deliveries").insert(entry);
  } catch (e) {
    console.error("whatsapp_deliveries log failed", e);
  }
}

const schema = z.object({
  body: z.string().min(1).max(1500),
  to: z.string().min(6).max(20).optional(),
  visit_id: z.string().uuid().optional(),
});

export const sendWhatsApp = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data, context }) => {
    const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
    const TWILIO_API_KEY = process.env.TWILIO_API_KEY;
    if (!LOVABLE_API_KEY || !TWILIO_API_KEY) {
      await logDelivery({
        visit_id: data.visit_id ?? null,
        direction: "customer",
        recipient: data.to ?? "",
        body: data.body,
        status: "skipped",
        error: "twilio_not_configured",
      });
      return { ok: false, skipped: true, reason: "twilio_not_configured" as const };
    }

    let to = data.to;
    if (!to) {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("whatsapp, phone")
        .eq("id", context.userId)
        .maybeSingle();
      to = profile?.whatsapp ?? profile?.phone ?? undefined;
    }
    if (!to) {
      await logDelivery({
        visit_id: data.visit_id ?? null,
        direction: "customer",
        recipient: "",
        body: data.body,
        status: "skipped",
        error: "no_recipient_number",
      });
      return { ok: false, skipped: true, reason: "no_recipient_number" as const };
    }

    const recipient = toWhatsAppAddress(to);
    const res = await fetch(`${GATEWAY_URL}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": TWILIO_API_KEY,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ To: recipient, From: FROM, Body: data.body }),
    });

    const payload = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("twilio whatsapp error", res.status, payload);
      await logDelivery({
        visit_id: data.visit_id ?? null,
        direction: "customer",
        recipient,
        body: data.body,
        status: "failed",
        error: `${res.status}: ${(payload as any)?.message ?? "twilio_error"}`,
      });
      return { ok: false, status: res.status, error: (payload as any)?.message ?? "twilio_error" };
    }
    await logDelivery({
      visit_id: data.visit_id ?? null,
      direction: "customer",
      recipient,
      body: data.body,
      status: "sent",
      twilio_sid: (payload as any)?.sid ?? null,
    });
    return { ok: true, sid: (payload as any)?.sid };
  });

const adminSchema = z.object({
  body: z.string().min(1).max(1500),
  visit_id: z.string().uuid().optional(),
});

export const sendAdminWhatsApp = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => adminSchema.parse(data))
  .handler(async ({ data }) => {
    const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
    const TWILIO_API_KEY = process.env.TWILIO_API_KEY;
    const ADMIN_WHATSAPP = process.env.ADMIN_WHATSAPP_TO || ADMIN_WHATSAPP_FALLBACK;
    const recipient = toWhatsAppAddress(ADMIN_WHATSAPP);

    if (!LOVABLE_API_KEY || !TWILIO_API_KEY) {
      await logDelivery({
        visit_id: data.visit_id ?? null,
        direction: "admin",
        recipient,
        body: data.body,
        status: "skipped",
        error: "twilio_not_configured",
      });
      return { ok: false, skipped: true, reason: "twilio_not_configured" as const };
    }
    const res = await fetch(`${GATEWAY_URL}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": TWILIO_API_KEY,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ To: recipient, From: FROM, Body: data.body }),
    });
    const payload = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("twilio admin whatsapp error", res.status, payload);
      await logDelivery({
        visit_id: data.visit_id ?? null,
        direction: "admin",
        recipient,
        body: data.body,
        status: "failed",
        error: `${res.status}: ${(payload as any)?.message ?? "twilio_error"}`,
      });
      return { ok: false, status: res.status, error: (payload as any)?.message ?? "twilio_error" };
    }
    await logDelivery({
      visit_id: data.visit_id ?? null,
      direction: "admin",
      recipient,
      body: data.body,
      status: "sent",
      twilio_sid: (payload as any)?.sid ?? null,
    });
    return { ok: true, sid: (payload as any)?.sid };
  });
