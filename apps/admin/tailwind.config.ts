import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand palette — matches packages/shared/src/brand.ts
        parchment: '#FAF8F3',
        cocoa: '#2C2622',
        gold: '#D4AF37',
        'gold-accessible': '#8C7A2E',
        'gold-highlight': '#F5E6A3',
        sage: '#9FAF90',
        ivory: '#F5ECDA',
        // Admin semantic
        success: '#5A8A6A',
        warning: '#C49B2A',
        error: '#B5453A',
        info: '#6B8DA6',
        // Admin UI surfaces
        'admin-bg': '#F4F5F7',
        'admin-sidebar': '#1E1A17',
        'admin-sidebar-hover': '#2C2622',
        'admin-border': '#E5E2DC',
      },
      fontFamily: {
        heading: ['"Cormorant Garamond"', 'serif'],
        body: ['Lato', 'sans-serif'],
      },
      borderRadius: {
        pill: '24px',
        card: '8px',
      },
      boxShadow: {
        card: '0 2px 8px rgba(44,38,34,0.08)',
        'card-hover': '0 4px 16px rgba(44,38,34,0.14)',
        sidebar: '2px 0 8px rgba(44,38,34,0.12)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.3s ease-out',
        shimmer: 'shimmer 1.5s infinite linear',
      },
    },
  },
  plugins: [],
}

export default config
