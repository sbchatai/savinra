-- ============================================================
-- 006_automations.sql
-- Chat, abandoned cart, WhatsApp logs, segments,
-- social posts, AI images, inventory alerts
-- ============================================================

-- ── chat_sessions ─────────────────────────────────────────────
CREATE TABLE chat_sessions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  customer_id   UUID REFERENCES customers(id) ON DELETE SET NULL,
  -- Anonymous sessions (pre-login)
  session_token TEXT,
  status        TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open','resolved','abandoned')),
  channel       TEXT NOT NULL DEFAULT 'web'
    CHECK (channel IN ('web','whatsapp')),
  assigned_to   UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  closed_at     TIMESTAMPTZ
);

ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
SELECT add_updated_at_trigger('chat_sessions');

CREATE INDEX ON chat_sessions(customer_id);
CREATE INDEX ON chat_sessions(status, created_at DESC);

CREATE POLICY "chat_sessions_own" ON chat_sessions FOR SELECT
  USING (customer_id = auth.uid());
CREATE POLICY "chat_sessions_insert" ON chat_sessions FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' OR session_token IS NOT NULL);
CREATE POLICY "admin_all_chat_sessions" ON chat_sessions FOR ALL USING (is_admin());

-- ── chat_messages ─────────────────────────────────────────────
CREATE TABLE chat_messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  session_id  UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role        TEXT NOT NULL CHECK (role IN ('customer','admin','ai')),
  content     TEXT NOT NULL,
  -- Structured card responses (product suggestions, etc.)
  metadata    JSONB NOT NULL DEFAULT '{}'
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE INDEX ON chat_messages(session_id, created_at ASC);

CREATE POLICY "chat_messages_own" ON chat_messages FOR SELECT
  USING (
    session_id IN (
      SELECT id FROM chat_sessions WHERE customer_id = auth.uid()
    )
  );
CREATE POLICY "chat_messages_insert" ON chat_messages FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "admin_all_chat_messages" ON chat_messages FOR ALL USING (is_admin());

-- ── abandoned_cart_events ──────────────────────────────────────
-- Captured when a customer with items doesn't checkout in 1h
CREATE TABLE abandoned_cart_events (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  customer_id   UUID REFERENCES customers(id) ON DELETE SET NULL,
  cart_snapshot JSONB NOT NULL,   -- [{product_id, variant_id, qty, price}]
  cart_value    INTEGER NOT NULL, -- paise
  -- Recovery tracking
  email_sent_at TIMESTAMPTZ,
  whatsapp_sent_at TIMESTAMPTZ,
  recovered     BOOLEAN NOT NULL DEFAULT false,
  recovered_at  TIMESTAMPTZ,
  recovered_order_id UUID REFERENCES orders(id) ON DELETE SET NULL
);

ALTER TABLE abandoned_cart_events ENABLE ROW LEVEL SECURITY;

CREATE INDEX ON abandoned_cart_events(customer_id);
CREATE INDEX ON abandoned_cart_events(recovered, created_at DESC);

CREATE POLICY "abandoned_cart_own" ON abandoned_cart_events FOR SELECT
  USING (customer_id = auth.uid());
CREATE POLICY "admin_all_abandoned_cart" ON abandoned_cart_events FOR ALL USING (is_admin());

-- ── whatsapp_logs ──────────────────────────────────────────────
-- Record every WhatsApp message sent (order updates, recovery, promos)
CREATE TABLE whatsapp_logs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  customer_id   UUID REFERENCES customers(id) ON DELETE SET NULL,
  phone         TEXT NOT NULL,
  message_type  TEXT NOT NULL CHECK (message_type IN ('order_confirm','shipped','delivered','abandoned_cart','promo','otp')),
  template_name TEXT,
  payload       JSONB,          -- variables substituted into template
  status        TEXT NOT NULL DEFAULT 'queued'
    CHECK (status IN ('queued','sent','delivered','failed','read')),
  gateway_msg_id TEXT,          -- WhatsApp API message ID for receipt tracking
  error_message  TEXT,
  sent_at        TIMESTAMPTZ
);

ALTER TABLE whatsapp_logs ENABLE ROW LEVEL SECURITY;

CREATE INDEX ON whatsapp_logs(customer_id);
CREATE INDEX ON whatsapp_logs(status, created_at DESC);

CREATE POLICY "whatsapp_logs_own" ON whatsapp_logs FOR SELECT
  USING (customer_id = auth.uid());
CREATE POLICY "admin_all_whatsapp_logs" ON whatsapp_logs FOR ALL USING (is_admin());

-- ── customer_segments ─────────────────────────────────────────
CREATE TABLE customer_segments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  name        TEXT NOT NULL,
  description TEXT,
  -- JSON filter definition evaluated server-side to populate members
  -- e.g. {"min_orders": 3, "min_spent": 500000, "tag": "vip"}
  filter_rules JSONB NOT NULL DEFAULT '{}',
  is_dynamic  BOOLEAN NOT NULL DEFAULT true,   -- auto-refresh vs manual
  member_count INTEGER NOT NULL DEFAULT 0,
  last_synced_at TIMESTAMPTZ
);

ALTER TABLE customer_segments ENABLE ROW LEVEL SECURITY;
SELECT add_updated_at_trigger('customer_segments');

CREATE POLICY "admin_all_segments" ON customer_segments FOR ALL USING (is_admin());

-- ── customer_segment_members ──────────────────────────────────
CREATE TABLE customer_segment_members (
  segment_id  UUID NOT NULL REFERENCES customer_segments(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  added_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (segment_id, customer_id)
);

ALTER TABLE customer_segment_members ENABLE ROW LEVEL SECURITY;

CREATE INDEX ON customer_segment_members(customer_id);

CREATE POLICY "admin_all_segment_members" ON customer_segment_members FOR ALL USING (is_admin());

-- ── social_posts ──────────────────────────────────────────────
-- AI-generated social content (Instagram, WhatsApp broadcast)
CREATE TABLE social_posts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  platform      TEXT NOT NULL CHECK (platform IN ('instagram','whatsapp','facebook')),
  status        TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft','scheduled','published','failed')),
  caption       TEXT NOT NULL,
  hashtags      TEXT[] NOT NULL DEFAULT '{}',
  -- Asset references (Supabase Storage paths)
  image_urls    TEXT[] NOT NULL DEFAULT '{}',
  -- Scheduling
  scheduled_for TIMESTAMPTZ,
  published_at  TIMESTAMPTZ,
  -- Performance (filled post-publish)
  likes_count   INTEGER,
  reach_count   INTEGER,
  -- Link to product if this is a product post
  product_id    UUID REFERENCES products(id) ON DELETE SET NULL,
  -- AI generation metadata
  ai_prompt     TEXT,
  created_by    UUID REFERENCES admin_users(id) ON DELETE SET NULL
);

ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
SELECT add_updated_at_trigger('social_posts');

CREATE INDEX ON social_posts(status, scheduled_for);
CREATE INDEX ON social_posts(platform, published_at DESC);

CREATE POLICY "admin_all_social_posts" ON social_posts FOR ALL USING (is_admin());

-- ── ai_generated_images ────────────────────────────────────────
-- Tracks fal.ai flux-lora generations for Savinra product shoots
CREATE TABLE ai_generated_images (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  product_id    UUID REFERENCES products(id) ON DELETE SET NULL,
  -- Prompt used
  prompt        TEXT NOT NULL,
  lora_model    TEXT,              -- e.g. 'savinra-v1.2'
  -- Output
  storage_path  TEXT,             -- Supabase Storage path
  public_url    TEXT,
  width         INTEGER,
  height        INTEGER,
  -- Status
  status        TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','processing','done','failed')),
  fal_request_id TEXT,
  error_message  TEXT,
  -- Approved for use on site?
  is_approved   BOOLEAN NOT NULL DEFAULT false,
  approved_by   UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  approved_at   TIMESTAMPTZ,
  -- Approved image can be promoted to product_images
  promoted_to_product_image_id UUID REFERENCES product_images(id) ON DELETE SET NULL
);

ALTER TABLE ai_generated_images ENABLE ROW LEVEL SECURITY;

CREATE INDEX ON ai_generated_images(product_id);
CREATE INDEX ON ai_generated_images(status, created_at DESC);
CREATE INDEX ON ai_generated_images(is_approved);

CREATE POLICY "admin_all_ai_images" ON ai_generated_images FOR ALL USING (is_admin());

-- ── inventory_alerts ───────────────────────────────────────────
CREATE TABLE inventory_alerts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id  UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  alert_type  TEXT NOT NULL CHECK (alert_type IN ('low_stock','out_of_stock','restock')),
  threshold   INTEGER,       -- qty that triggered the alert
  current_qty INTEGER,
  is_resolved BOOLEAN NOT NULL DEFAULT false,
  resolved_at TIMESTAMPTZ,
  -- Notification tracking
  notified_admin_at TIMESTAMPTZ
);

ALTER TABLE inventory_alerts ENABLE ROW LEVEL SECURITY;

CREATE INDEX ON inventory_alerts(product_id, is_resolved);
CREATE INDEX ON inventory_alerts(alert_type, is_resolved);

CREATE POLICY "admin_all_inventory_alerts" ON inventory_alerts FOR ALL USING (is_admin());

-- Auto-create inventory alert when variant stock hits zero
CREATE OR REPLACE FUNCTION check_variant_stock()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.stock_count = 0 AND OLD.stock_count > 0 THEN
    INSERT INTO inventory_alerts (product_id, variant_id, alert_type, current_qty)
    VALUES (NEW.product_id, NEW.id, 'out_of_stock', 0);
  ELSIF NEW.stock_count > 0 AND NEW.stock_count <= 5 AND OLD.stock_count > 5 THEN
    INSERT INTO inventory_alerts (product_id, variant_id, alert_type, threshold, current_qty)
    VALUES (NEW.product_id, NEW.id, 'low_stock', 5, NEW.stock_count);
  ELSIF NEW.stock_count > 0 AND OLD.stock_count = 0 THEN
    INSERT INTO inventory_alerts (product_id, variant_id, alert_type, current_qty)
    VALUES (NEW.product_id, NEW.id, 'restock', NEW.stock_count);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER variant_stock_alert
  AFTER UPDATE OF stock_count ON product_variants
  FOR EACH ROW EXECUTE FUNCTION check_variant_stock();
