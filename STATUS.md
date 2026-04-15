# SAVINRA — Project Status

> This file is updated at the end of every session.
> A new Claude Code session MUST read this file before doing anything.

---

## Quick State

| Field | Value |
|---|---|
| Current phase | Phase 1c — Store + Admin wired to Supabase |
| Current stage | 🔄 Auth + data hooks done. Admin CRUD pages + store wiring NEXT |
| Last session | 2026-04-15 |
| GitHub repo | https://github.com/sbchatai/savinra (branch: main) |
| Live preview | https://savinra-store.vercel.app (client reviewing) |
| Last commit | 9e78a4f — feat: Phase 1c — store auth, Supabase data layer, Edge Functions, seed data |
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

### Session 4 (2026-04-15) — Phase 1c Partial 🔄
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
- **Committed**: 9e78a4f (not yet pushed to GitHub)

---

## 🔥 NEXT SESSION — Start here

### Priority 1: Wire the store pages to real data

**`apps/store/src/pages/HomePage.tsx`** — Replace placeholder collections/products with hooks:
```tsx
const { collections } = useCollections()
const { products: bestsellers } = useProducts({ is_bestseller: true, limit: 4 })
const { products: newArrivals } = useProducts({ is_new: true, limit: 4 })
```
Keep existing UI design exactly — just swap data source. Add skeleton loading states.

**`apps/store/src/pages/CollectionsPage.tsx`** — use `useCollections()` hook

**`apps/store/src/pages/CollectionDetailPage.tsx`** — use `useProducts({ collection_slug })` hook

**`apps/store/src/pages/ProductDetailPage.tsx`** — use `useProduct(slug)` hook (get slug from useParams)

**`apps/store/src/components/layout/SavinraHeader.tsx`** — Add `<UserMenu />` next to cart icon

**`apps/store/src/pages/CheckoutPage.tsx`** — Guard: redirect to auth modal if not logged in

### Priority 2: Admin Products page — full CRUD

Rewrite `apps/admin/src/pages/ProductsPage.tsx` with:
- Real data from Supabase `products` + `product_images`
- Search, filter by active/all
- Add/Edit via `ProductFormModal` (new component)
- Image upload to `product-images` Storage bucket
- Toggle active inline, delete with confirm

Create `apps/admin/src/components/ProductFormModal.tsx`:
- All product fields (name, slug auto-gen, price in ₹→paise, fabric, care, craft story)
- Image upload with preview
- Variants (size, color, sku, stock, price_delta)
- Customization options (if customizable=true)

### Priority 3: Admin Settings — fully functional

Rewrite `apps/admin/src/pages/SettingsPage.tsx` with 5 tabs all wired to Supabase:
- **Store Info**: name, email, phone, WhatsApp, social links, meta — saves to store_settings
- **Shipping & Payments**: free shipping threshold, flat rate, COD toggle, GST — saves to store_settings
- **Announcements**: list + add/edit/delete from store_announcements table
- **FAQs**: list + add/edit/delete/reorder from faq_items table
- **Notifications**: WhatsApp logs view (last 20 from whatsapp_logs)

### Priority 4: Admin Collections + Coupons pages (new pages)

Create `apps/admin/src/pages/CollectionsPage.tsx` + `CollectionFormModal.tsx`
Create `apps/admin/src/pages/CouponsPage.tsx` + `CouponFormModal.tsx`
Add routes + nav items in App.tsx + AdminLayout.tsx

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
  ⏳ Wire store pages to real data (HomePage, PDP, Collections)
  ⏳ Admin Products CRUD (ProductFormModal, image upload)
  ⏳ Admin Settings (all 5 tabs functional)
  ⏳ Admin Collections + Coupons pages
Phase 1d — Admin Full Build   🔄 Partial (stubs done, CRUD next)
Phase 1e — Integrations       ⏳ After 1c complete
Phase 2 — Automations         ⏳ After Phase 1
Handover                      ⏳ End of Phase 2
```
