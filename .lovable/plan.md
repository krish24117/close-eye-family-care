# Close the gaps in booking, payments & account

## 1. Create the 6 Stripe products
Run `batch_create_product` to register the catalog the code already references (`companion_visit_single`, `hospital_companion_single`, `emergency_visit_single`, `care_plan_4/8/12_monthly`) at the prices in `PRICE_CATALOG`. Without this, the very first checkout fails with "Price not found".

## 2. Database: subscription entitlements
New table `public.plan_entitlements` to enforce the strict monthly quota:
- `user_id`, `stripe_subscription_id` (unique), `price_id`
- `visits_total` (4 / 8 / 12), `visits_remaining`
- `period_start`, `period_end`, `environment`
- RLS: user reads own row; service role writes.

Helper `consume_plan_visit(user_uuid, env)` RPC (security definer) that atomically decrements `visits_remaining` and returns the new value, or `null` if none available.

## 3. Webhook upgrades (`/api/public/payments/webhook`)
- `checkout.session.completed` (one-off): also fire WhatsApp to customer (`contact_phone` on the booking) and to admin.
- `customer.subscription.created` / `updated`: upsert entitlement, setting `visits_total` from a `PLAN_VISITS` map and resetting `visits_remaining = visits_total` only when the period changes.
- `invoice.payment_succeeded`: on renewal, reset `visits_remaining` to `visits_total` and advance `period_end`.
- `invoice.payment_failed`: notify customer via WhatsApp, log notification row.

## 4. Visit requests respect the quota
In `visits.new` flow:
- If the user has an active plan with `visits_remaining > 0`, call `consume_plan_visit` before inserting the `visits` row. On `null`, block with toast "Your plan's monthly visits are used up — book a one-time visit instead" and link to `/book`.
- If no active plan, redirect to `/book` (they must pay per visit).
- Move this logic into a `requestVisit` server function so it's authoritative.

## 5. Account / billing self-service
Extend `dashboard.tsx` with:
- "Your care plan" card: plan name, `visits_remaining / visits_total`, renewal date, `Manage billing` button.
- "Recent bookings" list (uses existing `getMyBookings`): label, amount, status, date.

New server function `createPortalSession` (Stripe Billing Portal) — opens in new tab, lets the user cancel-at-period-end, update card, download invoices. Stripe handles end-of-period cancellation natively; the `customer.subscription.updated` webhook with `cancel_at_period_end=true` already flows into our `subscriptions` table.

## 6. Test in preview (test mode)

The preview is wired to Stripe sandbox automatically — banner at the top of `/book` confirms it.

1. Sign in (Google or email) on the preview.
2. Optional: add a loved one under **Dashboard → Add loved one**.
3. Go to **Services → Book Now** for any service.
4. Fill the form with a Hyderabad pincode (e.g. `500081`) and submit.
5. In the embedded Stripe form, use:
   - **Success** — card `4242 4242 4242 4242`, any future expiry, any 3-digit CVC, any zip.
   - **Decline** — `4000 0000 0000 0002`.
   - **3-D Secure** — `4000 0025 0000 3155` (approve in the modal).
6. After success you'll land on `/checkout/return`. The booking shows on the dashboard as **paid**, and you'll get an admin WhatsApp ping.
7. For a Care Plan, the dashboard then shows "Visits remaining: 4/4". Try requesting a visit from **/visits/new** — `remaining` should drop by one. Drain it to 0 and confirm the next request is blocked.
8. Open **Manage billing** to test cancel-at-period-end via Stripe's portal (sandbox).

## Technical notes
- All Stripe calls go through `createStripeClient(env)` (gateway proxy) — no direct SDK keys.
- Webhook uses `?env=sandbox|live`; live secret will be provisioned at go-live.
- `plan_entitlements.environment` is filtered on every read so sandbox/live coexist safely.
- New table follows the standard grant + RLS pattern.
