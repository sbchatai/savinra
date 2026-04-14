-- ============================================================
-- 003_catalog.sql
-- Collections, products, variants, customization options, reviews
-- ============================================================

-- ── collections ──────────────────────────────────────────────
CREATE TABLE collections (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  description   TEXT,
  cover_image   TEXT,
  occasion      TEXT,          -- festive / wedding / casual / work / party
  sort_order    INTEGER NOT NULL DEFAULT 0,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  meta_title    TEXT,
  meta_desc     TEXT
);

ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
SELECT add_updated_at_trigger('collections');

CREATE POLICY "collections_public_read"  ON collections FOR SELECT USING (is_active = true);
CREATE POLICY "admin_all_collections"    ON collections FOR ALL USING (is_admin());

-- ── products ──────────────────────────────────────────────────
CREATE TABLE products (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  name              TEXT NOT NULL,
  slug              TEXT NOT NULL UNIQUE,
  description       TEXT,
  fabric            TEXT,
  care_instructions TEXT,
  craft_story       TEXT,
  -- Pricing in paise (1 INR = 100 paise)
  price             INTEGER NOT NULL CHECK (price >= 0),
  compare_at_price  INTEGER CHECK (compare_at_price >= 0),
  -- Inventory
  in_stock          BOOLEAN NOT NULL DEFAULT true,
  stock_count       INTEGER NOT NULL DEFAULT 0,
  -- Flags
  is_new            BOOLEAN NOT NULL DEFAULT false,
  is_bestseller     BOOLEAN NOT NULL DEFAULT false,
  is_active         BOOLEAN NOT NULL DEFAULT true,
  -- Customization
  customizable      BOOLEAN NOT NULL DEFAULT false,
  -- Occasions
  occasions         TEXT[] NOT NULL DEFAULT '{}',
  tags              TEXT[] NOT NULL DEFAULT '{}',
  -- SEO
  meta_title        TEXT,
  meta_desc         TEXT,
  -- Soft delete
  deleted_at        TIMESTAMPTZ
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
SELECT add_updated_at_trigger('products');

-- Full-text search index
CREATE INDEX products_search_idx ON products
  USING GIN(to_tsvector('english', coalesce(name,'') || ' ' || coalesce(description,'') || ' ' || coalesce(craft_story,'')));

CREATE INDEX ON products(is_active, deleted_at);
CREATE INDEX ON products(is_bestseller);
CREATE INDEX ON products USING GIN(occasions);
CREATE INDEX ON products USING GIN(tags);

CREATE POLICY "products_public_read" ON products FOR SELECT
  USING (is_active = true AND deleted_at IS NULL);
CREATE POLICY "admin_all_products"   ON products FOR ALL USING (is_admin());

-- ── collection_products (junction) ───────────────────────────
CREATE TABLE collection_products (
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  product_id    UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (collection_id, product_id)
);

ALTER TABLE collection_products ENABLE ROW LEVEL SECURITY;

CREATE INDEX ON collection_products(product_id);

CREATE POLICY "collection_products_public_read" ON collection_products FOR SELECT USING (true);
CREATE POLICY "admin_all_collection_products"   ON collection_products FOR ALL USING (is_admin());

-- ── product_images ────────────────────────────────────────────
CREATE TABLE product_images (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  alt_text    TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_primary  BOOLEAN NOT NULL DEFAULT false
);

ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

CREATE INDEX ON product_images(product_id, sort_order);

CREATE POLICY "product_images_public_read" ON product_images FOR SELECT USING (true);
CREATE POLICY "admin_all_product_images"   ON product_images FOR ALL USING (is_admin());

-- ── product_variants (size/colour) ───────────────────────────
CREATE TABLE product_variants (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  product_id    UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size          TEXT NOT NULL,          -- XS / S / M / L / XL / XXL
  color         TEXT,
  sku           TEXT UNIQUE,
  stock_count   INTEGER NOT NULL DEFAULT 0,
  price_delta   INTEGER NOT NULL DEFAULT 0,  -- +/- paise from base price
  is_active     BOOLEAN NOT NULL DEFAULT true
);

ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
SELECT add_updated_at_trigger('product_variants');

CREATE INDEX ON product_variants(product_id);

CREATE POLICY "variants_public_read" ON product_variants FOR SELECT USING (is_active = true);
CREATE POLICY "admin_all_variants"   ON product_variants FOR ALL USING (is_admin());

-- ── product_customization_options ─────────────────────────────
CREATE TABLE product_customization_options (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  label       TEXT NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('text', 'select', 'color')),
  choices     TEXT[],          -- for select/color types
  max_length  INTEGER,         -- for text type
  is_required BOOLEAN NOT NULL DEFAULT false,
  sort_order  INTEGER NOT NULL DEFAULT 0
);

ALTER TABLE product_customization_options ENABLE ROW LEVEL SECURITY;

CREATE INDEX ON product_customization_options(product_id);

CREATE POLICY "customization_options_public_read" ON product_customization_options
  FOR SELECT USING (true);
CREATE POLICY "admin_all_customization_options" ON product_customization_options
  FOR ALL USING (is_admin());

-- ── product_reviews ───────────────────────────────────────────
CREATE TABLE product_reviews (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  product_id   UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  customer_id  UUID REFERENCES customers(id) ON DELETE SET NULL,
  -- Allow anonymous reviews (imported / from WhatsApp)
  reviewer_name     TEXT NOT NULL,
  reviewer_location TEXT,
  rating       INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body         TEXT NOT NULL,
  is_verified  BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT true
);

ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

CREATE INDEX ON product_reviews(product_id, is_published);
CREATE INDEX ON product_reviews(customer_id);

CREATE POLICY "reviews_public_read"  ON product_reviews FOR SELECT USING (is_published = true);
CREATE POLICY "reviews_insert_auth"  ON product_reviews FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "admin_all_reviews"    ON product_reviews FOR ALL USING (is_admin());
