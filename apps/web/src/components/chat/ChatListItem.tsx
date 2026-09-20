'use client';

import React from 'react';
import { Chat } from '@/types';
import { useChatStore } from '@/stores/chatStore';
import { CheckCheck, Pin, VolumeX, Lock, Image, Mic, FileText, Vote, Calendar } from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';

interface Props {
  chat: Chat;
}

export function ChatListItem({ chat }: Props) {
  const activeChat = useChatStore((s) => s.activeChat);
  const setActiveChat = useChatStore((s) => s.setActiveChat);
  const typingMap = useChatStore((s) => s.typingMap);

  const isActive = activeChat?.id === chat.id;
  const isTyping = (typingMap[chat.id] || []).length > 0;

  // Determine display name and avatar
  const displayName = chat.name || chat.members[0]?.user?.profile?.displayName || 'Chat';
  const avatarUrl = chat.avatarUrl || chat.members[0]?.user?.profile?.avatarUrl;
  const lastMsg = chat.messages?.[0];

  const formatMessageTime = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isToday(date)) {
      return format(date, 'h:mm a');
    }
    if (isYesterday(date)) {
      return 'Yesterday';
    }
    return format(date, 'dd/MM/yyyy');
  };

  const renderSnippet = () => {
    if (isTyping) {
      return <span className="text-[#2563EB] font-medium">typing...</span>;
    }
    if (!lastMsg) return <span className="text-[#94A3B8] italic">Tap to start chatting</span>;

    const isOutgoing = lastMsg.senderId === 'me' || lastMsg.senderId === 'usr_me_01';

    return (
      <span className="flex items-center gap-1 truncate text-[13px] text-[#64748B]">
        {isOutgoing && (
          <span className="text-[#2563EB] mr-0.5 inline-flex flex-shrink-0">
            <CheckCheck className="w-3.5 h-3.5" />
          </span>
        )}

        {lastMsg.type === 'VOICE' && (
          <span className="flex items-center gap-1 text-[#64748B]">
            <Mic className="w-3.5 h-3.5 text-[#1E3A8A]" /> Voice message
          </span>
        )}
        {lastMsg.type === 'IMAGE' && (
          <span className="flex items-center gap-1 text-[#64748B]">
            <Image className="w-3.5 h-3.5 text-[#1E3A8A]" /> Photo
          </span>
        )}
        {lastMsg.type === 'POLL' && (
          <span className="flex items-center gap-1 text-[#64748B]">
            <Vote className="w-3.5 h-3.5 text-amber-500" /> Poll
          </span>
        )}
        {lastMsg.type === 'EVENT' && (
          <span className="flex items-center gap-1 text-[#64748B]">
            <Calendar className="w-3.5 h-3.5 text-[#1E3A8A]" /> Event invitation
          </span>
        )}
        {lastMsg.type === 'TEXT' && (
          <span className="truncate">{lastMsg.content}</span>
        )}
      </span>
    );
  };

  return (
    <div
      onClick={() => setActiveChat(chat)}
      className={`h-[72px] px-3 flex items-center gap-3 cursor-pointer transition-colors border-b border-[#E2D8C7]/60 ${
        isActive ? 'bg-[#ECE3D4]' : 'hover:bg-[#F3EBDD]'
      }`}
    >
      {/* 49px Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-[49px] h-[49px] rounded-full bg-[#E2D8C7] overflow-hidden flex items-center justify-center text-[#0F2744] font-semibold text-base border border-[#ECE3D4]">
          {avatarUrl ? (
            <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
          ) : (
            displayName.charAt(0).toUpperCase()
          )}
        </div>
        {chat.isLocked && (
          <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#FAF8F2] rounded-full flex items-center justify-center text-amber-500 border border-[#E2D8C7]">
            <Lock className="w-2.5 h-2.5" />
          </span>
        )}
      </div>

      {/* Details (Name, Snippet, Time, Badges) */}
      <div className="flex-1 min-w-0 pr-1 flex flex-col justify-center">
        <div className="flex items-center justify-between gap-1 mb-0.5">
          <h3 className="text-[15.5px] font-semibold text-[#0F172A] truncate">{displayName}</h3>
          <span className={`text-[12px] whitespace-nowrap ${(chat.unreadCount || 0) > 0 ? 'text-[#1E3A8A] font-bold' : 'text-[#94A3B8]'}`}>
            {formatMessageTime(chat.lastMessageAt)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">{renderSnippet()}</div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {chat.isMuted && <VolumeX className="w-4 h-4 text-[#94A3B8]" />}
            {chat.isPinned && <Pin className="w-4 h-4 text-[#1E3A8A] rotate-45" />}
            {(chat.unreadCount || 0) > 0 && (
              <span className="min-w-[20px] h-[20px] px-1.5 bg-[#1E3A8A] text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-xs">
                {chat.unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
