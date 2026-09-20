'use client';

import React from 'react';
import { Search, Plus, MoreVertical, SlidersHorizontal, Lock, MessageSquarePlus } from 'lucide-react';
import { useChatStore } from '@/stores/chatStore';
import { useUIStore } from '@/stores/uiStore';

export function TopAppBar() {
  const { searchQuery, setSearchQuery, activeFilter, setActiveFilter, secretCodeUnlocked, unlockSecretCode } = useChatStore();
  const { setModalState, openRightDrawer } = useUIStore();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);

    // If user types secret code into search bar, unlock hidden locked chats!
    if (val.trim() === '7777' || val.trim().toLowerCase() === 'secret') {
      unlockSecretCode(true);
    }
  };

  const filters: { key: 'ALL' | 'UNREAD' | 'FAVORITES' | 'GROUPS'; label: string }[] = [
    { key: 'ALL', label: 'All' },
    { key: 'UNREAD', label: 'Unread' },
    { key: 'FAVORITES', label: 'Favorites' },
    { key: 'GROUPS', label: 'Groups' },
  ];

  return (
    <div className="bg-[#FAF8F2] border-b border-[#E2D8C7] flex flex-col">
      {/* Top Header Bar */}
      <div className="h-[60px] px-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#0F172A] tracking-tight font-sans">Chats</h1>

        <div className="flex items-center gap-1.5">
          {/* New Chat Button */}
          <button
            onClick={() => setModalState('isNewChatOpen', true)}
            className="p-2 rounded-full text-[#1E3A8A] hover:bg-[#ECE3D4] transition-all"
            title="Start new chat / search contact"
          >
            <MessageSquarePlus className="w-5 h-5" />
          </button>

          {/* Menu Options */}
          <button
            onClick={() => openRightDrawer('INFO')}
            className="p-2 rounded-full text-[#1E3A8A] hover:bg-[#ECE3D4] transition-all"
            title="Menu"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Light Cream & Navy Search Bar */}
      <div className="px-3 pb-2 flex items-center gap-2">
        <div className="flex-1 relative flex items-center bg-[#FFFFFF] border border-[#E2D8C7] rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-[#1E3A8A] shadow-2xs transition-all">
          <Search className="w-4 h-4 text-[#64748B] mr-3 flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search or start new chat"
            className="w-full bg-transparent text-[13px] text-[#0F172A] placeholder-[#64748B] focus:outline-none"
          />
          {secretCodeUnlocked && (
            <span className="flex items-center gap-1 text-[10px] text-[#1E3A8A] font-bold bg-[#1E3A8A]/10 px-2 py-0.5 rounded ml-1 border border-[#1E3A8A]/30">
              <Lock className="w-3 h-3" /> Vault
            </span>
          )}
        </div>

        {/* Filter Toggle Icon */}
        <button
          onClick={() => setActiveFilter(activeFilter === 'ALL' ? 'UNREAD' : 'ALL')}
          className={`p-2 rounded-xl transition-all border ${
            activeFilter !== 'ALL'
              ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
              : 'bg-[#FFFFFF] border-[#E2D8C7] text-[#64748B] hover:text-[#0F172A] hover:bg-[#ECE3D4]'
          }`}
          title="Filter unread chats"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Filter Chips Row */}
      <div className="px-3 pb-2.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {filters.map((f) => {
          const isActive = activeFilter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#1E3A8A] text-white shadow-xs'
                  : 'bg-[#FFFFFF] border border-[#E2D8C7] text-[#0F172A] hover:bg-[#ECE3D4]'
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
