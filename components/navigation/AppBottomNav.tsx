'use client';

import React from 'react';
import { PieChart, TrendingUp, Activity, Settings, Bot } from 'lucide-react';
import { haptics } from '@/lib/haptics';

export type AppNavTab = 'Portfolio' | 'Invest' | 'Gopal' | 'Insights' | 'Settings';

interface AppBottomNavProps {
  activeTab: AppNavTab;
  onSelectTab: (tab: AppNavTab) => void;
  onOpenGopal: () => void;
}

export const AppBottomNav: React.FC<AppBottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenGopal,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0E131A]/95 backdrop-blur-md border-t border-white/10 px-3 py-2 select-none">
      <div className="max-w-lg mx-auto flex items-center justify-around">
        {/* 1. Portfolio Tab (Active default) */}
        <button
          onClick={() => {
            haptics.tap('light');
            onSelectTab('Portfolio');
          }}
          className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
            activeTab === 'Portfolio'
              ? 'text-[#00DF8F]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <PieChart className="w-5 h-5 stroke-[2]" />
          <span className="text-[11px] font-medium leading-none">Portfolio</span>
        </button>

        {/* 2. Invest Tab */}
        <button
          onClick={() => {
            haptics.tap('light');
            onSelectTab('Invest');
          }}
          className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
            activeTab === 'Invest'
              ? 'text-[#00DF8F]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-5 h-5 stroke-[2]" />
          <span className="text-[11px] font-medium leading-none">Invest</span>
        </button>

        {/* 3. Gopal Tab (Placeholder Picture for Gopal Chatbot with Green Status Dot) */}
        <button
          onClick={() => {
            haptics.tap('medium');
            onOpenGopal();
          }}
          className="flex flex-col items-center gap-1 transition-colors cursor-pointer group"
        >
          <div className="relative">
            {/* Gopal Chatbot Placeholder Picture */}
            <div className="w-6 h-6 rounded-full bg-slate-800 border border-white/20 flex items-center justify-center text-slate-300 shadow-xs overflow-hidden group-hover:border-slate-300 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-300">
                <rect x="3" y="11" width="18" height="10" rx="3" />
                <circle cx="9" cy="16" r="1.5" fill="currentColor" />
                <circle cx="15" cy="16" r="1.5" fill="currentColor" />
                <path d="M12 7v4" />
                <circle cx="12" cy="5" r="2" />
              </svg>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#00DF8F] ring-1.5 ring-[#0B0F15]" />
          </div>
          <span className="text-[11px] font-medium text-slate-300 group-hover:text-white leading-none">
            Gopal
          </span>
        </button>

        {/* 4. Insights Tab */}
        <button
          onClick={() => {
            haptics.tap('light');
            onSelectTab('Insights');
          }}
          className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
            activeTab === 'Insights'
              ? 'text-[#00DF8F]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Activity className="w-5 h-5 stroke-[2]" />
          <span className="text-[11px] font-medium leading-none">Insights</span>
        </button>

        {/* 5. Settings Tab */}
        <button
          onClick={() => {
            haptics.tap('light');
            onSelectTab('Settings');
          }}
          className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
            activeTab === 'Settings'
              ? 'text-[#00DF8F]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Settings className="w-5 h-5 stroke-[2]" />
          <span className="text-[11px] font-medium leading-none">Settings</span>
        </button>
      </div>
    </nav>
  );
};
