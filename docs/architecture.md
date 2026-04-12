# Savinra — Technical Architecture

## Project Info
- **Supabase Project ID:** rzknetoapokbwmyhvqac
- **Region:** ap-south-1 (Mumbai)
- **Supabase URL:** https://rzknetoapokbwmyhvqac.supabase.co

## Monorepo Structure
```
savinra/
├── apps/
│   ├── store/          # Customer PWA — savinra.com (Vercel)
│   └── admin/          # Admin PWA — admin.savinra.com (Vercel)
├── packages/
│   ├── shared/         # Types, brand tokens, Supabase client, utils
│   └── ui/             # Shared shadcn/ui components (future)
├── supabase/
│   ├── migrations/     # All DB migrations (source of truth)
│   ├── functions/      # Edge Functions (Deno)
│   └── seed/           # Seed data for dev
├── n8n/
│   └── workflows/      # n8n workflow JSONs (version controlled)
└── assets/brand/       # Logo SVG, brand kit
```

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite 5 |
| Styling | Tailwind CSS v3 + shadcn/ui + magicui |
| Animations | Framer Motion v11 |
| State | React Query (server) + React Context (UI) |
| Backend | Supabase (PostgreSQL 17, Auth, Storage, Edge Functions) |
| Hosting | Vercel (store + admin — separate projects) |
| Payments | Razorpay (checkout.js + razorpay-node in Edge Function) |
| Shipping | Shiprocket REST API (thin Deno wrapper in Edge Function) |
| AI Chatbot | Claude Haiku via @anthropic-ai/sdk in Edge Function |
| AI Photography | FASHN AI (primary) + fal.ai (fallback) |
| Automation | n8n self-hosted on Hostinger VPS (Mumbai) |
| WhatsApp | Interakt or AiSensy (WhatsApp Business API) |
| Social | Meta Graph API (Instagram + Facebook) |
| Charts | Recharts via shadcn Chart component |
| PWA | vite-plugin-pwa + workbox |

## Key Architectural Decisions

### Automation Split
- **Edge Functions:** Payment verification, order creation, chatbot proxy, stock decrement, Shiprocket trigger — must be atomic with DB or security-critical
- **n8n:** WhatsApp/email notifications, abandoned cart sequences, AI photography pipeline, social media posting, inventory alerts, re-engagement campaigns

### Security Boundaries
- `SUPABASE_PUBLISHABLE_KEY` → client-safe, in Vite env
- `SUPABASE_SERVICE_ROLE_KEY` → Edge Functions only, Vercel env vars
- `RAZORPAY_KEY_ID` → client-safe (checkout.js)
- `RAZORPAY_KEY_SECRET` → Edge Functions only
- `ANTHROPIC_API_KEY` → Edge Functions only
- `FASHN_AI_API_KEY` → Edge Functions / n8n only
- All third-party keys → Vercel env vars or n8n credentials — never in git

### RLS Policy Hierarchy
- Anonymous: read published products + collections only
- Authenticated (customer): read/write own data (orders, addresses, cart, wishlist)
- Admin role: read all, write products/orders/collections/settings

## Phase Delivery
- **Phase 1:** Store PWA + Admin Panel + Razorpay + Shiprocket + AI Chatbot
- **Phase 2:** n8n automations (WhatsApp, abandoned cart, AI photography, social, lifecycle)
