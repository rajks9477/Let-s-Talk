'use client';

import React, { useState } from 'react';
import { Message } from '@/types';
import { useAuthStore } from '@/stores/authStore';
import { VoicePlayer } from './VoicePlayer';
import { PollBubble } from './PollBubble';
import { EventBubble } from './EventBubble';
import {
  CheckCheck,
  Star,
  Pin,
  Clock,
  FileText,
  Download,
  Smile,
  ChevronDown,
  Reply,
  Copy,
  Trash2,
} from 'lucide-react';
import { format } from 'date-fns';
import { api } from '@/lib/api';

interface Props {
  message: Message;
  onReply?: (msg: Message) => void;
}

export function MessageBubble({ message, onReply }: Props) {
  const { user } = useAuthStore();
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const isSender = message.senderId === user?.id || message.senderId === 'me' || message.senderId === 'usr_me_01';

  const handleReact = async (emoji: string) => {
    setShowReactionPicker(false);
    try {
      await api.toggleReaction(message.id, emoji);
    } catch (err) {
      console.error('Reaction failed:', err);
    }
  };

  const handleCopy = () => {
    if (message.content) {
      navigator.clipboard.writeText(message.content);
    }
    setShowMenu(false);
  };

  const handleDelete = async (forEveryone: boolean) => {
    try {
      await api.deleteMessage(message.id, forEveryone);
    } catch (err) {
      console.error('Delete failed:', err);
    }
    setShowMenu(false);
  };

  const quickEmojis = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

  return (
    <div
      className={`relative group flex flex-col mb-1 px-1 select-text ${
        isSender ? 'items-end' : 'items-start'
      }`}
    >
      <div
        className={`relative max-w-[85%] md:max-w-[65%] rounded-lg px-2.5 pt-1.5 pb-1 shadow-sm transition-all text-[14.2px] leading-[19px] ${
          isSender
            ? 'wa-bubble-out'
            : 'wa-bubble-in'
        }`}
      >
        {/* Hover Dropdown Chevron */}
        <button
          onClick={() => setShowMenu(!showMenu)}
          className={`absolute top-1.5 right-1.5 p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 ${
            isSender ? 'text-white/80 hover:text-white bg-[#0F2744]/60' : 'text-[#64748B] hover:text-[#0F172A] bg-[#ECE3D4]'
          }`}
        >
          <ChevronDown className="w-4 h-4" />
        </button>

        {/* Quoted Message Preview */}
        {message.replyTo && (
          <div className={`mb-1.5 p-2 rounded-md border-l-[3px] text-xs ${
            isSender
              ? 'bg-[#0F2744]/50 border-[#60A5FA] text-white/90'
              : 'bg-[#FAF8F2] border-[#1E3A8A] text-[#0F172A]'
          }`}>
            <span className={`font-semibold block mb-0.5 ${isSender ? 'text-[#93C5FD]' : 'text-[#1E3A8A]'}`}>
              {message.replyTo.sender?.profile?.displayName || 'User'}
            </span>
            <p className={`truncate ${isSender ? 'text-white/80' : 'text-[#64748B]'}`}>{message.replyTo.content || 'Attachment'}</p>
          </div>
        )}

        {/* View Once Photo / Audio Badge */}
        {message.isViewOnce && (
          <div className={`flex items-center gap-1.5 text-xs font-medium mb-1 px-2 py-1 rounded ${
            isSender ? 'bg-[#0F2744]/40 text-[#FDE68A]' : 'bg-[#FEF3C7] text-[#92400E]'
          }`}>
            <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px] font-bold">1</span>
            <span>View once message</span>
          </div>
        )}

        {/* Media Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="space-y-1 mb-1">
            {message.attachments.map((att, idx) => {
              if (att.type === 'IMAGE' || att.mimeType.startsWith('image/')) {
                return (
                  <div key={idx} className="rounded-lg overflow-hidden max-h-80 bg-black/10 relative">
                    <img
                      src={att.fileUrl}
                      alt={att.fileName}
                      className="w-full h-full object-cover cursor-pointer"
                    />
                    {att.isHD && (
                      <span className="absolute top-2 right-2 bg-[#0F2744]/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded border border-white/20">
                        HD
                      </span>
                    )}
                  </div>
                );
              }
              if (att.type === 'AUDIO' || att.type === 'VOICE' || att.mimeType.startsWith('audio/')) {
                return (
                  <VoicePlayer
                    key={idx}
                    audioUrl={att.fileUrl}
                    waveform={att.waveform}
                    durationSec={att.durationSec}
                    isSender={isSender}
                  />
                );
              }
              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 p-2 rounded-lg text-xs ${
                    isSender ? 'bg-[#0F2744]/40 border border-white/10' : 'bg-[#FAF8F2] border border-[#E2D8C7]'
                  }`}
                >
                  <FileText className={`w-7 h-7 flex-shrink-0 ${isSender ? 'text-[#93C5FD]' : 'text-[#1E3A8A]'}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold truncate ${isSender ? 'text-white' : 'text-[#0F172A]'}`}>{att.fileName}</p>
                    <span className={`text-[11px] ${isSender ? 'text-[#93C5FD]' : 'text-[#64748B]'}`}>
                      {(att.fileSize / (1024 * 1024)).toFixed(1)} MB • {att.mimeType.split('/')[1]?.toUpperCase()}
                    </span>
                  </div>
                  <a
                    href={att.fileUrl}
                    download
                    className={`p-2 rounded-full hover:bg-black/10 ${isSender ? 'text-white' : 'text-[#1E3A8A]'}`}
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              );
            })}
          </div>
        )}

        {/* Interactive Poll */}
        {message.poll && <PollBubble poll={message.poll} />}

        {/* Interactive Event */}
        {message.event && <EventBubble event={message.event} />}

        {/* Message Text Content */}
        {message.content && !message.poll && !message.event && (
          <p className={`leading-relaxed whitespace-pre-wrap break-words pr-14 ${
            isSender ? 'text-white' : 'text-[#0F172A]'
          }`}>
            {message.content}
          </p>
        )}

        {/* Timestamp & Status Icon in bottom right */}
        <div className={`flex items-center justify-end gap-1 mt-0.5 -mb-0.5 text-[11px] select-none float-right ml-3 ${
          isSender ? 'text-[#93C5FD]' : 'text-[#64748B]'
        }`}>
          {message.isEdited && <span className="text-[10px] italic">edited</span>}
          {message.isDisappearing && <Clock className="w-3 h-3" />}
          {message.isStarred && <Star className="w-3 h-3 text-amber-300 fill-amber-300" />}
          {message.isPinned && <Pin className="w-3 h-3 rotate-45" />}

          <span>{message.createdAt ? format(new Date(message.createdAt), 'h:mm a') : 'Now'}</span>

          {isSender && (
            <span className="text-[#93C5FD]">
              <CheckCheck className="w-4 h-4" />
            </span>
          )}
        </div>

        {/* Emoji Reactions Badge */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="absolute -bottom-2.5 right-2 flex items-center gap-1 bg-[#FFFFFF] border border-[#E2D8C7] px-1.5 py-0.5 rounded-full shadow-sm text-xs">
            {message.reactions.map((r, i) => (
              <span key={i} title={r.user?.profile?.displayName || 'User'}>
                {r.emoji}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* WhatsApp Message Context Dropdown Menu */}
      {showMenu && (
        <div
          className={`absolute top-6 z-40 w-44 bg-[#FFFFFF] border border-[#E2D8C7] rounded-xl shadow-2xl py-1.5 text-[13px] text-[#0F172A] animate-slide-up ${
            isSender ? 'right-4' : 'left-4'
          }`}
        >
          {onReply && (
            <button
              onClick={() => {
                setShowMenu(false);
                onReply(message);
              }}
              className="w-full px-3.5 py-2 hover:bg-[#FAF8F2] flex items-center gap-2.5 text-left font-medium"
            >
              <Reply className="w-4 h-4 text-[#1E3A8A]" /> Reply
            </button>
          )}

          <button
            onClick={() => {
              setShowMenu(false);
              setShowReactionPicker(true);
            }}
            className="w-full px-3.5 py-2 hover:bg-[#FAF8F2] flex items-center gap-2.5 text-left font-medium"
          >
            <Smile className="w-4 h-4 text-[#1E3A8A]" /> React
          </button>

          <button
            onClick={handleCopy}
            className="w-full px-3.5 py-2 hover:bg-[#FAF8F2] flex items-center gap-2.5 text-left font-medium"
          >
            <Copy className="w-4 h-4 text-[#1E3A8A]" /> Copy
          </button>

          <button
            onClick={() => {
              setShowMenu(false);
              handleDelete(false);
            }}
            className="w-full px-3.5 py-2 hover:bg-[#FAF8F2] flex items-center gap-2.5 text-left font-medium"
          >
            <Trash2 className="w-4 h-4 text-[#64748B]" /> Delete for me
          </button>

          {isSender && (
            <button
              onClick={() => {
                setShowMenu(false);
                handleDelete(true);
              }}
              className="w-full px-3.5 py-2 hover:bg-rose-50 flex items-center gap-2.5 text-left text-rose-600 font-medium"
            >
              <Trash2 className="w-4 h-4" /> Delete for everyone
            </button>
          )}
        </div>
      )}

      {/* Quick Emoji Reaction Bubble Bar */}
      {showReactionPicker && (
        <div
          className={`absolute -top-10 z-50 flex items-center gap-1.5 px-3 py-1.5 bg-[#FFFFFF] border border-[#E2D8C7] rounded-full shadow-2xl animate-fade-in ${
            isSender ? 'right-4' : 'left-4'
          }`}
        >
          {quickEmojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleReact(emoji)}
              className="text-lg hover:scale-125 transition-transform p-1"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
