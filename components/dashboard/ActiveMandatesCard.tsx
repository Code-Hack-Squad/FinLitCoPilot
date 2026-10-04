'use client';

import React from 'react';
import { FundHolding } from '@/types';
import { formatINR } from '@/lib/formatters';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { haptics } from '@/lib/haptics';

interface ActiveMandatesCardProps {
  holdings: FundHolding[];
  onSelectMandate: (fund: FundHolding) => void;
  onManageAll: () => void;
}

export const ActiveMandatesCard: React.FC<ActiveMandatesCardProps> = ({
  holdings,
  onSelectMandate,
  onManageAll,
}) => {
  // Show the top active mandates matching the screenshot
  const activeList = holdings.filter((h) => h.mandate.status === 'Active');

  const getAmcCode = (name: string) => {
    if (name.includes('UTI')) return 'UTI';
    if (name.includes('Mirae')) return 'MIR';
    if (name.includes('HDFC')) return 'HDFC';
    if (name.includes('Nippon') || name.includes('Gold')) return 'NIP';
    return name.slice(0, 3).toUpperCase();
  };

  return (
    <div className="space-y-2.5">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm sm:text-base font-semibold text-white tracking-tight">
          Active SIP Mandates
        </h2>
        <button
          onClick={() => {
            haptics.tap('light');
            onManageAll();
          }}
          className="group text-xs text-slate-400 hover:text-white font-mono flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>Manage All</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Card Container */}
      <div className="bg-[#121820] border border-white/10 rounded-2xl divide-y divide-white/5 overflow-hidden shadow-xs">
        {activeList.slice(0, 2).map((fund) => {
          const amcCode = getAmcCode(fund.name);
          return (
            <div
              key={fund.id}
              onClick={() => {
                haptics.tap('light');
                onSelectMandate(fund);
              }}
              className="p-4 hover:bg-white/[0.03] transition-colors cursor-pointer flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* AMC Code Badge */}
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-mono font-bold text-white shrink-0">
                  {amcCode}
                </div>

                <div className="min-w-0">
                  <div className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors truncate">
                    {fund.name.split('-')[0].trim()}
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    Debit {fund.mandate.executionDay}th monthly
                  </div>
                </div>
              </div>

              {/* Amount & Arrow */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-sm font-bold font-mono text-white tabular-nums">
                  {formatINR(fund.mandate.sipAmount)}/mo
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
