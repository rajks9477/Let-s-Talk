'use client';

import React from 'react';
import { X, QrCode, Copy, Share2, Check } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';
import { QRCodeSVG } from 'qrcode.react';

export function PaymentQRCodeModal() {
  const { isQRCodeOpen, setModalState } = useUIStore();
  const { user } = useAuthStore();
  const [copied, setCopied] = React.useState(false);

  if (!isQRCodeOpen) return null;

  const vpa = `user.${user?.phoneNumber?.slice(-4) || '7890'}@upi`;
  const upiUri = `upi://pay?pa=${vpa}&pn=${encodeURIComponent(user?.profile?.displayName || 'Lets Talk User')}&cu=INR`;

  const handleCopy = () => {
    navigator.clipboard.writeText(vpa);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-[#0A192F]/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 select-none">
      <div className="w-full max-w-sm bg-[#FAF8F2] border border-[#E2D8C7] rounded-3xl shadow-2xl p-6 text-center animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E2D8C7] mb-5">
          <div className="flex items-center gap-2 text-[#1E3A8A] font-bold text-sm">
            <QrCode className="w-5 h-5" />
            <span>Scan & Pay via UPI</span>
          </div>
          <button
            onClick={() => setModalState('isQRCodeOpen', false)}
            className="p-1 rounded-full text-[#64748B] hover:text-[#0F172A] hover:bg-[#ECE3D4]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Canvas Box */}
        <div className="p-6 bg-white rounded-2xl inline-block mb-4 shadow-md border-4 border-[#1E3A8A]/20">
          <QRCodeSVG value={upiUri} size={180} />
        </div>

        <h4 className="text-sm font-bold text-[#0F172A] mb-0.5">{user?.profile?.displayName || 'Your Profile'}</h4>
        <p className="text-xs text-[#1E3A8A] font-mono font-semibold mb-5">{vpa}</p>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex-1 py-2.5 rounded-xl bg-[#FFFFFF] hover:bg-[#ECE3D4] text-xs font-semibold text-[#0F172A] border border-[#E2D8C7] flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            {copied ? <Check className="w-4 h-4 text-[#1E3A8A]" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied VPA' : 'Copy VPA'}</span>
          </button>

          <button
            onClick={() => alert('UPI QR Link ready for sharing!')}
            className="p-2.5 rounded-xl bg-[#1E3A8A] hover:bg-[#2563EB] text-white shadow-md shadow-[#1E3A8A]/20"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
