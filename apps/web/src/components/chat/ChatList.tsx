'use client';

import React, { useEffect, useState } from 'react';
import { useChatStore } from '@/stores/chatStore';
import { ChatListItem } from './ChatListItem';
import { api } from '@/lib/api';
import { Lock, MessageSquarePlus } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';

export function ChatList() {
  const { chats, setChats, searchQuery, activeFilter, secretCodeUnlocked, setActiveChat } = useChatStore();
  const { setModalState } = useUIStore();
  const [loading, setLoading] = useState(true);
  const [remoteUsers, setRemoteUsers] = useState<any[]>([]);
  const [searchingUsers, setSearchingUsers] = useState(false);

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

  // Live remote search when user types in search bar
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setRemoteUsers([]);
      return;
    }

    let isMounted = true;
    async function searchRemote() {
      setSearchingUsers(true);
      try {
        const res = await api.searchUsers(searchQuery);
        if (isMounted && res.success && res.users) {
          // Filter out users who already have an open chat
          const openChatMemberIds = new Set(
            chats.flatMap((c) => c.members?.map((m: any) => m.userId || m.id) || [])
          );
          setRemoteUsers(res.users);
        }
      } catch {
        // Ignore error
      } finally {
        if (isMounted) setSearchingUsers(false);
      }
    }

    const timer = setTimeout(searchRemote, 300);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [searchQuery, chats]);

  // Start chat with searched user
  const handleStartChatWithUser = async (targetUser: any) => {
    try {
      const targetPhone = targetUser.phoneNumber || targetUser.phone;
      const res = await api.getOrCreateDirectChat(targetUser.id, targetPhone);
      if (res.success && res.chat) {
        const newChat = res.chat;
        const exists = chats.some((c) => c.id === newChat.id);
        if (!exists) {
          setChats([newChat, ...chats]);
        }
        setActiveChat(newChat);
      }
    } catch (err: any) {
      alert(err.message || 'Could not start chat.');
    }
  };

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
      const name = (c.name || c.members?.[0]?.user?.profile?.displayName || '').toLowerCase();
      const lastMsg = (c.messages?.[0]?.content || '').toLowerCase();
      return name.includes(q) || lastMsg.includes(q);
    }

    return true;
  });

  const cleanDigits = searchQuery.replace(/\D/g, '');

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

      {/* Existing Conversations */}
      {filteredChats.map((chat) => (
        <ChatListItem key={chat.id} chat={chat} />
      ))}

      {/* Searched Registered Users / Contacts Section */}
      {searchQuery.trim().length >= 2 && remoteUsers.length > 0 && (
        <div className="border-t border-[#E2D8C7] bg-[#FAF8F2] p-2">
          <div className="px-3 py-1.5 text-[11px] font-bold text-[#1E3A8A] uppercase tracking-wider flex items-center justify-between">
            <span>Contacts & Registered Users</span>
            <span>{remoteUsers.length}</span>
          </div>

          <div className="space-y-1 mt-1">
            {remoteUsers.map((u) => {
              const displayName = u.profile?.displayName || u.phoneNumber || 'User';
              const avatar = u.profile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.phoneNumber || u.id}`;
              const phone = u.phoneNumber || '';

              return (
                <div
                  key={u.id}
                  onClick={() => handleStartChatWithUser(u)}
                  className="px-3 py-2 rounded-xl flex items-center justify-between hover:bg-[#ECE3D4] cursor-pointer transition-all border border-transparent hover:border-[#E2D8C7]"
                >
                  <div className="flex items-center gap-2.5">
                    <img src={avatar} alt={displayName} className="w-9 h-9 rounded-full border border-[#E2D8C7] bg-white object-cover" />
                    <div>
                      <h5 className="text-xs font-bold text-[#0F2744]">{displayName}</h5>
                      <p className="text-[11px] text-[#64748B] font-mono">{phone}</p>
                    </div>
                  </div>
                  <button className="px-2.5 py-1 bg-[#1E3A8A] text-white text-[11px] font-bold rounded-lg hover:bg-[#2563EB] transition-all">
                    Chat
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Direct Phone Number Chat Suggestion */}
      {cleanDigits.length >= 10 && (
        <div className="p-3 m-3 bg-[#EBF3FF] border border-[#1E3A8A]/30 rounded-xl text-center shadow-xs">
          <p className="text-xs font-bold text-[#0F2744]">Direct Phone Chat</p>
          <p className="text-[11px] text-[#64748B] mb-2 font-mono">+91 {cleanDigits.slice(-10)}</p>
          <button
            onClick={() => handleStartChatWithUser({
              id: `usr_${cleanDigits.slice(-10)}`,
              phoneNumber: `+91${cleanDigits.slice(-10)}`,
              profile: { displayName: `Contact (+91${cleanDigits.slice(-10)})` }
            })}
            className="w-full py-1.5 bg-[#1E3A8A] hover:bg-[#2563EB] text-white text-xs font-bold rounded-lg transition-all"
          >
            Start Chatting with +91 {cleanDigits.slice(-10)}
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredChats.length === 0 && remoteUsers.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 text-center text-[#64748B] mt-12">
          <div className="w-12 h-12 rounded-full bg-[#ECE3D4] flex items-center justify-center mb-3">
            <MessageSquarePlus className="w-6 h-6 text-[#1E3A8A]" />
          </div>
          <h4 className="text-sm font-semibold text-[#0F172A] mb-1">No chats found</h4>
          <p className="text-xs max-w-xs mb-4">Start a conversation by entering any friend's phone number!</p>
          <button
            onClick={() => setModalState('isNewChatOpen', true)}
            className="px-4 py-2 bg-[#1E3A8A] hover:bg-[#2563EB] text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-[#1E3A8A]/20 flex items-center gap-1.5"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Start New Chat / Contact</span>
          </button>
        </div>
      )}
    </div>
  );
}
