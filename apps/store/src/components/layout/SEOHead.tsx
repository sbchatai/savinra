import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'Savinra'
const DEFAULT_TITLE = 'Savinra — Handcrafted Indo-Western Fashion'
const DEFAULT_DESCRIPTION =
  'Shop premium handcrafted Indo-Western clothing at Savinra. Kurtas, suits, festive wear — free shipping above ₹999.'
const BASE_URL = 'https://savinra.in'
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-default.jpg`

interface SEOHeadProps {
  title?: string
  description?: string
  canonical?: string
  ogImage?: string
  ogType?: 'website' | 'product'
  noIndex?: boolean
  jsonLd?: object | object[]
}

export default function SEOHead({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  noIndex = false,
  jsonLd,
}: SEOHeadProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE
  const canonicalUrl = canonical ? `${BASE_URL}${canonical}` : undefined

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {noIndex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}

      {/* Twitter */}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(Array.isArray(jsonLd) ? jsonLd : [jsonLd])}
        </script>
      )}
    </Helmet>
  )
}
