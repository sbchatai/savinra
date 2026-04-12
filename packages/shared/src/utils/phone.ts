import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js/min'

/**
 * Validate an Indian mobile number.
 * Accepts formats: 9876543210, +919876543210, 09876543210
 */
export const isValidIndianMobile = (phone: string): boolean => {
  try {
    return isValidPhoneNumber(phone, 'IN')
  } catch {
    return false
  }
}

/**
 * Normalize to E.164 format (+91XXXXXXXXXX) for API calls.
 */
export const normalizeIndianPhone = (phone: string): string | null => {
  try {
    const parsed = parsePhoneNumber(phone, 'IN')
    return parsed.isValid() ? parsed.format('E.164') : null
  } catch {
    return null
  }
}
