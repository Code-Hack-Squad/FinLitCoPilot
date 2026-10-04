import React from 'react';
import { FundHolding } from '../../types';
import { formatINR } from '../../utils/formatters';
import { Building, CheckCircle2, PauseCircle, PlayCircle, ShieldCheck, Clock, ExternalLink } from 'lucide-react';
import { TactileButton } from '../common/TactileButton';
import { haptics } from '../../utils/haptics';

interface MandatesViewProps {
  holdings: FundHolding[];
  onOpenSmartPause: (fund: FundHolding) => void;
  onResumeMandate: (fundId: string) => void;
}

export const MandatesView: React.FC<MandatesViewProps> = ({
  holdings,
  onOpenSmartPause,
  onResumeMandate,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Institutional Mandates & Autopay
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
            NPCI e-NACH & BSE StAR MF Automated Execution Engine
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
          <ShieldCheck className="w-4 h-4" />
          <span>NPCI Live Autopay Gateway Active</span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#141A23] border border-slate-200 dark:border-white/10 rounded-xl p-4">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">Monthly Auto-Debited</div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1 tabular-nums">
            {formatINR(holdings.reduce((sum, h) => sum + (h.mandate.status === 'Active' ? h.mandate.sipAmount : 0), 0))}
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-0.5">Across active SIPs</div>
        </div>

        <div className="bg-white dark:bg-[#141A23] border border-slate-200 dark:border-white/10 rounded-xl p-4">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">Active Mandates</div>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
            {holdings.filter((h) => h.mandate.status === 'Active').length} / {holdings.length}
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-0.5">Zero bounced transactions</div>
        </div>

        <div className="bg-white dark:bg-[#141A23] border border-slate-200 dark:border-white/10 rounded-xl p-4">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">Upcoming Execution</div>
          <div className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-1">
            10 Oct 2026
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-0.5">HDFC Short Term Debt (₹10,000)</div>
        </div>
      </div>

      {/* Mandate Items List */}
      <div className="bg-white dark:bg-[#141A23] border border-slate-200 dark:border-white/10 rounded-xl divide-y divide-slate-100 dark:divide-white/5 overflow-hidden">
        {holdings.map((h) => {
          const isActive = h.mandate.status === 'Active';
          return (
            <div key={h.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {h.name}
                  </h3>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      isActive
                        ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500/20'
                        : 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-500/20'
                    }`}
                  >
                    {isActive ? 'Active Auto-Debit' : 'Paused • Scheduled Resume'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400 font-mono">
                  <span>Bank: {h.mandate.bankName} ({h.mandate.accountNumberMasked})</span>
                  <span>·</span>
                  <span>UMRN: {h.mandate.umrn}</span>
                  <span>·</span>
                  <span>Day {h.mandate.executionDay} of month</span>
                  <span>·</span>
                  <span>{h.mandate.autopayType}</span>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 shrink-0">
                <div className="text-left md:text-right font-mono">
                  <div className="text-base font-bold text-slate-900 dark:text-white tabular-nums">
                    {formatINR(h.mandate.sipAmount)} / mo
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Next: {h.mandate.nextExecutionDate}
                  </div>
                </div>

                <div>
                  {isActive ? (
                    <TactileButton
                      variant="outline"
                      size="sm"
                      onClick={() => onOpenSmartPause(h)}
                      className="text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20 text-xs"
                    >
                      <PauseCircle className="w-3.5 h-3.5" />
                      <span>Smart Pause</span>
                    </TactileButton>
                  ) : (
                    <TactileButton
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        haptics.tap('heavy');
                        onResumeMandate(h.id);
                      }}
                      className="text-xs"
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>Resume Mandate</span>
                    </TactileButton>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
