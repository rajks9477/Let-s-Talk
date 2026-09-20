'use client';

import React, { useState } from 'react';
import { X, Users } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useChatStore } from '@/stores/chatStore';

export function CreateGroupModal() {
  const { isCreateGroupOpen, setModalState } = useUIStore();
  const { chats, setChats, setActiveChat } = useChatStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  if (!isCreateGroupOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newGroup: any = {
      id: `group_${Date.now()}`,
      type: 'GROUP',
      name: name.trim(),
      description: description.trim(),
      avatarUrl: `https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150`,
      lastMessageAt: new Date().toISOString(),
      unreadCount: 0,
      members: [{ userId: 'me', role: 'OWNER' }],
      messages: [
        {
          id: `sys_msg_${Date.now()}`,
          content: `Group "${name.trim()}" was created`,
          type: 'SYSTEM',
          createdAt: new Date().toISOString(),
          senderId: 'me',
        },
      ],
    };

    setChats([newGroup, ...chats]);
    setActiveChat(newGroup);
    setModalState('isCreateGroupOpen', false);
    setName('');
    setDescription('');
  };

  return (
    <div className="fixed inset-0 bg-[#0A192F]/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-[#FAF8F2] border border-[#E2D8C7] rounded-2xl shadow-2xl p-5 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E2D8C7] mb-4">
          <div className="flex items-center gap-2 text-[#1E3A8A] font-bold text-sm">
            <Users className="w-5 h-5" />
            <span>New Group Conversation</span>
          </div>
          <button
            onClick={() => setModalState('isCreateGroupOpen', false)}
            className="text-[#64748B] hover:text-[#0F172A] p-1 rounded-lg hover:bg-[#ECE3D4]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#64748B] mb-1">Group Subject</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Core Engineering Team"
              className="w-full bg-[#FFFFFF] text-sm text-[#0F172A] rounded-xl px-3.5 py-2.5 border border-[#E2D8C7] focus:border-[#1E3A8A] focus:outline-none shadow-xs"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#64748B] mb-1">Group Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide group rules or description..."
              rows={3}
              className="w-full bg-[#FFFFFF] text-xs text-[#0F172A] rounded-xl px-3.5 py-2 border border-[#E2D8C7] focus:border-[#1E3A8A] focus:outline-none resize-none shadow-xs"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#1E3A8A] hover:bg-[#2563EB] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-[#1E3A8A]/20"
          >
            Create Group Chat
          </button>
        </form>
      </div>
    </div>
  );
}
