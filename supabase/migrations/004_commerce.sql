-- ============================================================
-- 004_commerce.sql
-- Cart, wishlist, coupons
-- ============================================================

-- ── cart_items ────────────────────────────────────────────────
-- One row per (customer, variant). qty updated in-place.
CREATE TABLE cart_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id  UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  qty         INTEGER NOT NULL DEFAULT 1 CHECK (qty > 0),
  -- Snapshot customization choices at add-to-cart time
  customizations JSONB NOT NULL DEFAULT '{}',
  UNIQUE (customer_id, variant_id)   -- one row per variant per customer
);

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
SELECT add_updated_at_trigger('cart_items');

CREATE INDEX ON cart_items(customer_id);
CREATE INDEX ON cart_items(product_id);

CREATE POLICY "cart_own" ON cart_items FOR ALL
  USING (customer_id = auth.uid())
  WITH CHECK (customer_id = auth.uid());
CREATE POLICY "admin_all_cart" ON cart_items FOR ALL USING (is_admin());

-- ── wishlist_items ────────────────────────────────────────────
CREATE TABLE wishlist_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE (customer_id, product_id)
);

ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

CREATE INDEX ON wishlist_items(customer_id);

CREATE POLICY "wishlist_own" ON wishlist_items FOR ALL
  USING (customer_id = auth.uid())
  WITH CHECK (customer_id = auth.uid());
CREATE POLICY "admin_all_wishlist" ON wishlist_items FOR ALL USING (is_admin());

-- ── coupons ───────────────────────────────────────────────────
CREATE TABLE coupons (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  code            TEXT NOT NULL UNIQUE,
  description     TEXT,
  -- Discount type
  type            TEXT NOT NULL CHECK (type IN ('percentage', 'fixed')),
  -- Value: percentage (0–100) or fixed paise amount
  value           INTEGER NOT NULL CHECK (value > 0),
  -- Minimum order subtotal in paise to apply coupon
  min_order_value INTEGER NOT NULL DEFAULT 0,
  -- Maximum discount cap in paise (null = no cap)
  max_discount    INTEGER,
  -- Usage limits
  usage_limit     INTEGER,          -- null = unlimited
  usage_count     INTEGER NOT NULL DEFAULT 0,
  -- Validity window
  valid_from      TIMESTAMPTZ NOT NULL DEFAULT now(),
  valid_until     TIMESTAMPTZ,      -- null = never expires
  is_active       BOOLEAN NOT NULL DEFAULT true,
  -- Restrict to specific customer(s) — null = any
  customer_id     UUID REFERENCES customers(id) ON DELETE SET NULL
);

ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
SELECT add_updated_at_trigger('coupons');

CREATE INDEX ON coupons(code);
CREATE INDEX ON coupons(is_active, valid_until);

-- Public can check if a code exists (needed for validation at checkout)
CREATE POLICY "coupons_public_read" ON coupons FOR SELECT
  USING (is_active = true AND (valid_until IS NULL OR valid_until > now()));
CREATE POLICY "admin_all_coupons" ON coupons FOR ALL USING (is_admin());

-- ── coupon_uses ───────────────────────────────────────────────
CREATE TABLE coupon_uses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  coupon_id   UUID NOT NULL REFERENCES coupons(id) ON DELETE RESTRICT,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  order_id    UUID,           -- FK added after orders table is created (005)
  discount    INTEGER NOT NULL CHECK (discount >= 0)  -- actual paise saved
);

ALTER TABLE coupon_uses ENABLE ROW LEVEL SECURITY;

CREATE INDEX ON coupon_uses(coupon_id);
CREATE INDEX ON coupon_uses(customer_id);

CREATE POLICY "coupon_uses_own"    ON coupon_uses FOR SELECT USING (customer_id = auth.uid());
CREATE POLICY "admin_all_coupon_uses" ON coupon_uses FOR ALL USING (is_admin());

-- Increment usage_count when a use is recorded
CREATE OR REPLACE FUNCTION increment_coupon_usage()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE coupons SET usage_count = usage_count + 1 WHERE id = NEW.coupon_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER coupon_usage_count
  AFTER INSERT ON coupon_uses
  FOR EACH ROW EXECUTE FUNCTION increment_coupon_usage();
