'use client';

import React, { useState } from 'react';
import { FundHolding } from '@/types';
import { formatINR, formatPercent } from '@/lib/formatters';
import { X, TrendingUp, Calendar, Building, ShieldCheck, PauseCircle, Plus, AlertCircle } from 'lucide-react';
import { TactileButton } from '../common/TactileButton';
import { haptics } from '@/lib/haptics';

interface FundDeepDiveModalProps {
  fund: FundHolding | null;
  onClose: () => void;
  onOpenSmartPause: (fund: FundHolding) => void;
  onOpenDeposit: (fund: FundHolding) => void;
}

export const FundDeepDiveModal: React.FC<FundDeepDiveModalProps> = ({
  fund,
  onClose,
  onOpenSmartPause,
  onOpenDeposit,
}) => {
  if (!fund) return null;

  const [timeframe, setTimeframe] = useState<'1Y' | '3Y' | 'All'>('1Y');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  const historyData = fund.performanceHistory[timeframe];
  const maxVal = Math.max(...historyData.map((d) => Math.max(d.value, d.principal))) * 1.1;
  const minVal = Math.min(...historyData.map((d) => Math.min(d.value, d.principal))) * 0.9;

  // SVG Chart Dimensions
  const width = 640;
  const height = 220;
  const paddingX = 40;
  const paddingY = 25;

  const getCoordinates = (index: number, val: number) => {
    const x = paddingX + (index / (historyData.length - 1)) * (width - 2 * paddingX);
    const y = height - paddingY - ((val - minVal) / (maxVal - minVal)) * (height - 2 * paddingY);
    return { x, y };
  };

  const pointsValue = historyData.map((d, i) => getCoordinates(i, d.value));
  const pointsPrincipal = historyData.map((d, i) => getCoordinates(i, d.principal));

  const pathValue = pointsValue.reduce(
    (acc, pt, i) => (i === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`),
    ''
  );
  const pathPrincipal = pointsPrincipal.reduce(
    (acc, pt, i) => (i === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`),
    ''
  );

  const activePoint = hoveredPointIndex !== null ? historyData[hoveredPointIndex] : historyData[historyData.length - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-xs select-none">
      <div className="bg-white dark:bg-[#141A23] border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-white/10 flex items-start justify-between gap-4 sticky top-0 bg-white/95 dark:bg-[#141A23]/95 backdrop-blur-md z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-blue-600 dark:text-blue-400 font-medium">
                {fund.category}
              </span>
              <span className="text-xs text-slate-400 font-mono">· Direct Growth</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              {fund.name}
            </h2>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
              Folio {fund.folioNumber} • Benchmark: {fund.benchmark}
            </div>
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

        {/* Core Stats Overview */}
        <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50/50 dark:bg-white/[0.02] border-b border-slate-100 dark:border-white/5">
          <div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Current Valuation</div>
            <div className="text-lg font-bold text-slate-900 dark:text-white font-mono tabular-nums mt-0.5">
              {formatINR(fund.currentValuation)}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Invested Principal</div>
            <div className="text-lg font-bold text-slate-700 dark:text-slate-200 font-mono tabular-nums mt-0.5">
              {formatINR(fund.investedAmount)}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Annualized XIRR</div>
            <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums mt-0.5">
              +{fund.xirr}%
            </div>
          </div>
          <div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Total Capital Gain</div>
            <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums mt-0.5">
              +{formatINR(fund.totalGains, true)}
            </div>
          </div>
        </div>

        {/* Interactive Trajectory Chart */}
        <div className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div>
              <div className="text-xs font-semibold text-slate-900 dark:text-white">
                Trajectory Analysis (Market Value vs Principal)
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                {activePoint.date}: Value <strong className="text-blue-600 dark:text-blue-400">{formatINR(activePoint.value)}</strong> · Principal <strong className="text-slate-600 dark:text-slate-300">{formatINR(activePoint.principal)}</strong>
              </div>
            </div>

            {/* Timeframe Selector */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-white/5 rounded-lg">
              {(['1Y', '3Y', 'All'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    haptics.tap('light');
                    setTimeframe(t);
                    setHoveredPointIndex(null);
                  }}
                  className={`px-3 py-1 text-xs font-mono font-medium rounded-md transition-colors cursor-pointer ${
                    timeframe === t
                      ? 'bg-white dark:bg-[#202B3B] text-blue-600 dark:text-blue-400 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Canvas */}
          <div className="relative w-full overflow-hidden bg-slate-50 dark:bg-[#0E131A] rounded-xl p-2 border border-slate-200/80 dark:border-white/5">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-44 sm:h-52 overflow-visible"
              onMouseLeave={() => setHoveredPointIndex(null)}
            >
              {/* Grid Lines */}
              <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
              <line x1={paddingX} y1={height / 2} x2={width - paddingX} y2={height / 2} stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
              <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="currentColor" strokeOpacity="0.15" />

              {/* Principal Path (Dotted slate) */}
              <path
                d={pathPrincipal}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="4 4"
                className="text-slate-400 dark:text-slate-500"
              />

              {/* Valuation Path (Solid Electric Blue) */}
              <path
                d={pathValue}
                fill="none"
                stroke="#2563EB"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Interactive Hover Nodes */}
              {historyData.map((d, i) => {
                const pt = pointsValue[i];
                const isHovered = hoveredPointIndex === i;
                return (
                  <g
                    key={i}
                    onMouseEnter={() => {
                      haptics.tap('light');
                      setHoveredPointIndex(i);
                    }}
                    className="cursor-pointer"
                  >
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? 6 : 4}
                      fill={isHovered ? '#2563EB' : '#FFFFFF'}
                      stroke="#2563EB"
                      strokeWidth={isHovered ? 3 : 2}
                      className="transition-all"
                    />
                    {/* Invisible hit area */}
                    <rect
                      x={pt.x - 20}
                      y={0}
                      width={40}
                      height={height}
                      fill="transparent"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Legend */}
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 px-2 pt-2 border-t border-slate-200/50 dark:border-white/5">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-0.5 bg-blue-600 rounded-full" />
                  <span>Market Value</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-0.5 border-b border-dashed border-slate-400" />
                  <span>Principal Invested</span>
                </span>
              </div>
              <span>Compounding Alpha: +{formatINR(fund.totalGains, true)}</span>
            </div>
          </div>
        </div>

        {/* Folio & Institutional Mandate Details */}
        <div className="px-5 pb-5">
          <div className="bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 dark:text-white">
                <Building className="w-3.5 h-3.5 text-blue-500" />
                <span>NPCI e-NACH Autopay Mandate</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {fund.mandate.status}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div>
                <span className="text-slate-400">Debit Bank:</span>
                <div className="font-medium text-slate-800 dark:text-slate-200">{fund.mandate.bankName} ({fund.mandate.accountNumberMasked})</div>
              </div>
              <div>
                <span className="text-slate-400">Monthly SIP:</span>
                <div className="font-medium text-slate-800 dark:text-slate-200">{formatINR(fund.mandate.sipAmount)} / mo</div>
              </div>
              <div>
                <span className="text-slate-400">Next Auto-Debit:</span>
                <div className="font-medium text-slate-800 dark:text-slate-200">{fund.mandate.nextExecutionDate}</div>
              </div>
              <div className="col-span-2 sm:col-span-3 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-200/60 dark:border-white/5 pt-2">
                UMRN: <span className="font-mono">{fund.mandate.umrn}</span> • Autopay: {fund.mandate.autopayType}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#141A23]">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            Direct Plan TER: {fund.expenseRatio}% • SEBI: {fund.sebiRiskRating}
          </div>

          <div className="flex items-center gap-2">
            <TactileButton
              variant="outline"
              size="sm"
              onClick={() => {
                onClose();
                onOpenSmartPause(fund);
              }}
              className="text-xs text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20 hover:bg-amber-50 dark:hover:bg-amber-500/10"
            >
              <PauseCircle className="w-3.5 h-3.5" />
              <span>Smart Pause / Adjust</span>
            </TactileButton>

            <TactileButton
              variant="primary"
              size="sm"
              onClick={() => {
                onClose();
                onOpenDeposit(fund);
              }}
              className="text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Instant Lumpsum</span>
            </TactileButton>
          </div>
        </div>
      </div>
    </div>
  );
};
