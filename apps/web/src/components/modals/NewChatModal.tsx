'use client';

import React, { useState, useEffect } from 'react';
import { Search, Phone, User, MessageSquarePlus, X, Sparkles, UserPlus, Users } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useChatStore } from '@/stores/chatStore';
import { api } from '@/lib/api';

export function NewChatModal() {
  const { isNewChatOpen, setModalState } = useUIStore();
  const { setActiveChat, setChats, chats } = useChatStore();

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [customPhone, setCustomPhone] = useState('');
  const [isStartingChat, setIsStartingChat] = useState(false);

  // Fetch registered users when modal opens
  useEffect(() => {
    if (!isNewChatOpen) return;
    async function loadInitialUsers() {
      setLoading(true);
      try {
        const res = await api.searchUsers('');
        if (res.success && res.users) {
          setUsers(res.users);
        }
      } catch (err) {
        console.warn('Failed to load registered users:', err);
      } finally {
        setLoading(false);
      }
    }
    loadInitialUsers();
  }, [isNewChatOpen]);

  // Handle Search Input Change
  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setLoading(true);
    try {
      const res = await api.searchUsers(val);
      if (res.success && res.users) {
        setUsers(res.users);
      }
    } catch (err) {
      console.warn('Search query error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Start Direct Chat with Selected User
  const handleStartChat = async (targetUser: any) => {
    setIsStartingChat(true);
    try {
      const targetPhone = targetUser.phoneNumber || targetUser.phone;
      const res = await api.getOrCreateDirectChat(targetUser.id, targetPhone);
      if (res.success && res.chat) {
        const newChat = res.chat;
        // Check if chat already in list
        const exists = chats.some((c) => c.id === newChat.id);
        if (!exists) {
          setChats([newChat, ...chats]);
        }
        setActiveChat(newChat);
        setModalState('isNewChatOpen', false);
      }
    } catch (err: any) {
      alert(err.message || 'Could not start chat. Please try again.');
    } finally {
      setIsStartingChat(false);
    }
  };

  // Start Direct Chat with Typed Custom Phone Number
  const handleStartByCustomPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = customPhone.replace(/\D/g, '');
    if (cleanNum.length < 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }

    const formattedPhone = cleanNum.startsWith('91') && cleanNum.length > 10 ? `+${cleanNum}` : `+91${cleanNum.slice(-10)}`;
    await handleStartChat({
      id: `usr_${cleanNum.slice(-10)}`,
      phoneNumber: formattedPhone,
      profile: {
        displayName: `Contact (${formattedPhone})`,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formattedPhone}`,
      },
    });
  };

  if (!isNewChatOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#FAF8F2] border border-[#E2D8C7] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="bg-[#0F2744] text-[#FAF8F2] p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#1E3A8A] border border-[#F5EFE6]/30 flex items-center justify-center text-[#FAF8F2]">
              <UserPlus className="w-5 h-5 text-[#FAF8F2]" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Start New Chat</h3>
              <p className="text-[11px] text-[#E2D8C7]/80">Search by name, contact or phone number</p>
            </div>
          </div>
          <button
            onClick={() => setModalState('isNewChatOpen', false)}
            className="p-1.5 rounded-full text-[#FAF8F2]/80 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Direct Phone Number Input Box */}
        <div className="p-4 border-b border-[#E2D8C7] bg-[#F5EFE6]">
          <form onSubmit={handleStartByCustomPhone} className="space-y-2">
            <label className="text-xs font-bold text-[#0F2744] flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#1E3A8A]" />
              Chat by Phone Number
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center bg-[#FFFFFF] border border-[#E2D8C7] rounded-xl px-3 py-2 shadow-2xs focus-within:ring-2 focus-within:ring-[#1E3A8A]">
                <span className="text-xs font-bold text-[#64748B] mr-2">+91</span>
                <input
                  type="tel"
                  placeholder="Enter 10-digit number (e.g. 9876543210)"
                  value={customPhone}
                  onChange={(e) => setCustomPhone(e.target.value)}
                  className="w-full text-xs font-semibold text-[#0F172A] placeholder-[#94A3B8] focus:outline-none bg-transparent"
                  maxLength={13}
                />
              </div>
              <button
                type="submit"
                disabled={isStartingChat || customPhone.replace(/\D/g, '').length < 10}
                className="px-4 py-2 bg-[#1E3A8A] hover:bg-[#2563EB] disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-[#1E3A8A]/20 whitespace-nowrap"
              >
                {isStartingChat ? 'Connecting...' : 'Chat Now'}
              </button>
            </div>
          </form>
        </div>

        {/* Live Search Input */}
        <div className="p-3 border-b border-[#E2D8C7] bg-[#FAF8F2]">
          <div className="flex items-center bg-[#FFFFFF] border border-[#E2D8C7] rounded-xl px-3 py-2 shadow-2xs focus-within:ring-2 focus-within:ring-[#1E3A8A]">
            <Search className="w-4 h-4 text-[#64748B] mr-2.5 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search registered friends / users..."
              value={query}
              onChange={handleSearchChange}
              className="w-full text-xs text-[#0F172A] placeholder-[#64748B] focus:outline-none bg-transparent"
            />
          </div>
        </div>

        {/* Quick Action: Create Group */}
        <div className="px-4 py-2.5 border-b border-[#E2D8C7] bg-[#FAF8F2]">
          <button
            onClick={() => {
              setModalState('isNewChatOpen', false);
              setModalState('isCreateGroupOpen', true);
            }}
            className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-[#ECE3D4] text-[#0F2744] font-semibold text-xs transition-all text-left group"
          >
            <div className="w-8 h-8 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center group-hover:scale-105 transition-all">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-[#0F2744]">New Group</p>
              <p className="text-[10px] text-[#64748B]">Create a group chat with multiple friends</p>
            </div>
          </button>
        </div>

        {/* Contacts / Registered Users List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 min-h-[160px] bg-[#FAF8F2]">
          <div className="px-2 py-1 flex items-center justify-between text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
            <span>Registered Users / Contacts</span>
            <span className="text-[#1E3A8A]">{users.length} Found</span>
          </div>

          {loading && (
            <div className="p-6 text-center text-xs text-[#64748B] animate-pulse">
              Searching registered users...
            </div>
          )}

          {!loading && users.length === 0 && (
            <div className="p-8 text-center text-[#64748B]">
              <User className="w-8 h-8 mx-auto mb-2 text-[#94A3B8]" />
              <p className="text-xs font-semibold text-[#0F172A]">No registered users found</p>
              <p className="text-[11px] text-[#64748B] mt-1">Enter your friend's phone number above to start a conversation instantly!</p>
            </div>
          )}

          {!loading &&
            users.map((u) => {
              const displayName = u.profile?.displayName || u.phoneNumber || 'Let\'s Talk User';
              const avatar = u.profile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.phoneNumber || u.id}`;
              const phone = u.phoneNumber || '';

              return (
                <div
                  key={u.id}
                  onClick={() => handleStartChat(u)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#ECE3D4] cursor-pointer transition-all border border-transparent hover:border-[#E2D8C7] group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={avatar}
                      alt={displayName}
                      className="w-10 h-10 rounded-full border border-[#E2D8C7] object-cover bg-white group-hover:scale-105 transition-all"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-[#0F2744] group-hover:text-[#1E3A8A] transition-colors flex items-center gap-1.5">
                        {displayName}
                        {u.isVerified && <Sparkles className="w-3 h-3 text-amber-500" />}
                      </h4>
                      <p className="text-[11px] text-[#64748B] font-mono">{phone}</p>
                    </div>
                  </div>

                  <button
                    disabled={isStartingChat}
                    className="px-3 py-1.5 bg-[#0F2744] group-hover:bg-[#1E3A8A] text-[#FAF8F2] text-xs font-semibold rounded-lg transition-all shadow-xs flex items-center gap-1"
                  >
                    <MessageSquarePlus className="w-3.5 h-3.5" />
                    <span>Chat</span>
                  </button>
                </div>
              );
            })}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#ECE3D4] border-t border-[#E2D8C7] text-center text-[11px] text-[#64748B]">
          🔒 Realtime end-to-end encrypted messaging powered by Let's Talk SuperApp
        </div>

      </div>
    </div>
  );
}
