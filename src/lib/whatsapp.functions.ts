import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/twilio";
// Twilio sandbox WhatsApp sender. Replace with your approved sender when out of sandbox.
const FROM = "whatsapp:+14155238886";
// Admin / business WhatsApp number that receives operational alerts (E.164).
const ADMIN_WHATSAPP = "+919000221261";

const schema = z.object({
  body: z.string().min(1).max(1500),
  to: z.string().min(6).max(20).optional(), // E.164 with leading '+', optional override
});

function toWhatsAppAddress(num: string) {
  const cleaned = num.trim().replace(/[^\d+]/g, "");
  const e164 = cleaned.startsWith("+") ? cleaned : `+${cleaned}`;
  return `whatsapp:${e164}`;
}

export const sendWhatsApp = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data, context }) => {
    const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
    const TWILIO_API_KEY = process.env.TWILIO_API_KEY;
    if (!LOVABLE_API_KEY || !TWILIO_API_KEY) {
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
    if (!to) return { ok: false, skipped: true, reason: "no_recipient_number" as const };

    const res = await fetch(`${GATEWAY_URL}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": TWILIO_API_KEY,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        To: toWhatsAppAddress(to),
        From: FROM,
        Body: data.body,
      }),
    });

    const payload = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("twilio whatsapp error", res.status, payload);
      return { ok: false, status: res.status, error: (payload as any)?.message ?? "twilio_error" };
    }
    return { ok: true, sid: (payload as any)?.sid };
  });
