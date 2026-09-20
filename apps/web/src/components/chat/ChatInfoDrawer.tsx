'use client';

import React, { useState } from 'react';
import { useChatStore } from '@/stores/chatStore';
import { useUIStore } from '@/stores/uiStore';
import {
  X,
  Lock,
  Clock,
  Image,
  FileText,
  Star,
  Trash2,
  UserX,
} from 'lucide-react';
import { api } from '@/lib/api';

export function ChatInfoDrawer() {
  const { activeChat } = useChatStore();
  const { isRightDrawerOpen, rightDrawerContent, closeRightDrawer, setModalState } = useUIStore();
  const [isLocked, setIsLocked] = useState(activeChat?.isLocked || false);
  const [disappearingTimer, setDisappearingTimer] = useState<number>(0);

  if (!isRightDrawerOpen || rightDrawerContent !== 'INFO' || !activeChat) return null;

  const displayName = activeChat.name || activeChat.members[0]?.user?.profile?.displayName || 'Chat';
  const avatarUrl = activeChat.avatarUrl || activeChat.members[0]?.user?.profile?.avatarUrl;
  const bio = activeChat.description || activeChat.members[0]?.user?.profile?.bio || 'Living in the moment ✨';

  const handleToggleLock = async () => {
    const nextLocked = !isLocked;
    setIsLocked(nextLocked);
    try {
      await api.lockChat(activeChat.id, nextLocked);
    } catch (err) {
      console.error('Failed to update chat lock:', err);
    }
  };

  return (
    <aside className="w-80 md:w-96 bg-[#FAF8F2] border-l border-[#E2D8C7] flex flex-col h-full z-20 animate-fade-in overflow-y-auto">
      {/* Header */}
      <div className="h-16 px-4 border-b border-[#E2D8C7] flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#0F172A]">Contact Info</h3>
        <button
          onClick={closeRightDrawer}
          className="p-1.5 rounded-lg hover:bg-[#ECE3D4] text-[#64748B] hover:text-[#0F172A]"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Profile Overview Card */}
      <div className="p-6 flex flex-col items-center text-center border-b border-[#E2D8C7] bg-[#FFFFFF]">
        <div className="w-24 h-24 rounded-full bg-[#ECE3D4] border-2 border-[#1E3A8A]/40 overflow-hidden mb-3 shadow-md flex items-center justify-center text-xl font-bold text-[#0F2744]">
          {avatarUrl ? (
            <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
          ) : (
            displayName.charAt(0).toUpperCase()
          )}
        </div>
        <h2 className="text-base font-bold text-[#0F172A] mb-0.5">{displayName}</h2>
        <p className="text-xs text-[#64748B] max-w-xs">{bio}</p>
      </div>

      {/* Privacy & Security Features */}
      <div className="p-4 space-y-3 border-b border-[#E2D8C7]">
        <h4 className="text-xs font-semibold text-[#64748B] uppercase tracking-wider px-1">
          Privacy & Controls
        </h4>

        {/* Chat Lock */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-[#FFFFFF] border border-[#E2D8C7] shadow-xs">
          <div className="flex items-center gap-3">
            <Lock className="w-4 h-4 text-amber-500" />
            <div>
              <p className="text-xs font-semibold text-[#0F172A]">Chat Lock</p>
              <p className="text-[10px] text-[#64748B]">Lock and hide with Secret Code</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={isLocked}
            onChange={handleToggleLock}
            className="w-4 h-4 accent-[#1E3A8A] rounded cursor-pointer"
          />
        </div>

        {/* Disappearing Messages */}
        <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#E2D8C7] space-y-2 shadow-xs">
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-[#1E3A8A]" />
            <div>
              <p className="text-xs font-semibold text-[#0F172A]">Disappearing Messages</p>
              <p className="text-[10px] text-[#64748B]">Set automatic timer for message expiration</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 pt-1">
            {[
              { label: 'Off', sec: 0 },
              { label: '24h', sec: 86400 },
              { label: '7d', sec: 604800 },
              { label: '90d', sec: 7776000 },
            ].map((t) => (
              <button
                key={t.sec}
                onClick={() => setDisappearingTimer(t.sec)}
                className={`flex-1 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  disappearingTimer === t.sec
                    ? 'bg-[#1E3A8A] text-white shadow-xs'
                    : 'bg-[#FAF8F2] text-[#64748B] hover:text-[#0F172A] border border-[#E2D8C7]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Media, Links & Docs Quick Links */}
      <div className="p-4 space-y-2 border-b border-[#E2D8C7]">
        <h4 className="text-xs font-semibold text-[#64748B] uppercase tracking-wider px-1">
          Shared Content
        </h4>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setModalState('isMediaStudioOpen', true)}
            className="p-3 rounded-xl bg-[#FFFFFF] hover:bg-[#FAF8F2] border border-[#E2D8C7] flex flex-col items-center justify-center gap-1 transition-all shadow-xs"
          >
            <Image className="w-5 h-5 text-[#1E3A8A]" />
            <span className="text-[10px] font-medium text-[#64748B]">Media</span>
          </button>

          <button className="p-3 rounded-xl bg-[#FFFFFF] hover:bg-[#FAF8F2] border border-[#E2D8C7] flex flex-col items-center justify-center gap-1 transition-all shadow-xs">
            <FileText className="w-5 h-5 text-[#2563EB]" />
            <span className="text-[10px] font-medium text-[#64748B]">Docs</span>
          </button>

          <button className="p-3 rounded-xl bg-[#FFFFFF] hover:bg-[#FAF8F2] border border-[#E2D8C7] flex flex-col items-center justify-center gap-1 transition-all shadow-xs">
            <Star className="w-5 h-5 text-amber-500" />
            <span className="text-[10px] font-medium text-[#64748B]">Starred</span>
          </button>
        </div>
      </div>

      {/* Danger Zone Actions */}
      <div className="p-4 space-y-2 mt-auto">
        <button className="w-full p-2.5 rounded-xl bg-[#FFFFFF] hover:bg-rose-50 text-rose-600 border border-[#E2D8C7] flex items-center justify-center gap-2 text-xs font-semibold transition-all">
          <UserX className="w-4 h-4" /> Block Contact
        </button>

        <button className="w-full p-2.5 rounded-xl bg-[#FFFFFF] hover:bg-rose-50 text-rose-600 border border-[#E2D8C7] flex items-center justify-center gap-2 text-xs font-semibold transition-all">
          <Trash2 className="w-4 h-4" /> Clear Chat History
        </button>
      </div>
    </aside>
  );
}
