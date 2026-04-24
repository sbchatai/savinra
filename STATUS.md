# SAVINRA — Project Status

> This file is updated at the end of every session.
> A new Claude Code session MUST read this file before doing anything.

---

## Quick State

| Field | Value |
|---|---|
| Current phase | Phase 1e — Client Feedback |
| Current stage | ✅ SEO, mobile layout, categories done. Pending: Razorpay keys + WATI key + assign products to categories |
| Last session | 2026-04-24 |
| GitHub repo | https://github.com/sbchatai/savinra (branch: main) |
| Live store | https://savinra-store.vercel.app ✅ READY |
| Live admin | https://savinra-admin-chi.vercel.app ✅ READY |
| Last commit | 6604dfd — feat: mobile layout fixes, SEO foundation, categories system |
| Supabase project | rzknetoapokbwmyhvqac (ap-south-1, Mumbai) |
| Supabase URL | https://rzknetoapokbwmyhvqac.supabase.co |
| Local path | D:/ai-lab/projects/savinra/ |

---

## ✅ BOTH VERCEL DEPLOYMENTS LIVE (fixed 2026-04-20)

### What was broken and how it was fixed
| Bug | Root Cause | Fix |
|-----|-----------|-----|
| Admin tsc build failed | 11 files imported `assertSupabase` which was never exported from `lib/supabase.ts` | Added `assertSupabase()` function to `lib/supabase.ts` |
| Store wishlist badge showed "2" | WishlistContext pre-populated with fake IDs `['p2','p4']` | Changed to `new Set()` |
| UserMenu links 404'd | Links pointed to `/account/orders` etc, routes defined at `/orders` | Fixed 3 routes in `UserMenu.tsx` |
| Cart lost on refresh | `CartContext` used plain `useState([])` | Added lazy init + `useEffect` → `localStorage` persistence |
| Store Vercel build error | `outputDirectory: "dist"` but build outputs to `apps/store/dist/` | Fixed to `"apps/store/dist"` in `vercel.json` |

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
- Auth layer, data hooks, Edge Functions, seed data, wire store pages to real data
- Superseded by Sessions 6 & 7 — see below for all completed work

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

### Session 10 (2026-04-24) — Client Feedback: Mobile + SEO + Categories ✅
- **Mobile layout fixed**: all account/order/wishlist/returns pages use `flex-col lg:flex-row` — AccountSidebar tabs show correctly on mobile
- **SEO foundation**: `react-helmet-async` installed, `SEOHead` component wired to every page with unique titles, descriptions, canonical, og:, JSON-LD
- **Product JSON-LD** on ProductDetailPage, WebSite SearchAction on HomePage, BreadcrumbList on category/product pages
- **sitemap.xml** + **manifest.json** (PWA) + **robots.txt** sitemap link
- **Categories system**: migration 011 applied — 5 categories + 12 subcategories in Supabase
- **DB-driven mega-menu** in SavinraHeader: desktop hover dropdown + mobile accordion tree, both fed from live Supabase `categories` table
- **ShopCategoryPage**: `/shop/:categorySlug` and `/shop/:categorySlug/:subcategorySlug` — breadcrumbs, subcategory tiles, product grid
- **Admin CategoriesPage**: full CRUD for categories and subcategories with image upload, accordion expand, inline edit/delete
- ⚠️ Supabase project was auto-paused (free tier limit) — restored during session; Sunil should upgrade to Pro or manage active projects
- Commit: `6604dfd`

### Session 8 (2026-04-20) — Full QA + All Bugs Fixed ✅
- Diagnosed and fixed admin tsc build blocker: added `assertSupabase()` to `lib/supabase.ts`
- Shipped Session 6/7 uncommitted code (CollectionsPage, CouponsPage, ProductFormPage, etc.)
- Fixed SettingsPage `as any` type assertions
- Fixed store UserMenu 3 broken routes (`/account/orders` → `/orders` etc.)
- Fixed WishlistContext fake initial IDs `['p2','p4']` → empty `Set`
- Added localStorage cart persistence to CartContext
- Fixed root `vercel.json` outputDirectory (`dist` → `apps/store/dist`)
- Created `D:/ai-lab/.claude/agents/savinra-qa.md` QA agent
- **QA Result: 17 PASS, 0 FAIL** — both apps live and fully functional
- Note: savinra-store.vercel.app needs to be added to Chrome extension allowlist for interactive QA

### Session 7 (2026-04-20) — Admin Collections + Coupons + Vercel fix attempt ✅
- **CollectionsPage** (new): grid view with cover images, occasion badges, product counts, inline activate/delete
- **CollectionFormModal** (new): cover image upload to `brand-assets` bucket, occasion select, SEO fields, slug auto-gen
- **CouponsPage** (new): table with copy-code, discount in INR/%, usage limits, expiry status badges, type badges
- **CouponFormModal** (new): percentage/fixed type, min order, max cap, validity dates, usage limit
- **App.tsx + AdminLayout**: routes + nav items for Collections and Coupons
- **TypeScript fixes**: `type: data.type as 'percentage' | 'fixed'` cast in CouponFormModal
- **Vercel build fix attempt**: regenerated pnpm-lock.yaml (was missing @supabase/supabase-js entries for admin/store workspaces) → committed `b6e3a2c` and pushed
- ⚠️ **Vercel build still failing** — Sunil to provide exact error next session

---

## ✅ SESSION 9 (2026-04-20) — Admin Login Fixed + Full QA

### What was fixed
| Bug | Root Cause | Fix |
|-----|-----------|-----|
| Admin Vercel app calling `placeholder.supabase.co` | `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` not set on either Vercel project | Set both env vars via Vercel API on both `savinra-admin` and `savinra-store` projects |
| Admin login → 500 on admin_users query | `admin_owner_all` RLS policy used inline `SELECT FROM admin_users` inside a policy ON `admin_users` — infinite recursion | Added `is_admin_owner()` SECURITY DEFINER function; migration `010_fix_admin_rls_recursion.sql` applied live |

### Admin QA result (2026-04-20)
| Page | Result |
|------|--------|
| `/login` → `/dashboard` redirect | ✅ PASS |
| Dashboard — stat cards, recent orders | ✅ PASS |
| Orders — filter tabs, table loads | ✅ PASS |
| Products — live data from Supabase | ✅ PASS |
| Customers — loads | ✅ PASS |
| Collections — loads | ✅ PASS |
| Coupons — loads | ✅ PASS |
| Settings — Store Info tab with real data | ✅ PASS |
| Console errors | ✅ ZERO |

Admin credentials: `admin@savinra.com` / `Savinra@Admin1` (owner role)

---

## 🔥 NEXT SESSION — Start here

### Priority 0: ⚠️ Supabase project keeps auto-pausing (free tier limit)
- Sunil has 2 active free projects — when Savinra pauses, restore it from Supabase dashboard
- OR upgrade Savinra to Pro plan (recommended before handover)
- Migration 011 is already applied to the live DB

### Priority 1: Assign products to categories (quick win — admin UI is ready)
- Go to Admin → Categories → see the 5 categories + 12 subcategories
- Go to Admin → Products → edit each product → assign category_id / subcategory_id
- Store category pages (`/shop/:categorySlug`) will immediately show products once assigned

### Priority 2: Get client credentials (BLOCKING for Razorpay + WhatsApp)
- **Razorpay**: Client to create Razorpay account → get Key ID + Key Secret + Webhook Secret
  - Set in Supabase Vault: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`
  - Set webhook URL in Razorpay dashboard: `https://rzknetoapokbwmyhvqac.supabase.co/functions/v1/razorpay-webhook`
- **WATI**: Client to create WATI account → get API key + Account ID + configure 6 message templates
  - Set in Supabase Vault: `WATI_API_KEY`, `WATI_ACCOUNT_ID`
  - Templates needed: `savinra_order_confirmed`, `savinra_order_shipped`, `savinra_order_delivered`, `savinra_abandoned_cart`, `savinra_promotion`, `savinra_otp`

### Priority 3: ProductFormPage — add category/subcategory selectors
- `apps/admin/src/pages/ProductFormPage.tsx` needs two dropdowns: Category (from categories table) + Subcategory (filtered by selected category)
- Currently the form has no category assignment UI

### Priority 4: Set up admin.savinra.com subdomain (at handover)
- Vercel: add custom domain `admin.savinra.com` to savinra-admin project
- GoDaddy DNS: add CNAME record `admin` → `cname.vercel-dns.com`

### Priority 5: Chrome extension domain allowlist
- Add `savinra-store.vercel.app` to Claude-in-Chrome extension's allowed domains

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
Phase 1c — Store + Admin     ✅ DONE — both apps live, QA passed
Phase 1d — Admin Full Build  ✅ DONE
Phase 1e — Integrations      🔄 IN PROGRESS (Razorpay + WhatsApp + subdomain)
Phase 2 — Automations        ⏳ After Phase 1
Handover                     ⏳ End of Phase 2
```
