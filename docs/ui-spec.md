# SAVINRA — UI Specification
**Version:** 1.0  
**Date:** 13 Apr 2026  
**Stack:** React 18 + TypeScript + Vite 5 + Tailwind CSS v3 + shadcn/ui + magicui + Framer Motion v11  
**State:** React Query (server) + React Context (UI)  
**Payments:** Razorpay | **Shipping:** Shiprocket | **Auth:** Supabase Auth

---

## Global Design Tokens (apply everywhere)

| Token | Value |
|---|---|
| Page background | `#FAF8F3` (Parchment) — NEVER `#FFFFFF` |
| Body text | `#2C2622` (Deep Cocoa) — NEVER `#000000` |
| Primary gold (decorative) | `#D4AF37` |
| Accessible gold (buttons/links on light bg) | `#8C7A2E` |
| Gold highlight | `#F5E6A3` |
| Sage | `#9FAF90` |
| Ivory Linen (cards) | `#F5ECDA` |
| Success | `#5A8A6A` |
| Warning | `#C49B2A` |
| Error | `#B5453A` |
| Info | `#6B8DA6` |
| Heading font | Cormorant Garamond 600/700 |
| Body font | Lato 400/500 |
| Button border-radius | `24px` (pill) |
| Button (light bg) | bg `#8C7A2E`, text `#FAF8F3` |
| Button (dark bg) | bg `#D4AF37`, text `#2C2622` |
| Card border-radius | `8px` |
| Card shadow | `0 2px 8px rgba(44,38,34,0.08)` |
| Card bg | `#F5ECDA` (Ivory Linen) |
| Image border-radius | `8px` |

**Golden Shine CSS classes (defined once in global CSS, used everywhere):**
```css
.savinra-shine { background: linear-gradient(135deg,#D4AF37 0%,#F5E6A3 40%,#D4AF37 60%,#8C7A2E 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.savinra-shine-animated { background: linear-gradient(90deg,#8C7A2E 0%,#D4AF37 25%,#F5E6A3 50%,#D4AF37 75%,#8C7A2E 100%); background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:savinra-shimmer 3s ease-in-out infinite; }
.savinra-shine-on-dark { background: linear-gradient(135deg,#D4AF37 0%,#F5E6A3 35%,#FFFACD 50%,#F5E6A3 65%,#D4AF37 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
@keyframes savinra-shimmer { 0%,100%{background-position:0% center} 50%{background-position:100% center} }
@media(prefers-reduced-motion:reduce){.savinra-shine-animated{animation:none;background-position:0% center}}
```

**Typography scale:**

| Level | Font | Size | Weight |
|---|---|---|---|
| H1 Hero | Cormorant Garamond | 40px / 2.5rem | 600 |
| H2 Section | Cormorant Garamond | 28px / 1.75rem | 600 |
| H3 Card/Sub | Cormorant Garamond | 22px / 1.375rem | 600 |
| H4 Label | Lato | 16px / 1rem | 500 |
| Body | Lato | 15px / 0.9375rem | 400 |
| Caption | Lato | 13px / 0.8125rem | 400 |
| Button | Lato | 14px / 0.875rem | 500, letter-spacing +0.5px |
| Price | Cormorant Garamond | 20px / 1.25rem | 500 |

**Animations:** All via Framer Motion. Use `initial/animate/exit` with `opacity` 0→1 and `y` 12→0, `duration` 0.3–0.5s, `ease: "easeOut"`. Never spring/bounce. Stagger product grid items with 0.05s delay each.

**Product grid:** 1 col (mobile <768px) → 2 col (tablet 768–1023px) → 3 col (desktop ≥1024px). Never 4 cols. Gap: `24px`.

---

## Global Shared Components

### `<SavinraHeader>` (store)
Full-width sticky header. Background: `#FAF8F3`, border-bottom: `1px solid #D4AF37` at 30% opacity.

**Left:** Logo SVG with `.savinra-shine` applied as CSS class to the "SAVINRA" text element. Logo links to `/`.

**Center (desktop only):** Navigation links — "Collections", "Shop", "About", "Help". Font: Lato 14px 500. Color: `#2C2622`. On hover: `#8C7A2E`. Letter-spacing 0.5px.

**Right:** Icon row — Search (lucide `Search`), Wishlist (lucide `Heart`), Account (lucide `User`), Bag (lucide `ShoppingBag`) with item count badge. Badge: small circle, bg `#8C7A2E`, text `#FAF8F3`, 10px Lato 500.

**Mobile:** Center logo. Replace center nav with hamburger (lucide `Menu`). Right shows only Bag icon + count badge. On hamburger tap: shadcn `<Sheet>` from left with nav links + "Sign in / My account" at bottom.

---

### `<SavinraFooter>` (store)
Background: `#2C2622`. Text: `#FAF8F3`.

Three column layout (stacked on mobile):
- **Col 1:** Logo with `.savinra-shine-on-dark`. Tagline "House of Refined Living" Cormorant Garamond 16px with `.savinra-shine-on-dark`. One-line sustainability statement.
- **Col 2:** Quick links — Shop, Collections, About, FAQs, Returns. Lato 14px, color `#F5ECDA`, hover `#D4AF37`.
- **Col 3:** Contact email, WhatsApp. Instagram + Facebook icon links. Newsletter input + "Subscribe" pill button (bg `#D4AF37`, text `#2C2622`).

Bottom bar: `1px` divider `#D4AF37` at 20% opacity. "© 2026 Savinra. All rights reserved." left + "Privacy Policy · Terms" right. Lato 13px `#9FAF90`.

---

---

# PART 1 — CUSTOMER STORE PWA (Priority Screens — Full Detail)

---

## Screen 1: Home / Landing

**Route:** `/`  
**App:** store  
**Layout:** Full-bleed hero → stacked sections → footer.

---

### 1. `<SavinraHeader>` (sticky)

### 2. Hero Section

Component: custom `<HeroSection>`.

Full-bleed image (100vw, 90vh desktop / 70vh mobile). Overlay: `linear-gradient(to bottom, rgba(250,248,243,0) 40%, rgba(44,38,34,0.55) 100%)`.

Text block: absolute, bottom-left, padding `48px desktop / 24px mobile`:
- Eyebrow: "House of Refined Living" — Lato 13px uppercase letter-spacing 2px, `.savinra-shine`
- H1: "Where heritage finds its future" — Cormorant Garamond 600 40px desktop / 28px mobile, `#FAF8F3` (plain, no shine — headline is parchment white on dark overlay)
- Sub: "Sustainable Indo-Western fashion, crafted for the woman who dresses with intention." — Lato 400 15px `#F5ECDA`, max-width 480px
- CTA: "Shop the collection" — pill, bg `#D4AF37`, text `#2C2622`, `px-8 py-3`. Links `/shop`.

**Animation:** Image fade-in 0.6s. Text block: `y: 20→0, opacity: 0→1, duration: 0.5s, delay: 0.2s`.

**Mobile:** 70vh, sub-headline hidden below 480px, CTA centered.

---

### 3. Collection Spotlight

Section padding: `80px 0` desktop / `48px 0` mobile. Bg: `#FAF8F3`.

Header (centered): thin gold divider (60px) + H2 "The Collections" Cormorant Garamond 600 28px.

3-up grid desktop / horizontal scroll snap mobile.

**`<CollectionCard>`:**
- 360px width, aspect ratio 4:5, cover image fills card
- Overlay bottom half: `linear-gradient(to top, rgba(44,38,34,0.7), transparent)`
- Bottom text: collection name Cormorant Garamond 600 22px `#FAF8F3`, "X pieces" Lato 13px `#F5ECDA`
- Sage badge top-right: bg `#9FAF90`, text `#FAF8F3`, Lato 13px 500, border-radius 24px
- Border-radius 8px, shadow token. Hover: `scale(1.02)` via Framer Motion `whileHover`
- Entire card links → `/collections/[slug]`

CTA below: "Explore all collections" text link, Lato 14px 500, `#8C7A2E`.

---

### 4. Featured Products

Section padding: `80px 0`. Bg: `#F5ECDA`.

Header: gold divider + H2 "New in the studio" Cormorant Garamond 600 28px.

Product grid: 3-col desktop / 2-col tablet / 1-col mobile. Gap 24px. Shows 6 products.

**`<ProductCard>`:**
- Card bg `#FAF8F3`, border-radius 8px, shadow token
- Image: aspect ratio 3:4, object-fit cover, border-radius `8px 8px 0 0`
- Wishlist icon (lucide `Heart`) absolute top-right 12px, 18px, `#8C7A2E`. Filled = wishlisted
- Body padding 16px:
  - Product name: Cormorant Garamond 600 22px, `#2C2622`, `line-clamp-2`
  - Fabric tag: Lato 13px `#9FAF90`
  - Price: Cormorant Garamond 500 20px. If `compare_at_price`: struck-through in Lato 13px `#B5453A` at 60%
  - "Add to bag" pill button, full-width, bg `#8C7A2E`, text `#FAF8F3`. On click: cart context + checkmark flash 1.5s

**Animation:** Grid stagger-fade with `staggerChildren: 0.05`.

CTA below: "Shop the collection" pill button, bg `#8C7A2E`, text `#FAF8F3`. → `/shop`.

---

### 5. Brand Story Strip

Full-width. Bg: `#2C2622`. Padding `80px 0`.

Two-column 50/50 (stacked mobile — image top, text below):
- **Left:** Editorial image, square, border-radius 8px
- **Right:** Eyebrow "Our philosophy" Lato 13px uppercase `#9FAF90` + H2 "Refined by intention." Cormorant Garamond 600 28px `#FAF8F3` + 2 short body paragraphs Lato 15px `#F5ECDA` + CTA "Read our story" outline pill (border `1px solid #D4AF37`, text `#D4AF37`). Hover: bg `#D4AF37`, text `#2C2622`.

---

### 6. Sustainability Callout

Full-width. Bg: `rgba(159,175,144,0.12)` on `#FAF8F3`. Padding `60px 0`.

3-column icon + text blocks (stacked mobile):
1. Leaf icon `#9FAF90` 32px → "Organic fabrics" Lato 500 14px uppercase `#8C7A2E` → "Natural fibres sourced from certified cooperatives." Lato 13px
2. Recycle icon → "Zero-waste cuts" → "Pattern engineered to produce less than 3% fabric waste."
3. Heart icon → "Artisan made" → "Handcrafted by skilled artisans across India."

---

### 7. Instagram Feed Preview

Section padding `80px 0`. H2 "From the studio" Cormorant Garamond 600 28px + "@savinra" Lato 13px `#8C7A2E`.

6 square images. Desktop: 6-col row. Mobile: 3-col 2-row. Object-fit cover. On hover: opacity overlay + Instagram icon.

---

### 8. `<SavinraFooter>`

---

**Key components:** `<HeroSection>`, `<CollectionCard>`, `<CollectionSpotlight>`, `<ProductCard>`, `<FeaturedProducts>`, `<BrandStoryStrip>`, `<SustainabilityCallout>`, `<InstagramFeedPreview>`

**Data:** `Collection[]` (3 featured, published, DESC), `Product[]` (6 featured, published, DESC), `ProductImage[]` first per product

**Actions:** Navigate to collection, navigate to product, add to bag (context + localStorage), toggle wishlist (auth required), navigate to /shop

**Mobile:** Hero 70vh / sub hidden, Collections horizontal scroll snap, Products 1-col, BrandStrip stacked, Instagram 3-col 2-row

**Brand notes:** Logo `.savinra-shine`, eyebrow "House of Refined Living" `.savinra-shine` on dark overlay, footer logo `.savinra-shine-on-dark`, sage badges on collection cards, hero CTA gold bg on dark

---

## Screen 2: Product Detail

**Route:** `/products/[slug]`  
**App:** store  
**Layout:** Two-column desktop (gallery left ~55%, details right ~45%). Single-column mobile.

---

### 1. `<SavinraHeader>` (sticky)

### 2. Breadcrumb
shadcn `<Breadcrumb>`. Path: Home / Collections / [Collection] / [Product]. Lato 13px `#8C7A2E`. Separator `/` in `#D4AF37` at 60%.

### 3. Product Gallery + Details

Max-width 1200px centered. Padding `48px 24px` desktop / `24px 16px` mobile.

**Left: `<ProductGallery>`** (sticky `top: 80px` on desktop)
- Main image: aspect ratio 3:4, object-fit cover, border-radius 8px
- Thumbnail strip: 5 thumbs max (72×96px, border-radius 4px). Selected: `2px solid #8C7A2E`. Click → swap main image. Click main image → lightbox.
- **Lightbox:** shadcn `<Dialog>` full-screen. Bg `rgba(44,38,34,0.95)`. Arrow navigation, keyboard support (`←→Esc`).
- **Mobile:** `embla-carousel-react` horizontal swipe. Dot indicators below, filled = active `#8C7A2E`. No thumbnails.

**Right: `<ProductDetails>`** (`pl-12` on desktop)

Top to bottom:
- Collection tag: sage pill (bg `#9FAF90` at 15%, text `#9FAF90`, Lato 13px 500, border-radius 24px). Links to collection.
- Product name: Cormorant Garamond 600 32px desktop / 26px mobile
- Material tag: Lato 13px `#9FAF90`. Pull from `product.fabric`
- Price row: Cormorant Garamond 500 24px. Compare-at: struck-through 16px at 50% opacity. Tax note: Lato 13px at 60%: "Incl. of all taxes. Free shipping on orders above ₹999."
- Thin gold divider `my-6`
- **`<SizeSelector>`:** H4 "Size" Lato 500 14px. Sizes as pill toggles (border `1px solid #D4AF37` at 50%; selected: bg `#8C7A2E` border `#8C7A2E` text `#FAF8F3`; OOS: opacity 40% cursor-not-allowed strikethrough). "Size guide" text link → shadcn `<Sheet>` with size chart table.
- Customisation textarea (optional): shadcn `<Textarea>` max 120 chars. border `1px solid #D4AF37` at 40%. Placeholder: "E.g. embroidery initials, special instructions."
- **"Add to bag" button:** Full-width pill, bg `#8C7A2E`, text `#FAF8F3`, `py-4`. Disabled if no size. On click: cart context + checkmark "Added to bag" 2s via `AnimatePresence`.
- **Wishlist link:** Lucide `Heart` + "Save to wishlist" Lato 14px `#8C7A2E`. Toggle.
- Thin gold divider
- **Description accordion** (3 items, Framer Motion animate height):
  - Description (default open): product description, Lato 15px, line-height 1.6
  - Fabric & Care: bullet list with icons
  - Shipping & Returns: static policy text
  - Header: Lato 500 14px `#2C2622`. Icon: lucide `Plus`/`Minus` `#8C7A2E`. Border-bottom `1px solid #D4AF37` at 20%.
- Share row: "Copy link" + "WhatsApp share". lucide `Link` + react-icons `FaWhatsapp`. `#8C7A2E`.

### 4. Complete the Look
H2 Cormorant Garamond 600 28px + 3 `<ProductCard>` components (same collection or tags).

### 5. Recently Viewed
Horizontal scroll, 5 compact product cards. localStorage.

### 6. `<SavinraFooter>`

---

**Key components:** `<ProductGallery>` (embla on mobile), `<ProductImageLightbox>` (shadcn Dialog), `<ProductDetails>`, `<SizeSelector>`, `<SizeGuideSheet>` (shadcn Sheet), `<ProductDescriptionAccordion>` (Framer Motion), `<CompleteTheLook>`, `<RecentlyViewed>`

**Data:** `Product` all fields, `ProductImage[]` sorted by position, `AiGeneratedImage[]` approved (appended to gallery), `Collection` name + slug, related `Product[]` (same collection, limit 3, exclude current)

**Actions:** Gallery nav + lightbox, size select, size guide sheet, add to bag, wishlist toggle (auth required), share, recently viewed tracking, complete the look navigation

**Mobile:** Embla carousel + dot indicators, single column (gallery top / details below), sticky "Add to bag" bar at viewport bottom (appears after scroll past in-page button), accordions collapsed by default

**Brand notes:** Collection badge sage, price always Cormorant Garamond, no stock quantity surfaced, "Add to bag" not "Add to cart", description leads with fabric

---

## Screen 3: Cart

**Route:** `/cart`  
**App:** store  
**Layout:** Two-column desktop (items left ~60%, summary right ~40%). Single-column mobile.

---

### 1. `<SavinraHeader>` (sticky)

### 2. Cart Content

Max-width 1100px centered. Padding `48px 24px` desktop / `24px 16px` mobile.

H1 "Your bag" Cormorant Garamond 600 32px + item count Lato 400 15px at 60%.

**Empty state:** "Your bag is empty." Lato 15px + "Shop the collection" pill button.

**Left: `<CartItemList>`**

Each `<CartItem>`:
- Image 80×106px border-radius 8px + details right
- Product name: Cormorant Garamond 600 18px, links `/products/[slug]`
- Size: Lato 13px at 70%
- Customisation note (if present): Lato 13px italic at 60%
- Price: Cormorant Garamond 500 18px right-aligned
- Quantity stepper: lucide `Minus` | qty | lucide `Plus`. Buttons: border `1px solid #D4AF37` at 40%, border-radius 4px, `w-8 h-8`, `#8C7A2E`. Optimistic update, debounced Supabase sync.
- Remove: lucide `Trash2` 16px `#B5453A` at 60%, hover `#B5453A`
- Divider: `1px solid #D4AF37` at 15% between items

**Item removal animation:** `AnimatePresence` with `exit: { opacity: 0, height: 0, marginBottom: 0 }` 0.25s.

**Right: `<OrderSummary>`** (sticky `top: 100px` desktop)

Card: bg `#F5ECDA`, border-radius 8px, shadow, padding 24px.
- H3 "Order summary" Cormorant Garamond 600 22px
- Subtotal row, Shipping row (free if ≥ ₹999, else ₹99)
- Thin divider
- **Coupon field:** shadcn `<Input>` + "Apply" pill button (bg `#8C7A2E`). Valid: discount row `#5A8A6A` + remove pill badge. Invalid: Lato 13px `#B5453A` inline error.
- Discount row (conditional): `#5A8A6A`
- Thin divider
- Total: Lato 500 14px uppercase left / Cormorant Garamond 500 24px right
- Tax note: Lato 13px at 60%
- "Proceed to checkout" full-width pill, bg `#8C7A2E`, text `#FAF8F3`, `py-4`
- Payment icons + "Secured by Razorpay." Lato 13px at 50%
- "Continue shopping" text link `#8C7A2E` → `/shop`

---

**Key components:** `<CartItemList>`, `<CartItem>`, `<OrderSummary>` (reused in checkout), shadcn `<Input>` (coupon)

**Data:** Cart from React Context + localStorage. Coupon validated via Edge Function `validate-coupon`. Shipping computed from subtotal vs threshold.

**Actions:** Change qty (optimistic + debounced sync), remove item, apply/remove coupon, proceed to checkout

**Mobile:** Single column (items → summary), sticky bottom bar: "Total ₹X · Proceed to checkout"

**Brand notes:** "Your bag" not "Your cart", "Proceed to checkout" not "Checkout now", coupon error quiet inline

---

## Screen 4: Checkout

**Route:** `/checkout`  
**App:** store  
**Auth required:** Must be logged in → redirect `/account?next=/checkout`.  
**Layout:** Two-column desktop (form left ~58%, summary right ~42%). Single-column mobile.

---

### 1. `<SavinraHeader>` (simplified)
Logo `.savinra-shine` + "Secure Checkout" Lato 13px `#8C7A2E` + lucide `Lock` 14px. No nav, no bag icon.

### 2. Checkout Content

Max-width 1100px centered. Padding `48px 24px` desktop / `24px 16px` mobile.

**Progress indicator:** 3 steps — "Delivery" → "Payment" → "Confirm". Active: `#8C7A2E`. Completed: `#5A8A6A` + checkmark. Inactive: `#2C2622` at 40%. Connector line: `1px solid #D4AF37` at 30%. Visual only — not clickable.

**Left: `<CheckoutForm>`** (multi-step, local state `step: 1 | 2`)

Step transitions: Framer Motion `AnimatePresence`, `initial: {opacity:0, x:20} → animate: {opacity:1, x:0}` 0.3s.

**Step 1 — Delivery:**
- H3 "Delivery address" Cormorant Garamond 600 22px
- Saved addresses as radio cards. Each `<AddressCard>`: bg `#FAF8F3`, border-radius 8px, border `2px solid transparent`. Selected: `2px solid #8C7A2E`. "Default" sage badge. Edit / Delete links Lato 13px `#8C7A2E`.
- "+ Add new address" → inline form:
  - Fields: Full name, Phone (libphonenumber-js validation), Line 1, Line 2 (optional), City, State (shadcn `<Select>` all Indian states/UTs), Pincode (6-digit, on blur: auto-fill city/state), Country (pre-filled India, disabled)
  - Validation: inline on blur, error text Lato 13px `#B5453A` below field (no red border)
  - "Save this address" checkbox, "Set as default" checkbox
- "Continue to payment" full-width pill, bg `#8C7A2E`, text `#FAF8F3`

**Step 2 — Payment:**
- H3 "Payment" Cormorant Garamond 600 22px
- Selected address compact read-only card (bg `#F5ECDA`) + "Change" text link → step 1
- Payment method radio cards (border `2px solid transparent`, selected `2px solid #8C7A2E`):
  1. UPI · "PhonePe, GPay, Paytm, BHIM"
  2. Debit / Credit card · "Visa, Mastercard, Rupay"
  3. Net Banking · "All major Indian banks"
  4. Cash on Delivery · warning note Lato 13px `#C49B2A` re: order limit + pincode
- Coupon field (if not applied from cart)
- Compact order total: subtotal, discount, shipping, total (Cormorant Garamond 500 for total amount)
- **"Place order" full-width pill** bg `#8C7A2E`, text `#FAF8F3`, `py-4`:
  - UPI/Card/Netbanking: Edge Function `create-razorpay-order` → `Razorpay.open()` → on success: Edge Function `verify-payment` → navigate `/order-confirmation/[order_number]`
  - COD: Edge Function `create-cod-order` → navigate
  - Loading: "Processing..." + spinner, button disabled
  - Failure: shadcn `<Alert>` (bg `#B5453A` at 8%, border `#B5453A`, Lato 14px), retry same step
- "Back to cart" text link `#8C7A2E` → `/cart`

**Right: `<OrderSummary>`** (reused, sticky desktop)
- Product thumbnails 60×80px + name + size + qty + price (scrollable if >4)
- Subtotal, shipping, discount, total
- "Your order is protected by Razorpay's secure payment gateway." Lato 13px + lock icon

---

**Key components:** `<CheckoutForm>` multi-step, `<AddressCard>`, `<AddressForm>` inline, `<PaymentMethodSelector>`, `<OrderSummary>` reused, shadcn `<Input>/<Select>/<Alert>`, Razorpay `checkout.js` (CDN script, not npm)

**Data:** `SavedAddress[]` (Supabase, own), cart context, payment methods (static)

**Actions:** Select address, add/edit/delete address (Supabase CRUD), select payment, apply/remove coupon, place order (Edge Function), handle Razorpay callbacks

**Mobile:** Single column, order summary in shadcn `<Accordion>` ("Show order summary ▼") below header with total visible in closed state, sticky "Place order" bar at bottom viewport

**Brand notes:** "Place order" not "Pay now", errors quiet + inline, loading spinner simple CSS, "Secured by Razorpay" text not badge

---

## Screen 5: Order Confirmation

**Route:** `/order-confirmation/[order_number]`  
**App:** store  
**Layout:** Centered single-column, max-width 720px.

---

### 1. `<SavinraHeader>` (logo only)

### 2. Confirmation Hero

Thin gold divider full-width.

- lucide `CheckCircle2` `#5A8A6A` 48px. Framer Motion: `scale: 0→1, opacity: 0→1` 0.4s delay 0.1s
- H1: "Thank you for choosing **Savinra**" — Cormorant Garamond 600 32px desktop / 26px mobile. Apply `.savinra-shine` to "Savinra" word only.
- Sub: "Your order has been placed. You'll receive a WhatsApp confirmation shortly." Lato 400 15px at 80%, centered.
- Order number `#SAV-XXXX`: Lato 500 14px uppercase `#8C7A2E` letter-spacing 1px, centered.

### 3. `<OrderDetailsCard>`

Card: bg `#F5ECDA`, border-radius 8px, shadow, padding 24px, max-width 560px centered.

- Items list: 60×80px image | name Cormorant Garamond 600 16px | size Lato 13px | qty Lato 13px | price Cormorant Garamond 500 16px right
- Price breakdown: subtotal, discount, shipping, total (Cormorant Garamond 500 22px)
- Delivery address block
- Payment method + ID (last 8 chars masked)
- Estimated delivery: Cormorant Garamond 500 18px (created_at + 7 days or Shiprocket response)

(Thin gold dividers between each section)

### 4. Action Row

- "Track my order" pill, bg `#8C7A2E`, text `#FAF8F3` → `/orders/[order_id]`
- "Shop the collection" outline pill (border + text `#8C7A2E`) → `/shop`
- "Download invoice" text link, lucide `Download` 14px + Lato 14px `#8C7A2E`

### 5. WhatsApp Confirmation Note

Lato 14px at 70%, centered. "A WhatsApp message with your order details has been sent to +91-XXXX7890." (partially masked).

If `whatsapp_opted_in: false`: "Want order updates on WhatsApp?" + shadcn `<Switch>` + "Enable" Lato 14px `#8C7A2E`. On enable: Supabase customer update.

### 6. Recommended Products Strip

H2 "You might also love" Cormorant Garamond 600 28px centered. 3 `<ProductCard>` components (same collection as purchased items). Horizontal scroll mobile, 3-col desktop.

### 7. `<SavinraFooter>` (full)

---

**Key components:** `<OrderConfirmationHero>`, `<OrderDetailsCard>`, `<OrderActionRow>`, `<RecommendedProducts>`, shadcn `<Switch>`

**Data:** `Order` all fields, `OrderItem[]`, estimated delivery, `Customer` phone (masked), `whatsapp_opted_in`

**Actions:** Track order, shop, download invoice (PDF via Edge Function or client-side), WhatsApp opt-in toggle, click recommended product

**Mobile:** All centered single-column, action buttons stacked, recommended products horizontal scroll

**Brand notes:** `.savinra-shine` on "Savinra" word only — not full headline, no confetti/celebration animation, WhatsApp note warm not transactional, COD shows "Payment due on delivery."

---

---

# PART 2 — CUSTOMER STORE PWA (Remaining Screens)

---

## Screen 6: Shop / All Products

**Route:** `/shop` | **Layout:** Sidebar filters + product grid desktop. Drawer filters mobile.

- H1 "The Collection" Cormorant Garamond 600 32px + item count Lato 15px
- **Filters desktop:** sticky left sidebar 240px. Collections `<Checkbox>`, Price `<Slider>` (`#8C7A2E` thumb), Size pill toggles, Fabric `<Checkbox>`, Tags `<Checkbox>`. Clear filters Lato 13px `#8C7A2E`.
- **Filters mobile:** "Filter" + "Sort" outline pill buttons. Filter → shadcn `<Sheet>` from bottom. Sort → shadcn `<DropdownMenu>`.
- Sort options: Newest / Price Low→High / Price High→Low / Name A–Z
- Product grid: `<ProductCard>` 3/2/1 col. React Query `useInfiniteQuery` page size 12. Skeleton cards: bg `#F5ECDA` CSS shimmer.
- Applied filter pills: bg `#F5ECDA`, text `#8C7A2E`, `X` to remove. URL search params (shareable URLs).
- Empty state: "No pieces match your filters." + "Clear filters" link.

---

## Screen 7: Collections Listing

**Route:** `/collections` | **Layout:** Full-width hero → card grid.

- Hero: full-width bg `#F5ECDA`, padding 60px. H1 "Our Collections" Cormorant Garamond 600 40px. Sub Lato 15px.
- `<CollectionCard>` grid: 3/2/1 col. Same component as homepage.

---

## Screen 8: Collection Detail

**Route:** `/collections/[slug]` | **Layout:** Hero banner → product grid.

- Full-width banner: 50vh, cover image. Overlay bottom-left: collection name H1 Cormorant Garamond 600 36px `#FAF8F3`, description Lato 15px `#F5ECDA`. Sage badge top-right.
- shadcn `<Breadcrumb>`: Home / Collections / [Name]
- Sort bar + item count
- `<ProductCard>` grid: all products in collection. 3/2/1 col, infinite scroll.

---

## Screen 9: My Orders (List)

**Route:** `/orders` | **Layout:** Account layout (`<AccountSidebar>` + main).

**`<AccountSidebar>`:** Desktop sticky left 220px. Mobile: horizontal tab bar top. Links: My Orders, Wishlist, Profile, Returns.

- H1 "My Orders" Cormorant Garamond 600 28px
- `<OrderListItem>` cards: bg `#F5ECDA`, border-radius 8px, shadow, padding 16px. First product thumbnail 48×64px + product names + order # Lato 13px `#8C7A2E` + date Lato 13px + total Cormorant Garamond 500 16px + status badge + "View order" link.
- Status badge colors: confirmed/processing `#6B8DA6`, shipped `#C49B2A`, delivered `#5A8A6A`, cancelled `#B5453A`, returned `#9FAF90`. All text `#FAF8F3`.
- Empty state: "You haven't placed any orders yet." + "Shop the collection" button.

---

## Screen 10: Order Detail (with Tracking)

**Route:** `/orders/[id]` | **Layout:** Account layout.

- Back link "← My Orders" Lato 14px `#8C7A2E`
- Order # + date + status badge
- **`<OrderTrackingSteps>`:** Horizontal stepper desktop / vertical mobile. Steps: Confirmed → Processing → Shipped → Out for Delivery → Delivered. Completed: `#5A8A6A` fill. Active: `#8C7A2E` fill. Upcoming: `#2C2622` at 20% border. AWB + carrier shown when shipped. "Track on Shiprocket" text link.
- Items list, price summary, delivery address, payment details (same as order confirmation card)
- **Actions:**
  - `confirmed` or `processing`: "Cancel order" outline pill (border `#B5453A`, text `#B5453A`) → shadcn `<AlertDialog>` confirm → Edge Function `cancel-order`
  - `delivered`: "Request return" pill → `/returns?order_id=X`

---

## Screen 11: Returns & Exchanges

**Route:** `/returns` | **Layout:** Account layout.

- H1 "Returns & Exchanges" Cormorant Garamond 600 28px
- Policy card: bg `#F5ECDA`, key points Lato 14px. "15-day return window. Item unworn with original tags. Exchanges subject to availability."
- **`<ReturnRequestForm>`** (4-step):
  1. Select order (shadcn `<Select>` eligible delivered orders) + item checkboxes with images
  2. Reason: shadcn `<RadioGroup>` — Wrong size / Doesn't match description / Arrived damaged / Changed my mind / Other + Textarea
  3. Resolution: Refund to original / Store credit / Exchange for different size (+ size selector if exchange)
  4. Upload photos: drag-drop or tap, Supabase Storage, max 3 photos 5MB each
  - "Submit return request" pill, bg `#8C7A2E`
- Existing return requests below as status cards.

---

## Screen 12: Wishlist

**Route:** `/wishlist` | **Layout:** Account layout.

- H1 "Saved pieces" Cormorant Garamond 600 28px
- `<ProductCard>` grid (3/2/1 col) with filled heart icon. Remove on heart click (optimistic). "Add to bag" per card.
- Empty state: "You haven't saved any pieces yet." + "Shop the collection" button.

---

## Screen 13: Profile / Account

**Route:** `/account` | **Layout:** Account layout with sections.

- H1 "My Account" + customer name Cormorant Garamond 600
- **Profile card:** name, email, phone, member since. Inline edit (shadcn `<Input>` on "Edit" click).
- **Saved addresses:** `<AddressCard>` list. Default badge (sage pill). Add/edit/delete. Same `<AddressForm>` as checkout.
- **Communication preferences:** shadcn `<Switch>` × 2 (WhatsApp, Email). Lato 13px reassurance note.
- **Password & security:** "Change password" → shadcn `<Sheet>` with old/new/confirm fields. Supabase Auth `updateUser`.
- **Birthday:** date input (MM-DD). "We send something special on your birthday."
- **Danger zone:** "Delete my account" Lato 13px `#B5453A` text link → `<AlertDialog>` → Edge Function `delete-customer`.
- **Sign out:** Lato 14px `#8C7A2E` text button.

---

## Screen 14: FAQs / Help

**Route:** `/help` | **Layout:** Centered single-column, max-width 780px.

- H1 "How can we help?" Cormorant Garamond 600 32px centered
- Search bar: shadcn `<Input>` + lucide `Search`. Client-side filter.
- FAQ categories: horizontal pill tabs (selected bg `#8C7A2E` text `#FAF8F3`, unselected bg `#F5ECDA` text `#8C7A2E`): Ordering / Shipping / Returns / Payments / Sizing / Sustainability. Each: shadcn `<Accordion>` items.
- Contact card: bg `#F5ECDA`, border-radius 8px. H3 "Still have questions?" + "Chat on WhatsApp" pill (bg `#25D366` white text — WhatsApp green, one permitted exception) + "Email us" outline pill.
- **AI Chatbot bubble (all store pages):** `position: fixed; bottom: 24px; right: 24px`. Circle 56px, bg `#8C7A2E`, white chat icon. Opens shadcn `<Sheet>` right 320px. Messages: customer right (bg `#F5ECDA`), bot left (bg `#FAF8F3`). Lato 14px. Typing: three dots CSS animation. Bot name: "Savinra Concierge". Calls Edge Function `chatbot-proxy` → Claude Haiku.

---

---

# PART 3 — ADMIN PANEL PWA

---

## Admin Global Layout

**`<AdminLayout>`:** Fixed left sidebar 240px + main content area.

**Sidebar (bg `#2C2622`):**
- Top: Logo + "SAVINRA" `.savinra-shine`. "Admin" Lato 13px `#9FAF90`
- Nav links: Lato 14px 500 `#FAF8F3`, lucide icons 18px `#9FAF90`. Active: bg `rgba(212,175,55,0.15)`, left border `3px solid #D4AF37`, icon `#D4AF37`.
- Bottom: Admin name Lato 13px + "Sign out" lucide `LogOut`
- Mobile: hamburger → shadcn `<Sheet>` from left

**Main area (bg `#FAF8F3`):** Top bar: breadcrumb + admin name + notification bell. Content padding `32px`.

**Shared admin conventions:**
- Tables: shadcn `<Table>`
- Forms: shadcn components
- Charts: shadcn `<ChartContainer>` wrapping Recharts
- Cards: bg `#F5ECDA`, border-radius 8px, shadow, padding 20–24px
- Chart colors from brand palette. Tooltip: bg `#2C2622`, text `#FAF8F3`, Lato 13px.

---

## Admin Screen 1: Login
**Route:** `/admin/login` | Full-screen bg `#2C2622`.

Center card (bg `#FAF8F3`, border-radius 8px, max-w 400px, padding 40px):
- Logo `.savinra-shine` + "Admin Panel" Lato 13px `#9FAF90`
- H2 "Welcome back" Cormorant Garamond 600 24px
- Email + Password (shadcn `<Input>`, show/hide toggle lucide `Eye`/`EyeOff`)
- "Sign in" pill full-width, bg `#8C7A2E`
- Error: shadcn `<Alert>` destructive
- "Forgot password?" text link `#8C7A2E`

Auth: Supabase Auth `signInWithPassword` → check admin role → redirect `/admin/dashboard`. Non-admin: sign out + "Not authorised."

---

## Admin Screen 2: Dashboard
**Route:** `/admin/dashboard`

- H1 "Dashboard" + date range picker (shadcn `<Popover>` + `<Calendar>` range, presets: Today/7d/30d/Month)
- **4 KPI cards** (bg `#F5ECDA`): Revenue, Orders, New customers, Avg order value. Each: value Cormorant Garamond 500 28px + trend arrow (`#5A8A6A` up, `#B5453A` down) + % vs prev period Lato 13px.
- Revenue area chart: Recharts `<AreaChart>`, line `#D4AF37`, fill `rgba(212,175,55,0.1)`, grid lines `#D4AF37` at 15%.
- Orders by status donut: Recharts `<PieChart>`. Colors: confirmed `#6B8DA6`, shipped `#C49B2A`, delivered `#5A8A6A`, cancelled `#B5453A`.
- Recent orders table (last 10): shadcn `<Table>`. Order #, Customer, Items, Total, Status badge, Date, "View" link.
- Top products table (last 30d by revenue): image 32px, Name, Units sold, Revenue.
- Low stock alert: shadcn `<Alert>` warning if any `stock_quantity < threshold`. Lists products.

---

## Admin Screen 3: Products List
**Route:** `/admin/products`

- H1 "Products" + "Add product" pill button → `/admin/products/new`
- Search (by name/SKU) + status filter + collection filter
- Table: checkbox, thumbnail 40px, Name Cormorant Garamond 600 15px, SKU, Collection, Price, Stock qty (warning color if <5), Status badge, Updated at, Edit (lucide `Pencil`) / Archive (lucide `Archive`) actions
- Bulk actions bar (on selection): Archive / Delete. shadcn `<AlertDialog>` for destructive.
- Pagination: shadcn `<Pagination>`, page size 25.

---

## Admin Screen 4: Add / Edit Product
**Route:** `/admin/products/new` | `/admin/products/[id]/edit`  
**Layout:** Two-column (form left ~65%, sidebar right ~35%).

**Left:**
- Name (`<Input>`), Slug (auto-gen, editable), Description (`<Textarea>` 5 rows + char count), Fabric (`<Input>`), Care instructions (`<Textarea>`), Tags (multi-select add-on-Enter), Images (drag-drop zone, Supabase Storage, drag-to-reorder via dnd-kit, max 8)
- AI Photography link: "Generate AI images →" (new tab to `/admin/automation/ai-photography`)

**Right sidebar:**
- Status: shadcn `<Select>` Draft/Published/Archived
- Collection: `<Select>`
- Price + Compare at price: `<Input>` type=number with ₹ prefix
- SKU, Stock quantity
- Sizes: pill toggles (multi-select)
- "Save draft" outline + "Publish" filled pill buttons
- "View on store" text link, "Delete product" `#B5453A` text link → `<AlertDialog>`

---

## Admin Screen 5: Collections Management
**Route:** `/admin/collections`

- H1 "Collections" + "New collection" button
- 2-col card grid: cover image 80×100px, name Cormorant Garamond 600 18px, description, piece count, published badge, Edit/Archive actions
- Add/Edit via shadcn `<Sheet>` right: Name, slug, description, cover image upload, published toggle.

---

## Admin Screen 6: Orders List
**Route:** `/admin/orders`

- H1 "Orders" + Export CSV button
- Filters: date range picker, status `<Select>`, search by order #/customer name/phone
- Table: Order #, Customer name + phone Lato 13px, Items count, Total, Payment method, Status badge, Created at, "View" link
- Pagination: page size 25

---

## Admin Screen 7: Order Detail + Status Update
**Route:** `/admin/orders/[id]`

- Order # + date + payment status badge. "Back to orders"
- Status update: shadcn `<Select>` + "Update status" button → Supabase update → n8n webhook → WhatsApp customer notification
- Items, price breakdown, shipping details (address, AWB editable input, tracking URL editable, Shiprocket order ID)
- Customer card: name, email, phone, segment badge, link to customer profile
- Internal notes: `<Textarea>` + "Save note" button
- Timeline: vertical status history list with timestamps Lato 13px at 60% (from `order_events` table)
- Actions: Cancel order, trigger refund (Razorpay via Edge Function)

---

## Admin Screen 8: Returns & Exchanges Management
**Route:** `/admin/returns`

- Returns table: Return #, Order #, Customer, Items, Reason, Preferred resolution, Status badge, Submitted date, View
- Status filter: Pending/Approved/Rejected/Completed
- Return detail: shadcn `<Sheet>` right on row click. Full details, uploaded photos (lightbox), approve/reject/process actions, notes field. Status update → n8n WhatsApp notification.
- Bulk: Approve / Reject selected.

---

## Admin Screen 9: Customers List
**Route:** `/admin/customers`

- H1 "Customers" + Export CSV
- Filters: search by name/email/phone, segment filter, date joined range
- Table: Avatar initials circle (bg `#F5ECDA`), Full name, Email, Phone, Segment badge, Total orders, Total spent Cormorant Garamond 500, Last order date, WhatsApp opted (lucide `CheckCircle`/`XCircle`)
- Segment badge colors: New `#6B8DA6`, Repeat `#5A8A6A`, VIP gold shine bg, At risk `#C49B2A`, Dormant `#B5453A`. All Lato 13px 500 `#FAF8F3`.
- Pagination: page size 50

---

## Admin Screen 10: Customer Detail
**Route:** `/admin/customers/[id]`

- Avatar 64px initials, name Cormorant Garamond 600 24px, email, phone, segment badge, member since
- 3 stat cards: Total orders, Total spent, Avg order value
- Tabs: Orders / Returns / Notes
- Edit: segment override (admin can manually set to VIP), WhatsApp toggle
- Send WhatsApp: `<Textarea>` + "Send" → n8n/Interakt API

---

## Admin Screen 11: Analytics
**Route:** `/admin/analytics`

- Date range picker
- Revenue over time: Recharts `<AreaChart>` with daily/weekly/monthly toggle
- Orders by status: Recharts `<BarChart>`
- New vs returning customers: Recharts `<LineChart>` (`#D4AF37` new, `#9FAF90` returning)
- Top collections by revenue: Recharts `<BarChart>` horizontal
- Top products by revenue: table + bar indicator
- Customer segment distribution: Recharts `<PieChart>`
- Payment method breakdown: Recharts `<PieChart>`
- Cohort retention table: shadcn `<Table>`, CSS heat-map cell coloring (`#F5ECDA` → `#5A8A6A`)

---

## Admin Screen 12: Coupons
**Route:** `/admin/coupons`

- H1 "Coupons" + "Create coupon" button
- Table: Code, type, value, min order, usage count/limit, valid from/to, active shadcn `<Switch>`, Edit/Delete
- Create/Edit via shadcn `<Sheet>`: Code (+ random suggest button), Type (% or flat, shadcn `<RadioGroup>`), Value, Min order, Usage limit (blank = unlimited), Valid from/to, Active toggle.

---

## Admin Screen 13: Store Settings
**Route:** `/admin/settings`  
**Tabs:** General / Shipping / Payments / Notifications / SEO / Branding

- **General:** Store name, tagline, contact email, WhatsApp, address
- **Shipping:** Free shipping threshold (₹999 default), flat rate (₹99), COD toggle, COD order limit, COD pincode whitelist textarea
- **Payments:** Razorpay Key ID (masked), Live/Test toggle, "Test connection" button
- **Notifications:** Per-trigger toggles (order confirmed WhatsApp, shipped, abandoned cart, re-engagement) + delay intervals
- **SEO:** Meta title, meta description, OG image upload
- **Branding:** Logo upload, favicon upload, preview

---

## Admin Screen 14: Admin Profile & Security
**Route:** `/admin/profile`

- Avatar (upload), name (edit), email (read-only)
- Change password: old/new/confirm, Supabase Auth `updateUser`
- 2FA: TOTP setup via Supabase Auth MFA
- Active sessions table: device, IP, last seen, "Revoke" per session
- Audit log: last 50 admin actions table (action, resource, timestamp)
- Sign out all sessions button

---

---

# PART 4 — ADMIN AUTOMATION CONTROL CENTER

---

## Admin Screen 15: Automation Dashboard
**Route:** `/admin/automation`

- H1 "Automation Center" + eyebrow "Powered by n8n" Lato 13px `#9FAF90`
- 7 automation status cards (bg `#F5ECDA`): icon + name Cormorant Garamond 600 18px + description Lato 13px + status badge (Active `#5A8A6A` / Paused `#C49B2A` / Error `#B5453A`) + last run + "Configure" link + active shadcn `<Switch>` (calls n8n webhook to activate/deactivate)
- Recent automation activity log: shadcn `<Table>`, 50 rows. Automation, Trigger, Status, Timestamp, Details.

---

## Admin Screen 16: AI Photography Hub
**Route:** `/admin/automation/ai-photography`

- H1 "AI Photography Hub" + description Lato 14px
- **Step 1:** Select product (shadcn `<Select>`) + preview
- **Step 2:** Drag-drop upload zone for garment flat image
- **Step 3:** Settings — Model type (Indian Female Model only), Background dropdown (Studio White / Courtyard / Linen Texture / Outdoor Warm), Angle checkboxes (Front/Side/Back/Lifestyle). "Generate photos" pill button. Loading: "Generating... 30–60 seconds per angle." + indeterminate progress bar bg `#D4AF37`.
- **Step 4:** Review grid (2-col). Each image: approve lucide `CheckCircle` / reject lucide `X` / regenerate. Approved → Supabase Storage + `ai_images` table `is_approved: true`.
- Approved images library below (all approved for this product).

---

## Admin Screen 17: WhatsApp Communication Center
**Route:** `/admin/automation/whatsapp`  
**Tabs:** Templates / Send Broadcast / Automation Triggers / Message Log

- **Templates:** List from Interakt/AiSensy API. Status: Approved/Pending/Rejected. Preview.
- **Broadcast:** Segment selector, template selector, preview, estimated recipient count, "Send broadcast" → n8n webhook → Interakt API. Confirmation dialog.
- **Triggers:** Table of which n8n workflows send WhatsApp. Toggle + delay interval edits.
- **Message log (7d):** Recipient, template, sent at, status (Sent/Delivered/Read/Failed). Pagination.

---

## Admin Screen 18: Abandoned Cart Recovery
**Route:** `/admin/automation/abandoned-cart`

- Stats row: Carts abandoned (30d), Recovery rate %, Revenue recovered
- Sequence settings:
  - Trigger: abandon after X minutes (default 30, `<Input>` type=number)
  - Message 1: delay 30 min, template selector, toggle
  - Message 2: delay 24h, template selector + optional coupon from coupons list, toggle
  - Max 2 messages (brand constraint: no push blasting)
  - "Save sequence" button
- Abandoned carts table: Customer, cart value, items compact, abandoned at, recovery status, last message sent

---

## Admin Screen 19: Inventory Intelligence
**Route:** `/admin/automation/inventory`

- Threshold settings: Low stock (default 5), Out-of-stock (0). `<Input>`. Save button.
- Notification channels: Email, WhatsApp (admin number). Toggle each.
- Stock dashboard: shadcn `<Table>`. Product, SKU, Stock qty, Status badge, Last updated. Filter: All/Low Stock/Out of Stock. Inline stock update: `<Input>` in qty cell + update icon button.
- Restock alerts log: recent alerts with timestamps.

---

## Admin Screen 20: Customer Lifecycle Manager
**Route:** `/admin/automation/lifecycle`

- Segment overview: shadcn `<Table>`. Segment name, rule description, customer count, active campaigns.
- Segment rules (display only): New / Repeat / VIP (5+ orders or ≥ ₹25,000) / At Risk (>60d) / Dormant (>120d)
- Per-segment campaign settings: re-engagement WhatsApp template, frequency (days), toggle. Birthday campaign toggle + template + coupon.
- Campaign performance: shadcn `<Table>`. Segment, campaign type, sent, opened (WhatsApp read receipts), orders attributed.

---

## Admin Screen 21: Social Media Manager
**Route:** `/admin/automation/social`

- **`<SocialComposer>`:** Image upload or select from product gallery (Supabase Storage browser). Caption textarea (2,200 char limit). Platform toggles (Instagram always, Facebook optional). Schedule: "Post now" or date-time picker (IST). "Schedule post" / "Post now" → n8n webhook → Meta Graph API.
- **Content calendar:** `<CalendarView>` (custom, dayjs). Day cells show scheduled post dot per platform. Click day → posts for that day. Click post → edit/delete.
- **Published posts grid (last 12):** Thumbnail + caption preview + platform icons + engagement (likes/comments from Meta Graph API). Lato 13px.
- **Connection status:** Instagram + Facebook page connected badges. "Reconnect" links.

---

## Admin Screen 22: AI Chatbot Settings
**Route:** `/admin/automation/chatbot`

- **Identity:** Name `<Input>` (default "Savinra Concierge"), Greeting message `<Textarea>`, Tone instructions `<Textarea>` (pre-filled brand voice excerpt, used as system prompt prefix), Max response length `<Input>` (tokens, default 250).
- **Knowledge base:** FAQ Q&A pairs (add/edit/delete, injected as context), Product catalog toggle (first 50 products as JSON summary in system prompt), Escalation trigger phrases (comma-separated: if detected → offer WhatsApp handoff).
- **Master toggle:** shadcn `<Switch>` on/off (off = chatbot bubble hidden on store).
- **Test interface:** `<ChatInterface>` (same as store, routes to production Edge Function).
- **Conversation logs (7d):** Table — Session ID, Customer (if logged in), First message preview, Message count, Timestamp. Click row → full thread in `<Sheet>`.
- "Save settings" pill button.

---

---

## Component Registry

### Shared (`packages/ui/`)
- `<SavinraShineText>` — renders text with golden shine. Props: `variant: 'static' | 'animated' | 'on-dark'`. Use everywhere instead of applying CSS class manually.
- `<StatusBadge>` — colored pill for `OrderStatus | CustomerSegment`. All color mapping centralized here.
- `<PillButton>` — base button. Variants: `'primary'` (Antique Bronze bg), `'outline'` (bordered), `'ghost'` (text), `'dark'` (gold bg on dark).
- `<GoldDivider>` — `<hr>` styled `1px solid #D4AF37 at 30%`.

### Store (`apps/store/src/components/`)
Global: `SavinraHeader`, `SavinraFooter`, `ChatInterface` (floating chatbot)  
Home: `HeroSection`, `CollectionCard`, `CollectionSpotlight`, `FeaturedProducts`, `BrandStoryStrip`, `SustainabilityCallout`, `InstagramFeedPreview`  
Product: `ProductCard` (reused in 6+ screens), `ProductGallery`, `ProductImageLightbox`, `ProductDetails`, `SizeSelector`, `SizeGuideSheet`, `ProductDescriptionAccordion`, `CompleteTheLook`, `RecentlyViewed`  
Cart/Checkout: `CartItem`, `CartItemList`, `OrderSummary` (shared cart + checkout), `CheckoutForm`, `AddressCard`, `AddressForm`, `PaymentMethodSelector`  
Orders: `OrderConfirmationHero`, `OrderDetailsCard`, `OrderActionRow`, `OrderTrackingSteps`, `OrderListItem`  
Account: `AccountSidebar`, `ReturnRequestForm`

### Admin (`apps/admin/src/components/`)
Global: `AdminLayout`, `AdminSidebar`  
Dashboard: `MetricCard`  
Automation: `SocialComposer`, `CalendarView`, `ChatInterface` (reused)

---

## Data Fetching Conventions

- All Supabase queries via React Query (`useQuery`, `useInfiniteQuery`, `useMutation`)
- Query keys: `['products', { filters }]`, `['order', orderId]`, etc.
- Optimistic updates: cart operations, wishlist toggles
- Stale time: 5 min for product lists, 0 for cart/orders
- Error handling: `<ErrorBoundary>` per data section, Lato 14px "Something went wrong. Please try again." + retry button. No full-page crashes.
- Loading skeletons: bg `#F5ECDA` CSS shimmer (`@keyframes`), never bouncy.

---

## PWA Configuration

- Both store + admin via `vite-plugin-pwa` + Workbox
- Store: offline fallback for browsed products (cache-first static, network-first API)
- Admin: no offline support — show "No internet connection" screen
- Store install prompt: after 3rd visit. Banner: bg `#2C2622`, text `#FAF8F3`, logo `.savinra-shine-on-dark`, "Add Savinra to your home screen". "Add" pill bg `#D4AF37` text `#2C2622`. "Not now" text link.
