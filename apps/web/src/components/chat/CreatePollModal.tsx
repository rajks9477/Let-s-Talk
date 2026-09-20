'use client';

import React, { useState } from 'react';
import { X, Plus, Trash2, Vote } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useChatStore } from '@/stores/chatStore';
import { api } from '@/lib/api';
import { getSocket } from '@/lib/socket';

export function CreatePollModal() {
  const { isCreatePollOpen, setModalState } = useUIStore();
  const { activeChat, addMessage } = useChatStore();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [isMultipleChoice, setIsMultipleChoice] = useState(false);

  if (!isCreatePollOpen || !activeChat) return null;

  const handleAddOption = () => {
    if (options.length < 10) {
      setOptions([...options, '']);
    }
  };

  const handleOptionChange = (idx: number, val: string) => {
    const updated = [...options];
    updated[idx] = val;
    setOptions(updated);
  };

  const handleRemoveOption = (idx: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== idx));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validOptions = options.map((o) => o.trim()).filter(Boolean);
    if (!question.trim() || validOptions.length < 2) return;

    try {
      const res = await api.createPoll({
        chatId: activeChat.id,
        question: question.trim(),
        options: validOptions,
        isMultipleChoice,
      });

      if (res.success && res.poll) {
        addMessage(activeChat.id, res.poll);
        getSocket().emit('message:send', res.poll);
      }
    } catch (err) {
      console.error('Failed to create poll:', err);
    }

    setModalState('isCreatePollOpen', false);
    setQuestion('');
    setOptions(['', '']);
  };

  return (
    <div className="fixed inset-0 bg-[#0A192F]/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-[#FAF8F2] border border-[#E2D8C7] rounded-2xl shadow-2xl p-5 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E2D8C7] mb-4">
          <div className="flex items-center gap-2 text-[#1E3A8A] font-bold text-sm">
            <Vote className="w-5 h-5 text-amber-500" />
            <span>Create Interactive Poll</span>
          </div>
          <button
            onClick={() => setModalState('isCreatePollOpen', false)}
            className="text-[#64748B] hover:text-[#0F172A] p-1 rounded-lg hover:bg-[#ECE3D4]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#64748B] mb-1">Question</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question..."
              className="w-full bg-[#FFFFFF] text-sm text-[#0F172A] rounded-xl px-3.5 py-2.5 border border-[#E2D8C7] focus:border-[#1E3A8A] focus:outline-none shadow-xs"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#64748B] mb-1">Options</label>
            <div className="space-y-2">
              {options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    placeholder={`Option ${idx + 1}`}
                    className="flex-1 bg-[#FFFFFF] text-xs text-[#0F172A] rounded-xl px-3 py-2 border border-[#E2D8C7] focus:border-[#1E3A8A] focus:outline-none shadow-xs"
                    required
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(idx)}
                      className="text-[#94A3B8] hover:text-rose-500 p-1.5"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {options.length < 10 && (
              <button
                type="button"
                onClick={handleAddOption}
                className="mt-2.5 text-xs text-[#1E3A8A] hover:text-[#2563EB] font-semibold flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add Option
              </button>
            )}
          </div>

          {/* Multiple Answers Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#FFFFFF] border border-[#E2D8C7] shadow-xs">
            <span className="text-xs font-medium text-[#0F172A]">Allow multiple answers</span>
            <input
              type="checkbox"
              checked={isMultipleChoice}
              onChange={(e) => setIsMultipleChoice(e.target.checked)}
              className="w-4 h-4 accent-[#1E3A8A] rounded cursor-pointer"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#1E3A8A] hover:bg-[#2563EB] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-[#1E3A8A]/20"
          >
            Create & Send Poll
          </button>
        </form>
      </div>
    </div>
  );
}
