
-- 1) user_roles: prevent privilege escalation
DROP POLICY IF EXISTS "User roles: self read" ON public.user_roles;
DROP POLICY IF EXISTS "User roles: admin manage" ON public.user_roles;
DROP POLICY IF EXISTS "User roles: self select" ON public.user_roles;

CREATE POLICY "User roles: self read"
  ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "User roles: admin read all"
  ON public.user_roles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "User roles: admin insert"
  ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "User roles: admin update"
  ON public.user_roles FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "User roles: admin delete"
  ON public.user_roles FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 2) notifications: remove client-side insert; service role only
DROP POLICY IF EXISTS "Notifications: self insert" ON public.notifications;
REVOKE INSERT ON public.notifications FROM authenticated, anon;

-- 3) companions: only show verified + active to authenticated users
DROP POLICY IF EXISTS "Companions: public read" ON public.companions;
CREATE POLICY "Companions: verified read"
  ON public.companions FOR SELECT TO authenticated
  USING (verified = true AND active = true);
CREATE POLICY "Companions: self read"
  ON public.companions FOR SELECT TO authenticated
  USING (id = auth.uid());
CREATE POLICY "Companions: admin read"
  ON public.companions FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 4) Revoke EXECUTE on internal SECURITY DEFINER functions from end users.
-- handle_new_user runs from an auth trigger; tg_set_updated_at runs from row triggers.
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.tg_set_updated_at() FROM PUBLIC, anon, authenticated;
