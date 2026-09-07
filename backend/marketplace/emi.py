"""
Reducing-balance EMI maths — the authoritative copy lives here on the server.

Mirrors src/features/marketplace/utils/emi.ts in the app so a plan shows the
same numbers before and after the order is placed.

    EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)

with a 0% fast-path for no-cost EMI and a final-instalment adjustment so
rounding never drifts.
"""

from __future__ import annotations

from decimal import Decimal


def _round(value: float) -> float:
    return round(value + 1e-9, 2)


def build_emi_quote(principal, plan) -> dict:
    p = float(principal)
    n = int(plan.tenure_months)
    r = float(plan.annual_interest_rate) / 12 / 100
    processing_fee = _round(p * float(plan.processing_fee_percent) / 100)

    if r == 0:
        monthly_emi = _round(p / n)
    else:
        factor = (1 + r) ** n
        monthly_emi = _round(p * r * factor / (factor - 1))

    schedule = []
    balance = p
    total_interest = 0.0
    for month in range(1, n + 1):
        interest = _round(balance * r)
        principal_component = balance if month == n else _round(monthly_emi - interest)
        balance = _round(balance - principal_component)
        total_interest += interest
        schedule.append(
            {
                "month": month,
                "principal": _round(principal_component),
                "interest": interest,
                "balance": max(balance, 0.0),
            }
        )

    total_interest = _round(total_interest)

    return {
        "plan_id": plan.id,
        "tenure_months": n,
        "principal": p,
        "monthly_emi": monthly_emi,
        "total_interest": total_interest,
        "processing_fee": processing_fee,
        "total_payable": _round(p + total_interest + processing_fee),
        "annual_interest_rate": float(plan.annual_interest_rate),
        "schedule": schedule,
    }


def decimal2(value: float) -> Decimal:
    return Decimal(str(_round(value)))
