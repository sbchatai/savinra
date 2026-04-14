export type CustomizationOptionType = 'text' | 'select' | 'color'

export interface CustomizationOption {
  id: string
  label: string
  type: CustomizationOptionType
  maxLength?: number
  choices?: string[]
  required: boolean
}

export interface Review {
  id: string
  name: string
  rating: number
  date: string
  body: string
  verified: boolean
  location: string
}

export interface Product {
  id: string
  name: string
  slug: string
  price: number
  compareAtPrice?: number
  images: string[]
  collection: string
  collectionSlug: string
  description: string
  fabric: string
  care: string
  craftStory: string
  sizes: string[]
  occasions: string[]
  tags: string[]
  inStock: boolean
  stockCount: number
  isNew?: boolean
  isBestseller?: boolean
  customizable: boolean
  customizationOptions: CustomizationOption[]
  reviews: Review[]
}

export interface Collection {
  id: string
  name: string
  slug: string
  description: string
  coverImage: string
  productCount: number
  occasion: string
}

// IMPORTANT: All Unsplash URLs must include ?w=800&h=1067&auto=format&fit=crop&q=80
// This ensures images load reliably. Never use bare Unsplash URLs without these params.

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Saffron Silk Kurta Set',
    slug: 'saffron-silk-kurta-set',
    price: 8500,
    compareAtPrice: 11000,
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&h=1067&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1566206091558-7f218b696731?w=800&h=1067&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=1067&auto=format&fit=crop&q=80',
    ],
    collection: 'Festive Glow',
    collectionSlug: 'festive-glow',
    description: 'A luminous saffron silk kurta paired with wide-leg palazzos, hand-embroidered with gold threadwork along the neckline and cuffs. The set arrives with a complementary organza dupatta in champagne gold.',
    fabric: 'Pure Mulberry Silk',
    care: 'Dry clean only. Store in muslin cloth. Avoid direct sunlight.',
    craftStory: 'Hand-embroidered by artisans in Varanasi using century-old zardozi techniques. Each set takes 14 days to complete.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    occasions: ['festive', 'wedding'],
    tags: ['festive', 'silk', 'embroidered', 'set'],
    inStock: true,
    stockCount: 8,
    isNew: true,
    customizable: true,
    customizationOptions: [
      { id: 'monogram', label: 'Monogram Embroidery (2\u20133 letters)', type: 'text', maxLength: 3, required: false },
      { id: 'embroidery_color', label: 'Embroidery Thread Color', type: 'color', choices: ['Gold', 'Silver', 'Rose Gold', 'Ivory'], required: false },
    ],
    reviews: [
      { id: 'r1', name: 'Priya Mehta', rating: 5, date: '10 Mar 2026', body: 'Absolutely stunning. The silk quality is exceptional and the embroidery detail is breathtaking. Got so many compliments at the wedding.', verified: true, location: 'Mumbai' },
      { id: 'r2', name: 'Ananya Sharma', rating: 5, date: '28 Feb 2026', body: 'Worth every rupee. The fit is perfect (ordered M) and the colour is exactly as shown. Delivery was quick too.', verified: true, location: 'Delhi' },
      { id: 'r3', name: 'Kavitha R', rating: 4, date: '15 Feb 2026', body: 'Beautiful piece. The dupatta is a lovely addition. Slightly long for my height but easily alterable.', verified: true, location: 'Bangalore' },
    ],
  },
  {
    id: 'p2',
    name: 'Midnight Indigo Anarkali',
    slug: 'midnight-indigo-anarkali',
    price: 12500,
    images: [
      'https://images.unsplash.com/photo-1526413232644-8a40f03cc03b?w=800&h=1067&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=1067&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1571513800374-df1bbe650e56?w=800&h=1067&auto=format&fit=crop&q=80',
    ],
    collection: 'Heritage Craft',
    collectionSlug: 'heritage-craft',
    description: 'A floor-sweeping anarkali in midnight indigo georgette, featuring hand-blocked floral prints and delicate mirror work at the hem. Comes with churidar and embroidered dupatta.',
    fabric: 'Pure Georgette',
    care: 'Gentle hand wash in cold water. Do not wring. Dry in shade.',
    craftStory: 'Block-printed by master craftsmen in Bagru, Rajasthan using natural indigo dye. The mirror work is hand-stitched by Kutchi artisans.',
    sizes: ['XS', 'S', 'M', 'L'],
    occasions: ['festive', 'wedding', 'party'],
    tags: ['anarkali', 'georgette', 'handblock', 'mirror-work'],
    inStock: true,
    stockCount: 5,
    isBestseller: true,
    customizable: true,
    customizationOptions: [
      { id: 'sleeve', label: 'Sleeve Length', type: 'select', choices: ['3/4 Sleeve (Standard)', 'Full Sleeve', 'Sleeveless'], required: true },
      { id: 'monogram', label: 'Monogram on Dupatta (optional)', type: 'text', maxLength: 3, required: false },
    ],
    reviews: [
      { id: 'r1', name: 'Sneha Pillai', rating: 5, date: '5 Apr 2026', body: 'This is the most beautiful piece I own. The indigo colour is rich and deep, not at all faded. Wore it to a sangeet and was literally stopped for photos.', verified: true, location: 'Chennai' },
      { id: 'r2', name: 'Deepa Nair', rating: 5, date: '20 Mar 2026', body: 'The block print quality is outstanding. You can tell this is handmade. Fits beautifully. Will definitely order again.', verified: true, location: 'Kochi' },
    ],
  },
  {
    id: 'p3',
    name: 'Ivory Linen Co-ord Set',
    slug: 'ivory-linen-coord-set',
    price: 6800,
    compareAtPrice: 8500,
    images: [
      'https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?w=800&h=1067&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&h=1067&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1067&auto=format&fit=crop&q=80',
    ],
    collection: 'Everyday Elegance',
    collectionSlug: 'everyday-elegance',
    description: 'A breathable linen co-ord set in natural ivory \u2014 a wide-leg palazzo with an elasticated waist paired with a relaxed crop top featuring pintuck detailing and a front button closure.',
    fabric: '100% Belgian Linen',
    care: 'Machine wash cold on gentle cycle. Tumble dry low. Iron on medium heat.',
    craftStory: 'Woven from Belgian linen on handlooms in Bhagalpur. Pintuck detailing by artisans in Kolkata.',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    occasions: ['casual', 'work'],
    tags: ['linen', 'coord', 'casual', 'sustainable'],
    inStock: true,
    stockCount: 15,
    customizable: false,
    customizationOptions: [],
    reviews: [
      { id: 'r1', name: 'Rhea Kapoor', rating: 5, date: '8 Apr 2026', body: 'This is my third order from Savinra and this set is my favourite. So comfortable for the Delhi heat. The ivory colour is perfect.', verified: true, location: 'Delhi' },
      { id: 'r2', name: 'Tanya Singh', rating: 4, date: '1 Apr 2026', body: 'Lovely quality. The linen does wrinkle (as expected) but gives that beautiful relaxed look. Highly recommend.', verified: true, location: 'Jaipur' },
    ],
  },
  {
    id: 'p4',
    name: 'Rose Blush Chanderi Suit',
    slug: 'rose-blush-chanderi-suit',
    price: 9200,
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&h=1067&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1617922001439-4a2e6562f328?w=800&h=1067&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&h=1067&auto=format&fit=crop&q=80',
    ],
    collection: 'Heritage Craft',
    collectionSlug: 'heritage-craft',
    description: 'A soft chanderi suit in dusty rose blush, adorned with delicate zardozi embroidery along the yoke and sleeves. Comes with a silk churidar and a contrast sage dupatta with gold border.',
    fabric: 'Chanderi Silk with Zari',
    care: 'Dry clean only. Keep away from moisture. Store flat.',
    craftStory: 'Woven on handlooms in Chanderi, MP \u2014 one of India\'s oldest textile towns. Embroidery by master zardozi craftsmen in Lucknow.',
    sizes: ['S', 'M', 'L', 'XL'],
    occasions: ['festive', 'work', 'party'],
    tags: ['chanderi', 'zardozi', 'suit', 'embroidered'],
    inStock: true,
    stockCount: 4,
    isNew: true,
    customizable: true,
    customizationOptions: [
      { id: 'sleeve', label: 'Sleeve Length', type: 'select', choices: ['3/4 Sleeve (Standard)', 'Full Sleeve'], required: true },
      { id: 'embroidery_color', label: 'Embroidery Color', type: 'color', choices: ['Gold (Standard)', 'Silver', 'Rose Gold'], required: false },
      { id: 'monogram', label: 'Monogram on Kurta (optional, 2\u20133 letters)', type: 'text', maxLength: 3, required: false },
    ],
    reviews: [
      { id: 'r1', name: 'Meera Iyer', rating: 5, date: '3 Apr 2026', body: 'This suit is pure elegance. The chanderi fabric feels luxurious and the zardozi work is so intricate. Perfect for my mehendi function.', verified: true, location: 'Hyderabad' },
    ],
  },
  {
    id: 'p5',
    name: 'Forest Green Wrap Dress',
    slug: 'forest-green-wrap-dress',
    price: 5500,
    images: [
      'https://images.unsplash.com/photo-1566206091558-7f218b696731?w=800&h=1067&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=1067&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?w=800&h=1067&auto=format&fit=crop&q=80',
    ],
    collection: 'Everyday Elegance',
    collectionSlug: 'everyday-elegance',
    description: 'A contemporary wrap dress in deep forest green rayon with a hand-painted batik print. The adjustable wrap tie creates a flattering silhouette for all body types.',
    fabric: 'Viscose Rayon with Batik Print',
    care: 'Machine wash cold on delicate cycle. Air dry. Cool iron.',
    craftStory: 'Batik-printed by artisans in Ahmedabad using centuries-old wax-resist dyeing technique.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    occasions: ['casual', 'work', 'party'],
    tags: ['wrap-dress', 'batik', 'everyday', 'flattering'],
    inStock: true,
    stockCount: 12,
    isBestseller: true,
    customizable: false,
    customizationOptions: [],
    reviews: [
      { id: 'r1', name: 'Sonal Gupta', rating: 5, date: '12 Apr 2026', body: 'Wore this to an office lunch and got compliments from everyone. The wrap style is so flattering. The green is rich and deep.', verified: true, location: 'Pune' },
      { id: 'r2', name: 'Aditi Rao', rating: 4, date: '6 Apr 2026', body: 'Beautiful dress. Runs slightly large so I recommend sizing down. The batik print is unique and artistic.', verified: true, location: 'Bangalore' },
    ],
  },
  {
    id: 'p6',
    name: 'Terracotta Block Print Kurta',
    slug: 'terracotta-block-print-kurta',
    price: 3800,
    compareAtPrice: 4500,
    images: [
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=1067&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1571513800374-df1bbe650e56?w=800&h=1067&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1526413232644-8a40f03cc03b?w=800&h=1067&auto=format&fit=crop&q=80',
    ],
    collection: 'Everyday Elegance',
    collectionSlug: 'everyday-elegance',
    description: 'A hand block-printed kurta in warm terracotta on 100% organic cotton, featuring traditional Bagru floral motifs. Straight cut, comfortable length, pairs beautifully with jeans, churidar, or palazzos.',
    fabric: '100% Organic Cotton',
    care: 'Machine wash cold separately. First wash may bleed slightly \u2014 this is normal for block prints.',
    craftStory: 'Block-printed by families in Bagru village, Rajasthan who have practiced this craft for eight generations.',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    occasions: ['casual', 'work'],
    tags: ['blockprint', 'cotton', 'casual', 'sustainable', 'organic'],
    inStock: true,
    stockCount: 20,
    customizable: false,
    customizationOptions: [],
    reviews: [
      { id: 'r1', name: 'Pallavi Desai', rating: 5, date: '9 Apr 2026', body: 'This is my everyday favourite now. Washes beautifully, colours stay rich. The terracotta shade is gorgeous.', verified: true, location: 'Ahmedabad' },
      { id: 'r2', name: 'Nisha Kumar', rating: 5, date: '2 Apr 2026', body: 'Love everything about this \u2014 the fabric, the print, the cut. Bought in 3 colours. Outstanding value.', verified: true, location: 'Chennai' },
    ],
  },
]

export const COLLECTIONS: Collection[] = [
  {
    id: 'c1',
    name: 'Festive Glow',
    slug: 'festive-glow',
    description: 'Opulent pieces for celebrations \u2014 silk, embroidery, and gold threadwork for moments that demand radiance.',
    coverImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1200&h=800&auto=format&fit=crop&q=80',
    productCount: 12,
    occasion: 'festive',
  },
  {
    id: 'c2',
    name: 'Heritage Craft',
    slug: 'heritage-craft',
    description: 'Hand-embroidered and hand-woven pieces that honour centuries of Indian textile traditions.',
    coverImage: 'https://images.unsplash.com/photo-1526413232644-8a40f03cc03b?w=1200&h=800&auto=format&fit=crop&q=80',
    productCount: 18,
    occasion: 'wedding',
  },
  {
    id: 'c3',
    name: 'Everyday Elegance',
    slug: 'everyday-elegance',
    description: 'Refined daily wear \u2014 breathable fabrics, effortless silhouettes, and quiet luxury for the modern Indian woman.',
    coverImage: 'https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?w=1200&h=800&auto=format&fit=crop&q=80',
    productCount: 24,
    occasion: 'casual',
  },
]

export const ORDERS = [
  {
    id: 'ORD-2026-0042',
    date: '2 Apr 2026',
    status: 'delivered' as const,
    total: 8500,
    items: [{ name: 'Saffron Silk Kurta Set', qty: 1, size: 'M', price: 8500, image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=200&h=267&auto=format&fit=crop&q=80' }],
    address: '12, Green Park Extension, New Delhi \u2014 110016',
    awb: '123456789012',
    carrier: 'Delhivery',
  },
  {
    id: 'ORD-2026-0031',
    date: '18 Mar 2026',
    status: 'processing' as const,
    total: 12500,
    items: [{ name: 'Midnight Indigo Anarkali', qty: 1, size: 'S', price: 12500, image: 'https://images.unsplash.com/photo-1526413232644-8a40f03cc03b?w=200&h=267&auto=format&fit=crop&q=80' }],
    address: '12, Green Park Extension, New Delhi \u2014 110016',
    awb: null,
    carrier: null,
  },
]

export const FAQS = [
  { category: 'Ordering', question: 'Can I change or cancel my order?', answer: 'You can cancel or modify your order within 2 hours of placing it. After that, the order enters processing and cannot be changed. For urgent changes, WhatsApp us immediately.' },
  { category: 'Ordering', question: 'Do you accept custom size requests?', answer: 'Custom sizing is available for all customisable products. After placing your order, our team will WhatsApp you for measurements within 24 hours.' },
  { category: 'Ordering', question: 'How does the customisation option work?', answer: 'Select your customisation preferences (monogram, embroidery colour, sleeve length etc.) on the product page before adding to bag. Our artisans will add 3\u20135 extra days to create your personalised piece.' },
  { category: 'Shipping', question: 'How long does delivery take?', answer: 'Standard delivery: 5\u20137 business days. Express delivery: 2\u20133 business days. Customised orders: add 3\u20135 business days. Free shipping on orders above \u20b9999.' },
  { category: 'Shipping', question: 'Do you ship internationally?', answer: 'We currently ship across India. International shipping to UAE, UK, USA, and Canada is coming in late 2026. Join our waitlist to be notified.' },
  { category: 'Returns', question: 'What is your return policy?', answer: '15-day return window from delivery date. Items must be unworn with original tags attached. Customised/personalised pieces are non-returnable. Earrings are non-returnable for hygiene reasons.' },
  { category: 'Returns', question: 'How do I initiate a return?', answer: 'Go to My Orders \u2192 Select the order \u2192 Request Return. Upload 2\u20133 photos of the item. We arrange pickup within 48 hours of approval. Refund processed in 5\u20137 business days.' },
  { category: 'Payments', question: 'What payment methods do you accept?', answer: 'UPI (PhonePe, GPay, Paytm), Credit/Debit cards (Visa, Mastercard, Amex), Net banking (all major banks), Wallets, and Cash on Delivery (orders up to \u20b95,000, selected PIN codes).' },
  { category: 'Payments', question: 'Is COD available everywhere?', answer: 'COD is available across 19,000+ PIN codes in India. Enter your PIN code at checkout to check availability. COD has a small handling fee of \u20b949.' },
  { category: 'Sizing', question: 'How do I find my size?', answer: 'Use the "Size Guide" on each product page \u2014 it has measurements in cm and inches. If between sizes, we recommend sizing up. Our kurtas and dresses have a relaxed fit with room to move.' },
  { category: 'Sizing', question: 'Do you offer custom sizing?', answer: 'Yes, for customisable products. Custom sizing adds \u20b9500 to the product price and 3\u20135 days to delivery. Select "Custom Fit" in customisation options and our team will contact you for measurements.' },
]

export const PRESS_MENTIONS = [
  { name: 'Vogue India', quote: '"Savinra\'s pieces feel like wearable art \u2014 contemporary yet deeply rooted in craft."', issue: 'March 2026' },
  { name: 'Harper\'s Bazaar', quote: '"The brand redefining indo-western fashion for the modern Indian woman."', issue: 'February 2026' },
  { name: 'Elle India', quote: '"Savinra is on every fashion editor\'s radar right now."', issue: 'April 2026' },
]
