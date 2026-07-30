'use client';

// =============================================================================
// Athlete Risk Intelligence Platform
// AIChatAssistant — Modern Conversational AI Interface (Athlete, Coach, Admin)
// =============================================================================

import React, { useEffect, useRef, useState } from 'react';
import { AIAssistantRole, ChatMessage } from '../../types';
import {
  AthleteContextInput,
  CoachContextInput,
  buildAthleteFactSheet,
  buildCoachFactSheet,
} from '../../services/ai';
import {
  Bot,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  MessageSquare,
  RefreshCw,
  Send,
  Sparkles,
  Trash2,
  User as UserIcon,
} from 'lucide-react';

interface AIChatAssistantProps {
  role: AIAssistantRole;
  athleteContext?: AthleteContextInput;
  coachContext?: CoachContextInput;
  title?: string;
  subtitle?: string;
  embedded?: boolean; // True = embedded card in page; False = floating widget
}

export function AIChatAssistant({
  role,
  athleteContext,
  coachContext,
  title,
  subtitle,
  embedded = true,
}: AIChatAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(embedded);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Default initial suggested questions based on role
  const defaultSuggestions =
    role === 'athlete'
      ? [
          'Why am I marked as Watch?',
          'Summarize my last month.',
          'What should I focus on next week?',
          'What recovery habits should I prioritize?',
        ]
      : role === 'coach'
      ? [
          'Which athletes need attention?',
          "Summarize today's team.",
          'Which athletes missed check-ins?',
          'Explain risk changes.',
        ]
      : [
          'Team health overview',
          'Most common Watch reasons',
          'Injury statistics',
          'Recovery trends',
        ];

  const [currentSuggestions, setCurrentSuggestions] = useState<string[]>(defaultSuggestions);

  // Add welcome message on initial load
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeText =
        role === 'athlete'
          ? `Hello ${athleteContext?.athlete.name || 'Athlete'}! I am your AI Athlete Assistant. Ask me to explain your risk flags, summarize your 7-day sleep and soreness trends, or recommend general recovery habits.`
          : role === 'coach'
          ? `Welcome Coach! I am your Roster Intelligence Assistant. Ask me which athletes need immediate attention, who missed check-ins, or for a daily team summary.`
          : `Hello Admin! I am your Organization Intelligence Assistant. Ask me for department health statistics, injury caseloads, or risk distributions.`;

      setMessages([
        {
          id: 'welcome-msg',
          sender: 'ai',
          text: welcomeText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedQuestions: defaultSuggestions,
        },
      ]);
    }
  }, [role, athleteContext, coachContext, messages.length]);

  // Auto scroll to bottom
  useEffect(() => {
    if (isExpanded) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isExpanded]);

  const factSheet =
    role === 'athlete' && athleteContext
      ? buildAthleteFactSheet(athleteContext)
      : (role === 'coach' || role === 'admin') && coachContext
      ? buildCoachFactSheet(coachContext)
      : null;

  const systemPrompt =
    role === 'athlete'
      ? `You are a friendly assistant embedded in a college athletics platform, talking to the student-athlete ${athleteContext?.athlete.name || ''}. Use ONLY the real platform data provided below to answer personal questions and give suggestions — never invent numbers, stats, or events that are not in this data. If the answer isn't in the data, say additional check-in history is needed. Never give a medical diagnosis or personalized medical advice; for medical concerns, point them to their physio.\n\n=== ATHLETE DATA ===\n${factSheet || 'No data available yet.'}\n=== END DATA ===`
      : role === 'coach'
      ? `You are a friendly assistant embedded in a college athletics platform, talking to a coach. Use ONLY the real roster data provided below to answer questions and give suggestions about specific athletes, training load, or check-in adherence — never invent athlete names or stats that are not in this data. If the answer isn't in the data, say so. Never give a medical diagnosis.\n\n=== ROSTER DATA ===\n${factSheet || 'No data available yet.'}\n=== END DATA ===`
      : `You are a friendly assistant embedded in a college athletics platform, talking to an athletics department admin. Use ONLY the real department data provided below to answer questions and give suggestions — never invent stats that are not in this data. If the answer isn't in the data, say so.\n\n=== DEPARTMENT DATA ===\n${factSheet || 'No data available yet.'}\n=== END DATA ===`;

  const handleSend = async (queryText?: string) => {
    const question = (queryText || input).trim();
    if (!question || isTyping) return;

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    if (!queryText) setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            ...newHistory.map((m) => ({
              role: m.sender === 'user' ? 'user' : 'assistant',
              content: m.text,
            })),
          ],
        }),
      });

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: res.ok
          ? data.reply
          : `⚠️ ${data.error || 'The local AI model could not be reached.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedQuestions: defaultSuggestions,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setCurrentSuggestions(defaultSuggestions);
    } catch {
      const aiMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: '⚠️ Could not reach the local AI service. Make sure Ollama is running (`ollama serve`) with the gemma4 model pulled (`ollama pull gemma4`).',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedQuestions: defaultSuggestions,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text.replace(/[*#_]/g, ''));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    setMessages([]);
    setCurrentSuggestions(defaultSuggestions);
  };

  // Helper to render basic markdown-like syntax (bold text, bullet points, headers)
  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Headers
      if (line.startsWith('### ')) {
        return (
          <h4
            key={idx}
            className="mt-3 mb-1.5 text-sm font-extrabold text-slate-900 dark:text-white"
          >
            {line.replace('### ', '')}
          </h4>
        );
      }
      if (line.startsWith('#### ')) {
        return (
          <h5
            key={idx}
            className="mt-2.5 mb-1 text-xs font-bold text-slate-900 dark:text-white"
          >
            {line.replace('#### ', '')}
          </h5>
        );
      }

      // Bullet points
      const isBullet = line.trim().startsWith('• ') || /^\d+\.\s/.test(line.trim());

      // Replace **bold** tags
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const renderedLine = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="font-extrabold text-slate-900 dark:text-white">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (isBullet) {
        return (
          <div key={idx} className="my-1.5 flex items-start gap-2 text-xs leading-relaxed">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
            <span className="flex-1">{renderedLine}</span>
          </div>
        );
      }

      if (line.trim() === '') {
        return <div key={idx} className="h-2" />;
      }

      return (
        <p key={idx} className="my-1 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
          {renderedLine}
        </p>
      );
    });
  };

  const containerClasses = embedded
    ? 'rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-all'
    : 'fixed bottom-6 right-6 z-50 w-full max-w-md rounded-3xl border border-slate-200 bg-white/95 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95 transition-all';

  return (
    <div className={containerClasses}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-600 text-white shadow-md">
            <Sparkles size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                {title || 'AI Roster & Risk Assistant'}
              </h3>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                {role}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {subtitle || 'Deterministic risk explanation & readiness memory'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {messages.length > 1 && (
            <button
              onClick={handleClear}
              title="Clear Conversation"
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-slate-800 dark:hover:text-rose-400 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          )}
          {!embedded && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              {isExpanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
            </button>
          )}
        </div>
      </div>

      {/* Chat Messages Body */}
      {isExpanded && (
        <>
          <div className="max-h-[420px] min-h-[280px] overflow-y-auto p-5 space-y-4">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                      isUser
                        ? 'bg-blue-600 text-white shadow-sm dark:bg-emerald-600'
                        : 'bg-slate-100 text-emerald-600 dark:bg-slate-800 dark:text-emerald-400'
                    }`}
                  >
                    {isUser ? <UserIcon size={16} /> : <Bot size={16} />}
                  </div>

                  <div
                    className={`group relative max-w-[85%] rounded-2xl p-4 shadow-sm ${
                      isUser
                        ? 'bg-blue-600 text-white dark:bg-emerald-600 dark:text-white rounded-tr-none'
                        : 'border border-slate-200/80 bg-slate-50/80 text-slate-800 dark:border-slate-800/80 dark:bg-slate-950/50 dark:text-slate-200 rounded-tl-none'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 pb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-75">
                        {isUser ? 'You' : 'AI Assistant'}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] opacity-60">{msg.timestamp}</span>
                        {!isUser && (
                          <button
                            onClick={() => handleCopy(msg.id, msg.text)}
                            title="Copy Response"
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                          >
                            {copiedId === msg.id ? (
                              <Check size={12} className="text-emerald-500" />
                            ) : (
                              <Copy size={12} />
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {isUser ? (
                      <p className="text-xs font-medium leading-relaxed">{msg.text}</p>
                    ) : (
                      <div className="space-y-1">{renderMarkdown(msg.text)}</div>
                    )}

                    {/* Context Used Badge */}
                    {msg.contextUsed && msg.contextUsed.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5 border-t border-slate-200/60 pt-2 dark:border-slate-800/60">
                        {msg.contextUsed.map((item, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center rounded-md bg-slate-200/50 px-1.5 py-0.5 text-[9px] font-semibold text-slate-600 dark:bg-slate-800/60 dark:text-slate-400"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-emerald-600 dark:bg-slate-800 dark:text-emerald-400">
                  <Bot size={16} />
                </div>
                <div className="rounded-2xl rounded-tl-none border border-slate-200/80 bg-slate-50/80 px-4 py-3 text-xs text-slate-500 dark:border-slate-800/80 dark:bg-slate-950/50 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 animate-ping rounded-full bg-emerald-500" />
                    <span>Analyzing physiological metrics &amp; rules...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions Chips */}
          {currentSuggestions.length > 0 && (
            <div className="border-t border-slate-100 px-5 py-2.5 dark:border-slate-800/60">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <MessageSquare size={11} />
                <span>Suggested Questions</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {currentSuggestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q)}
                    disabled={isTyping}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-700 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-emerald-500/50 dark:hover:bg-emerald-950 dark:hover:text-emerald-300 transition-all disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 border-t border-slate-100 p-4 dark:border-slate-800"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your readiness, check-ins, or rules..."
              disabled={isTyping}
              className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-500 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-900 text-white shadow-md transition-all hover:bg-blue-800 disabled:opacity-50 dark:bg-emerald-600 dark:hover:bg-emerald-700"
            >
              <Send size={16} />
            </button>
          </form>
        </>
      )}
    </div>
  );
}
