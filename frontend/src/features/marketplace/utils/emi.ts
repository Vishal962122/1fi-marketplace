import type { EmiPlan, EmiQuote } from '@/features/marketplace/types';

/**
 * Reducing-balance EMI maths.
 *
 * EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
 *   P = principal, r = monthly interest rate, n = tenure in months
 *
 * When the interest rate is 0 (no-cost EMI) the formula degenerates, so we
 * fall back to a straight split of principal across the tenure.
 */
export function buildEmiQuote(principal: number, plan: EmiPlan): EmiQuote {
  const n = plan.tenureMonths;
  const r = plan.annualInterestRate / 12 / 100;
  const processingFee = round(principal * (plan.processingFeePercent / 100));

  const monthlyEmi =
    r === 0
      ? round(principal / n)
      : round((principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));

  const schedule: EmiQuote['schedule'] = [];
  let balance = principal;
  let totalInterest = 0;

  for (let month = 1; month <= n; month++) {
    const interest = round(balance * r);
    // Last instalment clears whatever is left to avoid rounding drift.
    const principalComponent =
      month === n ? balance : round(monthlyEmi - interest);
    balance = round(balance - principalComponent);
    totalInterest += interest;
    schedule.push({ month, principal: principalComponent, interest, balance: Math.max(balance, 0) });
  }

  totalInterest = round(totalInterest);

  return {
    planId: plan.id,
    tenureMonths: n,
    principal,
    monthlyEmi,
    totalInterest,
    processingFee,
    totalPayable: round(principal + totalInterest + processingFee),
    annualInterestRate: plan.annualInterestRate,
    schedule,
  };
}

function round(value: number) {
  return Math.round(value * 100) / 100;
}
