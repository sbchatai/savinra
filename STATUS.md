# SAVINRA — Project Status

> This file is updated at the end of every session.
> A new Claude Code session MUST read this file before doing anything.

---

## Quick State

| Field | Value |
|---|---|
| Current phase | Phase 1c — Admin CRUD complete, Vercel build fix pending |
| Current stage | 🔄 Admin Collections + Coupons done. Vercel build failing — Sunil to provide exact error next session |
| Last session | 2026-04-20 |
| GitHub repo | https://github.com/sbchatai/savinra (branch: main) |
| Live preview | https://savinra-store.vercel.app (auto-deploys on push to main) |
| Last commit | b6e3a2c — fix: regenerate pnpm-lock.yaml — missing supabase-js entries |
| Supabase project | rzknetoapokbwmyhvqac (ap-south-1, Mumbai) |
| Supabase URL | https://rzknetoapokbwmyhvqac.supabase.co |
| Local path | D:/ai-lab/projects/savinra/ |

---

## ⚠️ VERCEL BUILD FAILING — provide exact error next session

The admin app fails to build on Vercel. pnpm-lock.yaml was regenerated but the build still fails.
Sunil will provide the exact Vercel error message next session so we can diagnose and fix.

Steps taken (insufficient):
- Regenerated pnpm-lock.yaml with `pnpm install` — lockfile was missing @supabase/supabase-js entries
- Committed as `b6e3a2c` and pushed to GitHub
- Re-trigger Vercel build to confirm

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

## 🔥 NEXT SESSION — Start here

### Priority 1: Fix Vercel admin build
- Sunil to provide exact Vercel error message
- Common fixes: add `vercel.json` with build config, or set `SKIP_BUILD_COMMAND`, or add `@supabase/supabase-js` to admin workspace explicitly
- Once admin deploys: set up `admin.savinra.com` subdomain in Vercel + GoDaddy DNS

### Priority 2: Phase 1e — Integrations

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
Phase 1c — Store + Admin     🔄 All pages done, Vercel build fix pending
Phase 1d — Admin Full Build   ✅ DONE
Phase 1e — Integrations       ⏳ After Vercel fix + admin subdomain
Phase 2 — Automations         ⏳ After Phase 1
Handover                      ⏳ End of Phase 2
```
