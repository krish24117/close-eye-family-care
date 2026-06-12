import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { type StripeEnv, verifyWebhook } from "@/lib/stripe.server";

let _supabase: ReturnType<typeof createClient> | null = null;
function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
  }
  return _supabase;
}

// Map price_id → visit_type enum for the visits table
const PRICE_TO_VISIT_TYPE: Record<string, string> = {
  companion_visit_single: "companion_visit",
  hospital_companion_single: "hospital_companion",
  emergency_visit_single: "emergency_visit",
  // monthly plans schedule the first companion_visit; ops can adjust per visit
  care_plan_4_monthly: "companion_visit",
  care_plan_8_monthly: "companion_visit",
  care_plan_12_monthly: "companion_visit",
};

async function markBookingPaid(session: any, env: StripeEnv) {
  const bookingId = session.metadata?.bookingId;
  if (!bookingId) {
    console.error("checkout.session.completed without bookingId metadata");
    return;
  }
  const supabase = getSupabase();

  const { data: booking } = await supabase
    .from("bookings")
    .select(
      "id, customer_id, loved_one_id, price_id, scheduled_at, special_requests, service_kind, status, visit_id",
    )
    .eq("id", bookingId)
    .maybeSingle();

  if (!booking) {
    console.error("Booking not found:", bookingId);
    return;
  }

  // Idempotency — if already paid/active, skip duplicate visit creation
  const newStatus =
    booking.service_kind === "subscription" ? "active" : "paid";
  const alreadyHandled =
    booking.status === newStatus || booking.status === "completed";

  const updatePatch: Record<string, any> = {
    status: newStatus,
    stripe_payment_intent_id: session.payment_intent ?? null,
    stripe_subscription_id: session.subscription ?? null,
    environment: env,
  };

  // Create a visit row if a loved_one is linked and we haven't yet
  if (!alreadyHandled && booking.loved_one_id && !booking.visit_id) {
    const visitType = PRICE_TO_VISIT_TYPE[booking.price_id as string] ?? "companion_visit";
    const { data: visit } = await supabase
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

  await supabase.from("bookings").update(updatePatch).eq("id", bookingId);
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

  await getSupabase()
    .from("subscriptions")
    .upsert(
      {
        user_id: userId,
        stripe_subscription_id: subscription.id,
        stripe_customer_id: subscription.customer,
        product_id: productId,
        price_id: priceId,
        status: subscription.status,
        current_period_start: periodStart
          ? new Date(periodStart * 1000).toISOString()
          : null,
        current_period_end: periodEnd
          ? new Date(periodEnd * 1000).toISOString()
          : null,
        cancel_at_period_end: subscription.cancel_at_period_end || false,
        environment: env,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "stripe_subscription_id" },
    );
}

async function markSubscriptionCanceled(subscription: any, env: StripeEnv) {
  await getSupabase()
    .from("subscriptions")
    .update({ status: "canceled", updated_at: new Date().toISOString() })
    .eq("stripe_subscription_id", subscription.id)
    .eq("environment", env);

  // Reflect on linked bookings
  await getSupabase()
    .from("bookings")
    .update({ status: "canceled" })
    .eq("stripe_subscription_id", subscription.id);
}

async function handleWebhook(req: Request, env: StripeEnv) {
  const event = await verifyWebhook(req, env);

  switch (event.type) {
    case "checkout.session.completed":
      await markBookingPaid(event.data.object, env);
      // If it was a subscription session, the customer.subscription.created
      // event will follow and populate the subscriptions table.
      break;
    case "customer.subscription.created":
    case "customer.subscription.updated":
      await upsertSubscription(event.data.object, env);
      break;
    case "customer.subscription.deleted":
      await markSubscriptionCanceled(event.data.object, env);
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
