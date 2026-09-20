'use client';

import React, { useState, useRef } from 'react';
import {
  Smile,
  Paperclip,
  Send,
  Image,
  FileText,
  Vote,
  Calendar,
  Camera,
  X,
} from 'lucide-react';
import { useChatStore } from '@/stores/chatStore';
import { useUIStore } from '@/stores/uiStore';
import { VoiceRecorder } from './VoiceRecorder';
import { RoundVideoRecorder } from './RoundVideoRecorder';
import { api } from '@/lib/api';
import { getSocket } from '@/lib/socket';

interface Props {
  replyingTo?: any;
  onCancelReply?: () => void;
}

export function ChatComposer({ replyingTo, onCancelReply }: Props) {
  const { activeChat, addMessage } = useChatStore();
  const { setModalState } = useUIStore();
  const [content, setContent] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [isViewOnce, setIsViewOnce] = useState(false);
  const [showRoundVideo, setShowRoundVideo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!activeChat) return null;

  const handleSendText = async () => {
    if (!content.trim()) return;

    const payload = {
      chatId: activeChat.id,
      content: content.trim(),
      type: 'TEXT',
      replyToId: replyingTo?.id,
      isViewOnce,
    };

    setContent('');
    setIsViewOnce(false);
    if (onCancelReply) onCancelReply();

    try {
      const res = await api.sendMessage(payload);
      if (res.success && res.message) {
        addMessage(activeChat.id, res.message);
        getSocket().emit('message:send', res.message);
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  };

  const handleSendVoice = async (audioUrl: string, waveform: number[], durationSec: number) => {
    const payload = {
      chatId: activeChat.id,
      type: 'VOICE',
      attachments: [{
        fileUrl: audioUrl,
        waveform,
        durationSec,
        type: 'AUDIO',
        fileName: 'voice_message.webm',
        mimeType: 'audio/webm',
      }],
    };

    try {
      const res = await api.sendMessage(payload);
      if (res.success && res.message) {
        addMessage(activeChat.id, res.message);
        getSocket().emit('message:send', res.message);
      }
    } catch (err) {
      console.error('Error sending voice message:', err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const uploadRes = await api.uploadMedia(formData);
      if (uploadRes.success && uploadRes.media) {
        const payload = {
          chatId: activeChat.id,
          type: uploadRes.media.type,
          isViewOnce,
          attachments: [uploadRes.media],
        };
        const res = await api.sendMessage(payload);
        if (res.success && res.message) {
          addMessage(activeChat.id, res.message);
          getSocket().emit('message:send', res.message);
        }
      }
    } catch (err) {
      console.error('File upload failed:', err);
    }
    setShowAttachMenu(false);
  };

  return (
    <div className="relative px-4 py-2.5 bg-[#FAF8F2] border-t border-[#E2D8C7] flex flex-col gap-1.5 z-20 select-none">
      {/* Quoted Message Preview Strip */}
      {replyingTo && (
        <div className="flex items-center justify-between px-3.5 py-2 bg-[#FFFFFF] rounded-lg border-l-4 border-[#1E3A8A] text-xs shadow-xs border border-[#E2D8C7]">
          <div>
            <span className="font-semibold text-[#1E3A8A] block">
              Replying to {replyingTo.sender?.profile?.displayName || 'User'}
            </span>
            <p className="truncate text-[#64748B] max-w-lg">{replyingTo.content || 'Attachment'}</p>
          </div>
          <button onClick={onCancelReply} className="text-[#94A3B8] hover:text-[#0F172A] p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Composer Row */}
      <div className="flex items-center gap-2">
        {/* Emoji / Sticker Drawer Toggle */}
        <button
          onClick={() => {
            setContent((prev) => prev + ' 😊 ');
          }}
          className="p-2 text-[#64748B] hover:text-[#1E3A8A] hover:bg-[#ECE3D4] rounded-full transition-all"
          title="Emojis, GIFs, Stickers"
        >
          <Smile className="w-6 h-6" />
        </button>

        {/* Attachment Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowAttachMenu(!showAttachMenu)}
            className={`p-2 rounded-full transition-all ${
              showAttachMenu
                ? 'bg-[#ECE3D4] text-[#1E3A8A] rotate-45'
                : 'text-[#64748B] hover:text-[#1E3A8A] hover:bg-[#ECE3D4]'
            }`}
            title="Attach"
          >
            <Paperclip className="w-6 h-6 transition-transform" />
          </button>

          {/* WhatsApp Authentic Floating Circular Attachment Menu */}
          {showAttachMenu && (
            <div className="absolute bottom-full left-0 mb-4 bg-[#FFFFFF] border border-[#E2D8C7] rounded-2xl shadow-2xl p-3 flex flex-col gap-2.5 text-xs text-[#0F172A] animate-slide-up z-40 min-w-[200px]">
              {/* Document */}
              <button
                onClick={() => {
                  setShowAttachMenu(false);
                  fileInputRef.current?.click();
                }}
                className="flex items-center gap-3.5 hover:bg-[#FAF8F2] p-2 rounded-xl transition-all"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="font-semibold">Document</span>
              </button>

              {/* Photos & Videos */}
              <button
                onClick={() => {
                  setShowAttachMenu(false);
                  setModalState('isMediaStudioOpen', true);
                }}
                className="flex items-center gap-3.5 hover:bg-[#FAF8F2] p-2 rounded-xl transition-all"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md">
                  <Image className="w-5 h-5" />
                </div>
                <span className="font-semibold">Photos & videos</span>
              </button>

              {/* Camera Studio */}
              <button
                onClick={() => {
                  setShowAttachMenu(false);
                  setShowRoundVideo(true);
                }}
                className="flex items-center gap-3.5 hover:bg-[#FAF8F2] p-2 rounded-xl transition-all"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center text-white shadow-md">
                  <Camera className="w-5 h-5" />
                </div>
                <span className="font-semibold">Instant Video</span>
              </button>

              {/* Poll */}
              <button
                onClick={() => {
                  setShowAttachMenu(false);
                  setModalState('isCreatePollOpen', true);
                }}
                className="flex items-center gap-3.5 hover:bg-[#FAF8F2] p-2 rounded-xl transition-all"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-500 flex items-center justify-center text-white shadow-md">
                  <Vote className="w-5 h-5" />
                </div>
                <span className="font-semibold">Poll</span>
              </button>

              {/* In-Chat Event */}
              <button
                onClick={() => {
                  setShowAttachMenu(false);
                  setModalState('isCreateEventOpen', true);
                }}
                className="flex items-center gap-3.5 hover:bg-[#FAF8F2] p-2 rounded-xl transition-all"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="font-semibold">Event</span>
              </button>

              {/* Payment (UPI India) */}
              <button
                onClick={() => {
                  setShowAttachMenu(false);
                  setModalState('isSendMoneyOpen', true);
                }}
                className="flex items-center gap-3.5 hover:bg-[#FAF8F2] p-2 rounded-xl transition-all"
              >
                <div className="w-9 h-9 rounded-full bg-[#1E3A8A] flex items-center justify-center text-white shadow-md font-bold text-sm">
                  ₹
                </div>
                <span className="font-semibold">Payment</span>
              </button>
            </div>
          )}
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Input Text Pill */}
        <div className="flex-1 relative flex items-center bg-[#FFFFFF] rounded-xl px-4 py-2 border border-[#E2D8C7] focus-within:border-[#1E3A8A] transition-all shadow-xs">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message"
            className="w-full bg-transparent text-[15px] text-[#0F172A] placeholder-[#94A3B8] focus:outline-none"
          />

          {/* View Once Icon Toggle */}
          <button
            onClick={() => setIsViewOnce(!isViewOnce)}
            className={`p-1 rounded-full transition-all ${
              isViewOnce ? 'text-[#1E3A8A] bg-[#1E3A8A]/10' : 'text-[#94A3B8] hover:text-[#0F172A]'
            }`}
            title="View Once"
          >
            <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-bold">1</span>
          </button>
        </div>

        {/* Send Airplane or Mic Button */}
        {content.trim() ? (
          <button
            onClick={handleSendText}
            className="p-2.5 rounded-full bg-[#1E3A8A] hover:bg-[#2563EB] text-white transition-all shadow-md flex items-center justify-center"
            title="Send"
          >
            <Send className="w-5 h-5 fill-current" />
          </button>
        ) : (
          <VoiceRecorder onSendVoice={handleSendVoice} />
        )}
      </div>

      {/* Round Video Recorder Dialog */}
      {showRoundVideo && (
        <RoundVideoRecorder
          onClose={() => setShowRoundVideo(false)}
          onSendVideo={async (videoUrl) => {
            const payload = {
              chatId: activeChat.id,
              type: 'ROUND_VIDEO',
              attachments: [{ fileUrl: videoUrl, type: 'VIDEO', fileName: 'round_video.webm' }],
            };
            const res = await api.sendMessage(payload);
            if (res.success && res.message) {
              addMessage(activeChat.id, res.message);
              getSocket().emit('message:send', res.message);
            }
          }}
        />
      )}
    </div>
  );
}
