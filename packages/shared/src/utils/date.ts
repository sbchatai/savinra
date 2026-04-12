/**
 * Format a date in Indian locale (DD MMM YYYY).
 * e.g. 13 Apr 2026
 */
export const formatIndianDate = (date: string | Date): string =>
  new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))

/**
 * Format a datetime with time (DD MMM YYYY, HH:MM AM/PM IST).
 */
export const formatIndianDateTime = (date: string | Date): string =>
  new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata',
  }).format(new Date(date))
