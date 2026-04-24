-- ============================================================
-- 012_customization_price_delta.sql
-- Add extra-charge field to customization options
-- ============================================================

ALTER TABLE product_customization_options
  ADD COLUMN IF NOT EXISTS price_delta INTEGER NOT NULL DEFAULT 0;

COMMENT ON COLUMN product_customization_options.price_delta IS
  'Extra charge in paise (1 INR = 100 paise) for this customization option. 0 = included free.';
