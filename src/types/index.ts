export type AssetClass = 'Equity' | 'Debt' | 'Gold' | 'Liquid';

export interface MandateDetails {
  id: string;
  bankName: string;
  accountNumberMasked: string;
  umrn: string;
  sipAmount: number;
  frequency: 'Monthly' | 'Weekly' | 'Quarterly';
  executionDay: number;
  nextExecutionDate: string;
  status: 'Active' | 'Paused' | 'Scheduled_Resume' | 'Under_Review';
  autopayType: 'NPCI e-NACH' | 'BSE StAR MF Instant' | 'Biller Auto-Debit';
  stepDownAllowed: boolean;
  pausedUntilDate?: string;
  skippedInstallmentsCount?: number;
}

export interface FundHolding {
  id: string;
  name: string;
  amc: string;
  category: string;
  assetClass: AssetClass;
  folioNumber: string;
  currentValuation: number;
  investedAmount: number;
  totalGains: number;
  xirr: number;
  units: number;
  currentNav: number;
  oneDayChangePercent: number;
  mandate: MandateDetails;
  performanceHistory: {
    '1Y': { date: string; value: number; principal: number }[];
    '3Y': { date: string; value: number; principal: number }[];
    'All': { date: string; value: number; principal: number }[];
  };
  expenseRatio: number;
  benchmark: string;
  sebiRiskRating: 'Moderate' | 'Moderately High' | 'Very High' | 'Low to Moderate';
}

export type RiskAppetite = 'Conservative' | 'Moderate' | 'Aggressive';

export interface FinancialGoal {
  id: string;
  title: string;
  category: 'Education' | 'Retirement' | 'Real Estate' | 'Wealth Creation' | 'Vehicle';
  targetYear: number;
  targetAmount: number;
  currentAmount: number;
  monthlySIP: number;
  status: 'On Track' | 'Needs Attention' | 'Drifting';
  inflationAssumed: number; // e.g. 6.0%
  riskProfile: RiskAppetite;
  linkedFunds: string[]; // fund IDs
  driftMonths?: number;
}

export interface PortfolioSummary {
  netWorth: number;
  investedTotal: number;
  oneYearGain: number;
  oneYearGainPercent: number;
  portfolioXIRR: number;
  activeMandatesCount: number;
  healthScore: number; // e.g. 88
  driftPercentage: number; // e.g. +3.2%
  assetAllocation: {
    equity: number;
    debt: number;
    gold: number;
  };
  targetAllocation: {
    equity: number;
    debt: number;
    gold: number;
  };
  lastSyncedTimestamp: string;
}

export interface MacroIndicator {
  title: string;
  tag: string;
  impact: 'Neutral' | 'Tailwind' | 'Headwind';
  summary: string;
  figure: string;
}
