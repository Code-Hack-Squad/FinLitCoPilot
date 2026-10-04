'use client';

import React, { useState } from 'react';
import { Bell, ChevronDown, User, Image as ImageIcon } from 'lucide-react';
import { haptics } from '@/lib/haptics';

interface AppTopBarProps {
  userName?: string;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenNotifications?: () => void;
}

export const AppTopBar: React.FC<AppTopBarProps> = ({
  userName = 'Rahul',
  isDarkMode,
  onToggleTheme,
  soundEnabled,
  onToggleSound,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: '1', title: 'NAV Update Consolidated', desc: 'UTI Nifty 50 marked at ₹150.0 (+0.52%)', time: '1m ago' },
    { id: '2', title: 'NPCI Mandate Verified', desc: 'Debit scheduled for 12 Oct (₹15,000)', time: '3h ago' },
    { id: '3', title: 'Quarterly Rebalancing Audit', desc: 'Equity at 74% — no taxable drift', time: '1d ago' },
  ];

  return (
    <header className="flex items-center justify-between py-2 sm:py-3 select-none relative z-30">
      {/* Top Left Logo: FinLit Co-Pilot */}
      <div className="flex items-center">
        <div className="px-3 py-1.5 rounded-lg bg-[#121820] border border-white/10 flex items-center gap-2.5 shadow-xs">
          {/* Logo Wave Mark */}
          <div className="w-5 h-5 rounded bg-blue-600/20 text-[#00DF8F] flex items-center justify-center">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
              <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
            </svg>
          </div>
          {/* Brand Name */}
          <span className="text-[11px] font-bold font-mono tracking-tight text-white uppercase">
            FinLit Co-Pilot
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#00DF8F]" />
        </div>
      </div>

      {/* User & Actions on Right */}
      <div className="flex items-center gap-2.5">
        {/* Welcome Back & Name */}
        <div className="relative">
          <button
            onClick={() => {
              haptics.tap('light');
              setShowDropdown(!showDropdown);
            }}
            className="flex items-center gap-2 text-left cursor-pointer group"
          >
            <div className="hidden sm:block text-right">
              <div className="text-[10px] text-slate-400 font-mono leading-none">
                Welcome back
              </div>
              <div className="text-xs font-semibold text-white flex items-center justify-end gap-0.5 mt-0.5 group-hover:text-slate-300 transition-colors">
                <span>{userName}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
            </div>

            {/* User Profile Picture Placeholder */}
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/15 flex items-center justify-center text-slate-300 shadow-xs overflow-hidden">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-slate-400">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#00DF8F] ring-2 ring-[#0B0F15]" />
            </div>
          </button>

          {/* User Profile Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 top-11 w-56 bg-[#141B24] border border-white/10 rounded-xl shadow-xl p-2 z-50 text-xs font-mono space-y-1">
              <div className="px-3 py-2 border-b border-white/5">
                <div className="font-bold text-white">{userName} Sharma</div>
                <div className="text-[11px] text-slate-400">KYC Verified • SEBI Client</div>
              </div>
              <button
                onClick={() => {
                  onToggleTheme();
                  setShowDropdown(false);
                }}
                className="w-full px-3 py-2 rounded-lg hover:bg-white/5 text-slate-300 hover:text-white flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>Theme</span>
                <span>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Notification Bell with Green Badge Dot */}
        <div className="relative">
          <button
            onClick={() => {
              haptics.tap('light');
              setShowNotifications(!showNotifications);
            }}
            aria-label="Notifications"
            className="w-8 h-8 rounded-full bg-[#121820] border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/5 transition-colors relative cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#00DF8F]" />
          </button>

          {/* Notifications Flyout */}
          {showNotifications && (
            <div className="absolute right-0 top-11 w-72 bg-[#141B24] border border-white/10 rounded-xl shadow-2xl p-3 z-50 text-xs space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-white/5">
                <span className="font-semibold text-white">Notifications</span>
                <span className="text-[10px] font-mono text-[#00DF8F]">Real-Time Active</span>
              </div>
              <div className="space-y-2">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2 rounded-lg bg-white/5 space-y-0.5">
                    <div className="font-semibold text-white text-[11px]">{n.title}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{n.desc}</div>
                    <div className="text-[9px] text-slate-500 font-mono text-right">{n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
