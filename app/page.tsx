'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  initialPortfolioSummary,
  initialFundHoldings,
  initialGoals,
} from '@/data/mockPortfolio';
import { FundHolding, FinancialGoal, PortfolioSummary } from '@/types';
import { AppTopBar } from '@/components/navigation/AppTopBar';
import { AppBottomNav, AppNavTab } from '@/components/navigation/AppBottomNav';
import { NetWorthCard } from '@/components/dashboard/NetWorthCard';
import { PortfolioHealthCard } from '@/components/dashboard/PortfolioHealthCard';
import { GoalsGrid } from '@/components/dashboard/GoalsGrid';
import { ActiveMandatesCard } from '@/components/dashboard/ActiveMandatesCard';
import { FundOverviewView } from '@/components/views/FundOverviewView';
import { SmartSIPInterruptionModal } from '@/components/modals/SmartSIPInterruptionModal';
import { GoalCalibrationModal } from '@/components/modals/GoalCalibrationModal';
import { DepositModal } from '@/components/modals/DepositModal';
import { EditTargetAllocationModal } from '@/components/modals/EditTargetAllocationModal';
import { AddGoalModal } from '@/components/modals/AddGoalModal';
import { GopalDrawer } from '@/components/copilot/GopalDrawer';
import { InsightsView } from '@/components/views/InsightsView';
import { SettingsView } from '@/components/views/SettingsView';
import { haptics } from '@/lib/haptics';

export default function Home() {
  const [activeTab, setActiveTab] = useState<AppNavTab>('Portfolio');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);

  // Core Data State
  const [summary, setSummary] = useState<PortfolioSummary>(initialPortfolioSummary);
  const [holdings, setHoldings] = useState<FundHolding[]>(initialFundHoldings);
  const [goals, setGoals] = useState<FinancialGoal[]>(initialGoals);

  // Detailed Fund Overview Screen state (Reference Image 1)
  const [selectedFundOverview, setSelectedFundOverview] = useState<FundHolding | null>(null);

  // Modal / Drawer States
  const [pauseFund, setPauseFund] = useState<FundHolding | null>(null);
  const [calibrateGoal, setCalibrateGoal] = useState<FinancialGoal | null>(null);
  const [isDepositOpen, setIsDepositOpen] = useState<boolean>(false);
  const [depositTargetFund, setDepositTargetFund] = useState<FundHolding | null>(null);
  const [isEditTargetOpen, setIsEditTargetOpen] = useState<boolean>(false);
  const [isAddGoalOpen, setIsAddGoalOpen] = useState<boolean>(false);
  const [isGopalOpen, setIsGopalOpen] = useState<boolean>(false);

  // Sync Dark Mode class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleToggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleToggleSound = () => {
    setSoundEnabled(false);
  };

  // Actions
  const handleOpenDeposit = (fund?: FundHolding) => {
    haptics.tap('light');
    setDepositTargetFund(fund || null);
    setIsDepositOpen(true);
  };

  const handleExecuteDeposit = (fundId: string, amount: number) => {
    setHoldings((prev) =>
      prev.map((h) => {
        if (h.id === fundId) {
          const addedUnits = amount / h.currentNav;
          return {
            ...h,
            units: h.units + addedUnits,
            investedAmount: h.investedAmount + amount,
            currentValuation: h.currentValuation + amount,
          };
        }
        return h;
      })
    );
    setSummary((prev) => ({
      ...prev,
      netWorth: prev.netWorth + amount,
      investedTotal: prev.investedTotal + amount,
    }));
  };

  const handleConfirmPause = (fundId: string, pauseMonths: number, restartDate: string) => {
    setHoldings((prev) =>
      prev.map((h) => {
        if (h.id === fundId) {
          return {
            ...h,
            mandate: {
              ...h.mandate,
              status: 'Paused',
              pausedUntilDate: restartDate,
              skippedInstallmentsCount: pauseMonths,
            },
          };
        }
        return h;
      })
    );
    setSummary((prev) => ({
      ...prev,
      activeMandatesCount: Math.max(0, prev.activeMandatesCount - 1),
    }));
  };

  const handleApplyStepDown = (fundId: string, newAmount: number) => {
    setHoldings((prev) =>
      prev.map((h) => {
        if (h.id === fundId) {
          return {
            ...h,
            mandate: {
              ...h.mandate,
              sipAmount: newAmount,
            },
          };
        }
        return h;
      })
    );
  };

  const handleSaveCalibratedGoal = (updated: FinancialGoal) => {
    setGoals((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
  };

  const handleAddGoal = (newGoal: FinancialGoal) => {
    setGoals((prev) => [...prev, newGoal]);
  };

  const handleSaveTargets = (equity: number, debt: number, gold: number) => {
    setSummary((prev) => {
      const drift = prev.assetAllocation.equity - equity;
      return {
        ...prev,
        targetAllocation: { equity, debt, gold },
        driftPercentage: parseFloat(drift.toFixed(1)),
        healthScore: Math.max(70, Math.min(99, Math.round(95 - Math.abs(drift) * 2.5))),
      };
    });
  };

  return (
    <main className="min-h-screen bg-[#0B0F15] text-white selection:bg-[#00DF8F]/20 selection:text-[#00DF8F] flex flex-col items-center justify-start py-2 sm:py-5 px-2.5 sm:px-4 overflow-x-hidden w-full max-w-full">
      {/* Centered Device / Mobile-Friendly Viewport Wrapper */}
      <div className="w-full max-w-xl mx-auto flex flex-col space-y-4 pb-24 overflow-x-hidden">
        <AnimatePresence mode="wait">
          {/* Render specific Fund Overview screen if selected (Reference Image 1) */}
          {selectedFundOverview ? (
            <motion.div
              key={`fund-${selectedFundOverview.id}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <FundOverviewView
                fund={selectedFundOverview}
                onBack={() => {
                  setSelectedFundOverview(null);
                }}
                onOpenPause={(fund) => {
                  setPauseFund(fund);
                }}
                onOpenDeposit={(fund) => {
                  handleOpenDeposit(fund);
                }}
                onOpenGopal={() => {
                  setIsGopalOpen(true);
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              {/* Top Header */}
              <AppTopBar
                userName="Rahul"
                isDarkMode={isDarkMode}
                onToggleTheme={handleToggleTheme}
                soundEnabled={soundEnabled}
                onToggleSound={handleToggleSound}
              />

              {/* TAB: Portfolio (Default Dashboard Screen matching Screenshot) */}
              {activeTab === 'Portfolio' && (
                <div className="space-y-4">
                  {/* Net Worth Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <NetWorthCard
                      summary={summary}
                      onOpenDeposit={() => handleOpenDeposit()}
                      onManageSIPs={() => {
                        const firstActive = holdings.find((h) => h.mandate.status === 'Active') || holdings[0];
                        setPauseFund(firstActive);
                      }}
                      onMoreActions={() => {
                        setIsGopalOpen(true);
                      }}
                    />
                  </motion.div>

                  {/* Portfolio Health & Allocation Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.24 }}
                  >
                    <PortfolioHealthCard
                      summary={summary}
                      onEditTarget={() => {
                        setIsEditTargetOpen(true);
                      }}
                    />
                  </motion.div>

                  {/* Financial Goals Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28 }}
                  >
                    <GoalsGrid
                      goals={goals}
                      onSelectGoal={(goal) => {
                        setCalibrateGoal(goal);
                      }}
                      onAddGoal={() => {
                        setIsAddGoalOpen(true);
                      }}
                    />
                  </motion.div>

                  {/* Active SIP Mandates Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.32 }}
                  >
                    <ActiveMandatesCard
                      holdings={holdings}
                      onSelectMandate={(fund) => {
                        setSelectedFundOverview(fund);
                      }}
                      onManageAll={() => {
                        setActiveTab('Invest');
                      }}
                    />
                  </motion.div>
                </div>
              )}

              {/* TAB: Invest */}
              {activeTab === 'Invest' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-xl font-bold tracking-tight text-white">
                        Direct Mutual Funds
                      </h1>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        Direct Institutional Plans • Zero Distributor TER
                      </p>
                    </div>
                    <button
                      onClick={() => handleOpenDeposit()}
                      className="px-3.5 py-1.5 rounded-xl bg-white text-[#0B0F15] font-semibold text-xs cursor-pointer shadow-sm hover:bg-slate-100 transition-colors"
                    >
                      + Deposit
                    </button>
                  </div>

                  <div className="bg-[#121820] border border-white/10 rounded-2xl divide-y divide-white/5 overflow-hidden">
                    {holdings.map((h) => (
                      <div
                        key={h.id}
                        onClick={() => {
                          setSelectedFundOverview(h);
                        }}
                        className="p-4 hover:bg-white/[0.03] transition-colors cursor-pointer flex items-center justify-between gap-3 group"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold text-white group-hover:text-[#00DF8F] transition-colors truncate">
                            {h.name.split('-')[0].trim()}
                          </div>
                          <div className="text-xs text-slate-400 font-mono mt-0.5 truncate">
                            NAV ₹{h.currentNav} • {h.category}
                          </div>
                        </div>

                        <div className="text-right font-mono shrink-0">
                          <div className="text-sm font-bold text-white tabular-nums">
                            ₹{h.currentValuation.toLocaleString('en-IN')}
                          </div>
                          <div className="text-xs text-[#00DF8F] font-semibold">
                            +{h.xirr}% XIRR
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: Insights */}
              {activeTab === 'Insights' && (
                <InsightsView
                  summary={summary}
                  holdings={holdings}
                  onOpenGopal={() => setIsGopalOpen(true)}
                />
              )}

              {/* TAB: Settings */}
              {activeTab === 'Settings' && (
                <SettingsView
                  isDarkMode={isDarkMode}
                  onToggleTheme={handleToggleTheme}
                  soundEnabled={soundEnabled}
                  onToggleSound={handleToggleSound}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Docked Bottom Navigation Bar */}
      <AppBottomNav
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setSelectedFundOverview(null);
          setActiveTab(tab);
        }}
        onOpenGopal={() => {
          setIsGopalOpen(true);
        }}
      />

      {/* Gopal AI Slide-Over Drawer */}
      <GopalDrawer
        isOpen={isGopalOpen}
        onClose={() => setIsGopalOpen(false)}
        summary={summary}
        holdings={holdings}
        activeTab={activeTab}
      />

      {/* Smart SIP Interruption & Behavioral Friction Modal (Reference Image 2 + Gopal Review) */}
      <SmartSIPInterruptionModal
        fund={pauseFund}
        onClose={() => setPauseFund(null)}
        onConfirmPause={handleConfirmPause}
        onApplyStepDown={handleApplyStepDown}
        onOpenGopalChat={() => {
          setPauseFund(null);
          setIsGopalOpen(true);
        }}
      />

      {/* Goal Calibration & Simulator Modal */}
      <GoalCalibrationModal
        goal={calibrateGoal}
        onClose={() => setCalibrateGoal(null)}
        onSaveGoal={handleSaveCalibratedGoal}
      />

      {/* Lumpsum Deposit Modal */}
      {isDepositOpen && (
        <DepositModal
          fund={depositTargetFund}
          holdings={holdings}
          onClose={() => {
            setIsDepositOpen(false);
            setDepositTargetFund(null);
          }}
          onExecuteDeposit={handleExecuteDeposit}
        />
      )}

      {/* Edit Target Allocation Modal */}
      {isEditTargetOpen && (
        <EditTargetAllocationModal
          summary={summary}
          onClose={() => setIsEditTargetOpen(false)}
          onSaveTargets={handleSaveTargets}
        />
      )}

      {/* Add Goal Modal */}
      <AddGoalModal
        isOpen={isAddGoalOpen}
        onClose={() => setIsAddGoalOpen(false)}
        onAddGoal={handleAddGoal}
      />
    </main>
  );
}
