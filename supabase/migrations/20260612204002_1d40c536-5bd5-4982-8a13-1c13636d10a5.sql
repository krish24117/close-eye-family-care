
CREATE TABLE public.plan_entitlements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_subscription_id text NOT NULL UNIQUE,
  stripe_customer_id text,
  price_id text NOT NULL,
  visits_total int NOT NULL,
  visits_remaining int NOT NULL,
  period_start timestamptz,
  period_end timestamptz,
  environment text NOT NULL DEFAULT 'sandbox',
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_plan_entitlements_user ON public.plan_entitlements(user_id, environment);

GRANT SELECT ON public.plan_entitlements TO authenticated;
GRANT ALL ON public.plan_entitlements TO service_role;

ALTER TABLE public.plan_entitlements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own entitlements"
  ON public.plan_entitlements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER trg_plan_entitlements_updated_at
  BEFORE UPDATE ON public.plan_entitlements
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Atomic decrement; returns new remaining or null if exhausted/none.
CREATE OR REPLACE FUNCTION public.consume_plan_visit(_user_id uuid, _env text)
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _new int;
BEGIN
  UPDATE public.plan_entitlements
     SET visits_remaining = visits_remaining - 1
   WHERE id = (
     SELECT id FROM public.plan_entitlements
      WHERE user_id = _user_id
        AND environment = _env
        AND status IN ('active','trialing')
        AND visits_remaining > 0
        AND (period_end IS NULL OR period_end > now())
      ORDER BY period_end DESC NULLS LAST
      LIMIT 1
      FOR UPDATE
   )
   RETURNING visits_remaining INTO _new;
  RETURN _new;
END;
$$;

REVOKE ALL ON FUNCTION public.consume_plan_visit(uuid, text) FROM public;
GRANT EXECUTE ON FUNCTION public.consume_plan_visit(uuid, text) TO service_role;
