
-- Fix function search_path
CREATE OR REPLACE FUNCTION public.tg_set_updated_at() RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- Lock down SECURITY DEFINER execution
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- Tighten waitlist insert (basic non-empty validation; still allows anonymous submissions)
DROP POLICY IF EXISTS "Waitlist: anon insert" ON public.waitlist;
CREATE POLICY "Waitlist: validated insert" ON public.waitlist FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(full_name) BETWEEN 1 AND 120
    AND length(email) BETWEEN 3 AND 320
    AND length(whatsapp) BETWEEN 4 AND 40
    AND length(country) BETWEEN 1 AND 80
    AND length(loved_one_city) BETWEEN 1 AND 80
  );
