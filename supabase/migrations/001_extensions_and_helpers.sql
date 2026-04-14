-- ============================================================
-- 001_extensions_and_helpers.sql
-- Extensions, shared helper functions, updated_at trigger
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";        -- fuzzy text search on products
CREATE EXTENSION IF NOT EXISTS "unaccent";        -- accent-insensitive search

-- ── updated_at trigger function (reused on all tables) ────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── Helper: attach updated_at trigger to any table ────────────
CREATE OR REPLACE FUNCTION add_updated_at_trigger(target_table TEXT)
RETURNS VOID AS $$
BEGIN
  EXECUTE format(
    'CREATE TRIGGER %I_updated_at
     BEFORE UPDATE ON %I
     FOR EACH ROW EXECUTE FUNCTION update_updated_at()',
    target_table, target_table
  );
END;
$$ LANGUAGE plpgsql;

-- ── Helper: check if user is admin ────────────────────────────
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = auth.uid()
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
