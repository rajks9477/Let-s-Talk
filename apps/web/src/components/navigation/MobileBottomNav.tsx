'use client';

import React from 'react';
import { MessageSquare, CircleDot, Users, Radio, Phone, Settings } from 'lucide-react';
import { useUIStore, MainTab } from '@/stores/uiStore';

export function MobileBottomNav() {
  const { activeTab, setActiveTab } = useUIStore();

  const items: { tab: MainTab; label: string; icon: React.ReactNode }[] = [
    { tab: 'CHATS', label: 'Chats', icon: <MessageSquare className="w-5 h-5" /> },
    { tab: 'STATUS', label: 'Updates', icon: <CircleDot className="w-5 h-5" /> },
    { tab: 'COMMUNITIES', label: 'Communities', icon: <Users className="w-5 h-5" /> },
    { tab: 'CHANNELS', label: 'Channels', icon: <Radio className="w-5 h-5" /> },
    { tab: 'CALLS', label: 'Calls', icon: <Phone className="w-5 h-5" /> },
    { tab: 'SETTINGS', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#FAF8F2] border-t border-[#E2D8C7] flex items-center justify-around px-2 z-30 shadow-lg">
      {items.map((item) => {
        const isActive = activeTab === item.tab;
        return (
          <button
            key={item.tab}
            onClick={() => setActiveTab(item.tab)}
            className={`flex flex-col items-center justify-center py-1 transition-all ${
              isActive ? 'text-[#1E3A8A] font-bold' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            {item.icon}
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
