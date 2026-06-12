CREATE TABLE public.whatsapp_deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id uuid REFERENCES public.visits(id) ON DELETE SET NULL,
  direction text NOT NULL CHECK (direction IN ('admin','customer')),
  recipient text NOT NULL,
  body text NOT NULL,
  status text NOT NULL CHECK (status IN ('sent','failed','skipped')),
  twilio_sid text,
  error text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.whatsapp_deliveries TO authenticated;
GRANT ALL ON public.whatsapp_deliveries TO service_role;
ALTER TABLE public.whatsapp_deliveries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view all deliveries" ON public.whatsapp_deliveries
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE INDEX idx_whatsapp_deliveries_visit ON public.whatsapp_deliveries(visit_id);
CREATE INDEX idx_whatsapp_deliveries_created ON public.whatsapp_deliveries(created_at DESC);