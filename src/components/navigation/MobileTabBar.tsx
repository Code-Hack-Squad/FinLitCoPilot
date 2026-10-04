import React from 'react';
import { LayoutDashboard, Compass, Sparkles, TrendingUp, SlidersHorizontal } from 'lucide-react';
import { haptics } from '../../utils/haptics';

export type MobileTab = 'Portfolio' | 'Invest' | 'Gopal AI' | 'Insights' | 'Settings';

interface MobileTabBarProps {
  activeTab: MobileTab;
  onSelectTab: (tab: MobileTab) => void;
  onOpenGopal: () => void;
}

export const MobileTabBar: React.FC<MobileTabBarProps> = ({
  activeTab,
  onSelectTab,
  onOpenGopal,
}) => {
  const tabs = [
    { id: 'Portfolio' as MobileTab, label: 'Portfolio', icon: LayoutDashboard },
    { id: 'Invest' as MobileTab, label: 'Invest', icon: Compass },
    { id: 'Gopal AI' as MobileTab, label: 'Gopal AI', icon: Sparkles, isCenter: true },
    { id: 'Insights' as MobileTab, label: 'Insights', icon: TrendingUp },
    { id: 'Settings' as MobileTab, label: 'Settings', icon: SlidersHorizontal },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-md border-t border-slate-200 dark:border-white/10 px-2 py-1 select-none">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.isCenter) {
            return (
              <button
                key={tab.id}
                onClick={() => {
                  haptics.tap('medium');
                  onOpenGopal();
                }}
                className="relative -top-2 flex flex-col items-center group cursor-pointer"
              >
                <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md active:scale-95 transition-transform border-2 border-white dark:border-[#0D1117]">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <span className="text-[10px] font-medium text-blue-600 dark:text-blue-400 mt-0.5">
                  Gopal AI
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => {
                haptics.tap('light');
                onSelectTab(tab.id);
              }}
              className={`flex flex-col items-center py-1 px-2.5 rounded-md transition-colors cursor-pointer ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px] mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
