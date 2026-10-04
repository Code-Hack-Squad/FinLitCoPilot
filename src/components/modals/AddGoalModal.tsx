import React, { useState } from 'react';
import { X, Target } from 'lucide-react';
import { FinancialGoal, RiskAppetite } from '../../types';
import { TactileButton } from '../common/TactileButton';
import { haptics } from '../../utils/haptics';

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGoal: (newGoal: FinancialGoal) => void;
}

export const AddGoalModal: React.FC<AddGoalModalProps> = ({
  isOpen,
  onClose,
  onAddGoal,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Education' | 'Retirement' | 'Real Estate' | 'Wealth Creation' | 'Vehicle'>('Wealth Creation');
  const [targetYear, setTargetYear] = useState(2032);
  const [targetAmount, setTargetAmount] = useState(2500000);
  const [currentAmount, setCurrentAmount] = useState(200000);
  const [monthlySIP, setMonthlySIP] = useState(15000);
  const [riskProfile, setRiskProfile] = useState<RiskAppetite>('Moderate');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    haptics.tap('medium');
    const newGoal: FinancialGoal = {
      id: `goal-${Date.now()}`,
      title: title.trim(),
      category,
      targetYear,
      targetAmount,
      currentAmount,
      monthlySIP,
      status: 'On Track',
      inflationAssumed: 6.0,
      riskProfile,
      linkedFunds: ['ppfc-01'],
      driftMonths: 0,
    };

    onAddGoal(newGoal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-xs select-none">
      <div className="bg-white dark:bg-[#141A23] border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-md max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-white/10 flex items-start justify-between gap-3 sticky top-0 bg-white/95 dark:bg-[#141A23]/95 backdrop-blur-md z-10">
          <div>
            <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider">
              Goal Architecture
            </span>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
              Create Financial Milestone
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
              Milestone Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Dream Home Downpayment or Paris Sabbatical"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1E2633] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1E2633] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="Education">Education</option>
                <option value="Retirement">Retirement</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Wealth Creation">Wealth Creation</option>
                <option value="Vehicle">Vehicle</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                Target Year
              </label>
              <input
                type="number"
                min="2027"
                max="2050"
                value={targetYear}
                onChange={(e) => setTargetYear(parseInt(e.target.value) || 2030)}
                className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1E2633] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                Target Amount (₹)
              </label>
              <input
                type="number"
                step="50000"
                value={targetAmount}
                onChange={(e) => setTargetAmount(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 text-xs font-mono font-bold rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1E2633] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                Current Corpus (₹)
              </label>
              <input
                type="number"
                step="10000"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 text-xs font-mono font-bold rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1E2633] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
              Planned Monthly SIP (₹)
            </label>
            <input
              type="number"
              step="1000"
              value={monthlySIP}
              onChange={(e) => setMonthlySIP(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 text-xs font-mono font-bold rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1E2633] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
            <TactileButton
              variant="ghost"
              size="sm"
              type="button"
              onClick={onClose}
            >
              Cancel
            </TactileButton>

            <TactileButton
              variant="primary"
              size="md"
              type="submit"
            >
              Create Goal
            </TactileButton>
          </div>
        </form>
      </div>
    </div>
  );
};
