import React, { useState } from 'react';
import { FinancialGoal, RiskAppetite } from '../../types';
import { formatINR, calculateSIPFutureValue } from '../../utils/formatters';
import { X, Sliders, Target, ShieldCheck, Flame, Check, Info } from 'lucide-react';
import { TactileButton } from '../common/TactileButton';
import { haptics } from '../../utils/haptics';

interface GoalCalibrationModalProps {
  goal: FinancialGoal | null;
  onClose: () => void;
  onSaveGoal: (updatedGoal: FinancialGoal) => void;
}

export const GoalCalibrationModal: React.FC<GoalCalibrationModalProps> = ({
  goal,
  onClose,
  onSaveGoal,
}) => {
  if (!goal) return null;

  const [targetYear, setTargetYear] = useState<number>(goal.targetYear);
  const [targetAmount, setTargetAmount] = useState<number>(goal.targetAmount);
  const [inflationRate, setInflationRate] = useState<number>(goal.inflationAssumed || 6.0);
  const [riskProfile, setRiskProfile] = useState<RiskAppetite>(goal.riskProfile || 'Moderate');

  const yearsLeft = Math.max(1, targetYear - 2026);

  // Return assumptions based on SEBI risk categories
  const expectedReturns: Record<RiskAppetite, number> = {
    Conservative: 9.0,
    Moderate: 12.5,
    Aggressive: 15.0,
  };

  const assumedReturn = expectedReturns[riskProfile];

  // Inflation-adjusted future target: Target * (1 + inflation)^years
  // (Assuming targetAmount is in today's purchasing power)
  const inflationAdjustedTarget = targetAmount * Math.pow(1 + inflationRate / 100, yearsLeft);

  // Calculate required monthly SIP to bridge the gap between currentAmount and inflationAdjustedTarget
  // Future value of existing currentAmount: currentAmount * (1 + r)^years
  const existingCorpusFutureValue = goal.currentAmount * Math.pow(1 + assumedReturn / 100, yearsLeft);
  const remainingGap = Math.max(0, inflationAdjustedTarget - existingCorpusFutureValue);

  // Approximate required monthly SIP
  const monthlyRate = assumedReturn / 100 / 12;
  const totalMonths = yearsLeft * 12;
  const requiredSIP = remainingGap <= 0 ? 0 : Math.round(
    (remainingGap * monthlyRate) / (Math.pow(1 + monthlyRate, totalMonths) - 1)
  );

  const handleSave = () => {
    haptics.tap('medium');
    onSaveGoal({
      ...goal,
      targetYear,
      targetAmount,
      inflationAssumed: inflationRate,
      riskProfile,
      monthlySIP: requiredSIP || goal.monthlySIP,
      status: requiredSIP > goal.monthlySIP * 1.3 ? 'Needs Attention' : 'On Track',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-xs select-none">
      <div className="bg-white dark:bg-[#141A23] border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-white/10 flex items-start justify-between gap-3 sticky top-0 bg-white/95 dark:bg-[#141A23]/95 backdrop-blur-md z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider">
                Goal Simulator & Calibrator
              </span>
              <span className="text-xs text-slate-400 font-mono">· {goal.category}</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              {goal.title}
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

        {/* Sliders & Controls */}
        <div className="p-5 space-y-6">
          {/* 1. Inflation Benchmark Adjustment */}
          <div>
            <div className="flex justify-between items-baseline mb-2">
              <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                1. Inflation Benchmark Adjustment
              </label>
              <span className="text-sm font-bold font-mono text-blue-600 dark:text-blue-400">
                {inflationRate.toFixed(1)}% p.a.
              </span>
            </div>
            <input
              type="range"
              min="4.0"
              max="9.0"
              step="0.5"
              value={inflationRate}
              onChange={(e) => {
                haptics.tap('light');
                setInflationRate(parseFloat(e.target.value));
              }}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>RBI Min 4.0%</span>
              <span>Long-term avg 6.0%</span>
              <span>Stress-test 9.0%</span>
            </div>
          </div>

          {/* 2. Target Year & Horizon */}
          <div>
            <div className="flex justify-between items-baseline mb-2">
              <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                2. Horizon Year
              </label>
              <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                Year {targetYear} ({yearsLeft} years away)
              </span>
            </div>
            <input
              type="range"
              min="2027"
              max="2046"
              step="1"
              value={targetYear}
              onChange={(e) => {
                haptics.tap('light');
                setTargetYear(parseInt(e.target.value));
              }}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>2027</span>
              <span>2035</span>
              <span>2046</span>
            </div>
          </div>

          {/* 3. Three-Tier SEBI Risk Appetite Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2">
              3. Asset Allocation Risk Appetite
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Conservative', 'Moderate', 'Aggressive'] as RiskAppetite[]).map((r) => {
                const isSelected = riskProfile === r;
                const returnVal = expectedReturns[r];
                return (
                  <button
                    key={r}
                    onClick={() => {
                      haptics.tap('light');
                      setRiskProfile(r);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-600 dark:border-blue-500 bg-blue-50/70 dark:bg-blue-500/10 ring-1 ring-blue-500/30'
                        : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {r}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                        Exp. ~{returnVal}%
                      </div>
                    </div>
                    {isSelected && (
                      <div className="mt-2 text-blue-600 dark:text-blue-400">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Simulation Output Card */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
              <span>Today's Target Basis:</span>
              <span className="font-semibold text-slate-900 dark:text-white">{formatINR(targetAmount, true)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
              <span>Inflation-Adjusted Target ({targetYear}):</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">{formatINR(inflationAdjustedTarget, true)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
              <span>Current Accumulated:</span>
              <span className="font-semibold text-slate-900 dark:text-white">{formatINR(goal.currentAmount, true)}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex justify-between items-center text-sm">
              <span className="font-sans font-semibold text-slate-900 dark:text-white">Calibrated Recommended SIP:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-base">{formatINR(requiredSIP)} / mo</span>
            </div>
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
          >
            Save Calibrated Goal
          </TactileButton>
        </div>
      </div>
    </div>
  );
};
