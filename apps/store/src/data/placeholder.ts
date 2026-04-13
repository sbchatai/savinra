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
  sizes: string[]
  tags: string[]
  inStock: boolean
  stockCount: number
  isNew?: boolean
  isBestseller?: boolean
}

export interface Collection {
  id: string
  name: string
  slug: string
  description: string
  coverImage: string
  productCount: number
}

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Saffron Silk Kurta Set',
    slug: 'saffron-silk-kurta-set',
    price: 8500,
    compareAtPrice: 11000,
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80',
      'https://images.unsplash.com/photo-1594938298603-c8148c4b4e56?w=800&q=80',
    ],
    collection: 'Festive Glow',
    collectionSlug: 'festive-glow',
    description: 'A luminous saffron silk kurta paired with palazzos, hand-embroidered with gold threadwork along the neckline and cuffs. Perfect for festive celebrations.',
    fabric: 'Pure Silk',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    tags: ['festive', 'silk', 'embroidered'],
    inStock: true,
    stockCount: 8,
    isNew: true,
  },
  {
    id: 'p2',
    name: 'Midnight Indigo Anarkali',
    slug: 'midnight-indigo-anarkali',
    price: 12500,
    images: [
      'https://images.unsplash.com/photo-1609357605129-1283b117c1e2?w=800&q=80',
      'https://images.unsplash.com/photo-1617627143233-9b86e64a31ad?w=800&q=80',
    ],
    collection: 'Heritage Craft',
    collectionSlug: 'heritage-craft',
    description: 'Floor-length anarkali in midnight indigo georgette, featuring hand-blocked floral prints and delicate mirror work at the hem.',
    fabric: 'Georgette',
    sizes: ['XS', 'S', 'M', 'L'],
    tags: ['anarkali', 'georgette', 'handblock'],
    inStock: true,
    stockCount: 5,
    isBestseller: true,
  },
  {
    id: 'p3',
    name: 'Ivory Linen Co-ord Set',
    slug: 'ivory-linen-coord-set',
    price: 6800,
    compareAtPrice: 8500,
    images: [
      'https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?w=800&q=80',
      'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&q=80',
    ],
    collection: 'Everyday Elegance',
    collectionSlug: 'everyday-elegance',
    description: 'Breathable linen co-ord set in natural ivory \u2014 a wide-leg palazzo paired with a relaxed crop top featuring pintuck detailing.',
    fabric: '100% Linen',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    tags: ['linen', 'coord', 'casual'],
    inStock: true,
    stockCount: 15,
  },
  {
    id: 'p4',
    name: 'Rose Blush Chanderi Suit',
    slug: 'rose-blush-chanderi-suit',
    price: 9200,
    images: [
      'https://images.unsplash.com/photo-1571513800374-df1bbe650e56?w=800&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80',
    ],
    collection: 'Heritage Craft',
    collectionSlug: 'heritage-craft',
    description: 'Soft chanderi suit in rose blush, adorned with delicate zardozi embroidery on the yoke. Comes with a contrast dupatta.',
    fabric: 'Chanderi Silk',
    sizes: ['S', 'M', 'L', 'XL'],
    tags: ['chanderi', 'zardozi', 'suit'],
    inStock: true,
    stockCount: 4,
    isNew: true,
  },
  {
    id: 'p5',
    name: 'Forest Green Wrap Dress',
    slug: 'forest-green-wrap-dress',
    price: 5500,
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
    ],
    collection: 'Everyday Elegance',
    collectionSlug: 'everyday-elegance',
    description: 'Contemporary wrap dress in forest green rayon with subtle batik print. Versatile enough for work and evenings.',
    fabric: 'Rayon',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    tags: ['wrap-dress', 'batik', 'everyday'],
    inStock: true,
    stockCount: 12,
    isBestseller: true,
  },
  {
    id: 'p6',
    name: 'Terracotta Block Print Kurta',
    slug: 'terracotta-block-print-kurta',
    price: 3800,
    compareAtPrice: 4500,
    images: [
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80',
      'https://images.unsplash.com/photo-1617922001439-4a2e6562f328?w=800&q=80',
    ],
    collection: 'Everyday Elegance',
    collectionSlug: 'everyday-elegance',
    description: 'Hand block-printed kurta in warm terracotta on cotton, featuring traditional Bagru motifs. Pairs beautifully with jeans or churidar.',
    fabric: 'Cotton',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    tags: ['blockprint', 'cotton', 'casual'],
    inStock: true,
    stockCount: 20,
  },
]

export const COLLECTIONS: Collection[] = [
  {
    id: 'c1',
    name: 'Festive Glow',
    slug: 'festive-glow',
    description: 'Opulent pieces for celebrations \u2014 silk, embroidery, and gold threadwork for moments that demand radiance.',
    coverImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1200&q=80',
    productCount: 12,
  },
  {
    id: 'c2',
    name: 'Heritage Craft',
    slug: 'heritage-craft',
    description: 'Hand-embroidered and hand-woven pieces that honour centuries of Indian textile traditions.',
    coverImage: 'https://images.unsplash.com/photo-1609357605129-1283b117c1e2?w=1200&q=80',
    productCount: 18,
  },
  {
    id: 'c3',
    name: 'Everyday Elegance',
    slug: 'everyday-elegance',
    description: 'Refined daily wear \u2014 breathable fabrics, effortless silhouettes, and quiet luxury for the modern Indian woman.',
    coverImage: 'https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?w=1200&q=80',
    productCount: 24,
  },
]

export const ORDERS = [
  {
    id: 'ORD-2026-0042',
    date: '2 Apr 2026',
    status: 'delivered' as const,
    total: 8500,
    items: [{ name: 'Saffron Silk Kurta Set', qty: 1, size: 'M', price: 8500, image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=200&q=80' }],
    address: '12, Green Park Extension, New Delhi \u2014 110016',
    awb: '123456789012',
    carrier: 'Delhivery',
  },
  {
    id: 'ORD-2026-0031',
    date: '18 Mar 2026',
    status: 'processing' as const,
    total: 12500,
    items: [{ name: 'Midnight Indigo Anarkali', qty: 1, size: 'S', price: 12500, image: 'https://images.unsplash.com/photo-1609357605129-1283b117c1e2?w=200&q=80' }],
    address: '12, Green Park Extension, New Delhi \u2014 110016',
    awb: null,
    carrier: null,
  },
]

export const FAQS = [
  { category: 'Ordering', question: 'Can I change or cancel my order?', answer: 'You can cancel or modify your order within 2 hours of placing it. After that, the order enters processing and cannot be changed.' },
  { category: 'Ordering', question: 'Do you accept custom size requests?', answer: 'We currently offer standard sizes XS to XXL. Custom sizing is available for select pieces \u2014 contact us on WhatsApp.' },
  { category: 'Shipping', question: 'How long does delivery take?', answer: 'Standard delivery: 5\u20137 business days. Express delivery: 2\u20133 business days. Free shipping on orders above \u20b9999.' },
  { category: 'Shipping', question: 'Do you ship internationally?', answer: 'Currently we ship within India only. International shipping is coming in 2026.' },
  { category: 'Returns', question: 'What is your return policy?', answer: '15-day return window from delivery date. Items must be unworn with original tags attached. Earrings and customised pieces are non-returnable.' },
  { category: 'Returns', question: 'How do I initiate a return?', answer: 'Go to My Orders, select the order, and click "Request Return". Upload photos and select your reason. We will arrange a pickup within 48 hours.' },
  { category: 'Payments', question: 'What payment methods do you accept?', answer: 'UPI, Credit/Debit cards, Net banking, Wallets, and Cash on Delivery (orders up to \u20b95,000).' },
  { category: 'Payments', question: 'Is COD available everywhere?', answer: 'COD is available in most PIN codes across India. Enter your PIN code at checkout to check availability.' },
  { category: 'Sizing', question: 'How do I find my size?', answer: 'Each product page has a size guide with measurements in cm and inches. When in doubt, size up \u2014 our kurtas and dresses have a relaxed fit.' },
]
