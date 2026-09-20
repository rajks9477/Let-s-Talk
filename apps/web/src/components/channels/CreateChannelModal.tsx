'use client';

import React, { useState } from 'react';
import { X, Radio } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useChannelStore } from '@/stores/channelStore';
import { api } from '@/lib/api';

export function CreateChannelModal() {
  const { isCreateChannelOpen, setModalState } = useUIStore();
  const { channels, setChannels } = useChannelStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('TECHNOLOGY');

  if (!isCreateChannelOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const res = await api.createChannel({
        name: name.trim(),
        description: description.trim(),
        category,
      });

      if (res.success && res.channel) {
        setChannels([res.channel, ...channels]);
      }
    } catch (err) {
      console.error('Failed to create channel:', err);
    }

    setModalState('isCreateChannelOpen', false);
    setName('');
    setDescription('');
  };

  return (
    <div className="fixed inset-0 bg-[#0A192F]/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-[#FAF8F2] border border-[#E2D8C7] rounded-2xl shadow-2xl p-5 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E2D8C7] mb-4">
          <div className="flex items-center gap-2 text-[#1E3A8A] font-bold text-sm">
            <Radio className="w-5 h-5" />
            <span>Create Broadcast Channel</span>
          </div>
          <button
            onClick={() => setModalState('isCreateChannelOpen', false)}
            className="text-[#64748B] hover:text-[#0F172A] p-1 rounded-lg hover:bg-[#ECE3D4]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#64748B] mb-1">Channel Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Design Systems & AI"
              className="w-full bg-[#FFFFFF] text-sm text-[#0F172A] rounded-xl px-3.5 py-2.5 border border-[#E2D8C7] focus:border-[#1E3A8A] focus:outline-none shadow-xs"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#64748B] mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this channel about? Followers can read updates..."
              rows={3}
              className="w-full bg-[#FFFFFF] text-xs text-[#0F172A] rounded-xl px-3.5 py-2 border border-[#E2D8C7] focus:border-[#1E3A8A] focus:outline-none resize-none shadow-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#64748B] mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#FFFFFF] text-xs text-[#0F172A] rounded-xl px-3 py-2.5 border border-[#E2D8C7] focus:border-[#1E3A8A] focus:outline-none shadow-xs"
            >
              <option value="TECHNOLOGY">Technology & Engineering</option>
              <option value="NEWS">Global News & Pulse</option>
              <option value="BUSINESS">Business & Finance</option>
              <option value="LIFESTYLE">Lifestyle & Entertainment</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#1E3A8A] hover:bg-[#2563EB] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-[#1E3A8A]/20"
          >
            Create Channel
          </button>
        </form>
      </div>
    </div>
  );
}
