export function formatPrice(amount: number): string {
  return '\u20b9' + amount.toLocaleString('en-IN')
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}
