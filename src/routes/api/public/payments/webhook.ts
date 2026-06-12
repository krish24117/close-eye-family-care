import { createFileRoute } from "@tanstack/react-router";
import { type StripeEnv, verifyWebhook } from "@/lib/stripe.server";

const PRICE_TO_VISIT_TYPE: Record<string, string> = {
  companion_visit_single: "companion_visit",
  hospital_companion_single: "hospital_companion",
  emergency_visit_single: "emergency_visit",
  care_plan_4_monthly: "companion_visit",
  care_plan_8_monthly: "companion_visit",
  care_plan_12_monthly: "companion_visit",
};

const PLAN_VISITS: Record<string, number> = {
  care_plan_4_monthly: 4,
  care_plan_8_monthly: 8,
  care_plan_12_monthly: 12,
};

async function getDb() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin as unknown as { from: (t: string) => any };
}

function formatINR(minor: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(minor / 100);
}

async function sendTwilioWhatsApp(to: string, body: string) {
  const apiKey = process.env.TWILIO_API_KEY;
  const adminTo = process.env.ADMIN_WHATSAPP_TO;
  if (!apiKey) return;
  // Reuse same shape as src/lib/whatsapp.functions.ts — best-effort.
  try {
    await fetch("https://connector-gateway.lovable.dev/twilio/whatsapp/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Connection-Api-Key": apiKey,
        "Lovable-API-Key": process.env.LOVABLE_API_KEY ?? "",
      },
      body: JSON.stringify({ to, body, admin_to: adminTo }),
    });
  } catch (e) {
    console.error("WA send failed", e);
  }
}

async function notifyBookingPaid(booking: any) {
  // Best-effort: log notification row + send WA via existing pattern.
  const db = await getDb();
  await db.from("notifications").insert({
    user_id: booking.customer_id,
    title: "Payment received",
    body: `Your ${booking.service_label} booking is confirmed. Our team will call ${booking.contact_phone} to arrange the visit.`,
    type: "success",
    link: "/dashboard",
  });

  if (booking.contact_phone) {
    await sendTwilioWhatsApp(
      booking.contact_phone,
      `Close Eye — payment received ✅\n${booking.service_label} — ${formatINR(booking.amount_minor)}\nWe'll call ${booking.contact_phone} shortly to confirm arrival time.`,
    );
  }
  const adminTo = process.env.ADMIN_WHATSAPP_TO;
  if (adminTo) {
    await sendTwilioWhatsApp(
      adminTo,
      `🔔 New PAID booking\n${booking.service_label} — ${formatINR(booking.amount_minor)}\nContact: ${booking.contact_name} (${booking.contact_phone})\nAddress: ${booking.address_line}, ${booking.area ?? ""} ${booking.pincode}`,
    );
  }
}

async function markBookingPaid(session: any, env: StripeEnv) {
  const bookingId = session.metadata?.bookingId;
  if (!bookingId) {
    console.error("checkout.session.completed without bookingId metadata");
    return;
  }
  const db = await getDb();

  const { data: booking } = await db
    .from("bookings")
    .select(
      "id, customer_id, loved_one_id, price_id, scheduled_at, special_requests, service_kind, service_label, amount_minor, contact_name, contact_phone, address_line, area, pincode, status, visit_id",
    )
    .eq("id", bookingId)
    .maybeSingle();

  if (!booking) {
    console.error("Booking not found:", bookingId);
    return;
  }

  const newStatus = booking.service_kind === "subscription" ? "active" : "paid";
  const alreadyHandled = booking.status === newStatus || booking.status === "completed";

  const updatePatch: Record<string, any> = {
    status: newStatus,
    stripe_payment_intent_id: session.payment_intent ?? null,
    stripe_subscription_id: session.subscription ?? null,
    environment: env,
  };

  if (!alreadyHandled && booking.loved_one_id && !booking.visit_id) {
    const visitType = PRICE_TO_VISIT_TYPE[booking.price_id] ?? "companion_visit";
    const { data: visit } = await db
      .from("visits")
      .insert({
        customer_id: booking.customer_id,
        loved_one_id: booking.loved_one_id,
        visit_type: visitType,
        scheduled_at: booking.scheduled_at,
        special_requests: booking.special_requests,
      })
      .select("id")
      .single();
    if (visit) updatePatch.visit_id = visit.id;
  }

  await db.from("bookings").update(updatePatch).eq("id", bookingId);

  if (!alreadyHandled) {
    await notifyBookingPaid(booking);
  }
}

async function upsertSubscription(subscription: any, env: StripeEnv) {
  const userId = subscription.metadata?.userId;
  if (!userId) {
    console.error("subscription event without userId metadata");
    return;
  }
  const item = subscription.items?.data?.[0];
  const priceId =
    item?.price?.lookup_key ||
    item?.price?.metadata?.lovable_external_id ||
    item?.price?.id;
  const productId = item?.price?.product;
  const periodStart = item?.current_period_start ?? subscription.current_period_start;
  const periodEnd = item?.current_period_end ?? subscription.current_period_end;
  const periodEndIso = periodEnd ? new Date(periodEnd * 1000).toISOString() : null;
  const periodStartIso = periodStart ? new Date(periodStart * 1000).toISOString() : null;

  const db = await getDb();
  await db.from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: subscription.customer,
      product_id: productId,
      price_id: priceId,
      status: subscription.status,
      current_period_start: periodStartIso,
      current_period_end: periodEndIso,
      cancel_at_period_end: subscription.cancel_at_period_end || false,
      environment: env,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "stripe_subscription_id" },
  );

  // Maintain the entitlement row for Care Plans.
  const visitsTotal = PLAN_VISITS[priceId as string];
  if (visitsTotal) {
    // Check if existing row needs reset (new period).
    const { data: existing } = await db
      .from("plan_entitlements")
      .select("id, period_end, visits_total")
      .eq("stripe_subscription_id", subscription.id)
      .maybeSingle();

    const periodChanged =
      !existing ||
      (periodEndIso && existing.period_end !== periodEndIso) ||
      existing.visits_total !== visitsTotal;

    await db.from("plan_entitlements").upsert(
      {
        user_id: userId,
        stripe_subscription_id: subscription.id,
        stripe_customer_id: subscription.customer,
        price_id: priceId,
        visits_total: visitsTotal,
        visits_remaining: periodChanged ? visitsTotal : (existing as any)?.visits_remaining ?? visitsTotal,
        period_start: periodStartIso,
        period_end: periodEndIso,
        status: subscription.status,
        environment: env,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "stripe_subscription_id" },
    );
  }
}

async function markSubscriptionCanceled(subscription: any, env: StripeEnv) {
  const db = await getDb();
  await db
    .from("subscriptions")
    .update({ status: "canceled", updated_at: new Date().toISOString() })
    .eq("stripe_subscription_id", subscription.id)
    .eq("environment", env);
  await db
    .from("plan_entitlements")
    .update({ status: "canceled", visits_remaining: 0, updated_at: new Date().toISOString() })
    .eq("stripe_subscription_id", subscription.id);
  await db
    .from("bookings")
    .update({ status: "canceled" })
    .eq("stripe_subscription_id", subscription.id);
}

async function handleInvoicePaymentSucceeded(invoice: any, env: StripeEnv) {
  // Renewal: reset entitlement for the new period.
  const subId = invoice.subscription;
  if (!subId || invoice.billing_reason !== "subscription_cycle") return;
  const line = invoice.lines?.data?.[0];
  const periodEnd = line?.period?.end;
  const periodStart = line?.period?.start;
  const priceId = line?.price?.lookup_key || line?.price?.metadata?.lovable_external_id;
  const visitsTotal = PLAN_VISITS[priceId as string];
  if (!visitsTotal) return;

  const db = await getDb();
  await db
    .from("plan_entitlements")
    .update({
      visits_total: visitsTotal,
      visits_remaining: visitsTotal,
      period_start: periodStart ? new Date(periodStart * 1000).toISOString() : null,
      period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
      status: "active",
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subId)
    .eq("environment", env);
}

async function handleInvoicePaymentFailed(invoice: any) {
  const db = await getDb();
  // Find the user.
  const subId = invoice.subscription;
  if (!subId) return;
  const { data: sub } = await db
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_subscription_id", subId)
    .maybeSingle();
  if (!sub?.user_id) return;
  await db.from("notifications").insert({
    user_id: sub.user_id,
    title: "Payment failed on your Care Plan",
    body: "We couldn't charge your card for this month's renewal. Please update your payment method in Manage Billing.",
    type: "error",
    link: "/dashboard",
  });
}

async function handleWebhook(req: Request, env: StripeEnv) {
  const event = await verifyWebhook(req, env);

  switch (event.type) {
    case "checkout.session.completed":
      await markBookingPaid(event.data.object, env);
      break;
    case "customer.subscription.created":
    case "customer.subscription.updated":
      await upsertSubscription(event.data.object, env);
      break;
    case "customer.subscription.deleted":
      await markSubscriptionCanceled(event.data.object, env);
      break;
    case "invoice.payment_succeeded":
      await handleInvoicePaymentSucceeded(event.data.object, env);
      break;
    case "invoice.payment_failed":
      await handleInvoicePaymentFailed(event.data.object);
      break;
    default:
      console.log("Unhandled event:", event.type);
  }
}

export const Route = createFileRoute("/api/public/payments/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawEnv = new URL(request.url).searchParams.get("env");
        if (rawEnv !== "sandbox" && rawEnv !== "live") {
          console.error("Webhook: invalid env query param:", rawEnv);
          return Response.json({ received: true, ignored: "invalid env" });
        }
        try {
          await handleWebhook(request, rawEnv as StripeEnv);
          return Response.json({ received: true });
        } catch (e) {
          console.error("Webhook error:", e);
          return new Response("Webhook error", { status: 400 });
        }
      },
    },
  },
});
