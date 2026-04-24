-- ============================================================
-- 011_categories.sql
-- Product categories and subcategories with admin control
-- ============================================================

-- ── categories ────────────────────────────────────────────────
CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  cover_image TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  meta_title  TEXT,
  meta_desc   TEXT
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
SELECT add_updated_at_trigger('categories');

CREATE INDEX ON categories(is_active, sort_order);

CREATE POLICY "categories_public_read" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "admin_all_categories"   ON categories FOR ALL USING (is_admin());

-- ── subcategories ─────────────────────────────────────────────
CREATE TABLE subcategories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(category_id, slug)
);

ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
SELECT add_updated_at_trigger('subcategories');

CREATE INDEX ON subcategories(category_id, sort_order);

CREATE POLICY "subcategories_public_read" ON subcategories FOR SELECT USING (is_active = true);
CREATE POLICY "admin_all_subcategories"   ON subcategories FOR ALL USING (is_admin());

-- ── Add category/subcategory to products ──────────────────────
ALTER TABLE products
  ADD COLUMN category_id    UUID REFERENCES categories(id) ON DELETE SET NULL,
  ADD COLUMN subcategory_id UUID REFERENCES subcategories(id) ON DELETE SET NULL;

CREATE INDEX ON products(category_id);
CREATE INDEX ON products(subcategory_id);

-- ── Seed starter categories ───────────────────────────────────
INSERT INTO categories (name, slug, description, sort_order) VALUES
  ('Kurtas & Suits',    'kurtas-suits',    'Elegant kurtas and coordinated suits for every occasion', 1),
  ('Ethnic Wear',       'ethnic-wear',     'Traditional Indian ethnic clothing — sarees, lehengas, anarkalis', 2),
  ('Western Fusion',    'western-fusion',  'Indo-western styles that blend tradition with modernity', 3),
  ('Festive & Wedding', 'festive-wedding', 'Statement pieces for weddings, festivals and celebrations', 4),
  ('Casual & Everyday', 'casual-everyday', 'Comfortable everyday Indo-western styles', 5);

-- Subcategories for Kurtas & Suits
WITH cat AS (SELECT id FROM categories WHERE slug = 'kurtas-suits')
INSERT INTO subcategories (category_id, name, slug, sort_order)
SELECT cat.id, sub.name, sub.slug, sub.ord FROM cat,
(VALUES
  ('Straight Kurtas', 'straight-kurtas', 1),
  ('Anarkali Kurtas', 'anarkali-kurtas', 2),
  ('Kurta Sets',      'kurta-sets',      3),
  ('Palazzo Suits',   'palazzo-suits',   4)
) AS sub(name, slug, ord);

-- Subcategories for Ethnic Wear
WITH cat AS (SELECT id FROM categories WHERE slug = 'ethnic-wear')
INSERT INTO subcategories (category_id, name, slug, sort_order)
SELECT cat.id, sub.name, sub.slug, sub.ord FROM cat,
(VALUES
  ('Sarees',     'sarees',     1),
  ('Lehengas',   'lehengas',   2),
  ('Anarkalis',  'anarkalis',  3),
  ('Dupattas',   'dupattas',   4)
) AS sub(name, slug, ord);

-- Subcategories for Western Fusion
WITH cat AS (SELECT id FROM categories WHERE slug = 'western-fusion')
INSERT INTO subcategories (category_id, name, slug, sort_order)
SELECT cat.id, sub.name, sub.slug, sub.ord FROM cat,
(VALUES
  ('Fusion Tops',    'fusion-tops',    1),
  ('Dhoti Pants',    'dhoti-pants',    2),
  ('Cape Sets',      'cape-sets',      3),
  ('Co-ord Sets',    'coord-sets',     4)
) AS sub(name, slug, ord);
