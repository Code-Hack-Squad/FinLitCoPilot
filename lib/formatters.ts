// Indian Rupee currency formatters with tabular figures
export function formatINR(amount: number, compact: boolean = false): string {
  if (isNaN(amount)) return '₹0';
  
  if (compact) {
    if (Math.abs(amount) >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }
    if (Math.abs(amount) >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    }
    if (Math.abs(amount) >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}k`;
    }
  }

  // Standard Indian comma separator format: 1,00,000
  const isNegative = amount < 0;
  const absAmount = Math.round(Math.abs(amount));
  const numStr = absAmount.toString();
  
  let lastThree = numStr.substring(numStr.length - 3);
  const otherNumbers = numStr.substring(0, numStr.length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  
  return `${isNegative ? '-' : ''}₹${formatted}`;
}

export function formatPercent(value: number, includeSign: boolean = true): string {
  const sign = includeSign && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}

export function formatTabularNumber(num: number, decimals: number = 2): string {
  return num.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

// Future value / compounding calculations
export function calculateSIPFutureValue(
  monthlyInvestment: number,
  annualRate: number,
  years: number
): number {
  const monthlyRate = annualRate / 100 / 12;
  const totalMonths = years * 12;
  if (monthlyRate === 0) return monthlyInvestment * totalMonths;
  // FV = P * [((1 + r)^n - 1) / r] * (1 + r)
  return monthlyInvestment * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate);
}

// Calculate compounding loss when SIP is paused for M months
export function calculateSIPPauseImpact(
  currentSIP: number,
  pauseMonths: number,
  expectedReturnRate: number, // e.g. 12%
  horizonYears: number = 10,
  currentNav: number = 82.4
) {
  // Installments skipped
  const skippedPrincipal = currentSIP * pauseMonths;
  
  // Future value of these skipped installments if invested right now till horizon
  // Each missed installment would have compounded for (horizonYears * 12 - monthIndex) months
  const monthlyRate = expectedReturnRate / 100 / 12;
  const totalMonths = horizonYears * 12;
  
  let compoundedShortfall = 0;
  for (let m = 0; m < pauseMonths; m++) {
    const compoundingMonthsRemaining = totalMonths - m;
    compoundedShortfall += currentSIP * Math.pow(1 + monthlyRate, compoundingMonthsRemaining);
  }

  // Units missed during dip
  const unitsMissed = Math.round(skippedPrincipal / currentNav);

  // Milestone drift estimation: how many extra months of normal SIP to make up compoundedShortfall
  // Compounded shortfall divided by monthly SIP with interest ~ pauseMonths * 3.5 roughly in high compounding years
  const estimatedDriftMonths = Math.min(36, Math.max(pauseMonths * 3, Math.round(pauseMonths * (1 + expectedReturnRate / 5))));

  return {
    skippedPrincipal,
    compoundedShortfall: Math.round(compoundedShortfall),
    unitsMissed,
    driftMonths: estimatedDriftMonths,
  };
}
