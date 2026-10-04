import React from 'react';
import {
  LayoutDashboard,
  Compass,
  FileCheck2,
  TrendingUp,
  SlidersHorizontal,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { haptics } from '../../utils/haptics';

export type NavTab = 'Dashboard' | 'Invest' | 'Mandates' | 'Insights' | 'Settings';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isSyncing?: boolean;
  onManualSync?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isDarkMode,
  onToggleTheme,
  soundEnabled,
  onToggleSound,
  isSyncing = false,
  onManualSync,
}) => {
  const navItems: { label: NavTab; icon: React.ElementType }[] = [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Invest', icon: Compass },
    { label: 'Mandates', icon: FileCheck2 },
    { label: 'Insights', icon: TrendingUp },
    { label: 'Settings', icon: SlidersHorizontal },
  ];

  return (
    <aside className="w-[240px] shrink-0 border-r border-slate-200 dark:border-white/10 bg-white/70 dark:bg-[#0D1117] flex flex-col justify-between p-5 select-none h-screen sticky top-0 transition-colors">
      <div className="flex flex-col gap-6">
        {/* Brand Logo & Wordmark */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <div className="font-bold text-base tracking-tight text-slate-900 dark:text-white">
              Aura Wealth
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono tracking-tight">
              AMFI RIA • INA000184
            </div>
          </div>
        </div>

        {/* Real-Time Sync Indicator */}
        <button
          onClick={() => {
            haptics.tap('light');
            if (onManualSync) onManualSync();
          }}
          className="group flex items-center justify-between px-2.5 py-1.5 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 text-left transition-colors hover:bg-slate-200/60 dark:hover:bg-white/10 cursor-pointer"
          title="Click to refresh NAV data"
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 ${isSyncing ? 'duration-500' : 'duration-1000'}`}></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] text-slate-600 dark:text-slate-300 font-mono">
              {isSyncing ? 'Refreshing NAVs...' : 'Synced 1m ago'}
            </span>
          </div>
          <RefreshCw className={`w-3 h-3 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-transform ${isSyncing ? 'animate-spin' : ''}`} />
        </button>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.label;
            return (
              <button
                key={item.label}
                onClick={() => {
                  haptics.tap('light');
                  onSelectTab(item.label);
                }}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/5'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'
                  }`}
                />
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions: Theme Toggle, Sound Toggle, and User Profile Badge */}
      <div className="flex flex-col gap-4 pt-4 border-t border-slate-200 dark:border-white/10">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                haptics.tap('light');
                onToggleTheme();
              }}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer transition-colors"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => {
                const next = onToggleSound();
                haptics.tap('medium');
              }}
              title={soundEnabled ? 'Mute micro-interaction audio' : 'Enable tactile audio'}
              className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
            <span>SEBI Safe</span>
          </div>
        </div>

        {/* User Profile Badge */}
        <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200/70 dark:border-white/5">
          <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 flex items-center justify-center text-xs font-bold tracking-tight">
            RS
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
              Rajesh Sharma
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">
              Verified Investor
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
