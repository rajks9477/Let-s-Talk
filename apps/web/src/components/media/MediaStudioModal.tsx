'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  PenTool,
  Type,
  Send,
} from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useChatStore } from '@/stores/chatStore';
import { api } from '@/lib/api';
import { getSocket } from '@/lib/socket';

export function MediaStudioModal() {
  const { isMediaStudioOpen, setModalState } = useUIStore();
  const { activeChat, addMessage } = useChatStore();
  const [selectedImage] = useState<string | null>(
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600'
  );
  const [caption, setCaption] = useState('');
  const [isHD, setIsHD] = useState(false);
  const [activeTool, setActiveTool] = useState<'NONE' | 'DRAW' | 'TEXT'>('NONE');
  const [brushColor] = useState('#1E3A8A');
  const [overlayText, setOverlayText] = useState('');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);

  useEffect(() => {
    if (!isMediaStudioOpen || !selectedImage) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.src = selectedImage;
    img.onload = () => {
      canvas.width = img.width > 600 ? 600 : img.width;
      canvas.height = (img.height / img.width) * canvas.width;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  }, [isMediaStudioOpen, selectedImage]);

  if (!isMediaStudioOpen || !activeChat) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool !== 'DRAW') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    isDrawingRef.current = true;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || activeTool !== 'DRAW') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  const addTextOverlay = () => {
    if (!overlayText.trim()) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.font = 'bold 24px Inter, sans-serif';
    ctx.fillStyle = brushColor;
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 6;
    ctx.fillText(overlayText, 30, canvas.height / 2);
    setOverlayText('');
    setActiveTool('NONE');
  };

  const handleSend = async () => {
    const canvas = canvasRef.current;
    const finalUrl = canvas ? canvas.toDataURL('image/jpeg', isHD ? 0.95 : 0.8) : selectedImage;

    const payload = {
      chatId: activeChat.id,
      content: caption.trim() || undefined,
      type: 'IMAGE',
      attachments: [
        {
          fileUrl: finalUrl,
          thumbnailUrl: finalUrl,
          fileName: 'edited_photo.jpg',
          fileSize: 480000,
          mimeType: 'image/jpeg',
          isHD,
          type: 'IMAGE',
        },
      ],
    };

    try {
      const res = await api.sendMessage(payload);
      if (res.success && res.message) {
        addMessage(activeChat.id, res.message);
        getSocket().emit('message:send', res.message);
      }
    } catch (err) {
      console.error('Failed to send media:', err);
    }

    setModalState('isMediaStudioOpen', false);
    setCaption('');
  };

  return (
    <div className="fixed inset-0 bg-[#0A192F]/95 z-50 flex flex-col items-center justify-between p-4 md:p-6 animate-fade-in select-none">
      {/* Top Toolbar */}
      <div className="w-full max-w-2xl flex items-center justify-between z-10">
        <button
          onClick={() => setModalState('isMediaStudioOpen', false)}
          className="p-2 rounded-full bg-[#FAF8F2] text-[#0F172A] hover:bg-[#ECE3D4]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Editing Tools Bar */}
        <div className="flex items-center gap-2 bg-[#FAF8F2] border border-[#E2D8C7] px-3 py-1.5 rounded-full shadow-lg">
          <button
            onClick={() => setActiveTool(activeTool === 'DRAW' ? 'NONE' : 'DRAW')}
            className={`p-2 rounded-full transition-all ${
              activeTool === 'DRAW' ? 'bg-[#1E3A8A] text-white' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
            title="Pen Drawing"
          >
            <PenTool className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTool(activeTool === 'TEXT' ? 'NONE' : 'TEXT')}
            className={`p-2 rounded-full transition-all ${
              activeTool === 'TEXT' ? 'bg-[#1E3A8A] text-white' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
            title="Add Text"
          >
            <Type className="w-4 h-4" />
          </button>

          {/* HD Toggle */}
          <button
            onClick={() => setIsHD(!isHD)}
            className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all border ${
              isHD
                ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                : 'text-[#64748B] border-[#E2D8C7] hover:text-[#0F172A]'
            }`}
          >
            HD
          </button>
        </div>

        <div className="w-10" />
      </div>

      {/* Main Canvas Editor Area */}
      <div className="w-full max-w-2xl flex-1 flex flex-col items-center justify-center my-3 relative">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="max-h-[60vh] max-w-full rounded-2xl shadow-2xl border border-[#E2D8C7] cursor-crosshair object-contain bg-black"
        />

        {/* Text Input Drawer if Text Tool Active */}
        {activeTool === 'TEXT' && (
          <div className="absolute top-4 flex items-center gap-2 bg-[#FAF8F2] p-2 rounded-2xl border border-[#1E3A8A] shadow-2xl z-20">
            <input
              type="text"
              value={overlayText}
              onChange={(e) => setOverlayText(e.target.value)}
              placeholder="Enter text on image..."
              className="bg-transparent text-sm text-[#0F172A] px-2 focus:outline-none"
              autoFocus
            />
            <button
              onClick={addTextOverlay}
              className="px-3 py-1 bg-[#1E3A8A] text-white rounded-xl text-xs font-bold"
            >
              Add
            </button>
          </div>
        )}
      </div>

      {/* Caption & Send Bar */}
      <div className="w-full max-w-2xl flex items-center gap-3 z-10">
        <div className="flex-1 bg-[#FAF8F2] rounded-2xl border border-[#E2D8C7] px-4 py-2 flex items-center">
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Add a caption..."
            className="w-full bg-transparent text-sm text-[#0F172A] focus:outline-none placeholder-[#94A3B8]"
          />
        </div>

        <button
          onClick={handleSend}
          className="p-3.5 rounded-2xl bg-[#1E3A8A] hover:bg-[#2563EB] text-white shadow-xl shadow-[#1E3A8A]/30 transition-all hover:scale-105"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
