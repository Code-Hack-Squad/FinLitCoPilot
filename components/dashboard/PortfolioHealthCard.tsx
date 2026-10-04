'use client';

import React from 'react';
import { Info, Sliders } from 'lucide-react';
import { PortfolioSummary } from '@/types';
import { formatINR } from '@/lib/formatters';
import { haptics } from '@/lib/haptics';

interface PortfolioHealthCardProps {
  summary: PortfolioSummary;
  onEditTarget: () => void;
}

export const PortfolioHealthCard: React.FC<PortfolioHealthCardProps> = ({
  summary,
  onEditTarget,
}) => {
  const { assetAllocation } = summary;

  // Exact figures from the screenshot
  const equityVal = 1365440;
  const debtVal = 387490;
  const goldVal = 92270;

  return (
    <div className="bg-[#121820] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs">
      {/* Top Status Header */}
      <div className="flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00DF8F]" />
          <span className="text-white font-medium">
            Portfolio Health: Optimal 88/100
          </span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-400">Low drift</span>
        </div>

        <div className="flex items-center gap-1 text-slate-400 hover:text-slate-300 transition-colors cursor-pointer">
          <span>5.4 Mo Buffer</span>
          <Info className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Asset Allocation Header with Edit Target Action */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-semibold text-white">
            Asset Allocation
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono text-[#00DF8F] bg-[#00DF8F]/10 border border-[#00DF8F]/20">
            Balanced
          </span>
        </div>

        {/* Edit Target without blue outline */}
        <button
          onClick={() => {
            haptics.tap('light');
            onEditTarget();
          }}
          className="text-xs text-slate-300 hover:text-white font-mono flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 transition-colors cursor-pointer"
        >
          <Sliders className="w-3 h-3 text-slate-300" />
          <span>Edit Target</span>
        </button>
      </div>

      {/* Segmented Horizontal Asset Allocation Bar */}
      <div>
        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex gap-0.5">
          {/* Equity - Vibrant Mint Emerald (74%) */}
          <div
            style={{ width: '74%' }}
            className="bg-[#00DF8F] h-full rounded-l-full transition-all duration-500"
            title="Equity: 74%"
          />
          {/* Debt - Slate Gray (21%) */}
          <div
            style={{ width: '21%' }}
            className="bg-slate-500 h-full transition-all duration-500"
            title="Debt: 21%"
          />
          {/* Gold - Clean Light Cream/Gold (5%) */}
          <div
            style={{ width: '5%' }}
            className="bg-slate-200 h-full rounded-r-full transition-all duration-500"
            title="Gold: 5%"
          />
        </div>

        {/* Legend with Tabular Figures */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-1 text-xs font-mono">
          <div>
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00DF8F]" />
              <span>Equity (74%)</span>
            </div>
            <div className="font-bold text-white text-sm mt-0.5 tabular-nums">
              {formatINR(equityVal)}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              <span>Debt (21%)</span>
            </div>
            <div className="font-bold text-white text-sm mt-0.5 tabular-nums">
              {formatINR(debtVal)}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
              <span>Gold (5%)</span>
            </div>
            <div className="font-bold text-white text-sm mt-0.5 tabular-nums">
              {formatINR(goldVal)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
