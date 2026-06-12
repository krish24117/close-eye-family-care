import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// Price catalog — must match products created in payment provider.
export const PRICE_CATALOG = {
  companion_visit_single: {
    label: "Companion Visit",
    amount_minor: 99900,
    kind: "one_time" as const,
  },
  hospital_companion_single: {
    label: "Hospital Companion",
    amount_minor: 149900,
    kind: "one_time" as const,
  },
  emergency_visit_single: {
    label: "Emergency Visit",
    amount_minor: 249900,
    kind: "one_time" as const,
  },
  care_plan_4_monthly: {
    label: "Care Plan — 4 visits / month",
    amount_minor: 349900,
    kind: "subscription" as const,
  },
  care_plan_8_monthly: {
    label: "Care Plan — 8 visits / month",
    amount_minor: 649900,
    kind: "subscription" as const,
  },
  care_plan_12_monthly: {
    label: "Care Plan — 12 visits / month",
    amount_minor: 899900,
    kind: "subscription" as const,
  },
} as const;

export type PriceId = keyof typeof PRICE_CATALOG;

// Hyderabad pincodes — 500xxx, 501xxx, 502xxx, 503xxx
const HYD_PINCODE = /^5(0[0-3])\d{3}$/;

const bookingInput = z.object({
  priceId: z.string().refine((v): v is PriceId => v in PRICE_CATALOG, "Unknown service"),
  loved_one_id: z.string().uuid().optional().nullable(),
  scheduled_at: z.string().datetime().optional().nullable(),
  contact_name: z.string().trim().min(2).max(80),
  contact_phone: z.string().trim().min(8).max(20),
  address_line: z.string().trim().min(5).max(200),
  area: z.string().trim().max(80).optional().nullable(),
  pincode: z
    .string()
    .trim()
    .regex(HYD_PINCODE, "We currently only serve Hyderabad pincodes (500xxx–503xxx)"),
  special_requests: z.string().trim().max(800).optional().nullable(),
});

export const createBooking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => bookingInput.parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const cat = PRICE_CATALOG[data.priceId as PriceId];

    const { data: row, error } = await supabase
      .from("bookings")
      .insert({
        customer_id: userId,
        loved_one_id: data.loved_one_id ?? null,
        price_id: data.priceId,
        service_label: cat.label,
        service_kind: cat.kind,
        amount_minor: cat.amount_minor,
        currency: "inr",
        scheduled_at: data.scheduled_at ?? null,
        contact_name: data.contact_name,
        contact_phone: data.contact_phone,
        address_line: data.address_line,
        area: data.area ?? null,
        city: "Hyderabad",
        pincode: data.pincode,
        special_requests: data.special_requests ?? null,
        status: "pending",
      })
      .select("id")
      .single();

    if (error || !row) throw new Error(error?.message ?? "Could not create booking");
    return { bookingId: row.id as string };
  });

export const getMyBookings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data } = await supabase
      .from("bookings")
      .select("id, service_label, status, scheduled_at, amount_minor, currency, created_at, service_kind")
      .eq("customer_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);
    return { bookings: data ?? [] };
  });
