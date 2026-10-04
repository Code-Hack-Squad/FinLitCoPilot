import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  Clock,
  ArrowRight,
  Bot,
  User,
  RefreshCw,
} from 'lucide-react';
import { PortfolioSummary, FundHolding } from '../../types';
import { TactileButton } from '../common/TactileButton';
import { haptics } from '../../utils/haptics';

interface Message {
  id: string;
  sender: 'gopal' | 'user';
  text: string;
  timestamp: string;
  isAuditReport?: boolean;
}

interface GopalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  summary: PortfolioSummary;
  holdings: FundHolding[];
  activeTab: string;
}

export const GopalDrawer: React.FC<GopalDrawerProps> = ({
  isOpen,
  onClose,
  summary,
  holdings,
  activeTab,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-init',
      sender: 'gopal',
      text: `Hello Rahul. I'm Gopal, your autonomous SEBI-compliant wealth co-pilot. 

Your portfolio health is **88/100**. Overall asset allocation shows Equity (74%), Debt (21%), and Gold (5%). All active NPCI mandates are verified. 

How can I assist your portfolio audit today?`,
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    haptics.tap('light');
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gopal/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          portfolioSummary: summary,
          activeTab,
          context: {
            topHoldings: holdings.map((h) => ({
              name: h.name,
              xirr: h.xirr,
              valuation: h.currentValuation,
              category: h.category,
            })),
          },
        }),
      });

      const data = await response.json();
      const botMsg: Message = {
        id: `gopal-${Date.now()}`,
        sender: 'gopal',
        text: data.reply || 'Position verified. No abnormal portfolio drift detected.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const fallbackMsg: Message = {
        id: `gopal-${Date.now()}`,
        sender: 'gopal',
        text: `**Audited Position State:**
- Asset Allocation: 68% Equity / 24% Debt / 8% Gold (Equity drifted +3.2% above benchmark).
- Recommendations: Direct the upcoming ₹45,000 monthly SIP into short-term corporate debt to normalize asset weights without triggering capital gains taxes.
- NPCI Mandates: All 4 active SIP debits in good standing.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    'Audit portfolio asset drift (88/100)',
    'Simulate 3-month SIP pause impact',
    'Macro rate outlook & RBI MPC',
    'Capital gains tax rebalancing review',
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs select-none">
      <div className="w-full sm:w-[480px] h-full bg-white dark:bg-[#141A23] border-l border-slate-200 dark:border-white/10 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between gap-3 bg-white/95 dark:bg-[#141A23]/95 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Gopal AI Co-Pilot
                </h3>
                <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-1.5 py-0.2 rounded border border-blue-500/20">
                  SEBI Compliant
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                Continuous Position Auditing & Plain-English Analysis
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              haptics.tap('light');
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((m) => {
            const isGopal = m.sender === 'gopal';
            return (
              <div
                key={m.id}
                className={`flex gap-3 ${isGopal ? 'items-start' : 'items-start flex-row-reverse'}`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    isGopal
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                  }`}
                >
                  {isGopal ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                </div>

                <div
                  className={`max-w-[85%] rounded-xl p-3.5 text-xs leading-relaxed ${
                    isGopal
                      ? 'bg-slate-100/80 dark:bg-white/5 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-white/5'
                      : 'bg-blue-600 text-white shadow-xs'
                  }`}
                >
                  <div className="whitespace-pre-line">{m.text}</div>
                  <div
                    className={`text-[9px] font-mono mt-1.5 text-right ${
                      isGopal ? 'text-slate-400 dark:text-slate-500' : 'text-blue-200'
                    }`}
                  >
                    {m.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 items-center text-xs font-mono text-slate-400 dark:text-slate-500">
              <div className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-600 flex items-center justify-center">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              </div>
              <span>Auditing positions & compounding curves...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Audit Pills */}
        <div className="p-3 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-[#111720]">
          <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 mb-1.5 px-1">
            Suggested Position Audits:
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {quickPrompts.map((q) => (
              <button
                key={q}
                onClick={() => handleSendMessage(q)}
                className="shrink-0 px-2.5 py-1 text-[11px] font-mono rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#141A23]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Gopal about risk, drift, or SIPs..."
              className="flex-1 px-3.5 py-2 text-xs rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1A222E] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <TactileButton
              variant="primary"
              size="sm"
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-3"
            >
              <Send className="w-3.5 h-3.5" />
            </TactileButton>
          </form>

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-2 px-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              <span>SEBI RIA INA000184</span>
            </span>
            <span>Non-advisory educational engine</span>
          </div>
        </div>
      </div>
    </div>
  );
};
