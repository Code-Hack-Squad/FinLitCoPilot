import React from 'react';
import { macroIndicators } from '../../data/mockPortfolio';
import { PortfolioSummary, FundHolding } from '../../types';
import { TrendingUp, Globe, ShieldCheck, ArrowUpRight, BarChart3, AlertCircle } from 'lucide-react';
import { formatINR } from '../../utils/formatters';

interface InsightsViewProps {
  summary: PortfolioSummary;
  holdings: FundHolding[];
  onOpenGopal: () => void;
}

export const InsightsView: React.FC<InsightsViewProps> = ({
  summary,
  holdings,
  onOpenGopal,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Market Insights & Macro Events
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
            SEBI-Compliant Macro Analysis • Zero-Jargon Monetary Policy Breakdowns
          </p>
        </div>

        <button
          onClick={onOpenGopal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-500/20 text-xs font-mono text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors cursor-pointer"
        >
          <span>Ask Gopal to audit macro impacts</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Macro Indicators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {macroIndicators.map((macro) => {
          const isTailwind = macro.impact === 'Tailwind';
          return (
            <div
              key={macro.title}
              className="bg-white dark:bg-[#141A23] border border-slate-200 dark:border-white/10 rounded-xl p-5 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 uppercase">
                  {macro.tag}
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    isTailwind
                      ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500/20'
                      : 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-500/20'
                  }`}
                >
                  {macro.impact}
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {macro.title}
                </h3>
                <span className="text-lg font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                  {macro.figure}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {macro.summary}
              </p>
            </div>
          );
        })}
      </div>

      {/* Institutional Asset Drift & Tax Rebalancing Analysis */}
      <div className="bg-white dark:bg-[#141A23] border border-slate-200 dark:border-white/10 rounded-xl p-5 md:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-500" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Tactical Rebalancing Strategy (Tax-Aware)
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">Equity +3.2% Drift</span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Your current equity weight of <strong className="text-slate-900 dark:text-white font-mono">68%</strong> sits slightly above the target of <strong className="text-slate-900 dark:text-white font-mono">65%</strong>. Rather than selling equity and generating short-term/long-term capital gains tax (LTCG above ₹1.25 Lakhs taxed at 12.5%), our smart SIP algorithm recommends routing the next 2 cycles of monthly inflows into <strong className="text-slate-900 dark:text-white">HDFC Short Term Debt Fund</strong>. This normalizes asset weights frictionlessly with 0% tax liability.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 dark:border-white/5 text-xs font-mono">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-white/[0.02]">
            <div className="text-slate-400">Tax Saved by Inflow Rebalance</div>
            <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">₹18,400</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-white/[0.02]">
            <div className="text-slate-400">Optimal Target Horizon</div>
            <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">60 Days (2 SIP cycles)</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-white/[0.02]">
            <div className="text-slate-400">Rebalance Execution Method</div>
            <div className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-0.5">Zero-Exit-Load Routing</div>
          </div>
        </div>
      </div>
    </div>
  );
};
