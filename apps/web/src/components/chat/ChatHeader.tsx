'use client';

import React, { useState } from 'react';
import { Phone, Video, Search, MoreVertical, Lock, ArrowLeft, Clock, VolumeX, Trash2 } from 'lucide-react';
import { useChatStore } from '@/stores/chatStore';
import { useUIStore } from '@/stores/uiStore';
import { useWebRTC } from '@/hooks/useWebRTC';

export function ChatHeader() {
  const { activeChat, setActiveChat, typingMap } = useChatStore();
  const { openRightDrawer, setModalState } = useUIStore();
  const { startCall } = useWebRTC();
  const [showMenu, setShowMenu] = useState(false);

  if (!activeChat) return null;

  const displayName = activeChat.name || activeChat.members[0]?.user?.profile?.displayName || 'Chat';
  const avatarUrl = activeChat.avatarUrl || activeChat.members[0]?.user?.profile?.avatarUrl;
  const isTyping = (typingMap[activeChat.id] || []).length > 0;

  const handleVoiceCall = () => {
    const targetUserId = activeChat.members[0]?.userId || 'user_demo';
    startCall(targetUserId, 'VOICE');
  };

  const handleVideoCall = () => {
    const targetUserId = activeChat.members[0]?.userId || 'user_demo';
    startCall(targetUserId, 'VIDEO');
  };

  return (
    <div className="h-[60px] px-4 bg-[#FAF8F2] border-b border-[#E2D8C7] flex items-center justify-between z-20 relative select-none">
      {/* Contact Profile Info */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => setActiveChat(null)}
          className="md:hidden p-1.5 rounded-full hover:bg-[#ECE3D4] text-[#0F2744]"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div
          onClick={() => openRightDrawer('INFO')}
          className="w-10 h-10 rounded-full bg-[#ECE3D4] overflow-hidden cursor-pointer flex items-center justify-center font-semibold text-[#0F2744] flex-shrink-0 border border-[#E2D8C7]"
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
          ) : (
            displayName.charAt(0).toUpperCase()
          )}
        </div>

        <div onClick={() => openRightDrawer('INFO')} className="cursor-pointer min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="text-[15.5px] font-semibold text-[#0F172A] truncate">{displayName}</h3>
            {activeChat.isLocked && <Lock className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />}
          </div>
          <p className="text-[12px] truncate">
            {isTyping ? (
              <span className="text-[#2563EB] font-medium animate-pulse">typing...</span>
            ) : (
              <span className="text-[#64748B]">online</span>
            )}
          </p>
        </div>
      </div>

      {/* Action Buttons: Video Call, Voice Call, Search, Menu */}
      <div className="flex items-center gap-1">
        <button
          onClick={handleVideoCall}
          className="p-2 rounded-full text-[#1E3A8A] hover:bg-[#ECE3D4] transition-all"
          title="Video call"
        >
          <Video className="w-5 h-5" />
        </button>

        <button
          onClick={handleVoiceCall}
          className="p-2 rounded-full text-[#1E3A8A] hover:bg-[#ECE3D4] transition-all"
          title="Voice call"
        >
          <Phone className="w-5 h-5" />
        </button>

        <button
          onClick={() => openRightDrawer('INFO')}
          className="p-2 rounded-full text-[#1E3A8A] hover:bg-[#ECE3D4] transition-all hidden sm:flex"
          title="Search in chat"
        >
          <Search className="w-5 h-5" />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-full text-[#1E3A8A] hover:bg-[#ECE3D4] transition-all"
            title="Menu"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {/* Menu Dropdown */}
          {showMenu && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-[#FFFFFF] rounded-xl shadow-2xl py-2 z-40 border border-[#E2D8C7] text-[13px] text-[#0F172A] animate-slide-up">
              <button
                onClick={() => {
                  setShowMenu(false);
                  openRightDrawer('INFO');
                }}
                className="w-full px-4 py-2.5 hover:bg-[#FAF8F2] flex items-center gap-3 text-left font-medium"
              >
                Contact info
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  openRightDrawer('AI');
                }}
                className="w-full px-4 py-2.5 hover:bg-[#FAF8F2] flex items-center gap-3 text-left text-[#1E3A8A] font-semibold"
              >
                Ask Meta AI
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  setModalState('isSecretCodeModalOpen', true);
                }}
                className="w-full px-4 py-2.5 hover:bg-[#FAF8F2] flex items-center gap-3 text-left text-amber-600 font-medium"
              >
                <Lock className="w-4 h-4" /> Lock chat
              </button>
              <button
                onClick={() => setShowMenu(false)}
                className="w-full px-4 py-2.5 hover:bg-[#FAF8F2] flex items-center gap-3 text-left font-medium"
              >
                <Clock className="w-4 h-4 text-[#64748B]" /> Disappearing messages
              </button>
              <button
                onClick={() => setShowMenu(false)}
                className="w-full px-4 py-2.5 hover:bg-[#FAF8F2] flex items-center gap-3 text-left font-medium"
              >
                <VolumeX className="w-4 h-4 text-[#64748B]" /> Mute notifications
              </button>
              <div className="my-1 border-t border-[#E2D8C7]" />
              <button
                onClick={() => {
                  setShowMenu(false);
                  setActiveChat(null);
                }}
                className="w-full px-4 py-2.5 hover:bg-rose-50 flex items-center gap-3 text-left text-rose-600 font-medium"
              >
                <Trash2 className="w-4 h-4" /> Clear chat
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
