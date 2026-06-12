
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), NEW.email)
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'customer'::app_role)
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$function$;

DROP POLICY IF EXISTS "Reports: companion insert" ON public.reports;
CREATE POLICY "Reports: companion insert"
  ON public.reports FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = companion_id
    AND EXISTS (
      SELECT 1 FROM public.visits v
      WHERE v.id = visit_id
        AND v.companion_id = auth.uid()
    )
  );
