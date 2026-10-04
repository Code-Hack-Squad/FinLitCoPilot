import React, { useState } from 'react';
import { FundHolding, AssetClass } from '../../types';
import { formatINR, formatPercent } from '../../utils/formatters';
import { ChevronRight, ArrowUpRight, ArrowDownRight, ShieldCheck, PauseCircle, Plus } from 'lucide-react';
import { TactileButton } from '../common/TactileButton';
import { haptics } from '../../utils/haptics';

interface HoldingsListProps {
  holdings: FundHolding[];
  onSelectFund: (fund: FundHolding) => void;
  onOpenDeposit: (fund?: FundHolding) => void;
  onManageSIP: (fund: FundHolding) => void;
}

export const HoldingsList: React.FC<HoldingsListProps> = ({
  holdings,
  onSelectFund,
  onOpenDeposit,
  onManageSIP,
}) => {
  const [filter, setFilter] = useState<'All' | AssetClass>('All');

  const filtered = holdings.filter((h) => {
    if (filter === 'All') return true;
    return h.assetClass === filter;
  });

  return (
    <div className="bg-white dark:bg-[#141A23] border border-slate-200 dark:border-white/10 rounded-xl transition-colors shadow-xs overflow-hidden">
      {/* Table Header / Filter Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-900 dark:text-white">
            Direct Mutual Fund Folios
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
            Zero-Commission Direct Plans • Daily NAV Marked
          </div>
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-white/5 rounded-lg">
          {(['All', 'Equity', 'Debt', 'Gold'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                haptics.tap('light');
                setFilter(tab);
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                filter === tab
                  ? 'bg-white dark:bg-[#202B3B] text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Holdings Rows */}
      <div className="divide-y divide-slate-100 dark:divide-white/5">
        {filtered.map((holding) => {
          const isPositiveDay = holding.oneDayChangePercent >= 0;
          return (
            <div
              key={holding.id}
              onClick={() => onSelectFund(holding)}
              className="p-4 sm:p-5 hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Fund Title & Metadata */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {holding.name}
                  </span>
                  {holding.mandate.status === 'Active' && (
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      SIP Active
                    </span>
                  )}
                  {holding.mandate.status === 'Paused' && (
                    <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                      SIP Paused
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
                  <span>{holding.category}</span>
                  <span aria-hidden="true" className="text-slate-300 dark:text-white/20">·</span>
                  <span>Folio {holding.folioNumber}</span>
                  <span aria-hidden="true" className="text-slate-300 dark:text-white/20">·</span>
                  <span>NAV ₹{holding.currentNav}</span>
                  <span aria-hidden="true" className="text-slate-300 dark:text-white/20">·</span>
                  <span className="inline-flex items-center gap-0.5">
                    {isPositiveDay ? (
                      <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 text-red-500" />
                    )}
                    <span className={isPositiveDay ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}>
                      {formatPercent(holding.oneDayChangePercent)}
                    </span>
                  </span>
                </div>
              </div>

              {/* Valuation & Returns */}
              <div className="flex items-center justify-between md:justify-end gap-6 sm:gap-8 shrink-0">
                <div className="text-left md:text-right font-mono">
                  <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tabular-nums">
                    {formatINR(holding.currentValuation)}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                    Invested: {formatINR(holding.investedAmount, true)}
                  </div>
                </div>

                <div className="text-right font-mono min-w-[70px]">
                  <div className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    +{holding.xirr}%
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    XIRR
                  </div>
                </div>

                {/* Actions & Chevron */}
                <div className="flex items-center gap-2">
                  <TactileButton
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onManageSIP(holding);
                    }}
                    title="Smart SIP Interruption & Settings"
                    className="hidden sm:inline-flex text-xs px-2.5 py-1"
                  >
                    <PauseCircle className="w-3.5 h-3.5 text-slate-500" />
                    <span>SIP</span>
                  </TactileButton>

                  <div className="p-1 rounded-md text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
