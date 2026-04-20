-- ============================================================
-- 002_customers_and_auth.sql
-- Customers (extends auth.users), addresses, admin users
-- ============================================================

-- ── customers ────────────────────────────────────────────────
CREATE TABLE customers (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  email         TEXT NOT NULL,
  full_name     TEXT,
  phone         TEXT,
  avatar_url    TEXT,
  -- Lifecycle tracking
  total_orders  INTEGER NOT NULL DEFAULT 0,
  total_spent   INTEGER NOT NULL DEFAULT 0,  -- in paise
  last_order_at TIMESTAMPTZ,
  -- Segmentation
  tags          TEXT[] NOT NULL DEFAULT '{}',
  notes         TEXT,                        -- internal admin notes
  -- Comms preferences
  whatsapp_opted_in  BOOLEAN NOT NULL DEFAULT false,
  email_opted_in     BOOLEAN NOT NULL DEFAULT true,
  -- Soft delete
  deleted_at    TIMESTAMPTZ
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
SELECT add_updated_at_trigger('customers');

CREATE POLICY "customers_read_own"   ON customers FOR SELECT USING (auth.uid() = id);
CREATE POLICY "customers_update_own" ON customers FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "admin_all_customers"  ON customers FOR ALL USING (is_admin());

-- Auto-create customer row on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.customers (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ── addresses ────────────────────────────────────────────────
CREATE TABLE addresses (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  customer_id   UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  -- Address fields
  label         TEXT NOT NULL DEFAULT 'Home',  -- Home / Work / Other
  full_name     TEXT NOT NULL,
  phone         TEXT NOT NULL,
  line1         TEXT NOT NULL,
  line2         TEXT,
  city          TEXT NOT NULL,
  state         TEXT NOT NULL,
  pincode       TEXT NOT NULL,
  country       TEXT NOT NULL DEFAULT 'India',
  is_default    BOOLEAN NOT NULL DEFAULT false
);

ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
SELECT add_updated_at_trigger('addresses');

CREATE INDEX ON addresses(customer_id);

CREATE POLICY "addresses_own" ON addresses FOR ALL USING (
  customer_id IN (SELECT id FROM customers WHERE id = auth.uid())
);
CREATE POLICY "admin_all_addresses" ON addresses FOR ALL USING (is_admin());

-- Ensure only one default address per customer
CREATE OR REPLACE FUNCTION ensure_single_default_address()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_default THEN
    UPDATE addresses
    SET is_default = false
    WHERE customer_id = NEW.customer_id AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER addresses_single_default
  AFTER INSERT OR UPDATE OF is_default ON addresses
  FOR EACH ROW WHEN (NEW.is_default = true)
  EXECUTE FUNCTION ensure_single_default_address();

-- ── admin_users ───────────────────────────────────────────────
CREATE TABLE admin_users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role        TEXT NOT NULL DEFAULT 'staff'
                CHECK (role IN ('owner', 'manager', 'staff')),
  is_active   BOOLEAN NOT NULL DEFAULT true,
  UNIQUE (user_id)
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Admins can see other admins; only owner can manage them
CREATE POLICY "admin_read_self"   ON admin_users FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "admin_owner_all"   ON admin_users FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND role = 'owner')
);
