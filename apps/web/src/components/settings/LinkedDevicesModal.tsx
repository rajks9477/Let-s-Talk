'use client';

import React from 'react';
import { X, Laptop, LogOut } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { QRCodeSVG } from 'qrcode.react';

export function LinkedDevicesModal() {
  const { isLinkedDevicesOpen, setModalState } = useUIStore();

  if (!isLinkedDevicesOpen) return null;

  const devices = [
    { id: 'dev_1', name: 'Google Chrome on macOS (Primary)', lastActive: 'Active now', isCurrent: true },
    { id: 'dev_2', name: 'Let\'s Talk Desktop for Windows', lastActive: '2 hours ago', isCurrent: false },
    { id: 'dev_3', name: 'iPad Pro Companion Client', lastActive: 'Yesterday', isCurrent: false },
  ];

  return (
    <div className="fixed inset-0 bg-[#0A192F]/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 select-none">
      <div className="w-full max-w-md bg-[#FAF8F2] border border-[#E2D8C7] rounded-3xl shadow-2xl p-6 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E2D8C7] mb-4">
          <div className="flex items-center gap-2 text-[#1E3A8A] font-bold text-sm">
            <Laptop className="w-5 h-5" />
            <span>Multi-Device Sessions</span>
          </div>
          <button
            onClick={() => setModalState('isLinkedDevicesOpen', false)}
            className="p-1 rounded-full text-[#64748B] hover:text-[#0F172A] hover:bg-[#ECE3D4]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Pairing Demo Box */}
        <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E2D8C7] flex items-center gap-4 mb-4 shadow-xs">
          <div className="p-2 bg-white rounded-xl border border-[#E2D8C7]">
            <QRCodeSVG value="letstalk-multidevice-session-auth-token-pair" size={64} />
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-bold text-[#0F172A]">Link a New Device</h4>
            <p className="text-[11px] text-[#64748B] mt-0.5">
              Scan this QR code from your companion mobile or desktop app to sync without keeping primary phone online.
            </p>
          </div>
        </div>

        {/* Active Sessions List */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-[#1E3A8A] uppercase tracking-wider px-1">
            Active Device Sessions
          </h4>

          {devices.map((d) => (
            <div
              key={d.id}
              className="p-3 rounded-2xl bg-[#FFFFFF] border border-[#E2D8C7] flex items-center justify-between gap-3 shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FAF8F2] flex items-center justify-center text-[#1E3A8A] border border-[#E2D8C7]">
                  <Laptop className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-[#0F172A]">{d.name}</h5>
                  <span className="text-[10px] text-[#64748B]">{d.lastActive}</span>
                </div>
              </div>

              {!d.isCurrent && (
                <button
                  onClick={() => alert('Session logged out successfully')}
                  className="p-1.5 rounded-lg text-[#64748B] hover:text-rose-600 hover:bg-rose-50 transition-all"
                  title="Revoke Session"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
