'use client';

import React from 'react';
import {
  MessageSquare,
  CircleDot,
  Users,
  Radio,
  Phone,
  CreditCard,
  Settings,
  Sparkles,
  Star,
  Lock,
} from 'lucide-react';
import { useUIStore, MainTab } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';

export function SidebarNav() {
  const { activeTab, setActiveTab, openRightDrawer, setModalState } = useUIStore();
  const { user } = useAuthStore();

  const mainNavItems: { tab: MainTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { tab: 'CHATS', label: 'Chats', icon: <MessageSquare className="w-5 h-5" />, badge: 2 },
    { tab: 'STATUS', label: 'Status', icon: <CircleDot className="w-5 h-5" /> },
    { tab: 'CHANNELS', label: 'Channels', icon: <Radio className="w-5 h-5" /> },
    { tab: 'COMMUNITIES', label: 'Communities', icon: <Users className="w-5 h-5" /> },
    { tab: 'CALLS', label: 'Calls', icon: <Phone className="w-5 h-5" /> },
    { tab: 'PAYMENTS', label: 'Payments', icon: <CreditCard className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-[60px] bg-[#0F2744] flex flex-col items-center justify-between py-3 border-r border-[#162E4D] select-none z-30 h-full">
      {/* Top Section: Main Tabs */}
      <div className="flex flex-col items-center gap-1.5 w-full px-2">
        {mainNavItems.map((item) => {
          const isActive = activeTab === item.tab;
          return (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                isActive
                  ? 'bg-[#1E3A8A] text-[#F8FAFC] shadow-inner'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E3A8A]/40'
              }`}
              title={item.label}
            >
              {item.icon}
              {item.badge && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-[#2563EB] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#0F2744]">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Meta AI / Aura AI Iridescent Orb Button */}
        <button
          onClick={() => openRightDrawer('AI')}
          className="relative w-10 h-10 rounded-full flex items-center justify-center mt-2 group transition-transform hover:scale-105"
          title="Meta AI Assistant"
        >
          <div className="w-8 h-8 rounded-full meta-ai-orb p-[2px] flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-[#0A192F] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#60A5FA] animate-pulse" />
            </div>
          </div>
        </button>
      </div>

      {/* Bottom Section: Starred, Archive, Settings, Profile */}
      <div className="flex flex-col items-center gap-1.5 w-full px-2 pt-2 border-t border-[#162E4D]">
        {/* Starred Messages */}
        <button
          onClick={() => openRightDrawer('INFO')}
          className="w-10 h-10 rounded-full flex items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E3A8A]/40 transition-all"
          title="Starred Messages"
        >
          <Star className="w-5 h-5" />
        </button>

        {/* Locked Chats */}
        <button
          onClick={() => {
            setActiveTab('CHATS');
            useUIStore.getState().setModalState('isSecretCodeModalOpen', true);
          }}
          className="w-10 h-10 rounded-full flex items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E3A8A]/40 transition-all"
          title="Locked Chats"
        >
          <Lock className="w-5 h-5 text-amber-400" />
        </button>

        {/* Settings */}
        <button
          onClick={() => setActiveTab('SETTINGS')}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            activeTab === 'SETTINGS'
              ? 'bg-[#1E3A8A] text-[#F8FAFC]'
              : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E3A8A]/40'
          }`}
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* Profile Avatar */}
        <div
          onClick={() => setModalState('isAuthModalOpen', true)}
          className="w-9 h-9 rounded-full bg-[#1E3A8A] overflow-hidden cursor-pointer mt-1 border border-[#60A5FA]/40 hover:ring-2 hover:ring-[#60A5FA] transition-all flex items-center justify-center shadow-md"
          title={user?.profile?.displayName || 'My Profile'}
        >
          {user?.profile?.avatarUrl ? (
            <img src={user.profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="font-bold text-xs text-[#F8FAFC]">
              {user?.profile?.displayName ? user.profile.displayName[0].toUpperCase() : 'U'}
            </span>
          )}
        </div>
      </div>
    </aside>
  );
}
