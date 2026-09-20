'use client';

import React, { useEffect, useState } from 'react';
import { useChatStore } from '@/stores/chatStore';
import { ChatListItem } from './ChatListItem';
import { api } from '@/lib/api';
import { Lock, MessageSquarePlus } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';

export function ChatList() {
  const { chats, setChats, searchQuery, activeFilter, secretCodeUnlocked } = useChatStore();
  const { setModalState } = useUIStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadChats() {
      try {
        const res = await api.getChats();
        if (res.success && res.chats) {
          setChats(res.chats);
        }
      } catch (err) {
        console.warn('Using local fallback state for chats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadChats();
  }, [setChats]);

  // Filter chats by search query, filter tabs, and locked chats rule
  const filteredChats = chats.filter((c) => {
    // If chat is locked and secret code not unlocked, hide it from normal view
    if (c.isLocked && !secretCodeUnlocked) return false;

    // Filter by tab
    if (activeFilter === 'UNREAD' && (!c.unreadCount || c.unreadCount <= 0)) return false;
    if (activeFilter === 'FAVORITES' && !c.isPinned) return false;
    if (activeFilter === 'GROUPS' && c.type !== 'GROUP' && c.type !== 'COMMUNITY') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const name = (c.name || c.members[0]?.user?.profile?.displayName || '').toLowerCase();
      const lastMsg = (c.messages?.[0]?.content || '').toLowerCase();
      return name.includes(q) || lastMsg.includes(q);
    }

    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF8F2]">
      {/* Locked Chats Folder Link (If Locked Chats exist) */}
      {!secretCodeUnlocked && (
        <div
          onClick={() => setModalState('isSecretCodeModalOpen', true)}
          className="px-4 py-3 flex items-center gap-3.5 border-b border-[#E2D8C7] hover:bg-[#ECE3D4] cursor-pointer text-[#0F172A] transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-[#FFFFFF] border border-[#1E3A8A]/30 flex items-center justify-center text-[#1E3A8A] group-hover:scale-105 transition-all shadow-xs">
            <Lock className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-[#0F172A]">Locked Chats</h4>
            <p className="text-xs text-[#64748B]">Protected with biometric / secret passcode</p>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && chats.length === 0 && (
        <div className="p-4 space-y-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="flex items-center gap-3 animate-pulse">
              <div className="w-12 h-12 bg-[#E2D8C7] rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 bg-[#E2D8C7] rounded w-1/3" />
                <div className="h-3 bg-[#E2D8C7] rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List of Chats */}
      {filteredChats.map((chat) => (
        <ChatListItem key={chat.id} chat={chat} />
      ))}

      {/* Empty State */}
      {!loading && filteredChats.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 text-center text-[#64748B] mt-12">
          <div className="w-12 h-12 rounded-full bg-[#ECE3D4] flex items-center justify-center mb-3">
            <MessageSquarePlus className="w-6 h-6 text-[#1E3A8A]" />
          </div>
          <h4 className="text-sm font-semibold text-[#0F172A] mb-1">No chats found</h4>
          <p className="text-xs max-w-xs mb-4">Start a conversation or invite friends to Let's Talk!</p>
          <button
            onClick={() => setModalState('isCreateGroupOpen', true)}
            className="px-4 py-2 bg-[#1E3A8A] hover:bg-[#2563EB] text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-[#1E3A8A]/20"
          >
            Create New Group
          </button>
        </div>
      )}
    </div>
  );
}
