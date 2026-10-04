import React, { useState } from 'react';
import { ShieldCheck, Moon, Sun, Volume2, VolumeX, Building2, UserCheck, Bell, Lock } from 'lucide-react';
import { TactileButton } from '../common/TactileButton';
import { haptics } from '../../utils/haptics';

interface SettingsViewProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  isDarkMode,
  onToggleTheme,
  soundEnabled,
  onToggleSound,
}) => {
  const [riskTolerance, setRiskTolerance] = useState('Moderate Aggressive');
  const [driftThreshold, setDriftThreshold] = useState('5.0');
  const [autoRebalanceNotify, setAutoRebalanceNotify] = useState(true);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Portfolio & Regulatory Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
          SEBI RIA INA000184 Configuration • Autopay & Security Rules
        </p>
      </div>

      {/* Account & Investor Details */}
      <div className="bg-white dark:bg-[#141A23] border border-slate-200 dark:border-white/10 rounded-xl p-5 md:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <UserCheck className="w-5 h-5 text-blue-500" />
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Investor Profile & KYC Verification
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Verified with KRA & CAMS Repositories
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            KYC Compliant
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 dark:border-white/5 text-xs font-mono">
          <div>
            <span className="text-slate-400">Primary Holder:</span>
            <div className="font-semibold text-slate-900 dark:text-white mt-0.5">Rahul Sharma</div>
          </div>
          <div>
            <span className="text-slate-400">PAN Card:</span>
            <div className="font-semibold text-slate-900 dark:text-white mt-0.5">ABCPS••••D</div>
          </div>
          <div>
            <span className="text-slate-400">CAMS Folio Consolidated:</span>
            <div className="font-semibold text-slate-900 dark:text-white mt-0.5">8 Folios Active</div>
          </div>
        </div>
      </div>

      {/* Linked Bank Mandates */}
      <div className="bg-white dark:bg-[#141A23] border border-slate-200 dark:border-white/10 rounded-xl p-5 md:p-6 space-y-3">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-blue-500" />
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            Linked Autopay Bank Accounts
          </h2>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 text-xs font-mono">
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">HDFC Bank Limited</div>
              <div className="text-slate-400 text-[11px]">A/C ••••4821 • NPCI e-NACH Active</div>
            </div>
            <span className="text-emerald-600 dark:text-emerald-400 text-[11px]">Primary Debit</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 text-xs font-mono">
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">ICICI Bank Limited</div>
              <div className="text-slate-400 text-[11px]">A/C ••••9930 • NPCI e-NACH Active</div>
            </div>
            <span className="text-slate-500 text-[11px]">Secondary</span>
          </div>
        </div>
      </div>

      {/* Interface & Display Preferences */}
      <div className="bg-white dark:bg-[#141A23] border border-slate-200 dark:border-white/10 rounded-xl p-5 md:p-6 space-y-4">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
          Display & Theme Preferences
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div>
            <div className="text-xs font-semibold text-slate-900 dark:text-white">
              Visual Appearance Mode
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Restrained minimal color palette: deep slate-black dark mode or crisp neutral slate light mode.
            </p>
          </div>
          <TactileButton
            variant="outline"
            size="sm"
            onClick={onToggleTheme}
            className="text-xs shrink-0"
          >
            {isDarkMode ? <Moon className="w-4 h-4 text-blue-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            <span>{isDarkMode ? 'Dark Mode (#0B0F15)' : 'Light Mode (#F8FAFC)'}</span>
          </TactileButton>
        </div>
      </div>
    </div>
  );
};
