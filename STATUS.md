# SAVINRA — Project Status

> This file is updated at the end of every session.
> A new Claude Code session MUST read this file before doing anything.

---

## Quick State

| Field | Value |
|---|---|
| Current phase | Phase 1c — Store wired to Supabase |
| Current stage | 🔄 Store pages done. Admin Products CRUD NEXT |
| Last session | 2026-04-19 |
| GitHub repo | https://github.com/sbchatai/savinra (branch: main) |
| Live preview | https://savinra-store.vercel.app (auto-deploys on push to main) |
| Last commit | 34d6790 — feat: wire all store pages to real Supabase data |
| Supabase project | rzknetoapokbwmyhvqac (ap-south-1, Mumbai) |
| Supabase URL | https://rzknetoapokbwmyhvqac.supabase.co |
| Local path | D:/ai-lab/projects/savinra/ |

---

## ⚠️ PUSH TO GITHUB FIRST

The repo has local commits not yet pushed. Run this after getting the PAT:
```
GIT_CONFIG_NOSYSTEM=1 git -c "http.extraheader=Authorization: Basic <base64(x-access-token:PAT)>" push origin main
```
Or ask Sunil to push manually.

---

## What was completed (cumulative)

### Session 1 (2026-04-12/13) — Phase 0 Setup ✅
- Scope locked, brand kit, monorepo scaffold, Supabase project, GitHub repo

### Session 2 (2026-04-13/14) — Phase 1a UI ✅
- Agent team (8 agents in ~/.claude/agents/), skills installed, AGENTS.md
- 14-screen premium store UI built and deployed to Vercel
- SVG logo wired, broken images fixed, auto-deploy via GitHub

### Session 3 (2026-04-14) — Phase 1b Backend ✅
- Migrations 001–007: 35 tables with RLS + triggers (all live in Supabase)
- TypeScript types generated (57KB database.ts)
- Admin panel scaffold (apps/admin, 8 pages)
- Razorpay webhook Edge Function

### Session 5 (2026-04-19) — Phase 1c Store Wiring ✅
- **Store pages wired to Supabase**:
  - `HomePage`: Collections grid + Best sellers + New arrivals from DB
  - `ShopPage`: Switched from placeholder → `useProducts` hook + `LiveProductCard`
  - `CheckoutPage`: Auth guard + real order insert to `orders`/`order_items`
  - `OrderConfirmationPage`: Live product recommendations from DB
  - `CartContext`: Added `variantId` field
  - Deleted stale `ProductCard.tsx` placeholder
- **Token tracker**: `~/.claude/token-tracker/` set up — `node cost.js` for reports
- **Memory**: Saved tool access (GitHub PAT, Notion, Supabase, Vercel MCP) to memory
- **Committed**: `34d6790` ✅
- **Migrations 008–009**: Storage buckets (product-images, brand-assets) + seed data
  - 3 collections, 8 real products with craft stories, variants, images, reviews
  - 3 coupons: WELCOME10, FESTIVE20, FLAT500
  - 1 announcement: "Free shipping above ₹999"
- **Edge Functions**:
  - `create-razorpay-order`: full order creation, coupon validation, COD support
  - `send-whatsapp`: WATI API with whatsapp_logs tracking
- **Store auth layer**:
  - `AuthContext` — Supabase session + customer row + modal control
  - `AuthModal` — sign in / sign up / forgot password
  - `UserMenu` — avatar dropdown (orders, wishlist, profile, sign out)
  - `apps/store/src/lib/supabase.ts` — typed client
  - `App.tsx` — wrapped with AuthProvider + AuthModal
- **Store data hooks**:
  - `useProducts(filters)` — filtered listing with primary image
  - `useCollections()` — active collections
  - `useProduct(slug)` — full detail with images, variants, reviews
- **HomePage**: Collections grid (useCollections), Best sellers (useProducts), New arrivals (useProducts) ✅
  - **CollectionDetailPage**: Already wired to useCollections + useProducts({ collection_slug }) ✅
  - **ProductDetailPage**: Already wired to useProduct(slug) ✅
  - **ShopPage**: Switched from PRODUCTS placeholder → useProducts hook + LiveProductCard ✅
  - **CartPage**: Already using LiveProductCard + useProducts ✅
  - **OrderConfirmationPage**: Switched from PRODUCTS → useProducts({ is_new: true }) ✅
  - **SavinraHeader**: UserMenu component already present ✅
  - **CheckoutPage**: Auth guard (redirects to sign-in if not logged in) + real order insert to `orders` + `order_items` tables ✅
  - **CartContext**: Added `variantId` field to CartItem interface ✅
- **Committed**: `9e78a4f` (not yet pushed to GitHub) — superseded by this session

### Session 6 (2026-04-19) — Admin Products CRUD ✅
- **ProductFormPage fully built**:
  - Image uploader: drag & drop → Supabase Storage `product-images` bucket, multi-image with primary selection, alt text, delete
  - Variants editor: size/color/SKU/stock/price delta with add/remove, synced to `product_variants` table
  - Collection multi-select: live from DB, pill toggles
  - Craft story textarea added
  - `in_stock` and `customizable` toggles added
  - All fields save/upsert to Supabase on submit
- **ProductsPage**: All/Active/Inactive filter tabs, inline activate/deactivate, soft-delete with confirm
- **SettingsPage**: Fixed all DB column name mismatches (`store_email`, `store_phone`, `support_whatsapp`, `instagram_handle`, `gst_rate_percent`, `show_from`/`show_until`, `phone` not `recipient_phone`)
- **tsconfig**: Added `vite/client` types to fix `ImportMeta.env` TS errors
- **Committed + pushed**: `00db24d` ✅

---

## 🔥 NEXT SESSION — Start here

### Priority 1: Admin Collections + Coupons pages

Create `apps/admin/src/pages/CollectionsPage.tsx` + `CollectionFormModal.tsx`:
- List all collections from DB, add/edit/delete, cover image upload to `brand-assets`
- Assign products to collections

Create `apps/admin/src/pages/CouponsPage.tsx` + `CouponFormModal.tsx`:
- List all coupons from DB, add/edit/delete with code, discount type, min order, expiry
- Toggle active inline

Add routes + nav items in App.tsx + AdminLayout.tsx.

### Priority 2: Phase 1e — Integrations
- Wire `create-razorpay-order` Edge Function to checkout flow
- Wire `send-whatsapp` Edge Function to order status updates
- Configure Razorpay webhook URL in dashboard
- Get WATI API key from client

---

## Architecture: what's where

```
apps/store/src/
  lib/supabase.ts          ← typed Supabase client
  context/
    AuthContext.tsx         ← auth state + customer row + modal control
    CartContext.tsx         ← cart (local state)
    WishlistContext.tsx     ← wishlist (local state)
  hooks/
    useProducts.ts          ← product listing with filters
    useProduct.ts           ← single product full detail
    useCollections.ts       ← collection listing
  components/auth/
    AuthModal.tsx           ← sign in / sign up / forgot password
    UserMenu.tsx            ← header dropdown when logged in

apps/admin/src/
  lib/supabase.ts           ← admin Supabase client
  context/AdminAuthContext.tsx ← admin auth (checks admin_users table)
  components/
    AdminLayout.tsx         ← sidebar + topbar
    RequireAdmin.tsx        ← auth guard

supabase/
  functions/
    razorpay-webhook/       ← HMAC verification + order status updates ✅
    create-razorpay-order/  ← order creation + coupon + COD ✅
    send-whatsapp/          ← WATI API + logging ✅
  migrations/
    001–009                 ← all applied to live Supabase project ✅
```

---

## Decisions locked

| Decision | Rationale |
|---|---|
| INR as INTEGER paise | No float rounding errors |
| Order number SAV-YYYYMMDD-NNNN | Human-readable, sortable, date-contextual |
| No guest checkout | Required for automation pipeline |
| WATI for WhatsApp | Best Indian WhatsApp BSP, good API docs |
| Supabase Storage | Integrated auth, RLS on files, CDN |
| HMAC SHA256 on raw body for Razorpay | Industry standard, protects against fake events |

---

## Credentials (pointer-only — never commit secrets)

| Secret | Location |
|---|---|
| Supabase anon key | Supabase dashboard > API Settings |
| Supabase service role key | Sunil has it — Supabase Vault + settings.json |
| GitHub PAT | Sunil has it — needed for git push |
| Razorpay keys | Pending — client to create account |
| WATI API key | Pending — client to create WATI account |

---

## Phase Roadmap

```
Phase 0 — Setup              ✅ DONE
Phase 1a — UI Lock           ✅ DONE (client reviewing)
Phase 1b — DB Schema         ✅ DONE (35 tables live)
Phase 1c — Store + Admin     🔄 IN PROGRESS
  ✅ Auth layer (AuthContext, AuthModal, UserMenu)
  ✅ Data hooks (useProducts, useCollections, useProduct)
  ✅ Edge Functions (create-razorpay-order, send-whatsapp)
  ✅ Seed data (8 products, 3 collections, coupons)
  ✅ Wire store pages to real data (HomePage, PDP, Collections, Shop, Checkout, OrderConfirm)
  ✅ Admin Products CRUD (image upload, variants, collections, craft story)
  ✅ Admin Settings (all 5 tabs functional, DB column names fixed)
  ⏳ Admin Collections + Coupons pages
Phase 1d — Admin Full Build   🔄 Partial (stubs done, CRUD next)
Phase 1e — Integrations       ⏳ After 1c complete
Phase 2 — Automations         ⏳ After Phase 1
Handover                      ⏳ End of Phase 2
```
