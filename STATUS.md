# SAVINRA — Project Status

> This file is updated at the end of every session.
> A new Claude Code session must read this file before doing anything.

---

## Quick state

| Field | Value |
|---|---|
| Current phase | Phase 1b — Backend Foundation |
| Current stage | ✅ Schema live → start admin scaffold next |
| Last session | 2026-04-14 |
| GitHub repo | https://github.com/sbchatai/savinra (branch: main) |
| Live preview | https://savinra-store.vercel.app (shared with client) |
| Last commit | c752c23 — feat: complete Phase 1b backend foundation |
| Supabase project | rzknetoapokbwmyhvqac (ap-south-1, Mumbai) |
| Supabase URL | https://rzknetoapokbwmyhvqac.supabase.co |
| Local path | D:/ai-lab/projects/savinra/ |

---

## What was completed (cumulative)

### Session 1 (2026-04-12/13)
- [x] Scope locked — Phase 1 (store + admin + chatbot) and Phase 2 (all automations)
- [x] Brand kit locked — savinra-brand-kit.md, logo.svg in assets/brand/
- [x] Monorepo scaffold — apps/store, apps/admin, packages/shared
- [x] Supabase project created — rzknetoapokbwmyhvqac, ap-south-1, free tier
- [x] Brand tokens, utilities, architecture doc, UI spec (44 screens)
- [x] GitHub repo live — https://github.com/sbchatai/savinra

### Session 2 (2026-04-13/14)
- [x] PostToolUse hooks — auto ESLint + Prettier on every .ts/.tsx save
- [x] Agent team set up — ~/.claude/agents/ (architect, frontend-lead, backend-lead, qa-reviewer, deploy-ops, explorer, researcher, auditor)
- [x] Skills installed — awesome-design, seo-expert, security-expert, database-expert, testing-strategy, debugging
- [x] AGENTS.md — living handbook at D:/ai-lab/AGENTS.md
- [x] 14-screen store prototype — all pages, premium UI, glassmorphism, framer-motion
- [x] SVG logo wired in — header, footer, checkout (leaf on final A)
- [x] Broken Unsplash images fixed — 3 URLs replaced with working alternatives
- [x] Vercel auto-deploy fixed — root vercel.json + pnpm lockfile committed
- [x] D:\Savinra archived → D:\ai-lab\archive\savinra-next-prototype (safe)
- [x] UI live at https://savinra-store.vercel.app — shared with client 2026-04-14

### Session 3 (2026-04-14) — Phase 1b Backend
- [x] Supabase migrations 001–007 written and applied to live project
  - 001: extensions, helpers, is_admin() function
  - 002: customers, addresses, admin_users + auth triggers
  - 003: collections, products, variants, images, reviews, customization options
  - 004: cart_items, wishlist_items, coupons, coupon_uses
  - 005: orders, order_items, shipments, returns, payment_attempts + auto-numbering
  - 006: chat, abandoned_cart, WhatsApp logs, segments, AI images, inventory alerts
  - 007: store_settings (seeded), FAQs (seeded), announcements, notification_logs
- [x] RLS policies on every table (mandatory, zero exceptions)
- [x] TypeScript types generated from Supabase schema → packages/shared/src/types/database.ts (57KB)
- [x] Domain type files (products, customers, orders) rewritten as Database<> wrappers
- [x] Razorpay webhook Edge Function — HMAC SHA256 verification + order status updates
- [x] .env.example updated with all required variables

---

## Pending client action

- [ ] **Client UI approval** — client reviewing https://savinra-store.vercel.app
  - Expected response: ~2 days from 2026-04-14
  - Minor UI tweaks expected — checklist items won't require DB changes

---

## Next step (start here next session)

**Immediate:** Begin admin panel scaffold (Point 4 — can proceed without client feedback).

1. **Admin panel scaffold** (`apps/admin/`)
   - Already scaffolded; needs: routing, shadcn/ui init, layout shell
   - Pages: Dashboard, Orders list, Order detail, Products, Customers, Settings
   - Use shadcn/ui Table, Dialog, Badge, Form components
   - Auth guard: admin_users check via Supabase

2. **API contracts doc** — `docs/api-contracts.md`
   - Edge Function signatures for: create-razorpay-order, razorpay-webhook, send-whatsapp
   - Supabase query patterns for: product listing, cart sync, checkout

3. **Deploy Razorpay webhook** — `supabase functions deploy razorpay-webhook`
   - Requires: RAZORPAY_WEBHOOK_SECRET set (client to provide)

---

## Decisions locked (do not revisit)

| Decision | Rationale |
|---|---|
| Monorepo (one repo, two apps) | Shared types + brand tokens, deploy separately |
| n8n for automations, Edge Functions for transactional | Atomicity vs flexibility |
| pnpm workspaces | Shared packages |
| Supabase ap-south-1 | Lowest latency for Indian users |
| No guest checkout | Re-engagement automations require accounts |
| Razorpay | Indian payment methods (UPI, netbanking, COD) |
| INR stored as paise (INTEGER) | No floating point rounding errors |
| Order number format: SAV-YYYYMMDD-NNNN | Human-readable, sortable |

---

## Credentials & config (pointer-only — never commit secrets)

| Secret | Location |
|---|---|
| Supabase service role key | Sunil has it — set in ~/.claude/settings.json for MCP |
| Supabase anon key | From Supabase dashboard > API Settings |
| GitHub PAT | Sunil has it — set in ~/.claude/settings.json for MCP |
| Razorpay keys | Pending — client to create account and share |
| WhatsApp API key | Pending — provider not yet chosen (Interakt vs AiSensy) |
| fal.ai API key | Pending — for AI product image generation |

---

## Active blockers

| Blocker | Owner | Required for |
|---|---|---|
| Client UI approval | Client (Savinra) | Any UI changes |
| Razorpay account | Client | Payment integration, webhook deploy |
| WhatsApp provider choice | Sunil | Phase 2 automations |

---

## Phase roadmap

```
Phase 0 — Setup          ✅ DONE
Phase 1a — UI Lock       ✅ DONE (client reviewing)
Phase 1b — DB Schema     ✅ DONE (35 tables live in Supabase)
Phase 1c — Store PWA     ⏳ After client feedback incorporated
Phase 1d — Admin Panel   🔄 NEXT
Phase 1e — Integrations  ⏳ Razorpay + Shiprocket + Chatbot
Phase 2 — Automations    ⏳ After Phase 1 delivery
Handover                 ⏳ End of Phase 2
```

---

## Reusability note

When Savinra Phase 1 ships, extract as templates in `D:/ai-lab/templates/`:
- `ecommerce-supabase/` — all 7 migrations, RLS policies, seed data
- `razorpay-edge-fn/` — create-order + webhook handler
- `shiprocket-wrapper/` — Deno API client
- `whatsapp-n8n/` — order notification workflow JSONs
- `ai-chatbot-widget/` — React widget + Edge Function
- `admin-panel-scaffold/` — shadcn admin shell with auth guard
