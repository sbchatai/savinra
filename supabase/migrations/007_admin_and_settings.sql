-- ============================================================
-- 007_admin_and_settings.sql
-- Store settings, FAQs, announcements, notification log
-- ============================================================

-- ── store_settings ────────────────────────────────────────────
-- Single-row config table. Enforced via CHECK (id = 1).
CREATE TABLE store_settings (
  id                    INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- General
  store_name            TEXT NOT NULL DEFAULT 'SAVINRA',
  store_email           TEXT NOT NULL DEFAULT 'hello@savinra.com',
  store_phone           TEXT,
  support_whatsapp      TEXT,          -- WhatsApp number with country code
  -- Shipping policy (paise)
  free_shipping_above   INTEGER NOT NULL DEFAULT 99900,  -- ₹999 default
  flat_shipping_rate    INTEGER NOT NULL DEFAULT 9900,   -- ₹99 default
  -- COD settings
  cod_enabled           BOOLEAN NOT NULL DEFAULT true,
  cod_max_order_value   INTEGER NOT NULL DEFAULT 500000, -- ₹5,000 max COD
  -- Taxes
  gst_rate_percent      NUMERIC(5,2) NOT NULL DEFAULT 5.00,
  gst_included_in_price BOOLEAN NOT NULL DEFAULT true,
  gst_number            TEXT,
  -- Razorpay config (key_id only — secret stays in Vault)
  razorpay_key_id       TEXT,
  -- Social
  instagram_handle      TEXT,
  facebook_url          TEXT,
  -- Meta / SEO
  meta_title            TEXT DEFAULT 'SAVINRA — Heritage Craft, Modern Silhouettes',
  meta_desc             TEXT DEFAULT 'Handcrafted Indo-Western fashion celebrating Indian artisanship.',
  og_image              TEXT,
  -- Maintenance mode
  maintenance_mode      BOOLEAN NOT NULL DEFAULT false,
  maintenance_message   TEXT
);

ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
SELECT add_updated_at_trigger('store_settings');

-- Seed with defaults
INSERT INTO store_settings DEFAULT VALUES;

-- Public can read non-sensitive settings
CREATE POLICY "settings_public_read" ON store_settings FOR SELECT USING (true);
CREATE POLICY "admin_all_settings"   ON store_settings FOR ALL USING (is_admin());

-- ── faq_items ─────────────────────────────────────────────────
CREATE TABLE faq_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  category    TEXT NOT NULL DEFAULT 'general'
    CHECK (category IN ('general','orders','shipping','returns','customization','payment','sizing')),
  question    TEXT NOT NULL,
  answer      TEXT NOT NULL,  -- Markdown supported
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT true
);

ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;
SELECT add_updated_at_trigger('faq_items');

CREATE INDEX ON faq_items(category, sort_order);

CREATE POLICY "faq_public_read" ON faq_items FOR SELECT USING (is_active = true);
CREATE POLICY "admin_all_faq"   ON faq_items FOR ALL USING (is_admin());

-- Seed commonly needed FAQs
INSERT INTO faq_items (category, question, answer, sort_order) VALUES
  ('shipping',      'How long does delivery take?',
   'Standard delivery takes 5–7 working days across India. Express delivery (3–5 days) is available for select pincodes.',
   1),
  ('shipping',      'Do you offer free shipping?',
   'Yes — free standard shipping on all orders above ₹999.',
   2),
  ('returns',       'What is your return policy?',
   'We accept returns within 7 days of delivery. Items must be unused, unwashed, and in original packaging.',
   1),
  ('customization', 'Can I get a custom size or monogram?',
   'Absolutely. Select "Customise" on any product page to add monogramming, custom measurements, or fabric requests. Turnaround time is 10–14 working days.',
   1),
  ('payment',       'What payment methods do you accept?',
   'UPI, Credit/Debit Cards (Visa, Mastercard, RuPay, Amex), Net Banking, and Cash on Delivery (orders up to ₹5,000).',
   1),
  ('orders',        'Can I change or cancel my order?',
   'Changes and cancellations are accepted within 2 hours of placing the order. Contact us on WhatsApp for fastest response.',
   1);

-- ── store_announcements ───────────────────────────────────────
-- Site-wide banners (sale, restock, shipping notice)
CREATE TABLE store_announcements (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  message     TEXT NOT NULL,
  link_text   TEXT,     -- CTA label, e.g. "Shop Now"
  link_url    TEXT,
  bg_color    TEXT NOT NULL DEFAULT '#D4AF37',   -- gold
  text_color  TEXT NOT NULL DEFAULT '#FFFFFF',
  is_active   BOOLEAN NOT NULL DEFAULT true,
  -- Display window
  show_from   TIMESTAMPTZ NOT NULL DEFAULT now(),
  show_until  TIMESTAMPTZ,   -- null = show indefinitely
  sort_order  INTEGER NOT NULL DEFAULT 0
);

ALTER TABLE store_announcements ENABLE ROW LEVEL SECURITY;
SELECT add_updated_at_trigger('store_announcements');

CREATE INDEX ON store_announcements(is_active, show_from, show_until);

CREATE POLICY "announcements_public_read" ON store_announcements FOR SELECT
  USING (
    is_active = true
    AND show_from <= now()
    AND (show_until IS NULL OR show_until > now())
  );
CREATE POLICY "admin_all_announcements" ON store_announcements FOR ALL USING (is_admin());

-- ── notification_logs ──────────────────────────────────────────
-- Central log for all outbound notifications (email, WhatsApp, push)
CREATE TABLE notification_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  channel         TEXT NOT NULL CHECK (channel IN ('email','whatsapp','sms','push')),
  recipient_id    UUID REFERENCES customers(id) ON DELETE SET NULL,
  recipient_email TEXT,
  recipient_phone TEXT,
  template_name   TEXT NOT NULL,
  subject         TEXT,              -- email subject
  -- Reference objects
  order_id        UUID REFERENCES orders(id) ON DELETE SET NULL,
  -- Delivery status
  status          TEXT NOT NULL DEFAULT 'queued'
    CHECK (status IN ('queued','sent','delivered','opened','clicked','failed','bounced')),
  provider_msg_id TEXT,              -- e.g. SendGrid message-id, WhatsApp msg-id
  error_message   TEXT,
  sent_at         TIMESTAMPTZ,
  delivered_at    TIMESTAMPTZ,
  opened_at       TIMESTAMPTZ
);

ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;

CREATE INDEX ON notification_logs(recipient_id, created_at DESC);
CREATE INDEX ON notification_logs(order_id);
CREATE INDEX ON notification_logs(status, channel, created_at DESC);

CREATE POLICY "notif_logs_own" ON notification_logs FOR SELECT
  USING (recipient_id = auth.uid());
CREATE POLICY "admin_all_notif_logs" ON notification_logs FOR ALL USING (is_admin());
