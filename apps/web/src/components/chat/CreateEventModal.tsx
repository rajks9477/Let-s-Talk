'use client';

import React, { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useChatStore } from '@/stores/chatStore';
import { api } from '@/lib/api';
import { getSocket } from '@/lib/socket';

export function CreateEventModal() {
  const { isCreateEventOpen, setModalState } = useUIStore();
  const { activeChat, addMessage } = useChatStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startTime, setStartTime] = useState(new Date().toISOString().slice(0, 16));

  if (!isCreateEventOpen || !activeChat) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await api.createEvent({
        chatId: activeChat.id,
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        startTime: new Date(startTime).toISOString(),
      });

      if (res.success && res.event) {
        addMessage(activeChat.id, res.event);
        getSocket().emit('message:send', res.event);
      }
    } catch (err) {
      console.error('Failed to create event:', err);
    }

    setModalState('isCreateEventOpen', false);
    setTitle('');
    setDescription('');
    setLocation('');
  };

  return (
    <div className="fixed inset-0 bg-[#0A192F]/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-[#FAF8F2] border border-[#E2D8C7] rounded-2xl shadow-2xl p-5 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E2D8C7] mb-4">
          <div className="flex items-center gap-2 text-[#1E3A8A] font-bold text-sm">
            <Calendar className="w-5 h-5" />
            <span>Create In-Chat Event</span>
          </div>
          <button
            onClick={() => setModalState('isCreateEventOpen', false)}
            className="text-[#64748B] hover:text-[#0F172A] p-1 rounded-lg hover:bg-[#ECE3D4]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-[#64748B] mb-1">Event Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Architecture Sprint Review"
              className="w-full bg-[#FFFFFF] text-sm text-[#0F172A] rounded-xl px-3.5 py-2 border border-[#E2D8C7] focus:border-[#1E3A8A] focus:outline-none shadow-xs"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#64748B] mb-1">Date & Time</label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full bg-[#FFFFFF] text-xs text-[#0F172A] rounded-xl px-3.5 py-2 border border-[#E2D8C7] focus:border-[#1E3A8A] focus:outline-none shadow-xs"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#64748B] mb-1">Location / Link</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Let's Talk Video Room or Office Room 4A"
              className="w-full bg-[#FFFFFF] text-xs text-[#0F172A] rounded-xl px-3.5 py-2 border border-[#E2D8C7] focus:border-[#1E3A8A] focus:outline-none shadow-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#64748B] mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief agenda or details..."
              rows={3}
              className="w-full bg-[#FFFFFF] text-xs text-[#0F172A] rounded-xl px-3.5 py-2 border border-[#E2D8C7] focus:border-[#1E3A8A] focus:outline-none resize-none shadow-xs"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#1E3A8A] hover:bg-[#2563EB] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-[#1E3A8A]/20"
          >
            Send Event Invitation
          </button>
        </form>
      </div>
    </div>
  );
}
