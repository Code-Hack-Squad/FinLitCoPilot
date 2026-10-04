import React, { useState } from 'react';
import { FundHolding } from '../../types';
import { formatINR } from '../../utils/formatters';
import { X, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { TactileButton } from '../common/TactileButton';
import { haptics } from '../../utils/haptics';

interface DepositModalProps {
  fund?: FundHolding | null;
  holdings: FundHolding[];
  onClose: () => void;
  onExecuteDeposit: (fundId: string, amount: number) => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({
  fund,
  holdings,
  onClose,
  onExecuteDeposit,
}) => {
  const [selectedFundId, setSelectedFundId] = useState<string>(
    fund ? fund.id : holdings[0]?.id || ''
  );
  const [amount, setAmount] = useState<number>(25000);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const selectedHolding = holdings.find((h) => h.id === selectedFundId) || holdings[0];
  const unitsExpected = selectedHolding
    ? (amount / selectedHolding.currentNav).toFixed(3)
    : '0';

  const handleDeposit = () => {
    haptics.tap('heavy');
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      onExecuteDeposit(selectedFundId, amount);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-xs select-none">
      <div className="bg-white dark:bg-[#141A23] border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-md max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-white/10 flex items-start justify-between gap-3 sticky top-0 bg-white/95 dark:bg-[#141A23]/95 backdrop-blur-md z-10">
          <div>
            <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider">
              Instant Order Routing
            </span>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
              Execute Lumpsum Deposit
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

        {/* Content */}
        {!isSuccess ? (
          <div className="p-5 space-y-4">
            {/* Target Fund Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                Target Mutual Fund Direct Plan
              </label>
              <select
                value={selectedFundId}
                onChange={(e) => {
                  haptics.tap('light');
                  setSelectedFundId(e.target.value);
                }}
                className="w-full text-xs font-mono p-2.5 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1E2633] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                {holdings.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name} (NAV: ₹{h.currentNav})
                  </option>
                ))}
              </select>
            </div>

            {/* Amount input */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                Investment Amount (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm font-bold font-mono text-slate-400">
                  ₹
                </span>
                <input
                  type="number"
                  step="5000"
                  min="1000"
                  value={amount}
                  onChange={(e) => {
                    setAmount(Math.max(0, parseInt(e.target.value) || 0));
                  }}
                  className="w-full pl-8 pr-4 py-2 text-base font-bold font-mono tabular-nums rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1E2633] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex gap-2 mt-2">
                {[10000, 25000, 50000, 100000].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => {
                      haptics.tap('light');
                      setAmount(preset);
                    }}
                    className="px-2.5 py-1 text-[11px] font-mono rounded bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                  >
                    +{formatINR(preset, true)}
                  </button>
                ))}
              </div>
            </div>

            {/* Execution Details & NAV Allocation Preview */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 text-xs font-mono space-y-1.5">
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Current NAV:</span>
                <span className="font-semibold text-slate-900 dark:text-white">₹{selectedHolding?.currentNav}</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Estimated Units:</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">{unitsExpected} units</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Cut-off Applicable:</span>
                <span className="text-emerald-600 dark:text-emerald-400">Same-Day 3:00 PM NAV</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400 pt-1.5 border-t border-slate-200/50 dark:border-white/5">
                <span>Payment Route:</span>
                <span className="text-slate-900 dark:text-white">HDFC UPI Instant ••4821</span>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <TactileButton
                variant="primary"
                size="md"
                onClick={handleDeposit}
                disabled={isSubmitting || amount <= 0}
                className="w-full"
              >
                <Zap className="w-4 h-4 mr-1" />
                <span>{isSubmitting ? 'Routing to BSE StAR MF...' : `Confirm Deposit of ${formatINR(amount)}`}</span>
              </TactileButton>
            </div>
          </div>
        ) : (
          <div className="p-6 flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Order Dispatched Successfully
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              ₹{amount.toLocaleString('en-IN')} allocated to {selectedHolding?.name}. Folio balance will reflect upon AMC EOD reconciliation.
            </p>
            <TactileButton
              variant="secondary"
              size="md"
              onClick={onClose}
              className="mt-3 w-full"
            >
              Close
            </TactileButton>
          </div>
        )}
      </div>
    </div>
  );
};
