import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  type StripeEnv,
  createStripeClient,
  getStripeErrorMessage,
} from "@/lib/stripe.server";

type CheckoutSessionResult = { clientSecret: string } | { error: string };

async function resolveOrCreateCustomer(
  stripe: ReturnType<typeof createStripeClient>,
  options: { email?: string; userId: string },
): Promise<string> {
  if (!/^[a-zA-Z0-9_-]+$/.test(options.userId)) throw new Error("Invalid userId");

  const found = await stripe.customers.search({
    query: `metadata['userId']:'${options.userId}'`,
    limit: 1,
  });
  if (found.data.length) return found.data[0].id;

  if (options.email) {
    const existing = await stripe.customers.list({ email: options.email, limit: 1 });
    if (existing.data.length) {
      const customer = existing.data[0];
      if (customer.metadata?.userId !== options.userId) {
        await stripe.customers.update(customer.id, {
          metadata: { ...customer.metadata, userId: options.userId },
        });
      }
      return customer.id;
    }
  }

  const created = await stripe.customers.create({
    ...(options.email && { email: options.email }),
    metadata: { userId: options.userId },
  });
  return created.id;
}

export const createBookingCheckout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (data: {
      bookingId: string;
      priceId: string;
      returnUrl: string;
      environment: StripeEnv;
    }) => {
      if (!/^[a-zA-Z0-9_-]+$/.test(data.priceId)) throw new Error("Invalid priceId");
      if (!/^[0-9a-f-]{36}$/i.test(data.bookingId)) throw new Error("Invalid bookingId");
      return data;
    },
  )
  .handler(async ({ data, context }): Promise<CheckoutSessionResult> => {
    try {
      const { supabase, userId, claims } = context;

      // Verify the booking belongs to this user
      const { data: booking, error: bErr } = await supabase
        .from("bookings")
        .select("id, customer_id, price_id, service_label, status")
        .eq("id", data.bookingId)
        .maybeSingle();
      if (bErr || !booking) return { error: "Booking not found" };
      if (booking.customer_id !== userId) return { error: "Not your booking" };
      if (booking.price_id !== data.priceId) return { error: "Price mismatch" };

      const stripe = createStripeClient(data.environment);

      const prices = await stripe.prices.list({ lookup_keys: [data.priceId] });
      if (!prices.data.length) return { error: "Price not found" };
      const stripePrice = prices.data[0];
      const isRecurring = stripePrice.type === "recurring";

      const email = (claims as { email?: string } | undefined)?.email;
      const customerId = await resolveOrCreateCustomer(stripe, { email, userId });

      let productDescription: string | undefined;
      if (!isRecurring) {
        const productId =
          typeof stripePrice.product === "string"
            ? stripePrice.product
            : stripePrice.product.id;
        const product = await stripe.products.retrieve(productId);
        productDescription = product.name;
      }

      const session = await stripe.checkout.sessions.create({
        line_items: [{ price: stripePrice.id, quantity: 1 }],
        mode: isRecurring ? "subscription" : "payment",
        ui_mode: "embedded_page",
        return_url: data.returnUrl,
        customer: customerId,
        metadata: { userId, bookingId: data.bookingId },
        ...(isRecurring && {
          subscription_data: { metadata: { userId, bookingId: data.bookingId } },
        }),
        ...(!isRecurring && {
          payment_intent_data: {
            description: productDescription,
            metadata: { userId, bookingId: data.bookingId },
          },
        }),
      });

      // Persist the session id for cross-reference
      await supabase
        .from("bookings")
        .update({ stripe_session_id: session.id, environment: data.environment })
        .eq("id", data.bookingId);

      return { clientSecret: session.client_secret ?? "" };
    } catch (error) {
      console.error("createBookingCheckout error", error);
      return { error: getStripeErrorMessage(error) };
    }
  });
