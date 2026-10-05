"use client";

import React, { useState } from "react";
import { FundHolding } from "@/types";
import { formatINR, calculateSIPPauseImpact } from "@/lib/formatters";
import {
  ChevronLeft,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Sparkles,
  Info,
  Calendar,
  Building,
  Sliders,
  Check,
} from "lucide-react";
import { haptics } from "@/lib/haptics";

interface SmartSIPInterruptionModalProps {
  fund: FundHolding | null;
  onClose: () => void;
  onConfirmPause: (
    fundId: string,
    pauseMonths: number,
    restartDate: string,
  ) => void;
  onApplyStepDown: (fundId: string, newAmount: number) => void;
  onOpenGopalChat?: () => void;
}

export const SmartSIPInterruptionModal: React.FC<
  SmartSIPInterruptionModalProps
> = ({ fund, onClose, onConfirmPause, onApplyStepDown, onOpenGopalChat }) => {
  if (!fund) return null;

  // View phase:
  // 'config' = Screen 1 (Duration & Reason matching Image 2)
  // 'gopal_review' = Screen 2 (Gopal steps in to show impact and alternatives)
  // 'success' = Success state
  const [phase, setPhase] = useState<"config" | "gopal_review" | "success">(
    "config",
  );

  const [selectedDuration, setSelectedDuration] = useState<number>(3); // 1, 3, 6, custom
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [customMonths, setCustomMonths] = useState<number>(4);
  const [selectedReason, setSelectedReason] = useState<string>("Cash crunch");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [aiAuditText, setAiAuditText] = useState<string>("");
  const [isFetchingAudit, setIsFetchingAudit] = useState<boolean>(false);
  const [aiRecommendedAction, setAiRecommendedAction] = useState<string>("");

  const activeMonths = isCustom ? customMonths : selectedDuration;
  const currentSIP = fund.mandate.sipAmount;

  // Auto-calculated restart dates matching Image 2 styling
  const getCalculatedRestartDate = (months: number) => {
    const d = new Date();
    d.setMonth(d.getMonth() + months);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const restartDate = getCalculatedRestartDate(activeMonths);

  // Behavioral impact math
  const impact = calculateSIPPauseImpact(
    currentSIP,
    activeMonths,
    fund.xirr || 15.0,
    10,
    fund.currentNav,
  );

  const suggestedStepDown = Math.max(
    500,
    Math.round((currentSIP * 0.33) / 100) * 100,
  );

  const handleProceedToGopalReview = async () => {
    haptics.tap("light");
    setPhase("gopal_review");
    setIsFetchingAudit(true);

    try {
      const response = await fetch("/api/gopal/intervene", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: "Rahul",
          reason: selectedReason,
          pauseMonths: activeMonths,
          fund: fund,
          impact: {
            shortfall: impact.compoundedShortfall,
            unitsMissed: impact.unitsMissed,
          },
        }),
      });
      const data = await response.json();
      setAiAuditText(data.auditText || "");
      setAiRecommendedAction(data.recommendedAction || "");
    } catch (error) {
      console.error(error);
      setAiAuditText(
        "We noticed an interruption. Please remember that stopping your SIP leads to a projected compounding shortfall. Consider stepping down instead.",
      );
      setAiRecommendedAction("step_down");
    } finally {
      setIsFetchingAudit(false);
    }
  };

  const handleExecuteConfirmedPause = () => {
    haptics.tap("medium");
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setPhase("success");
      onConfirmPause(fund.id, activeMonths, restartDate);
    }, 600);
  };

  const handleExecuteStepDown = (amount: number) => {
    haptics.tap("medium");
    onApplyStepDown(fund.id, amount);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xs select-none overflow-y-auto">
      <div className="w-full max-w-xl bg-[#0B0F15] border border-white/10 rounded-3xl max-h-[96vh] overflow-y-auto shadow-2xl flex flex-col my-auto text-white">
        {/* Top Header matching reference Image 2 */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-white/5 sticky top-0 bg-[#0B0F15]/95 backdrop-blur-md z-10">
          <button
            onClick={() => {
              haptics.tap("light");
              if (phase === "gopal_review") {
                setPhase("config");
              } else {
                onClose();
              }
            }}
            aria-label="Back"
            className="w-9 h-9 rounded-full bg-[#121820] border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2]" />
          </button>

          {/* Logo Badge */}
          <div className="px-2.5 py-1 rounded-lg bg-[#121820] border border-white/10 flex items-center gap-1.5 shadow-xs">
            <div className="w-4 h-4 rounded bg-blue-600/20 text-[#00DF8F] flex items-center justify-center text-[10px]">
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
              </svg>
            </div>
            <span className="text-[10px] font-bold font-mono text-white uppercase">
              FinLit Co-Pilot
            </span>
          </div>

          {/* User Profile Avatar Placeholder */}
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/15 flex items-center justify-center text-slate-300 shadow-xs overflow-hidden">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="text-slate-400"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#00DF8F] ring-2 ring-[#0B0F15]" />
          </div>
        </div>

        {/* PHASE 1: CONFIGURATION (Matching Image 2) */}
        {phase === "config" && (
          <div className="p-4 sm:p-6 space-y-5">
            {/* Title & Subtitle */}
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Pause SIP Mandate
              </h1>
              <div className="text-xs text-slate-400 font-mono mt-0.5">
                {fund.name.split("-")[0].trim()} • {formatINR(currentSIP)}/mo
              </div>
            </div>

            {/* Zero Penalty Notice Banner */}
            <div className="p-3 rounded-xl bg-[#0B252E] text-[#38BDF8] border border-[#38BDF8]/20 flex items-center gap-2 text-xs font-mono">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#38BDF8]" />
              <span>
                Zero penalty • Units continue compounding uninterrupted
              </span>
            </div>

            {/* Section: Select Pause Duration */}
            <div className="space-y-2.5">
              <label className="block text-xs font-semibold text-white">
                Select Pause Duration
              </label>

              <div className="bg-[#121820] border border-white/10 rounded-2xl divide-y divide-white/5 overflow-hidden">
                {/* Option 1: 1 Month (Quick Skip) */}
                <div
                  onClick={() => {
                    haptics.tap("light");
                    setIsCustom(false);
                    setSelectedDuration(1);
                  }}
                  className={`p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-white/[0.02] transition-colors ${
                    !isCustom && selectedDuration === 1 ? "bg-white/[0.04]" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        !isCustom && selectedDuration === 1
                          ? "border-[#38BDF8] bg-[#38BDF8]"
                          : "border-slate-500"
                      }`}
                    >
                      {!isCustom && selectedDuration === 1 && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0B0F15]" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">
                        1 Month (Quick Skip)
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        Skips next installment on {getCalculatedRestartDate(1)}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                    Skip Next
                  </span>
                </div>

                {/* Option 2: 3 Months (Recommended) */}
                <div
                  onClick={() => {
                    haptics.tap("light");
                    setIsCustom(false);
                    setSelectedDuration(3);
                  }}
                  className={`p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-white/[0.02] transition-colors ${
                    !isCustom && selectedDuration === 3 ? "bg-white/[0.04]" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        !isCustom && selectedDuration === 3
                          ? "border-[#38BDF8] bg-[#38BDF8]"
                          : "border-slate-500"
                      }`}
                    >
                      {!isCustom && selectedDuration === 3 && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0B0F15]" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">
                        3 Months
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        Auto-resumes {getCalculatedRestartDate(3)} • Best for
                        cash-flow buffer
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#06291C] text-[#00DF8F] border border-[#00DF8F]/20">
                    Recommended
                  </span>
                </div>

                {/* Option 3: 6 Months */}
                <div
                  onClick={() => {
                    haptics.tap("light");
                    setIsCustom(false);
                    setSelectedDuration(6);
                  }}
                  className={`p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-white/[0.02] transition-colors ${
                    !isCustom && selectedDuration === 6 ? "bg-white/[0.04]" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        !isCustom && selectedDuration === 6
                          ? "border-[#38BDF8] bg-[#38BDF8]"
                          : "border-slate-500"
                      }`}
                    >
                      {!isCustom && selectedDuration === 6 && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0B0F15]" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">
                        6 Months
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        Extended suspension • Auto-resumes{" "}
                        {getCalculatedRestartDate(6)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Option 4: Custom Duration */}
                <div
                  onClick={() => {
                    haptics.tap("light");
                    setIsCustom(true);
                  }}
                  className={`p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-white/[0.02] transition-colors ${
                    isCustom ? "bg-white/[0.04]" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isCustom
                          ? "border-[#38BDF8] bg-[#38BDF8]"
                          : "border-slate-500"
                      }`}
                    >
                      {isCustom && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0B0F15]" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">
                        Custom Duration
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {isCustom
                          ? `${customMonths} Months selected`
                          : "Choose 1 to 12 months"}
                      </div>
                    </div>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-slate-400 rotate-180" />
                </div>
              </div>

              {/* Custom Slider if selected */}
              {isCustom && (
                <div className="p-3 bg-[#121820] rounded-xl border border-white/10 space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Duration:</span>
                    <strong className="text-[#38BDF8] font-bold">
                      {customMonths} Months
                    </strong>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    step="1"
                    value={customMonths}
                    onChange={(e) => setCustomMonths(parseInt(e.target.value))}
                    className="w-full accent-[#38BDF8] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>1 mo</span>
                    <span>6 mo</span>
                    <span>12 mo</span>
                  </div>
                </div>
              )}
            </div>

            {/* Section: Reason for Pausing (Optional) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-white">
                  Reason for Pausing
                </label>
                <span className="text-[10px] text-slate-500 font-mono">
                  Optional
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "Market volatility",
                  "Cash crunch",
                  "Urgent expense",
                  "Manual later",
                  "Other",
                ].map((reason) => {
                  const isSelected = selectedReason === reason;
                  return (
                    <button
                      key={reason}
                      onClick={() => {
                        haptics.tap("light");
                        setSelectedReason(reason);
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-white/15 text-white border border-white/30"
                          : "bg-[#121820] text-slate-400 border border-white/10 hover:text-white"
                      }`}
                    >
                      {reason}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Review Action */}
            <div className="pt-3 space-y-2 relative">
              <button
                onClick={handleProceedToGopalReview}
                className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-[#0B0F15] font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>Review Pause Impact</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
              <p className="text-center text-[11px] text-slate-400 font-mono">
                You can cancel or resume this pause anytime with 1 tap.
              </p>

              {/* Floating Gopal Avatar badge */}
              <div className="absolute -top-6 right-2 w-10 h-10 rounded-full bg-[#121820] border border-white/20 flex items-center justify-center shadow-lg">
                <div className="relative">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-slate-300"
                  >
                    <rect x="3" y="11" width="18" height="10" rx="3" />
                    <circle cx="9" cy="16" r="1.5" fill="currentColor" />
                    <circle cx="15" cy="16" r="1.5" fill="currentColor" />
                    <path d="M12 7v4" />
                    <circle cx="12" cy="5" r="2" />
                  </svg>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#00DF8F] ring-1 ring-[#0B0F15]" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PHASE 2: GOPAL STEPS IN (Interactive AI Review & Alternatives) */}
        {phase === "gopal_review" && (
          <div className="p-4 sm:p-6 space-y-5">
            {/* Gopal Header Callout */}
            <div className="p-4 rounded-2xl bg-[#121820] border border-[#38BDF8]/30 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/20 flex items-center justify-center text-slate-200 shrink-0 relative">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-slate-300"
                  >
                    <rect x="3" y="11" width="18" height="10" rx="3" />
                    <circle cx="9" cy="16" r="1.5" fill="currentColor" />
                    <circle cx="15" cy="16" r="1.5" fill="currentColor" />
                    <path d="M12 7v4" />
                    <circle cx="12" cy="5" r="2" />
                  </svg>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#00DF8F] ring-1 ring-[#121820]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-sm font-bold text-white">
                      Gopal's Behavioral Audit
                    </h2>
                    <span className="text-[10px] font-mono text-[#00DF8F] bg-[#00DF8F]/10 px-1.5 py-0.2 rounded border border-[#00DF8F]/20">
                      SEBI Certified Logic
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Compounding Preservation Engine
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-200 leading-relaxed bg-[#0B0F15]/80 p-3 rounded-xl border border-white/5 min-h-[80px]">
                {isFetchingAudit ? (
                  <div className="space-y-2 animate-pulse">
                    <div className="h-3 bg-white/10 rounded w-full"></div>
                    <div className="h-3 bg-white/10 rounded w-5/6"></div>
                    <div className="h-3 bg-white/10 rounded w-4/6"></div>
                  </div>
                ) : (
                  <p>"{aiAuditText}"</p>
                )}
              </div>
            </div>

            {/* Impact Metric Chips */}
            <div className="grid grid-cols-3 gap-2 text-center font-mono">
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
                <div className="text-[10px] text-red-400">Milestone Delay</div>
                <div className="text-base font-bold text-red-400 mt-0.5">
                  +{impact.driftMonths} mo
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
                <div className="text-[10px] text-red-400">10Y Corpus Drag</div>
                <div className="text-base font-bold text-red-400 mt-0.5">
                  -{formatINR(impact.compoundedShortfall, true)}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <div className="text-[10px] text-amber-400">
                  Dip Units Missed
                </div>
                <div className="text-base font-bold text-amber-400 mt-0.5">
                  ~{impact.unitsMissed}
                </div>
              </div>
            </div>

            {/* Smarter Alternatives Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                <Sparkles className="w-3.5 h-3.5 text-[#00DF8F]" />
                <span>Choose a Smarter Alternative:</span>
              </div>

              {/* PRIMARY: Cancel Pause & Continue SIP */}
              <button
                onClick={() => {
                  haptics.tap("medium");
                  onClose();
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-[#00DF8F] hover:bg-[#00DF8F]/90 text-[#0B0F15] font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,223,143,0.2)] hover:shadow-[0_0_25px_rgba(0,223,143,0.3)] transition-all cursor-pointer transform active:scale-[0.98]"
              >
                <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                <span>Cancel & Continue SIP</span>
              </button>

              {/* Option A: Step-Down SIP Amount (Gopal Recommendation) */}
              <div className="p-4 rounded-2xl bg-[#06291C]/70 border border-[#00DF8F]/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#00DF8F] bg-[#00DF8F]/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                    Recommended to avoid loss
                  </span>
                  <span className="text-[11px] font-mono text-slate-300">
                    Cuts loss by ~67%
                  </span>
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white">
                    Step-down SIP to {formatINR(suggestedStepDown)}/mo instead
                  </h3>
                  <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                    Preserves continuous rupee-cost averaging and unit
                    accumulation while freeing up{" "}
                    {formatINR(currentSIP - suggestedStepDown)}/mo in cash flow
                    immediately.
                  </p>
                </div>
                <div className="relative group">
                  <button
                    onClick={() => handleExecuteStepDown(suggestedStepDown)}
                    disabled={!fund.mandate.stepDownAllowed}
                    className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border ${
                      fund.mandate.stepDownAllowed
                        ? "border-[#00DF8F]/40 bg-[#00DF8F]/10 hover:bg-[#00DF8F]/20 text-[#00DF8F] cursor-pointer"
                        : "border-slate-700 bg-slate-800/50 text-slate-400 cursor-not-allowed opacity-70"
                    }`}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>
                      Apply Step-Down to {formatINR(suggestedStepDown)}/mo
                    </span>
                  </button>
                  {!fund.mandate.stepDownAllowed && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 hidden group-hover:block w-max max-w-[220px] bg-[#121820] text-[10px] text-slate-300 p-2 rounded shadow-lg border border-white/10 whitespace-normal z-20 text-center">
                      Step-down is not supported by {fund.mandate.autopayType}{" "}
                      for this AMC.
                    </div>
                  )}
                </div>
              </div>

              {/* Option B: Shorten to 1-Month Skip */}
              {activeMonths > 1 && (
                <div className="p-3.5 rounded-2xl bg-[#121820] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">
                      Reduce pause to 1 Month only
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Saves {formatINR(currentSIP)} now
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Skips only the upcoming installment on{" "}
                    {getCalculatedRestartDate(1)}, limiting total compounding
                    drag.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedDuration(1);
                      setIsCustom(false);
                      handleExecuteConfirmedPause();
                    }}
                    className="w-full py-2 px-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium text-xs transition-colors cursor-pointer"
                  >
                    Switch to 1-Month Quick Skip
                  </button>
                </div>
              )}

              {/* Option C: Proceed with Planned Pause */}
              <div className="pt-2">
                <button
                  onClick={handleExecuteConfirmedPause}
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-3 rounded-xl bg-transparent text-slate-500 hover:text-slate-300 font-medium text-xs transition-colors cursor-pointer"
                >
                  {isSubmitting
                    ? "Freezing NACH Mandate..."
                    : `Proceed with ${activeMonths}-Month Pause (Auto-resumes ${restartDate})`}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PHASE 3: SUCCESS CONFIRMATION */}
        {phase === "success" && (
          <div className="p-6 sm:p-8 flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#00DF8F]/20 text-[#00DF8F] flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">
                Mandate Successfully Frozen
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-1 max-w-sm">
                SIP of {formatINR(currentSIP)} in{" "}
                {fund.name.split("-")[0].trim()} is paused for {activeMonths}{" "}
                months. Auto-restart scheduled for {restartDate}.
              </p>
            </div>

            <div className="w-full p-3 rounded-xl bg-[#121820] border border-white/10 text-xs font-mono text-slate-300">
              Zero Paperwork Resumption • NPCI Ref: NACH-FRZ-
              {Date.now().toString().slice(-6)}
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 px-4 rounded-xl bg-white text-[#0B0F15] font-bold text-xs cursor-pointer hover:bg-slate-100 transition-colors"
            >
              Done & Return to Portfolio
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
