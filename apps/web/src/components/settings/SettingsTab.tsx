'use client';

import React from 'react';
import {
  Key,
  Lock,
  MessageSquare,
  Bell,
  HardDrive,
  HelpCircle,
  LogOut,
  QrCode,
  ChevronRight,
  Laptop,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';

export function SettingsTab() {
  const { user, logout } = useAuthStore();
  const { setModalState } = useUIStore();

  const settingsItems = [
    {
      id: 'account',
      icon: <Key className="w-5 h-5 text-[#1E3A8A]" />,
      title: 'Account',
      subtitle: 'Security notifications, passkeys, change number',
      action: () => setModalState('isAuthModalOpen', true),
    },
    {
      id: 'privacy',
      icon: <Lock className="w-5 h-5 text-[#1E3A8A]" />,
      title: 'Privacy',
      subtitle: 'Block contacts, disappearing messages, chat lock',
      action: () => setModalState('isSecretCodeModalOpen', true),
    },
    {
      id: 'chats',
      icon: <MessageSquare className="w-5 h-5 text-[#1E3A8A]" />,
      title: 'Chats',
      subtitle: 'Theme, wallpapers, chat backup, chat history',
      action: () => setModalState('isBackupModalOpen', true),
    },
    {
      id: 'notifications',
      icon: <Bell className="w-5 h-5 text-[#1E3A8A]" />,
      title: 'Notifications',
      subtitle: 'Message, group & call tones, reaction notifications',
      action: () => alert('Notification preferences updated.'),
    },
    {
      id: 'storage',
      icon: <HardDrive className="w-5 h-5 text-[#1E3A8A]" />,
      title: 'Storage and data',
      subtitle: 'Network usage, auto-download, manage storage',
      action: () => alert('Storage Dashboard: 142 MB used / 2.4 GB free.'),
    },
    {
      id: 'devices',
      icon: <Laptop className="w-5 h-5 text-[#1E3A8A]" />,
      title: 'Linked devices',
      subtitle: 'Use Let\'s Talk on Web, Desktop and other devices',
      action: () => setModalState('isLinkedDevicesOpen', true),
    },
    {
      id: 'help',
      icon: <HelpCircle className="w-5 h-5 text-[#1E3A8A]" />,
      title: 'Help',
      subtitle: 'Help center, contact us, privacy policy, licenses',
      action: () => alert("Let's Talk SuperApp v2.4.0 — All Systems Operational."),
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAF8F2] overflow-y-auto select-none">
      {/* Header */}
      <div className="h-[60px] px-4 border-b border-[#E2D8C7] flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">Settings</h2>
      </div>

      {/* User Profile Header Card */}
      <div
        onClick={() => setModalState('isAuthModalOpen', true)}
        className="p-4 flex items-center gap-3.5 hover:bg-[#ECE3D4] cursor-pointer transition-colors border-b border-[#E2D8C7]/60"
      >
        <div className="w-[60px] h-[60px] rounded-full bg-[#ECE3D4] overflow-hidden flex items-center justify-center text-[#0F2744] font-bold text-lg flex-shrink-0 border border-[#E2D8C7]">
          {user?.profile?.avatarUrl ? (
            <img src={user.profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            user?.profile?.displayName ? user.profile.displayName[0].toUpperCase() : 'U'
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-[17px] font-semibold text-[#0F172A] truncate">{user?.profile?.displayName || 'Alex Mercer'}</h3>
          <p className="text-[13px] text-[#64748B] truncate">{user?.profile?.bio || "Hey there! I am using Let's Talk."}</p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setModalState('isQRCodeOpen', true);
          }}
          className="p-2 rounded-full hover:bg-[#ECE3D4] text-[#1E3A8A] transition-all"
          title="Share QR code"
        >
          <QrCode className="w-5 h-5" />
        </button>
      </div>

      {/* Settings Navigation List */}
      <div className="p-2 space-y-0.5">
        {settingsItems.map((item) => (
          <div
            key={item.id}
            onClick={item.action}
            className="px-3.5 py-3 rounded-xl hover:bg-[#ECE3D4] flex items-center gap-4 cursor-pointer transition-colors"
          >
            <div className="flex-shrink-0">{item.icon}</div>

            <div className="flex-1 min-w-0 border-b border-[#E2D8C7]/60 pb-0.5">
              <h4 className="text-[15px] font-medium text-[#0F172A]">{item.title}</h4>
              <p className="text-[12px] text-[#64748B] truncate">{item.subtitle}</p>
            </div>

            <ChevronRight className="w-4 h-4 text-[#94A3B8] flex-shrink-0" />
          </div>
        ))}

        {/* Log out */}
        <div
          onClick={logout}
          className="px-3.5 py-3 rounded-xl hover:bg-rose-50 flex items-center gap-4 cursor-pointer transition-colors text-rose-600 mt-2 font-medium"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="text-[15px]">Log out</h4>
          </div>
        </div>
      </div>
    </div>
  );
}
