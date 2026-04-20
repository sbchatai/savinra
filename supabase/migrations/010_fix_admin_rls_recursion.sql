-- ============================================================
-- 010_fix_admin_rls_recursion.sql
-- Fix infinite RLS recursion on admin_users table
-- ============================================================

-- The original admin_owner_all policy used an inline subquery:
--   EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND role = 'owner')
-- inside a policy ON admin_users — causing infinite RLS recursion (HTTP 500).
--
-- Fix: wrap the check in a SECURITY DEFINER function so the inner
-- SELECT bypasses RLS (runs as function owner, not as calling user).

CREATE OR REPLACE FUNCTION is_admin_owner()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = auth.uid()
      AND role = 'owner'
      AND is_active = true
  );
END;
$$;

-- Recreate the policy using the function (no inline subquery → no recursion)
DROP POLICY IF EXISTS "admin_owner_all" ON admin_users;
CREATE POLICY "admin_owner_all" ON admin_users FOR ALL USING (is_admin_owner());
