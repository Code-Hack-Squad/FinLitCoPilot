'use client';

import React, { useState } from 'react';
import { FundHolding } from '@/types';
import { formatINR } from '@/lib/formatters';
import {
  ChevronLeft,
  ShieldCheck,
  Pause,
  Plus,
  ArrowUp,
  Info,
} from 'lucide-react';
import { haptics } from '@/lib/haptics';

interface FundOverviewViewProps {
  fund: FundHolding;
  onBack: () => void;
  onOpenPause: (fund: FundHolding) => void;
  onOpenDeposit: (fund: FundHolding) => void;
  onOpenGopal: () => void;
}

export const FundOverviewView: React.FC<FundOverviewViewProps> = ({
  fund,
  onBack,
  onOpenPause,
  onOpenDeposit,
  onOpenGopal,
}) => {
  const [timeframe, setTimeframe] = useState<'1Y' | '3Y' | 'All'>('3Y');
  const [activeTooltip, setActiveTooltip] = useState<boolean>(true);

  // SVG dimensions for growth trajectory curve
  const width = 360;
  const height = 160;

  // Exact trajectory points inspired by Image 1
  const historyData = fund.performanceHistory[timeframe];
  const lastVal = fund.currentValuation;
  const principalVal = fund.investedAmount;

  // Computed coordinates for smooth upward curve
  const curvePath = `M 20,135 Q 120,110 200,65 T 340,30`;
  const principalPath = `M 20,138 L 340,90`;

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col space-y-4 pb-28 text-white select-none px-1">
      {/* Top Bar with Back Button, Logo Placeholder & User Avatar */}
      <div className="flex items-center justify-between py-1">
        <button
          onClick={() => {
            haptics.tap('light');
            onBack();
          }}
          aria-label="Back"
          className="w-9 h-9 rounded-full bg-[#121820] border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2]" />
        </button>

        {/* Center Logo + Title */}
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 rounded-lg bg-[#121820] border border-white/10 flex items-center gap-1.5 shadow-xs">
            <div className="w-4 h-4 rounded bg-blue-600/20 text-[#00DF8F] flex items-center justify-center text-[10px]">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
              </svg>
            </div>
            <span className="text-[10px] font-bold font-mono text-white uppercase">FinLit Co-Pilot</span>
          </div>
          <span className="text-xs sm:text-sm font-semibold text-white">Fund Overview</span>
        </div>

        {/* User Avatar Placeholder */}
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/15 flex items-center justify-center text-slate-300 shadow-xs overflow-hidden">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-slate-400">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#00DF8F] ring-2 ring-[#0B0F15]" />
        </div>
      </div>

      {/* Main Fund Card */}
      <div className="bg-[#121820] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-2.5 py-1 rounded-full bg-[#0B252E] text-[#38BDF8] border border-[#38BDF8]/20 text-[11px] font-mono flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Direct Growth • Equity</span>
          </div>
          <div className="px-2.5 py-1 rounded-full bg-[#06291C] text-[#00DF8F] border border-[#00DF8F]/20 text-[11px] font-mono">
            Low Volatility
          </div>
        </div>

        {/* Fund Title & Folio Subtitle */}
        <div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">
            {fund.name.split('-')[0].trim()}
          </h1>
          <div className="text-xs text-slate-400 font-mono mt-0.5">
            Folio ••••{fund.folioNumber.slice(-5)} • {fund.mandate.bankName} Autopay
          </div>
        </div>

        {/* Valuation & Capital Grid */}
        <div className="bg-[#0B0F15]/70 border border-white/5 rounded-xl p-4 grid grid-cols-2 gap-4">
          {/* Current Value */}
          <div>
            <div className="text-[11px] text-slate-400 font-mono">Current Value</div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums mt-0.5">
              {formatINR(fund.currentValuation)}
            </div>
            <div className="flex items-center gap-1 text-xs text-[#00DF8F] font-mono mt-1 font-medium">
              <ArrowUp className="w-3 h-3 stroke-[2.5]" />
              <span>+{fund.xirr}% XIRR</span>
            </div>
          </div>

          {/* Invested Capital */}
          <div>
            <div className="text-[11px] text-slate-400 font-mono">Invested Capital</div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums mt-0.5">
              {formatINR(fund.investedAmount)}
            </div>
            <div className="text-xs text-slate-400 font-mono mt-1">
              36 monthly installments
            </div>
          </div>
        </div>
      </div>

      {/* Growth Trajectory Card */}
      <div className="bg-[#121820] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs">
        {/* Header & Timeframe Segmented Control */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-white">Growth Trajectory</div>
            <div className="text-xs text-slate-400 font-mono">
              {formatINR(fund.mandate.sipAmount)}/mo SIP compounding
            </div>
          </div>

          <div className="flex items-center gap-1 p-0.5 bg-black/40 rounded-lg border border-white/5 text-xs font-mono">
            {(['1Y', '3Y', 'All'] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  haptics.tap('light');
                  setTimeframe(t);
                }}
                className={`px-2.5 py-1 rounded-md text-[11px] transition-colors cursor-pointer ${
                  timeframe === t
                    ? 'bg-[#00DF8F] text-[#0B0F15] font-bold shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive SVG Chart */}
        <div className="relative w-full overflow-hidden bg-[#0B0F15]/60 rounded-xl p-2 border border-white/5">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-36 sm:h-44 overflow-visible">
            {/* Horizontal Guide Lines */}
            <line x1="20" y1="40" x2="340" y2="40" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
            <line x1="20" y1="90" x2="340" y2="90" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
            <line x1="20" y1="140" x2="340" y2="140" stroke="rgba(255,255,255,0.1)" />

            {/* Dotted Invested Principal Line */}
            <path
              d={principalPath}
              fill="none"
              stroke="#64748B"
              strokeWidth="2"
              strokeDasharray="4 4"
            />

            {/* Solid Cyan / Emerald Valuation Curve */}
            <path
              d={curvePath}
              fill="none"
              stroke="#38BDF8"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Active End Node */}
            <circle cx="340" cy="30" r="5" fill="#38BDF8" className="animate-pulse" />
            <circle cx="340" cy="30" r="9" fill="none" stroke="#38BDF8" strokeOpacity="0.4" strokeWidth="2" />

            {/* Tooltip Tag matching screenshot */}
            <g transform="translate(230, 20)">
              <rect x="0" y="0" width="105" height="24" rx="12" fill="#0B252E" stroke="#38BDF8" strokeWidth="1" />
              <circle cx="12" cy="12" r="3.5" fill="#38BDF8" />
              <text x="24" y="16" fill="#FFFFFF" fontSize="11" fontFamily="monospace" fontWeight="bold">
                {formatINR(fund.currentValuation)}
              </text>
            </g>
          </svg>

          {/* Bottom Chart Legend */}
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 px-1 border-t border-white/5">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
                <span>Current Value</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 border-b border-dashed border-slate-400" />
                <span>Invested</span>
              </span>
            </div>
            <span>Source: AMFI Real-time</span>
          </div>
        </div>
      </div>

      {/* Mandate Details Card */}
      <div className="bg-[#121820] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-2.5 shadow-xs">
        <h2 className="text-sm font-semibold text-white">Mandate Details</h2>

        <div className="bg-[#0B0F15]/70 border border-white/5 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-white">Monthly SIP Amount</div>
            <div className="text-xs text-slate-400 font-mono mt-0.5">
              Debit: {fund.mandate.executionDay}th of every month
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm font-bold font-mono text-white tabular-nums">
              {formatINR(fund.mandate.sipAmount)}/mo
            </div>
            <div className="text-xs text-[#00DF8F] font-mono mt-0.5">
              Auto-debit active
            </div>
          </div>
        </div>
      </div>

      {/* Docked Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0B0F15]/95 backdrop-blur-md border-t border-white/10 p-3">
        <div className="max-w-xl mx-auto flex items-center gap-3 relative">
          {/* Pause or Adjust button */}
          <button
            onClick={() => {
              haptics.tap('light');
              onOpenPause(fund);
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-[#121820] hover:bg-[#18202A] text-slate-200 border border-white/10 font-semibold text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Pause className="w-3.5 h-3.5" />
            <span>Pause or Adjust</span>
          </button>

          {/* + Add Lump Sum button */}
          <button
            onClick={() => {
              haptics.tap('light');
              onOpenDeposit(fund);
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-[#00DF8F] hover:bg-[#00DF8F]/90 text-[#0B0F15] font-bold text-xs flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Lump Sum</span>
          </button>

          {/* Floating Gopal Avatar pill */}
          <button
            onClick={() => {
              haptics.tap('medium');
              onOpenGopal();
            }}
            title="Ask Gopal about this fund"
            className="absolute -top-14 right-2 w-10 h-10 rounded-full bg-[#121820] border border-white/20 flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <div className="relative">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-300">
                <rect x="3" y="11" width="18" height="10" rx="3" />
                <circle cx="9" cy="16" r="1.5" fill="currentColor" />
                <circle cx="15" cy="16" r="1.5" fill="currentColor" />
                <path d="M12 7v4" />
                <circle cx="12" cy="5" r="2" />
              </svg>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#00DF8F] ring-1 ring-[#0B0F15]" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
