-- ============================================================
-- 005_orders.sql
-- Orders, line items, payments, shipments, returns
-- ============================================================

-- ── orders ────────────────────────────────────────────────────
CREATE TABLE orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Reference number shown to customers: SAV-20260001
  order_number    TEXT NOT NULL UNIQUE,
  customer_id     UUID REFERENCES customers(id) ON DELETE SET NULL,
  -- Status lifecycle
  status          TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','confirmed','processing','shipped','delivered','cancelled','refunded')),
  -- Pricing snapshot (all in paise)
  subtotal        INTEGER NOT NULL CHECK (subtotal >= 0),
  shipping        INTEGER NOT NULL DEFAULT 0 CHECK (shipping >= 0),
  discount        INTEGER NOT NULL DEFAULT 0 CHECK (discount >= 0),
  total           INTEGER NOT NULL CHECK (total >= 0),
  -- Coupon
  coupon_id       UUID REFERENCES coupons(id) ON DELETE SET NULL,
  coupon_code     TEXT,   -- snapshot in case coupon is deleted later
  -- Shipping address snapshot (denormalised — address can change later)
  shipping_name   TEXT NOT NULL,
  shipping_phone  TEXT NOT NULL,
  shipping_line1  TEXT NOT NULL,
  shipping_line2  TEXT,
  shipping_city   TEXT NOT NULL,
  shipping_state  TEXT NOT NULL,
  shipping_pincode TEXT NOT NULL,
  shipping_country TEXT NOT NULL DEFAULT 'India',
  -- Payment
  payment_method  TEXT NOT NULL CHECK (payment_method IN ('upi','card','netbanking','cod','wallet')),
  payment_status  TEXT NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN ('pending','paid','failed','refunded')),
  -- Razorpay
  razorpay_order_id   TEXT,
  razorpay_payment_id TEXT,
  -- Notes
  customer_note   TEXT,
  admin_note      TEXT,
  -- COD flag
  is_cod          BOOLEAN NOT NULL DEFAULT false,
  -- Timestamps
  confirmed_at    TIMESTAMPTZ,
  shipped_at      TIMESTAMPTZ,
  delivered_at    TIMESTAMPTZ,
  cancelled_at    TIMESTAMPTZ
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
SELECT add_updated_at_trigger('orders');

CREATE INDEX ON orders(customer_id, created_at DESC);
CREATE INDEX ON orders(status);
CREATE INDEX ON orders(payment_status);
CREATE INDEX ON orders(order_number);
CREATE INDEX ON orders(razorpay_order_id);

CREATE POLICY "orders_own"       ON orders FOR SELECT USING (customer_id = auth.uid());
CREATE POLICY "orders_insert_auth" ON orders FOR INSERT WITH CHECK (customer_id = auth.uid());
CREATE POLICY "admin_all_orders" ON orders FOR ALL USING (is_admin());

-- Now add the FK from coupon_uses → orders (avoids forward-reference)
ALTER TABLE coupon_uses ADD CONSTRAINT coupon_uses_order_fk
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL;

-- Auto-generate order number: SAV-YYYYMMDD-NNNN
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
  today       TEXT := to_char(now(), 'YYYYMMDD');
  daily_count INTEGER;
BEGIN
  SELECT COUNT(*) + 1 INTO daily_count
  FROM orders
  WHERE DATE(created_at) = CURRENT_DATE;

  NEW.order_number := 'SAV-' || today || '-' || LPAD(daily_count::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER orders_generate_number
  BEFORE INSERT ON orders
  FOR EACH ROW WHEN (NEW.order_number IS NULL OR NEW.order_number = '')
  EXECUTE FUNCTION generate_order_number();

-- Update customer lifetime value when order is confirmed
CREATE OR REPLACE FUNCTION update_customer_on_order()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'confirmed' AND (OLD.status IS NULL OR OLD.status != 'confirmed') THEN
    UPDATE customers
    SET
      total_orders  = total_orders + 1,
      total_spent   = total_spent + NEW.total,
      last_order_at = now()
    WHERE id = NEW.customer_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER orders_update_customer
  AFTER INSERT OR UPDATE OF status ON orders
  FOR EACH ROW EXECUTE FUNCTION update_customer_on_order();

-- ── order_items ───────────────────────────────────────────────
CREATE TABLE order_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id  UUID REFERENCES products(id) ON DELETE SET NULL,
  variant_id  UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  -- Snapshots so historical orders are accurate even if product changes
  product_name  TEXT NOT NULL,
  variant_size  TEXT,
  variant_color TEXT,
  sku           TEXT,
  -- Pricing snapshot in paise
  unit_price  INTEGER NOT NULL CHECK (unit_price >= 0),
  qty         INTEGER NOT NULL DEFAULT 1 CHECK (qty > 0),
  total       INTEGER NOT NULL CHECK (total >= 0),  -- unit_price * qty
  -- Image snapshot
  image_url   TEXT
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE INDEX ON order_items(order_id);
CREATE INDEX ON order_items(product_id);

CREATE POLICY "order_items_own" ON order_items FOR SELECT
  USING (order_id IN (SELECT id FROM orders WHERE customer_id = auth.uid()));
CREATE POLICY "admin_all_order_items" ON order_items FOR ALL USING (is_admin());

-- ── order_item_customizations ──────────────────────────────────
CREATE TABLE order_item_customizations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id UUID NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
  label         TEXT NOT NULL,  -- e.g. "Monogram Text"
  value         TEXT NOT NULL   -- e.g. "P.S."
);

ALTER TABLE order_item_customizations ENABLE ROW LEVEL SECURITY;

CREATE INDEX ON order_item_customizations(order_item_id);

CREATE POLICY "order_item_custom_own" ON order_item_customizations FOR SELECT
  USING (
    order_item_id IN (
      SELECT oi.id FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      WHERE o.customer_id = auth.uid()
    )
  );
CREATE POLICY "admin_all_order_item_custom" ON order_item_customizations FOR ALL USING (is_admin());

-- ── order_events ──────────────────────────────────────────────
-- Append-only audit log of every status change
CREATE TABLE order_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  event_type  TEXT NOT NULL,  -- 'status_change', 'payment_received', 'note_added', etc.
  from_status TEXT,
  to_status   TEXT,
  note        TEXT,
  actor_id    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_type  TEXT CHECK (actor_type IN ('customer', 'admin', 'system'))
);

ALTER TABLE order_events ENABLE ROW LEVEL SECURITY;

CREATE INDEX ON order_events(order_id, created_at DESC);

CREATE POLICY "order_events_own" ON order_events FOR SELECT
  USING (order_id IN (SELECT id FROM orders WHERE customer_id = auth.uid()));
CREATE POLICY "admin_all_order_events" ON order_events FOR ALL USING (is_admin());

-- Auto-log status changes
CREATE OR REPLACE FUNCTION log_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO order_events (order_id, event_type, from_status, to_status, actor_type)
    VALUES (NEW.id, 'status_change', OLD.status, NEW.status, 'system');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER orders_log_status
  AFTER UPDATE OF status ON orders
  FOR EACH ROW EXECUTE FUNCTION log_order_status_change();

-- ── payment_attempts ──────────────────────────────────────────
CREATE TABLE payment_attempts (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  order_id            UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  gateway             TEXT NOT NULL DEFAULT 'razorpay',
  razorpay_order_id   TEXT,
  razorpay_payment_id TEXT,
  amount              INTEGER NOT NULL CHECK (amount > 0),  -- paise
  status              TEXT NOT NULL CHECK (status IN ('initiated','success','failed','pending')),
  failure_reason      TEXT,
  gateway_response    JSONB  -- raw webhook payload
);

ALTER TABLE payment_attempts ENABLE ROW LEVEL SECURITY;

CREATE INDEX ON payment_attempts(order_id);
CREATE INDEX ON payment_attempts(razorpay_payment_id);

CREATE POLICY "payment_attempts_own" ON payment_attempts FOR SELECT
  USING (order_id IN (SELECT id FROM orders WHERE customer_id = auth.uid()));
CREATE POLICY "admin_all_payment_attempts" ON payment_attempts FOR ALL USING (is_admin());

-- ── shipments ──────────────────────────────────────────────────
CREATE TABLE shipments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  courier         TEXT NOT NULL,     -- Delhivery / Shiprocket / India Post
  tracking_number TEXT,
  tracking_url    TEXT,
  status          TEXT NOT NULL DEFAULT 'packed'
    CHECK (status IN ('packed','handed_over','in_transit','out_for_delivery','delivered','returned')),
  estimated_at    TIMESTAMPTZ,
  delivered_at    TIMESTAMPTZ,
  notes           TEXT
);

ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
SELECT add_updated_at_trigger('shipments');

CREATE INDEX ON shipments(order_id);

CREATE POLICY "shipments_own" ON shipments FOR SELECT
  USING (order_id IN (SELECT id FROM orders WHERE customer_id = auth.uid()));
CREATE POLICY "admin_all_shipments" ON shipments FOR ALL USING (is_admin());

-- ── return_requests ────────────────────────────────────────────
CREATE TABLE return_requests (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  reason      TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'requested'
    CHECK (status IN ('requested','approved','rejected','picked_up','refunded')),
  refund_mode TEXT CHECK (refund_mode IN ('original','store_credit','bank')),
  refund_amount INTEGER,   -- paise, set when refund processed
  admin_note  TEXT,
  resolved_at TIMESTAMPTZ
);

ALTER TABLE return_requests ENABLE ROW LEVEL SECURITY;
SELECT add_updated_at_trigger('return_requests');

CREATE INDEX ON return_requests(order_id);
CREATE INDEX ON return_requests(customer_id);
CREATE INDEX ON return_requests(status);

CREATE POLICY "returns_own" ON return_requests FOR SELECT
  USING (customer_id = auth.uid());
CREATE POLICY "returns_insert_own" ON return_requests FOR INSERT
  WITH CHECK (customer_id = auth.uid());
CREATE POLICY "admin_all_returns" ON return_requests FOR ALL USING (is_admin());

-- ── return_items ───────────────────────────────────────────────
CREATE TABLE return_items (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  return_request_id UUID NOT NULL REFERENCES return_requests(id) ON DELETE CASCADE,
  order_item_id     UUID NOT NULL REFERENCES order_items(id) ON DELETE RESTRICT,
  qty               INTEGER NOT NULL DEFAULT 1 CHECK (qty > 0),
  reason            TEXT,
  condition         TEXT CHECK (condition IN ('unused','used','damaged'))
);

ALTER TABLE return_items ENABLE ROW LEVEL SECURITY;

CREATE INDEX ON return_items(return_request_id);

CREATE POLICY "return_items_own" ON return_items FOR SELECT
  USING (
    return_request_id IN (
      SELECT id FROM return_requests WHERE customer_id = auth.uid()
    )
  );
CREATE POLICY "admin_all_return_items" ON return_items FOR ALL USING (is_admin());
