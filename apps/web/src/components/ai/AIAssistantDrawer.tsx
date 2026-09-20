'use client';

import React, { useState } from 'react';
import { X, Sparkles, Send, Wand2, Languages, FileText } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useChatStore } from '@/stores/chatStore';
import { api } from '@/lib/api';

interface AIMsg {
  role: 'user' | 'assistant';
  content: string;
  image?: string;
}

export function AIAssistantDrawer() {
  const { isRightDrawerOpen, rightDrawerContent, closeRightDrawer } = useUIStore();
  const { activeChat } = useChatStore();
  const [messages, setMessages] = useState<AIMsg[]>([
    {
      role: 'assistant',
      content: "Hi! I'm Meta AI. Ask me anything, plan something, summarize conversations, or generate creative images! 💫",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isRightDrawerOpen || rightDrawerContent !== 'AI') return null;

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setMessages((prev) => [...prev, { role: 'user', content: userText }]);
    setInput('');
    setLoading(true);

    try {
      if (userText.toLowerCase().startsWith('imagine ') || userText.toLowerCase().startsWith('draw ')) {
        // Image generation simulation
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: `Here is the image generated for "${userText}":`,
              image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
            },
          ]);
          setLoading(false);
        }, 1000);
        return;
      }

      const res = await api.aiChat(userText);
      if (res.success && res.reply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: res.reply }]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Meta AI: I am here to help. What else would you like to explore or create?' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (promptText: string) => {
    setInput(promptText);
  };

  return (
    <aside className="w-full md:w-[380px] lg:w-[420px] bg-[#FAF8F2] border-l border-[#E2D8C7] flex flex-col h-full z-30 select-none">
      {/* Header */}
      <div className="h-[60px] px-4 border-b border-[#E2D8C7] flex items-center justify-between bg-[#FFFFFF]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#1E3A8A] to-[#2563EB] p-[2px] flex items-center justify-center shadow-xs">
            <div className="w-full h-full rounded-full bg-[#FFFFFF] flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-[#1E3A8A]" />
            </div>
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-[#0F172A]">Meta AI</h3>
            <p className="text-[11px] text-[#64748B]">Ask anything or create images</p>
          </div>
        </div>

        <button
          onClick={closeRightDrawer}
          className="p-1.5 rounded-full hover:bg-[#ECE3D4] text-[#64748B] hover:text-[#0F172A]"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Suggested Quick Action Chips */}
      <div className="p-3 border-b border-[#E2D8C7] flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-[#FAF8F2]">
        <button
          onClick={() => handleQuickPrompt('Imagine a futuristic city with flying cars at sunset')}
          className="px-3 py-1.5 rounded-full bg-[#FFFFFF] hover:bg-[#ECE3D4] border border-[#E2D8C7] text-[12px] text-[#0F172A] font-medium whitespace-nowrap flex items-center gap-1.5 transition-all shadow-xs"
        >
          <Wand2 className="w-3.5 h-3.5 text-[#1E3A8A]" /> Imagine
        </button>
        <button
          onClick={() => handleQuickPrompt('Summarize our recent conversation thread')}
          className="px-3 py-1.5 rounded-full bg-[#FFFFFF] hover:bg-[#ECE3D4] border border-[#E2D8C7] text-[12px] text-[#0F172A] font-medium whitespace-nowrap flex items-center gap-1.5 transition-all shadow-xs"
        >
          <FileText className="w-3.5 h-3.5 text-[#2563EB]" /> Summarize
        </button>
        <button
          onClick={() => handleQuickPrompt('Translate this message into Hindi')}
          className="px-3 py-1.5 rounded-full bg-[#FFFFFF] hover:bg-[#ECE3D4] border border-[#E2D8C7] text-[12px] text-[#0F172A] font-medium whitespace-nowrap flex items-center gap-1.5 transition-all shadow-xs"
        >
          <Languages className="w-3.5 h-3.5 text-emerald-600" /> Translate
        </button>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 wa-chat-wallpaper">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] rounded-xl p-3 text-[14px] leading-relaxed shadow-sm ${
                m.role === 'user'
                  ? 'wa-bubble-out'
                  : 'wa-bubble-in border border-[#E2D8C7]'
              }`}
            >
              {m.content}
              {m.image && (
                <div className="mt-2 rounded-lg overflow-hidden border border-[#E2D8C7]">
                  <img src={m.image} alt="AI output" className="w-full h-auto object-cover" />
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-[#1E3A8A] animate-pulse font-medium">
            <Sparkles className="w-4 h-4" /> Meta AI is generating response...
          </div>
        )}
      </div>

      {/* Composer Bar */}
      <div className="p-3 bg-[#FAF8F2] border-t border-[#E2D8C7] flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask Meta AI anything..."
          className="flex-1 bg-[#FFFFFF] text-[14px] text-[#0F172A] rounded-xl px-3.5 py-2 placeholder-[#94A3B8] border border-[#E2D8C7] focus:border-[#1E3A8A] focus:outline-none shadow-xs"
        />
        <button
          onClick={handleSend}
          className="p-2 rounded-full bg-[#1E3A8A] hover:bg-[#2563EB] text-white transition-all shadow-md flex items-center justify-center"
        >
          <Send className="w-4 h-4 fill-current" />
        </button>
      </div>
    </aside>
  );
}
