'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useChatStore } from '@/stores/chatStore';
import { ChatHeader } from './ChatHeader';
import { ChatComposer } from './ChatComposer';
import { MessageBubble } from './MessageBubble';
import { api } from '@/lib/api';
import { Message } from '@/types';
import { Lock, Laptop } from 'lucide-react';
import { getSocket } from '@/lib/socket';

export function ChatArea() {
  const { activeChat, messages, setMessages } = useChatStore();
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const chatMessages = activeChat ? messages[activeChat.id] || [] : [];

  useEffect(() => {
    if (!activeChat) return;

    // Join realtime socket room
    const socket = getSocket();
    socket.emit('chat:join', activeChat.id);

    async function loadMessages() {
      try {
        const res = await api.getMessages(activeChat!.id);
        if (res.success && res.messages) {
          setMessages(activeChat!.id, res.messages);
        }
      } catch (err) {
        console.warn('Using local cached messages:', err);
      }
    }
    loadMessages();

    return () => {
      socket.emit('chat:leave', activeChat.id);
    };
  }, [activeChat, setMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // WhatsApp Default Empty Screen
  if (!activeChat) {
    return (
      <div className="flex-1 hidden md:flex flex-col items-center justify-center bg-[#FAF8F2] p-8 text-center select-none border-b-[6px] border-[#1E3A8A]">
        <div className="w-24 h-24 rounded-full bg-[#ECE3D4] flex items-center justify-center text-[#1E3A8A] mb-8 shadow-sm border border-[#E2D8C7]">
          <Laptop className="w-12 h-12 text-[#1E3A8A]" />
        </div>
        <h2 className="text-[30px] font-semibold text-[#0F172A] mb-3 tracking-tight">Let's Talk Web & Desktop</h2>
        <p className="text-[14px] text-[#64748B] max-w-md mb-8 leading-relaxed">
          Send and receive messages without keeping your phone online. Use Let's Talk on up to 4 linked devices and 1 phone at the same time.
        </p>

        <a
          href="https://apps.microsoft.com/detail/9nksqgp742nh"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-2.5 rounded-full bg-[#1E3A8A] hover:bg-[#2563EB] text-white font-bold text-sm transition-all shadow-md mb-16"
        >
          Download Desktop App
        </a>

        <div className="flex items-center gap-1.5 text-xs text-[#94A3B8]">
          <Lock className="w-3.5 h-3.5 text-[#94A3B8]" />
          <span>Your personal messages are end-to-end encrypted</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F5EFE6] relative overflow-hidden">
      {/* Active Chat Header */}
      <ChatHeader />

      {/* Messages Stream with Light Cream Wallpaper */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1.5 wa-chat-wallpaper">
        {/* End-to-End Encryption Banner */}
        <div className="flex justify-center my-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FFFBEB] border border-[#FEF3C7] rounded-lg text-[12px] text-[#92400E] shadow-xs max-w-md text-center">
            <Lock className="w-3.5 h-3.5 text-[#B45309] flex-shrink-0" />
            <span>Messages and calls are end-to-end encrypted. No one outside of this chat, not even Let's Talk, can read or listen to them.</span>
          </div>
        </div>

        {/* Date Divider Pill */}
        <div className="flex justify-center my-3">
          <span className="px-3 py-1 bg-[#FFFFFF] border border-[#E2D8C7] rounded-lg text-[11px] text-[#64748B] font-semibold tracking-wide uppercase shadow-xs">
            TODAY
          </span>
        </div>

        {/* Message Bubbles */}
        {chatMessages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            onReply={(m) => setReplyingTo(m)}
          />
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Composer */}
      <ChatComposer
        replyingTo={replyingTo}
        onCancelReply={() => setReplyingTo(null)}
      />
    </div>
  );
}
