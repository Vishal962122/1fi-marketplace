/** Currency / number formatting helpers (INR, Indian digit grouping). */

const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const inrDecimal = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
});

export function formatCurrency(value: number, opts?: { decimals?: boolean }) {
  return opts?.decimals ? inrDecimal.format(value) : inr.format(value);
}

export function formatPercent(value: number) {
  return `${Number.isInteger(value) ? value : value.toFixed(2)}%`;
}

export function formatMonths(months: number) {
  return `${months} ${months === 1 ? 'month' : 'months'}`;
}
