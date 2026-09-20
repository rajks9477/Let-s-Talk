'use client';

import React, { useState } from 'react';
import { X, Send, Palette } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useStatusStore } from '@/stores/statusStore';
import { api } from '@/lib/api';

export function StatusCreatorModal() {
  const { isStatusCreatorOpen, setModalState } = useUIStore();
  const { stories, setStories } = useStatusStore();
  const [content, setContent] = useState('');
  const [gradientIdx, setGradientIdx] = useState(0);

  const gradients = [
    'from-[#0F2744] to-[#1E3A8A]',
    'from-[#1E3A8A] to-[#2563EB]',
    'from-[#0A192F] to-[#162E4D]',
    'from-[#1E3A8A] to-[#3B82F6]',
    'from-indigo-900 to-blue-700',
    'from-slate-800 to-indigo-900',
  ];

  if (!isStatusCreatorOpen) return null;

  const handleSubmit = async () => {
    if (!content.trim()) return;

    try {
      const res = await api.createStatus({
        type: 'TEXT',
        content: content.trim(),
        bgGradient: gradients[gradientIdx],
      });

      if (res.success && res.status) {
        setStories([res.status, ...stories]);
      }
    } catch (err) {
      console.error('Failed to create status:', err);
    }

    setModalState('isStatusCreatorOpen', false);
    setContent('');
  };

  return (
    <div className="fixed inset-0 bg-[#0A192F]/90 z-50 flex flex-col items-center justify-between p-6 animate-fade-in">
      {/* Top Bar Controls */}
      <div className="w-full max-w-lg flex items-center justify-between z-10">
        <button
          onClick={() => setModalState('isStatusCreatorOpen', false)}
          className="p-2 rounded-full bg-[#FAF8F2] hover:bg-[#ECE3D4] text-[#0F172A] border border-[#E2D8C7] shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gradient Background Switcher */}
        <button
          onClick={() => setGradientIdx((prev) => (prev + 1) % gradients.length)}
          className="p-2 rounded-full bg-[#FAF8F2] hover:bg-[#ECE3D4] text-[#1E3A8A] border border-[#E2D8C7] shadow-md"
          title="Change Background Gradient"
        >
          <Palette className="w-5 h-5" />
        </button>
      </div>

      {/* Main Status Canvas */}
      <div
        className={`w-full max-w-lg h-[60vh] rounded-3xl bg-gradient-to-tr ${gradients[gradientIdx]} shadow-2xl flex items-center justify-center p-8 relative overflow-hidden`}
      >
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a status update..."
          rows={5}
          className="w-full bg-transparent text-white text-center text-2xl md:text-3xl font-bold placeholder-white/50 focus:outline-none resize-none"
        />
      </div>

      {/* Footer Send Action */}
      <div className="w-full max-w-lg flex items-center justify-end z-10">
        <button
          onClick={handleSubmit}
          className="px-6 py-3 rounded-full bg-[#1E3A8A] hover:bg-[#2563EB] text-white font-bold flex items-center gap-2 shadow-xl shadow-[#1E3A8A]/30 transition-all hover:scale-105"
        >
          <span>Share Status</span>
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
