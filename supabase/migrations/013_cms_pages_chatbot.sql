-- ============================================================
-- 013_cms_pages_chatbot.sql
-- CMS pages table, chatbot settings, hero CMS fields
-- ============================================================

-- 1. Add hero CMS fields to store_settings
ALTER TABLE store_settings
  ADD COLUMN IF NOT EXISTS hero_image             TEXT,
  ADD COLUMN IF NOT EXISTS hero_heading           TEXT DEFAULT 'House of Refined Living',
  ADD COLUMN IF NOT EXISTS hero_subheading        TEXT DEFAULT 'Spring · Summer 2026',
  ADD COLUMN IF NOT EXISTS hero_cta_primary_text  TEXT DEFAULT 'Shop Now',
  ADD COLUMN IF NOT EXISTS hero_cta_primary_url   TEXT DEFAULT '/shop',
  ADD COLUMN IF NOT EXISTS hero_cta_secondary_text TEXT DEFAULT 'Our Story',
  ADD COLUMN IF NOT EXISTS hero_cta_secondary_url  TEXT DEFAULT '/about';

-- 2. Static pages table
CREATE TABLE IF NOT EXISTS pages (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug       TEXT        NOT NULL UNIQUE,
  title      TEXT        NOT NULL,
  content    TEXT        NOT NULL DEFAULT '',
  meta_title TEXT,
  meta_desc  TEXT,
  is_active  BOOLEAN     NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pages_public_read" ON pages FOR SELECT USING (is_active = true);
CREATE POLICY "pages_admin_all"   ON pages FOR ALL TO service_role USING (true) WITH CHECK (true);

INSERT INTO pages (slug, title, content, meta_title, meta_desc) VALUES (
  'about',
  'About Savinra',
  E'Savinra is a contemporary Indo-Western fashion brand born at the intersection of India''s rich textile heritage and modern design sensibility.\n\nWe believe that Indian women deserve clothing that honours their roots while celebrating the woman they are today — confident, stylish, and unapologetically modern. Our collections blend traditional weaves, hand-block prints, and artisanal embroideries with contemporary cuts and silhouettes that move effortlessly between boardrooms, celebrations, and quiet afternoons.\n\nEvery Savinra piece is designed in India, crafted with intention, and built to last — because style should never come at the cost of the planet or the people who make it.\n\n## Our Design Philosophy\n\nIndian fabrics have centuries of wisdom woven into them. Chanderi''s gossamer silk, Jaipur''s bold block prints, Lucknow''s delicate chikankari — these are not just textiles; they are living traditions. We work directly with regional artisans and weavers to bring these fabrics into contemporary shapes that feel entirely of this moment.\n\nThe result: pieces that look like no one else''s, feel extraordinary to wear, and carry a story worth telling.\n\n## What We Stand For\n\n**Craft over fast fashion.** Every design goes through dozens of iterations before it reaches you.\n\n**Sustainability at every step.** Natural fibres, low-impact dyes, plastic-free packaging.\n\n**Fair wages, always.** We pay artisans above market rate and maintain long-term relationships with our makers.\n\n**Fit for real women.** Our sizes run XS to XXL with detailed size guides and free alterations on select styles.',
  'About Savinra — Our Story & Design Philosophy',
  'Savinra is a contemporary Indo-Western fashion brand blending India''s textile heritage with modern design. Learn about our story, values, and craft philosophy.'
) ON CONFLICT (slug) DO NOTHING;

-- 3. Chatbot settings (singleton)
CREATE TABLE IF NOT EXISTS chatbot_settings (
  id                INTEGER     PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  is_enabled        BOOLEAN     NOT NULL DEFAULT true,
  greeting_message  TEXT        NOT NULL DEFAULT 'Hi! Welcome to Savinra 👋 How can I help you today?',
  fallback_message  TEXT        NOT NULL DEFAULT 'I''m not sure about that. Let me connect you with our team on WhatsApp!',
  handoff_message   TEXT        NOT NULL DEFAULT 'Chat with us directly for personalised assistance.',
  whatsapp_number   TEXT        NOT NULL DEFAULT '919876543210',
  knowledge_base    JSONB       NOT NULL DEFAULT '[]'::JSONB,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE chatbot_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "chatbot_public_read" ON chatbot_settings FOR SELECT USING (true);
CREATE POLICY "chatbot_admin_all"   ON chatbot_settings FOR ALL TO service_role USING (true) WITH CHECK (true);

INSERT INTO chatbot_settings (id, knowledge_base) VALUES (1,
  '[
    {"id":"1","keywords":["shipping","delivery","ship","deliver"],"answer":"We offer free shipping on orders above ₹999. Standard delivery takes 5–7 business days across India."},
    {"id":"2","keywords":["return","exchange","refund"],"answer":"We have a hassle-free 15-day return policy. Items must be unworn and in original packaging."},
    {"id":"3","keywords":["size","sizing","fit","measurement"],"answer":"We offer sizes XS to XXL. Check our detailed size guide on each product page or in the Help section."},
    {"id":"4","keywords":["customise","customization","monogram","personalise","personalize"],"answer":"Many of our pieces can be personalised with monograms or custom details. Look for the customisation option on each product page."},
    {"id":"5","keywords":["payment","pay","cod","cash","upi","card"],"answer":"We accept UPI, credit/debit cards, net banking, and Cash on Delivery (COD) up to ₹5000."},
    {"id":"6","keywords":["track","order","status","where is"],"answer":"Log into your account and go to My Orders to track your order in real-time."},
    {"id":"7","keywords":["fabric","material","cotton","silk","linen","natural"],"answer":"We use premium natural fibres — organic cotton, pure silk, linen, and handwoven fabrics sourced from certified artisan cooperatives."}
  ]'::JSONB
) ON CONFLICT DO NOTHING;
