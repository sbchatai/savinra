# SAVINRA — Project Status

> This file is updated at the end of every session.
> A new Claude Code session must read this file before doing anything.

---

## Quick state

| Field | Value |
|---|---|
| Current phase | Phase 1 — Pre-development |
| Current stage | UI Lock → awaiting client approval |
| Last session | 2026-04-13 |
| GitHub repo | https://github.com/sbchatai/savinra (branch: main) |
| Supabase project | rzknetoapokbwmyhvqac (ap-south-1, Mumbai) |
| Supabase URL | https://rzknetoapokbwmyhvqac.supabase.co |
| Local path | D:/ai-lab/projects/savinra/ |

---

## What was completed (this session)

- [x] Scope locked — Phase 1 (store + admin + chatbot) and Phase 2 (all automations)
- [x] Brand kit locked — savinra-brand-kit.md, logo.svg in assets/brand/
- [x] Research report — 40+ tools screened, approved install list ready
- [x] Monorepo scaffold created — apps/store, apps/admin, packages/shared
- [x] Supabase project created — savinra, ap-south-1, free tier
- [x] TypeScript types written — Product, Order, OrderItem, Customer, Address
- [x] Brand tokens written — packages/shared/src/brand.ts (colors, gradients, fonts)
- [x] Utility functions written — INR formatter, Indian phone validator, IST date formatter
- [x] Architecture doc written — docs/architecture.md
- [x] UI spec written — docs/ui-spec.md (all 44 screens, developer-ready)
- [x] GitHub repo live — https://github.com/sbchatai/savinra
- [x] MCP config updated — Supabase + GitHub MCPs in ~/.claude/settings.json
- [x] launch.json updated — savinra store (5173) + admin (5174) registered

---

## Pending client action

- [ ] **Client UI approval** — UI spec shared for review on 2026-04-13
  - If approved: proceed to DB schema
  - If changes requested: update ui-spec.md, revise affected components

---

## Next step (start here next session)

**After client approves UI:**

1. **Supabase schema** — write migrations for all ~57 tables
   - Core e-commerce: products, collections, orders, order_items, customers, addresses, cart, wishlist, coupons
   - Automation support: chat_sessions, chat_messages, ai_generated_images, abandoned_carts, whatsapp_logs, customer_segments, social_posts, return_requests, inventory_alerts
   - Admin: order_events (timeline), admin_users, store_settings, faq_items
   - Apply RLS policies on every table (mandatory)
   - Generate TypeScript types → packages/shared/src/types/database.ts

2. **shadcn/ui init** — run `npx shadcn@latest init` in both apps/store and apps/admin

3. **Vite config** — set up tailwind.config.ts with brand token overrides in both apps

**File to write next:** `supabase/migrations/001_initial_schema.sql`

---

## Decisions locked (do not revisit)

| Decision | Rationale |
|---|---|
| Monorepo (one repo, two apps) | Shared types + brand tokens, deploy separately to Vercel |
| n8n for automations, Edge Functions for transactional | Edge Fns for payment/order atomicity; n8n for async messaging |
| pnpm workspaces | Shared packages between store and admin |
| Supabase ap-south-1 | Lowest latency for Indian users |
| No guest checkout | Customer accounts enable re-engagement automations |
| Razorpay (not Stripe) | Indian payment methods (UPI, netbanking, COD) |
| FASHN AI primary, fal.ai fallback | Virtual try-on for AI photography pipeline |
| Client pays all API bills | Full handover model — Synapticon builds, client owns |

---

## Credentials & config (never commit actual secrets — this is pointer-only)

| Secret | Location |
|---|---|
| Supabase service role key | Sunil has it — set in ~/.claude/settings.json for MCP |
| Supabase publishable key | sb_publishable_RoaATgu6II9luXOg3A7lTQ_-uQV8gsd (safe, client-side) |
| GitHub PAT | Sunil has it — set in ~/.claude/settings.json for MCP |
| Razorpay keys | Not yet — client to create account and share |
| FASHN AI key | Not yet — client to create account |
| WhatsApp API | Not yet — provider not yet chosen (Interakt vs AiSensy) |

---

## Active blockers

| Blocker | Owner | Required for |
|---|---|---|
| Client UI approval | Client (Savinra) | DB schema can start |
| Razorpay account | Client | Payment integration |
| FASHN AI account | Client | AI photography pipeline |
| WhatsApp provider choice | Sunil | Phase 2 automations |

---

## Phase roadmap

```
Phase 0 — Setup          ✅ DONE
Phase 1a — UI Lock       🔄 IN PROGRESS (awaiting client approval)
Phase 1b — DB Schema     ⏳ Next
Phase 1c — Store PWA     ⏳ After schema
Phase 1d — Admin Panel   ⏳ Parallel with store
Phase 1e — Integrations  ⏳ Razorpay + Shiprocket + Chatbot
Phase 2 — Automations    ⏳ After Phase 1 delivery
Handover                 ⏳ End of Phase 2
```

---

## Reusability note

When Savinra Phase 1 is complete, extract these as templates in `D:/ai-lab/templates/`:
- `ecommerce-supabase/` — schema, RLS policies, seed
- `razorpay-edge-fn/` — payment create + webhook verify
- `shiprocket-wrapper/` — Deno API client
- `whatsapp-n8n/` — order notification workflow JSONs
- `ai-chatbot-widget/` — React widget + Edge Function
- `admin-panel-scaffold/` — shadcn admin shell
