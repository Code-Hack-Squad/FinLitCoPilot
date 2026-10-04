'use client';

import React, { useState } from 'react';
import { X, Sliders } from 'lucide-react';
import { PortfolioSummary } from '@/types';
import { TactileButton } from '../common/TactileButton';
import { haptics } from '@/lib/haptics';

interface EditTargetAllocationModalProps {
  summary: PortfolioSummary;
  onClose: () => void;
  onSaveTargets: (equity: number, debt: number, gold: number) => void;
}

export const EditTargetAllocationModal: React.FC<EditTargetAllocationModalProps> = ({
  summary,
  onClose,
  onSaveTargets,
}) => {
  const [equity, setEquity] = useState(summary.targetAllocation.equity);
  const [debt, setDebt] = useState(summary.targetAllocation.debt);
  const [gold, setGold] = useState(summary.targetAllocation.gold);

  const total = equity + debt + gold;
  const isValid = total === 100;

  const handleSave = () => {
    if (!isValid) return;
    haptics.tap('medium');
    onSaveTargets(equity, debt, gold);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-xs select-none">
      <div className="bg-white dark:bg-[#141A23] border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-md max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-white/10 flex items-start justify-between gap-3 sticky top-0 bg-white/95 dark:bg-[#141A23]/95 backdrop-blur-md z-10">
          <div>
            <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider">
              Asset Allocation Model
            </span>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
              Edit Target Asset Allocation
            </h2>
          </div>
          <button
            onClick={() => {
              haptics.tap('light');
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sliders */}
        <div className="p-5 space-y-5">
          {/* Equity */}
          <div>
            <div className="flex justify-between items-baseline mb-1.5 text-xs font-mono">
              <span className="font-semibold text-blue-600 dark:text-blue-400">Equity Target:</span>
              <strong className="text-slate-900 dark:text-white text-sm">{equity}%</strong>
            </div>
            <input
              type="range"
              min="20"
              max="90"
              step="5"
              value={equity}
              onChange={(e) => {
                haptics.tap('light');
                const newEq = parseInt(e.target.value);
                setEquity(newEq);
              }}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          {/* Debt */}
          <div>
            <div className="flex justify-between items-baseline mb-1.5 text-xs font-mono">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Debt Target:</span>
              <strong className="text-slate-900 dark:text-white text-sm">{debt}%</strong>
            </div>
            <input
              type="range"
              min="5"
              max="70"
              step="5"
              value={debt}
              onChange={(e) => {
                haptics.tap('light');
                setDebt(parseInt(e.target.value));
              }}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Gold */}
          <div>
            <div className="flex justify-between items-baseline mb-1.5 text-xs font-mono">
              <span className="font-semibold text-amber-500">Gold / Commodity Target:</span>
              <strong className="text-slate-900 dark:text-white text-sm">{gold}%</strong>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="1"
              value={gold}
              onChange={(e) => {
                haptics.tap('light');
                setGold(parseInt(e.target.value));
              }}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Sum Validation */}
          <div className={`p-3 rounded-lg text-xs font-mono flex items-center justify-between border ${
            isValid
              ? 'bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300'
              : 'bg-red-50 dark:bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'
          }`}>
            <span>Total Allocation Sum:</span>
            <span className="font-bold">{total}% {isValid ? '(Valid 100%)' : '(Must sum to 100%)'}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-200 dark:border-white/10 flex items-center justify-between gap-3 bg-white dark:bg-[#141A23]">
          <TactileButton
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            Cancel
          </TactileButton>

          <TactileButton
            variant="primary"
            size="md"
            onClick={handleSave}
            disabled={!isValid}
          >
            Apply Target Model
          </TactileButton>
        </div>
      </div>
    </div>
  );
};
