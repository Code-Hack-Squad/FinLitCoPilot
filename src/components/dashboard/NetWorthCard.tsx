import React from 'react';
import { Plus, SlidersHorizontal, MoreHorizontal } from 'lucide-react';
import { PortfolioSummary } from '../../types';
import { NumberTicker } from '../common/NumberTicker';
import { haptics } from '../../utils/haptics';

interface NetWorthCardProps {
  summary: PortfolioSummary;
  onOpenDeposit: () => void;
  onManageSIPs: () => void;
  onMoreActions?: () => void;
}

export const NetWorthCard: React.FC<NetWorthCardProps> = ({
  summary,
  onOpenDeposit,
  onManageSIPs,
  onMoreActions,
}) => {
  return (
    <div className="space-y-4">
      {/* Top row: Label & Synced Status */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400">
          Total Net Worth
        </span>
        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00DF8F] animate-pulse" />
          <span>Synced 1m ago</span>
        </div>
      </div>

      {/* Hero Balance */}
      <div>
        <div className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-white flex items-baseline gap-1">
          <span className="font-semibold text-2xl sm:text-3xl lg:text-4xl text-white">₹</span>
          <NumberTicker
            value={summary.netWorth}
            decimals={0}
            formatAsINR={true}
            className="tracking-tight"
          />
        </div>

        {/* Subline gains & active duration */}
        <div className="flex items-center gap-2 mt-1 text-xs sm:text-sm font-mono">
          <span className="text-[#00DF8F] font-medium">
            +₹{summary.oneYearGain.toLocaleString('en-IN')} (+{summary.oneYearGainPercent}%)
          </span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-400">28M Active</span>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="flex items-center gap-2.5 pt-1">
        {/* + Deposit (Solid White Button) */}
        <button
          onClick={() => {
            haptics.tap('light');
            onOpenDeposit();
          }}
          className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-[#0B0F15] font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Deposit</span>
        </button>

        {/* Manage SIPs (Clean Dark Button without blue outlines) */}
        <button
          onClick={() => {
            haptics.tap('light');
            onManageSIPs();
          }}
          className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#141B24] hover:bg-[#1A232F] text-slate-200 border border-white/10 font-medium text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-300" />
          <span>Manage SIPs</span>
        </button>

        {/* More Actions Icon Button */}
        <button
          onClick={() => {
            haptics.tap('light');
            if (onMoreActions) onMoreActions();
          }}
          aria-label="More options"
          className="w-10 h-10 rounded-xl bg-[#141B24] hover:bg-[#1A232F] text-slate-400 hover:text-white border border-white/10 flex items-center justify-center active:scale-[0.98] transition-all cursor-pointer shrink-0"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
