-- ============================================================
-- 009_seed_data.sql
-- Sample products, collections, coupons, and announcements
-- Idempotent: uses DO $$ blocks with conflict guards
-- ============================================================

-- ── Collections ───────────────────────────────────────────────
INSERT INTO collections (name, slug, description, occasion, sort_order, is_active, cover_image)
VALUES
  (
    'Festive Edit',
    'festive-edit',
    'Handcrafted pieces that honour every celebration — from Diwali diyas to the joy of Eid. Rich fabrics, artisan embroidery, and silhouettes that move beautifully.',
    'festive',
    1,
    true,
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=600&auto=format&fit=crop&q=80'
  ),
  (
    'Wedding Season',
    'wedding-season',
    'For every role at the shaadi — from the bride''s best friend to the distant aunt who must look her best. Luxe fabrics, considered details.',
    'wedding',
    2,
    true,
    'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&h=600&auto=format&fit=crop&q=80'
  ),
  (
    'Everyday Luxe',
    'everyday-luxe',
    'Because you deserve to feel beautiful on a Tuesday. Breathable fabrics and effortless silhouettes designed for the modern Indian woman.',
    'casual',
    3,
    true,
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=600&auto=format&fit=crop&q=80'
  )
ON CONFLICT (slug) DO NOTHING;

-- ── Products ──────────────────────────────────────────────────
DO $$
DECLARE
  p1_id UUID; p2_id UUID; p3_id UUID; p4_id UUID;
  p5_id UUID; p6_id UUID; p7_id UUID; p8_id UUID;
  c_festive UUID; c_wedding UUID; c_everyday UUID;
BEGIN

-- Get collection IDs
SELECT id INTO c_festive  FROM collections WHERE slug = 'festive-edit';
SELECT id INTO c_wedding  FROM collections WHERE slug = 'wedding-season';
SELECT id INTO c_everyday FROM collections WHERE slug = 'everyday-luxe';

-- ── Product 1: Chanderi Anarkali Set ─────────────────────────
INSERT INTO products (name, slug, description, fabric, care_instructions, craft_story,
  price, compare_at_price, is_new, is_bestseller, is_active, customizable,
  occasions, tags, in_stock, stock_count)
VALUES (
  'Chanderi Anarkali Set',
  'chanderi-anarkali-set',
  'A floor-length Anarkali in pure Chanderi silk, paired with matching palazzo pants and a sheer dupatta. The kurta features hand-block printed motifs along the hem and cuffs, lending it an heirloom quality that transcends seasons.',
  'Pure Chanderi Silk, Georgette Dupatta',
  'Dry clean recommended. Store folded, away from direct sunlight. Iron on low heat with a pressing cloth.',
  'Woven by master weavers in Chanderi, Madhya Pradesh — a craft tradition spanning over 700 years. Each metre of Chanderi takes 2–3 days to weave by hand.',
  389900, 489900, true, true, true, true,
  ARRAY['festive', 'wedding'], ARRAY['anarkali', 'chanderi', 'silk', 'embroidered', 'handcrafted'],
  true, 12
)
ON CONFLICT (slug) DO NOTHING
RETURNING id INTO p1_id;

IF p1_id IS NULL THEN SELECT id INTO p1_id FROM products WHERE slug = 'chanderi-anarkali-set'; END IF;

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary) VALUES
  (p1_id, 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=1067&auto=format&fit=crop&q=80', 'Chanderi Anarkali Set — front view', 0, true),
  (p1_id, 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&h=1067&auto=format&fit=crop&q=80', 'Chanderi Anarkali Set — detail', 1, false),
  (p1_id, 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1067&auto=format&fit=crop&q=80', 'Chanderi Anarkali Set — full look', 2, false)
ON CONFLICT DO NOTHING;

INSERT INTO product_variants (product_id, size, stock_count, price_delta) VALUES
  (p1_id, 'XS', 2, 0), (p1_id, 'S', 4, 0), (p1_id, 'M', 4, 0),
  (p1_id, 'L', 3, 0), (p1_id, 'XL', 2, 0), (p1_id, 'XXL', 1, 0)
ON CONFLICT DO NOTHING;

INSERT INTO product_customization_options (product_id, label, type, is_required, sort_order) VALUES
  (p1_id, 'Monogram Initials', 'text', false, 1),
  (p1_id, 'Blouse Length', 'select', false, 2)
ON CONFLICT DO NOTHING;

-- ── Product 2: Bandhani Wrap Co-ord ──────────────────────────
INSERT INTO products (name, slug, description, fabric, care_instructions, craft_story,
  price, compare_at_price, is_new, is_bestseller, is_active, customizable,
  occasions, tags, in_stock, stock_count)
VALUES (
  'Bandhani Wrap Co-ord',
  'bandhani-wrap-coord',
  'A two-piece co-ord set featuring a wrap-style crop top and wide-leg palazzo in traditional Bandhani tie-dye. The indigo and ivory pattern is achieved through thousands of tiny hand-tied knots — no two pieces are identical.',
  'Cotton Bandhani, Lining: Pure Cotton',
  'Hand wash in cold water separately. Do not wring. Dry in shade. Iron on medium heat.',
  'Crafted by Khatri artisans in Kutch, Gujarat — custodians of a 500-year-old tie-dye tradition. Each garment takes 3–5 days to hand-tie before dyeing.',
  228900, 289900, true, false, true, false,
  ARRAY['casual', 'festive'], ARRAY['bandhani', 'co-ord', 'cotton', 'tie-dye', 'kutch'],
  true, 18
)
ON CONFLICT (slug) DO NOTHING
RETURNING id INTO p2_id;

IF p2_id IS NULL THEN SELECT id INTO p2_id FROM products WHERE slug = 'bandhani-wrap-coord'; END IF;

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary) VALUES
  (p2_id, 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800&h=1067&auto=format&fit=crop&q=80', 'Bandhani Wrap Co-ord — front', 0, true),
  (p2_id, 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=1067&auto=format&fit=crop&q=80', 'Bandhani Wrap Co-ord — side', 1, false),
  (p2_id, 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&h=1067&auto=format&fit=crop&q=80', 'Bandhani Wrap Co-ord — detail', 2, false)
ON CONFLICT DO NOTHING;

INSERT INTO product_variants (product_id, size, stock_count, price_delta) VALUES
  (p2_id, 'XS', 3, 0), (p2_id, 'S', 5, 0), (p2_id, 'M', 5, 0),
  (p2_id, 'L', 4, 0), (p2_id, 'XL', 3, 0), (p2_id, 'XXL', 2, 0)
ON CONFLICT DO NOTHING;

-- ── Product 3: Silk Blend Palazzo Set ────────────────────────
INSERT INTO products (name, slug, description, fabric, care_instructions,
  price, compare_at_price, is_new, is_bestseller, is_active, customizable,
  occasions, tags, in_stock, stock_count)
VALUES (
  'Silk Blend Palazzo Set',
  'silk-blend-palazzo-set',
  'A relaxed yet refined straight-cut kurta paired with wide-leg palazzo pants in a rich silk blend. Subtle self-weave texture catches light elegantly — perfect for office celebrations or family brunches.',
  'Silk Blend (60% Silk, 40% Viscose)',
  'Dry clean only. Store on a hanger. Avoid perfume contact.',
  279900, 349900, false, true, true, false,
  ARRAY['work', 'casual', 'festive'], ARRAY['palazzo', 'silk', 'kurta', 'office-wear'],
  true, 20
)
ON CONFLICT (slug) DO NOTHING
RETURNING id INTO p3_id;

IF p3_id IS NULL THEN SELECT id INTO p3_id FROM products WHERE slug = 'silk-blend-palazzo-set'; END IF;

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary) VALUES
  (p3_id, 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=1067&auto=format&fit=crop&q=80', 'Silk Blend Palazzo Set — front', 0, true),
  (p3_id, 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1067&auto=format&fit=crop&q=80', 'Silk Blend Palazzo Set — full look', 1, false),
  (p3_id, 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1067&auto=format&fit=crop&q=80', 'Silk Blend Palazzo Set — styled', 2, false)
ON CONFLICT DO NOTHING;

INSERT INTO product_variants (product_id, size, stock_count, price_delta) VALUES
  (p3_id, 'S', 5, 0), (p3_id, 'M', 6, 0), (p3_id, 'L', 5, 0),
  (p3_id, 'XL', 3, 0), (p3_id, 'XXL', 2, 0)
ON CONFLICT DO NOTHING;

-- ── Product 4: Georgette Sharara Set ─────────────────────────
INSERT INTO products (name, slug, description, fabric, care_instructions, craft_story,
  price, compare_at_price, is_new, is_bestseller, is_active, customizable,
  occasions, tags, in_stock, stock_count)
VALUES (
  'Georgette Sharara Set',
  'georgette-sharara-set',
  'Flared sharara trousers paired with an embellished short kurta and gossamer dupatta — all in weightless georgette. Mirror work and zari embroidery on the kurta hem give it a festive brilliance without the heaviness.',
  'Georgette with Zari Embroidery, Mirror Work',
  'Dry clean only. Handle dupatta gently. Store folded in tissue paper.',
  'The mirror work (shisha) is done by artisans in Rajasthan using hand-cut mirrors individually stitched with a crewel needle — a process unchanged for three centuries.',
  349900, 429900, false, true, true, true,
  ARRAY['wedding', 'festive'], ARRAY['sharara', 'georgette', 'embroidered', 'mirror-work', 'zari'],
  true, 8
)
ON CONFLICT (slug) DO NOTHING
RETURNING id INTO p4_id;

IF p4_id IS NULL THEN SELECT id INTO p4_id FROM products WHERE slug = 'georgette-sharara-set'; END IF;

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary) VALUES
  (p4_id, 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&h=1067&auto=format&fit=crop&q=80', 'Georgette Sharara Set — front', 0, true),
  (p4_id, 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=1067&auto=format&fit=crop&q=80', 'Georgette Sharara Set — detail', 1, false),
  (p4_id, 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=1067&auto=format&fit=crop&q=80', 'Georgette Sharara Set — full look', 2, false)
ON CONFLICT DO NOTHING;

INSERT INTO product_variants (product_id, size, stock_count, price_delta) VALUES
  (p4_id, 'XS', 1, 0), (p4_id, 'S', 3, 0), (p4_id, 'M', 3, 0),
  (p4_id, 'L', 2, 0), (p4_id, 'XL', 1, 0)
ON CONFLICT DO NOTHING;

INSERT INTO product_customization_options (product_id, label, type, is_required, sort_order) VALUES
  (p4_id, 'Blouse Size', 'text', true, 1)
ON CONFLICT DO NOTHING;

-- ── Product 5: Ikat Straight Kurta ───────────────────────────
INSERT INTO products (name, slug, description, fabric, care_instructions,
  price, compare_at_price, is_new, is_bestseller, is_active, customizable,
  occasions, tags, in_stock, stock_count)
VALUES (
  'Ikat Straight Kurta',
  'ikat-straight-kurta',
  'A relaxed straight-cut kurta in handloom Ikat cotton — the geometric pattern is woven directly into the fabric, not printed. Worn with jeans or churidar, it adapts effortlessly from boardroom to weekend market.',
  'Handloom Ikat Cotton',
  'Machine wash cold, gentle cycle. Tumble dry low. Iron on medium.',
  189900, 239900, false, false, true, false,
  ARRAY['casual', 'work'], ARRAY['ikat', 'handloom', 'cotton', 'straight-kurta', 'everyday'],
  true, 25
)
ON CONFLICT (slug) DO NOTHING
RETURNING id INTO p5_id;

IF p5_id IS NULL THEN SELECT id INTO p5_id FROM products WHERE slug = 'ikat-straight-kurta'; END IF;

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary) VALUES
  (p5_id, 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&h=1067&auto=format&fit=crop&q=80', 'Ikat Straight Kurta — front', 0, true),
  (p5_id, 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=1067&auto=format&fit=crop&q=80', 'Ikat Straight Kurta — side', 1, false),
  (p5_id, 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800&h=1067&auto=format&fit=crop&q=80', 'Ikat Straight Kurta — casual styled', 2, false)
ON CONFLICT DO NOTHING;

INSERT INTO product_variants (product_id, size, stock_count, price_delta) VALUES
  (p5_id, 'XS', 4, 0), (p5_id, 'S', 6, 0), (p5_id, 'M', 7, 0),
  (p5_id, 'L', 5, 0), (p5_id, 'XL', 3, 0)
ON CONFLICT DO NOTHING;

-- ── Product 6: Printed Modal Kaftan ──────────────────────────
INSERT INTO products (name, slug, description, fabric, care_instructions,
  price, compare_at_price, is_new, is_bestseller, is_active, customizable,
  occasions, tags, in_stock, stock_count)
VALUES (
  'Printed Modal Kaftan',
  'printed-modal-kaftan',
  'A flowy kaftan in buttery modal fabric with a large-scale floral block print in terracotta and sage. One size fits most — the generous silhouette is intentional, creating an effortless drape without a belt.',
  'Modal (100%), Block Printed',
  'Machine wash cold, inside out. Do not tumble dry. Iron on low.',
  219900, 279900, true, false, true, false,
  ARRAY['casual'], ARRAY['kaftan', 'modal', 'block-print', 'floral', 'loungewear'],
  true, 15
)
ON CONFLICT (slug) DO NOTHING
RETURNING id INTO p6_id;

IF p6_id IS NULL THEN SELECT id INTO p6_id FROM products WHERE slug = 'printed-modal-kaftan'; END IF;

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary) VALUES
  (p6_id, 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=1067&auto=format&fit=crop&q=80', 'Printed Modal Kaftan — front', 0, true),
  (p6_id, 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1067&auto=format&fit=crop&q=80', 'Printed Modal Kaftan — styled', 1, false),
  (p6_id, 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1067&auto=format&fit=crop&q=80', 'Printed Modal Kaftan — detail', 2, false)
ON CONFLICT DO NOTHING;

INSERT INTO product_variants (product_id, size, stock_count, price_delta) VALUES
  (p6_id, 'S', 5, 0), (p6_id, 'M', 5, 0), (p6_id, 'L', 5, 0)
ON CONFLICT DO NOTHING;

-- ── Product 7: Leheriya Wrap Dress ───────────────────────────
INSERT INTO products (name, slug, description, fabric, care_instructions, craft_story,
  price, compare_at_price, is_new, is_bestseller, is_active, customizable,
  occasions, tags, in_stock, stock_count)
VALUES (
  'Leheriya Wrap Dress',
  'leheriya-wrap-dress',
  'A contemporary midi wrap dress in Rajasthani Leheriya — diagonal wave stripes in sunset colours created by resist-dyeing rolled fabric. The silhouette is decidedly modern; the craft is centuries old.',
  'Georgette Leheriya',
  'Dry clean recommended. Or hand wash very gently in cold water.',
  'Leheriya is dyed by rolling fabric diagonally and tying it at intervals before dyeing — producing the characteristic diagonal stripes. Made exclusively in Jaipur.',
  259900, 329900, true, false, true, false,
  ARRAY['festive', 'casual', 'party'], ARRAY['leheriya', 'wrap-dress', 'rajasthani', 'tie-dye', 'midi'],
  true, 10
)
ON CONFLICT (slug) DO NOTHING
RETURNING id INTO p7_id;

IF p7_id IS NULL THEN SELECT id INTO p7_id FROM products WHERE slug = 'leheriya-wrap-dress'; END IF;

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary) VALUES
  (p7_id, 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&h=1067&auto=format&fit=crop&q=80', 'Leheriya Wrap Dress — front', 0, true),
  (p7_id, 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=1067&auto=format&fit=crop&q=80', 'Leheriya Wrap Dress — styled', 1, false),
  (p7_id, 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800&h=1067&auto=format&fit=crop&q=80', 'Leheriya Wrap Dress — detail', 2, false)
ON CONFLICT DO NOTHING;

INSERT INTO product_variants (product_id, size, stock_count, price_delta) VALUES
  (p7_id, 'XS', 2, 0), (p7_id, 'S', 3, 0), (p7_id, 'M', 3, 0),
  (p7_id, 'L', 2, 0), (p7_id, 'XL', 1, 0)
ON CONFLICT DO NOTHING;

-- ── Product 8: Phulkari Jacket ────────────────────────────────
INSERT INTO products (name, slug, description, fabric, care_instructions, craft_story,
  price, compare_at_price, is_new, is_bestseller, is_active, customizable,
  occasions, tags, in_stock, stock_count)
VALUES (
  'Phulkari Embroidered Jacket',
  'phulkari-embroidered-jacket',
  'A versatile structured jacket in natural khaddar fabric, densely embroidered in Phulkari style — vibrant silk threads forming flower motifs across the entire surface. Pairs beautifully over a kurta, dress, or even jeans.',
  'Khaddar base, Silk thread Phulkari embroidery',
  'Dry clean only. Avoid heavy folding — store flat or on a hanger.',
  'Phulkari (literally "flower work") is Punjab''s most celebrated embroidery tradition. Each jacket takes a skilled craftwoman 15–20 hours to complete.',
  428900, 529900, false, true, true, true,
  ARRAY['festive', 'wedding', 'party'], ARRAY['phulkari', 'jacket', 'embroidered', 'punjabi', 'khaddar'],
  true, 6
)
ON CONFLICT (slug) DO NOTHING
RETURNING id INTO p8_id;

IF p8_id IS NULL THEN SELECT id INTO p8_id FROM products WHERE slug = 'phulkari-embroidered-jacket'; END IF;

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary) VALUES
  (p8_id, 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&h=1067&auto=format&fit=crop&q=80', 'Phulkari Jacket — front', 0, true),
  (p8_id, 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=1067&auto=format&fit=crop&q=80', 'Phulkari Jacket — back', 1, false),
  (p8_id, 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1067&auto=format&fit=crop&q=80', 'Phulkari Jacket — detail', 2, false)
ON CONFLICT DO NOTHING;

INSERT INTO product_variants (product_id, size, stock_count, price_delta) VALUES
  (p8_id, 'XS', 1, 0), (p8_id, 'S', 2, 0), (p8_id, 'M', 2, 0),
  (p8_id, 'L', 1, 0), (p8_id, 'XL', 1, 0)
ON CONFLICT DO NOTHING;

INSERT INTO product_customization_options (product_id, label, type, choices, is_required, sort_order) VALUES
  (p8_id, 'Thread Colour Palette', 'select', ARRAY['Traditional Multi', 'Ivory & Gold', 'Blues & Teals'], false, 1)
ON CONFLICT DO NOTHING;

-- ── Collection — Product assignments ──────────────────────────
INSERT INTO collection_products (collection_id, product_id, sort_order)
VALUES
  (c_festive, p1_id, 1), (c_festive, p2_id, 2), (c_festive, p4_id, 3),
  (c_festive, p7_id, 4), (c_festive, p8_id, 5),
  (c_wedding, p1_id, 1), (c_wedding, p4_id, 2), (c_wedding, p8_id, 3),
  (c_everyday, p2_id, 1), (c_everyday, p3_id, 2), (c_everyday, p5_id, 3),
  (c_everyday, p6_id, 4), (c_everyday, p7_id, 5)
ON CONFLICT DO NOTHING;

-- ── Reviews (sample) ─────────────────────────────────────────
INSERT INTO product_reviews (product_id, reviewer_name, reviewer_location, rating, body, is_verified, is_published)
VALUES
  (p1_id, 'Priya Mehta', 'Mumbai', 5, 'Absolutely stunning quality. The Chanderi fabric is so soft and the embroidery is exquisite. Wore it to a family puja and received so many compliments. Worth every rupee.', true, true),
  (p1_id, 'Ananya Singh', 'Delhi', 5, 'Ordered for my cousin''s wedding. The colour is even more beautiful in person. Delivery was fast and packaging was gorgeous.', true, true),
  (p2_id, 'Kavya Reddy', 'Hyderabad', 4, 'Love the Bandhani pattern — no two pieces are the same which is so special. The crop top fits perfectly. Only wish the palazzo came in a longer length.', true, true),
  (p4_id, 'Meera Joshi', 'Pune', 5, 'The mirror work is incredible. I wore this to a Sangeet and felt like a princess. Savinra truly understands craft.', false, true),
  (p8_id, 'Tanisha Kapoor', 'Bengaluru', 5, 'The Phulkari jacket is a work of art. I''ve been wearing it over everything — jeans, kurtas, even western dresses. It elevates every outfit.', true, true),
  (p3_id, 'Ritu Sharma', 'Jaipur', 4, 'Perfect for office wear. The silk blend is comfortable even in AC. Colour is rich and the fit is flattering.', true, true)
ON CONFLICT DO NOTHING;

END $$;

-- ── Coupons ───────────────────────────────────────────────────
INSERT INTO coupons (code, description, type, value, min_order_value, usage_limit, is_active, valid_from)
VALUES
  (
    'WELCOME10',
    'Welcome discount — 10% off your first order',
    'percentage', 10, 0, 1000, true, now()
  ),
  (
    'FESTIVE20',
    'Festive season offer — 20% off orders above ₹2,000',
    'percentage', 20, 200000, 500, true, now()
  ),
  (
    'FLAT500',
    'Flat ₹500 off on orders above ₹3,000',
    'fixed', 50000, 300000, NULL, true, now()
  )
ON CONFLICT (code) DO NOTHING;

-- ── Announcement ─────────────────────────────────────────────
INSERT INTO store_announcements (message, link_text, link_url, is_active, show_from)
VALUES (
  'Free shipping on all orders above ₹999',
  'Shop Now',
  '/collections',
  true,
  now()
)
ON CONFLICT DO NOTHING;
