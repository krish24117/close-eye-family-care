
-- BOOKINGS
CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  loved_one_id uuid REFERENCES public.loved_ones(id) ON DELETE SET NULL,
  visit_id uuid REFERENCES public.visits(id) ON DELETE SET NULL,
  price_id text NOT NULL,
  service_label text NOT NULL,
  service_kind text NOT NULL DEFAULT 'one_time',
  amount_minor integer NOT NULL,
  currency text NOT NULL DEFAULT 'inr',
  scheduled_at timestamptz,
  contact_name text NOT NULL,
  contact_phone text NOT NULL,
  address_line text NOT NULL,
  area text,
  city text NOT NULL DEFAULT 'Hyderabad',
  pincode text NOT NULL,
  special_requests text,
  status text NOT NULL DEFAULT 'pending',
  stripe_session_id text,
  stripe_payment_intent_id text,
  stripe_subscription_id text,
  environment text NOT NULL DEFAULT 'sandbox',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_bookings_customer ON public.bookings(customer_id);
CREATE INDEX idx_bookings_session ON public.bookings(stripe_session_id);

GRANT SELECT, INSERT, UPDATE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Bookings: customer read" ON public.bookings FOR SELECT TO authenticated
  USING (auth.uid() = customer_id OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Bookings: customer insert" ON public.bookings FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Bookings: customer update" ON public.bookings FOR UPDATE TO authenticated
  USING (auth.uid() = customer_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER set_updated_at_bookings BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- SUBSCRIPTIONS
CREATE TABLE public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_subscription_id text NOT NULL UNIQUE,
  stripe_customer_id text NOT NULL,
  product_id text NOT NULL,
  price_id text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean DEFAULT false,
  environment text NOT NULL DEFAULT 'sandbox',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_subs_user ON public.subscriptions(user_id);
CREATE INDEX idx_subs_stripe ON public.subscriptions(stripe_subscription_id);

GRANT SELECT ON public.subscriptions TO authenticated;
GRANT ALL ON public.subscriptions TO service_role;

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Subscriptions: own read" ON public.subscriptions FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER set_updated_at_subscriptions BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
