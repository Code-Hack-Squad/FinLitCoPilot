'use client';

import React from 'react';
import { FinancialGoal } from '@/types';
import { formatINR } from '@/lib/formatters';
import { Plus, GraduationCap, Umbrella, Home, Target } from 'lucide-react';
import { haptics } from '@/lib/haptics';

interface GoalsGridProps {
  goals: FinancialGoal[];
  onSelectGoal: (goal: FinancialGoal) => void;
  onAddGoal: () => void;
}

export const GoalsGrid: React.FC<GoalsGridProps> = ({
  goals,
  onSelectGoal,
  onAddGoal,
}) => {
  const getGoalIcon = (category: string, title: string) => {
    if (title.toLowerCase().includes('education') || category === 'Education') {
      return <GraduationCap className="w-5 h-5 text-[#00DF8F]" />;
    }
    if (title.toLowerCase().includes('retirement') || category === 'Retirement') {
      return <Umbrella className="w-5 h-5 text-slate-300" />;
    }
    if (title.toLowerCase().includes('home') || title.toLowerCase().includes('down') || category === 'Real Estate') {
      return <Home className="w-5 h-5 text-[#00DF8F]" />;
    }
    return <Target className="w-5 h-5 text-blue-400" />;
  };

  const getTargetLabel = (goal: FinancialGoal) => {
    if (goal.targetAmount >= 10000000) {
      return `Target ₹${(goal.targetAmount / 10000000).toFixed(1).replace('.0', '')} Cr • ${goal.targetYear}`;
    }
    if (goal.targetAmount >= 100000) {
      return `Target ₹${Math.round(goal.targetAmount / 100000)}L • ${goal.targetYear}`;
    }
    return `Target ${formatINR(goal.targetAmount, true)} • ${goal.targetYear}`;
  };

  return (
    <div className="space-y-2.5">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm sm:text-base font-semibold text-white tracking-tight">
          Financial Goals
        </h2>
        <button
          onClick={() => {
            haptics.tap('light');
            onAddGoal();
          }}
          className="text-xs text-slate-400 hover:text-white font-mono flex items-center gap-1 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Goal</span>
        </button>
      </div>

      {/* Unified Goals Card Container */}
      <div className="bg-[#121820] border border-white/10 rounded-2xl divide-y divide-white/5 overflow-hidden shadow-xs">
        {goals.map((goal) => {
          const progressPercent = Math.min(
            100,
            Math.round((goal.currentAmount / goal.targetAmount) * 100)
          );
          const isHighProgress = progressPercent >= 60;

          return (
            <div
              key={goal.id}
              onClick={() => {
                haptics.tap('light');
                onSelectGoal(goal);
              }}
              className="p-4 sm:p-5 hover:bg-white/[0.03] transition-colors cursor-pointer space-y-3 group"
            >
              {/* Row 1: Icon, Title & Target vs Current & % */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Category Icon */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isHighProgress
                        ? 'bg-[#00DF8F]/10 border border-[#00DF8F]/20'
                        : 'bg-white/5 border border-white/10'
                    }`}
                  >
                    {getGoalIcon(goal.category, goal.title)}
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-white group-hover:text-[#00DF8F] transition-colors truncate">
                      {goal.title}
                    </h3>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">
                      {getTargetLabel(goal)}
                    </div>
                  </div>
                </div>

                {/* Amount & Progress Text */}
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold font-mono text-white tabular-nums">
                    {formatINR(goal.currentAmount)}
                  </div>
                  <div
                    className={`text-xs font-mono mt-0.5 ${
                      isHighProgress ? 'text-[#00DF8F]' : 'text-slate-400'
                    }`}
                  >
                    {progressPercent}% on track
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  style={{ width: `${progressPercent}%` }}
                  className={`h-full rounded-full transition-all duration-500 ${
                    isHighProgress ? 'bg-[#00DF8F]' : 'bg-slate-500'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
