
-- Fix Visits: customer cannot self-assign companion
DROP POLICY IF EXISTS "Visits: assigned update" ON public.visits;
CREATE POLICY "Visits: assigned update" ON public.visits
FOR UPDATE
USING ((auth.uid() = customer_id) OR (auth.uid() = companion_id) OR has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role)
  OR (auth.uid() = companion_id)
  OR (
    auth.uid() = customer_id
    AND companion_id IS NULL
  )
);

-- Fix Reports: companion update must keep ownership
DROP POLICY IF EXISTS "Reports: companion update" ON public.reports;
CREATE POLICY "Reports: companion update" ON public.reports
FOR UPDATE
USING ((auth.uid() = companion_id) OR has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role)
  OR (
    auth.uid() = companion_id
    AND EXISTS (
      SELECT 1 FROM public.visits v
      WHERE v.id = reports.visit_id AND v.companion_id = auth.uid()
    )
  )
);

-- Revoke anon execute on consume_plan_visit (security definer)
REVOKE EXECUTE ON FUNCTION public.consume_plan_visit(uuid, text) FROM anon, PUBLIC;
GRANT EXECUTE ON FUNCTION public.consume_plan_visit(uuid, text) TO authenticated, service_role;
