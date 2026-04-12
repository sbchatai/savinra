/**
 * Format a number as Indian Rupees.
 * Uses native Intl — zero dependencies.
 */
export const formatINR = (amount: number): string =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)

/**
 * Parse a Razorpay amount (paise) to rupees.
 * Razorpay stores amounts in paise (1 INR = 100 paise).
 */
export const paiseToRupees = (paise: number): number => paise / 100

/**
 * Convert rupees to paise for Razorpay.
 */
export const rupeesToPaise = (rupees: number): number => Math.round(rupees * 100)
