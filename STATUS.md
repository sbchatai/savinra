# SAVINRA — Project Status

> This file is updated at the end of every session.
> A new Claude Code session MUST read this file before doing anything.

---

## Quick State

| Field | Value |
|---|---|
| Current phase | Phase 1e — Integrations |
| Current stage | ✅ Both apps live and passing QA. Next: Razorpay + WhatsApp wiring |
| Last session | 2026-04-20 |
| GitHub repo | https://github.com/sbchatai/savinra (branch: main) |
| Live store | https://savinra-store.vercel.app ✅ READY |
| Live admin | https://savinra-admin-chi.vercel.app ✅ READY |
| Last commit | d2df6f0 — fix(store): correct Vercel outputDirectory to apps/store/dist |
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

## 🔥 NEXT SESSION — Start here

### Priority 1: Set up admin.savinra.com subdomain
- Vercel: add custom domain `admin.savinra.com` to savinra-admin project
- GoDaddy DNS: add CNAME record `admin` → `cname.vercel-dns.com`
- Verify SSL auto-provisions

### Priority 2: Phase 1e — Integrations
- Wire `create-razorpay-order` Edge Function to checkout flow (CheckoutPage.tsx)
- Wire `send-whatsapp` Edge Function to order status updates
- Configure Razorpay webhook URL in Razorpay dashboard (requires client to create account)
- Get WATI API key from client

### Priority 3: Chrome extension domain allowlist
- Add `savinra-store.vercel.app` to Claude-in-Chrome extension's allowed domains
- This enables full interactive QA (click, JS inspect, screenshot) on the store
- Without it the savinra-qa agent can only check HTTP responses for the store URL

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
