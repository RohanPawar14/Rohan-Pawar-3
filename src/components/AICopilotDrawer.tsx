import React, { useState } from 'react';
import { 
  X, 
  BotMessageSquare, 
  Send, 
  Sparkles, 
  BrainCircuit, 
  TrendingUp, 
  Layers, 
  CornerDownLeft,
  CheckCircle2
} from 'lucide-react';
import { LineItem, HistoricalMemoryNode, PeriodType, EntityType } from '../types';

interface AICopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  period: PeriodType;
  entity: EntityType;
  pnlData: LineItem[];
  memoryNodes: HistoricalMemoryNode[];
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedFollowUps?: string[];
}

export const AICopilotDrawer: React.FC<AICopilotDrawerProps> = ({
  isOpen,
  onClose,
  period,
  entity,
  pnlData,
  memoryNodes,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: `Hello! I'm your **AutoPack FP&A Copilot**. I have indexed the complete **${period} Financial Pack for ${entity}** along with **${memoryNodes.filter(n => n.isCached).length} active historical memory nodes** (including the AWS EDP contract, R&D hiring pause, and SaaS Summit timing). How can I assist your financial analysis?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedFollowUps: [
        'Explain the top 3 drivers of EBITDA outperformance',
        'How does the Q1 R&D hiring pause affect Q3 OPEX?',
        'What is our Free Cash Flow conversion rate?',
      ],
    },
  ]);

  const [inputQuestion, setInputQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (questionText: string) => {
    const q = questionText.trim();
    if (!q) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/ask-analyst', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          financialContext: {
            period,
            entity,
            totalRevenueActual: 32450,
            totalRevenueBudget: 31200,
            grossProfitActual: 24080,
            grossProfitBudget: 22650,
            opexActual: 17260,
            opexBudget: 17480,
            ebitdaActual: 6820,
            ebitdaBudget: 5170,
            fcfActual: 5300,
            cashBalance: 42150,
          },
          memoryNodes: memoryNodes.filter((n) => n.isCached),
        }),
      });
      const data = await response.json();

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: data.answer || 'Analysis complete.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowUps: data.suggestedFollowUps || [],
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Error asking copilot:', err);
      const errorMsg: Message = {
        id: `ai-err-${Date.now()}`,
        sender: 'assistant',
        text: 'Apologies, I encountered a temporary connection issue. Based on offline cache: Revenue is +$1.25M favorable and EBITDA expanded by +$1.65M (+31.9%).',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
              <BotMessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                AutoPack FP&A Analyst
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-200 dark:border-indigo-800">
                  Gemini 3.7
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Grounded in active general ledger tables and historical context vectors
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[90%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-xs border border-slate-200/80 dark:border-slate-700/80'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>
                <div
                  className={`text-[10px] mt-1.5 text-right ${
                    msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {/* Follow-up Prompts */}
              {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                <div className="mt-2.5 space-y-1.5 w-full">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Suggested Inquiries:
                  </span>
                  {msg.suggestedFollowUps.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(prompt)}
                      className="block text-left w-full text-[11px] p-2 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200/60 dark:border-indigo-800/60 transition-colors"
                    >
                      &bull; {prompt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 p-3 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-xl w-fit">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Analyzing variance vectors and historical notes...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputQuestion);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about variances, EBITDA flow-through, or prior period memory..."
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              className="flex-1 text-xs py-2.5 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuestion.trim()}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 transition-colors shrink-0"
              title="Send question"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
