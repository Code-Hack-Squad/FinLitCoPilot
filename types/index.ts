export type AssetClass = 'Equity' | 'Debt' | 'Gold';

export type RiskAppetite = 'Conservative' | 'Moderate' | 'Aggressive';

export interface SIPMandate {
  id: string;
  bankName: string;
  accountNumberMasked: string;
  umrn: string;
  sipAmount: number;
  frequency: string;
  executionDay: number;
  nextExecutionDate: string;
  status: 'Active' | 'Paused';
  autopayType: string;
  stepDownAllowed: boolean;
  pausedUntilDate?: string;
  skippedInstallmentsCount?: number;
}

export interface PerformanceRecord {
  date: string;
  value: number;
  principal: number;
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
  expenseRatio: number;
  benchmark: string;
  sebiRiskRating: string;
  mandate: SIPMandate;
  performanceHistory: {
    '1Y': PerformanceRecord[];
    '3Y': PerformanceRecord[];
    'All': PerformanceRecord[];
    [key: string]: PerformanceRecord[];
  };
}

export interface FinancialGoal {
  id: string;
  title: string;
  category: string;
  targetYear: number;
  targetAmount: number;
  currentAmount: number;
  monthlySIP: number;
  status: string;
  inflationAssumed: number;
  riskProfile: RiskAppetite;
  linkedFunds: string[];
  driftMonths: number;
}

export interface PortfolioSummary {
  netWorth: number;
  investedTotal: number;
  oneYearGain: number;
  oneYearGainPercent: number;
  portfolioXIRR: number;
  activeMandatesCount: number;
  healthScore: number;
  driftPercentage: number;
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
  impact: string;
  summary: string;
  figure: string;
}
