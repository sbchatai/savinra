// =============================================================================
// SAVINRA BRAND TOKENS
// Single source of truth — imported by both store and admin apps
// =============================================================================

export const colors = {
  // Primary
  gold: '#D4AF37',
  goldAccessible: '#8C7A2E',
  goldHighlight: '#F5E6A3',

  // Secondary
  sage: '#9FAF90',

  // Neutrals
  ivoryLinen: '#F5ECDA',
  parchment: '#FAF8F3',
  deepCocoa: '#2C2622',

  // Status
  success: '#5A8A6A',
  warning: '#C49B2A',
  error: '#B5453A',
  info: '#6B8DA6',
} as const

export const gradients = {
  // Static golden shine — all brand name instances
  shine: 'linear-gradient(135deg, #D4AF37 0%, #F5E6A3 40%, #D4AF37 60%, #8C7A2E 100%)',

  // Animated shimmer — hero/splash/loading
  shineAnimated: 'linear-gradient(90deg, #8C7A2E 0%, #D4AF37 25%, #F5E6A3 50%, #D4AF37 75%, #8C7A2E 100%)',

  // On dark backgrounds
  shineOnDark: 'linear-gradient(135deg, #D4AF37 0%, #F5E6A3 35%, #FFFACD 50%, #F5E6A3 65%, #D4AF37 100%)',
} as const

export const fonts = {
  heading: "'Cormorant Garamond', serif",
  body: "'Lato', sans-serif",
  googleFontsUrl:
    'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Lato:wght@300;400;500;700&display=swap',
} as const

export const shadows = {
  card: '0 2px 8px rgba(44,38,34,0.08)',
} as const

export const radii = {
  card: '8px',
  button: '24px',
  input: '4px',
  image: '8px',
} as const
