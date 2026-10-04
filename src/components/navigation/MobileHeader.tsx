import React from 'react';
import { Sun, Moon, Volume2, VolumeX, RefreshCw } from 'lucide-react';
import { haptics } from '../../utils/haptics';

interface MobileHeaderProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isSyncing?: boolean;
  onManualSync?: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  isDarkMode,
  onToggleTheme,
  soundEnabled,
  onToggleSound,
  isSyncing = false,
  onManualSync,
}) => {
  return (
    <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-[#0D1117]/80 backdrop-blur-md border-b border-slate-200 dark:border-white/10">
      {/* Brand */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">
          Aura
        </span>
        <button
          onClick={() => {
            haptics.tap('light');
            if (onManualSync) onManualSync();
          }}
          className="ml-2 flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>{isSyncing ? 'Syncing...' : 'Live'}</span>
          <RefreshCw className={`w-2.5 h-2.5 ml-0.5 ${isSyncing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => {
            haptics.tap('light');
            onToggleSound();
          }}
          aria-label="Toggle sound"
          className="p-1.5 rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
        <button
          onClick={() => {
            haptics.tap('light');
            onToggleTheme();
          }}
          aria-label="Toggle theme"
          className="p-1.5 rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        <div className="w-7 h-7 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 flex items-center justify-center text-xs font-bold">
          RS
        </div>
      </div>
    </header>
  );
};
