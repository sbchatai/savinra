-- ============================================================
-- 008_storage_buckets.sql
-- Supabase Storage buckets for product images and brand assets
-- ============================================================

-- ── Buckets ───────────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  (
    'product-images',
    'product-images',
    true,
    10485760,   -- 10 MB
    ARRAY['image/jpeg', 'image/png', 'image/webp']
  ),
  (
    'brand-assets',
    'brand-assets',
    true,
    5242880,    -- 5 MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
  )
ON CONFLICT (id) DO NOTHING;

-- ── product-images policies ───────────────────────────────────
CREATE POLICY "product_images_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "product_images_admin_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images' AND is_admin());

CREATE POLICY "product_images_admin_update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-images' AND is_admin());

CREATE POLICY "product_images_admin_delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images' AND is_admin());

-- ── brand-assets policies ─────────────────────────────────────
CREATE POLICY "brand_assets_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'brand-assets');

CREATE POLICY "brand_assets_admin_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'brand-assets' AND is_admin());

CREATE POLICY "brand_assets_admin_update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'brand-assets' AND is_admin());

CREATE POLICY "brand_assets_admin_delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'brand-assets' AND is_admin());
