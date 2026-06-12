-- Visits: customer insert must not preset companion_id
DROP POLICY IF EXISTS "Visits: customer insert" ON public.visits;
CREATE POLICY "Visits: customer insert" ON public.visits
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = customer_id AND companion_id IS NULL);

-- Reports: companion must be verified
DROP POLICY IF EXISTS "Reports: companion insert" ON public.reports;
CREATE POLICY "Reports: companion insert" ON public.reports
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = companion_id
    AND EXISTS (
      SELECT 1 FROM public.companions c
      WHERE c.id = auth.uid() AND c.verified = true AND c.active = true
    )
    AND EXISTS (
      SELECT 1 FROM public.visits v
      WHERE v.id = visit_id AND v.companion_id = auth.uid()
    )
  );