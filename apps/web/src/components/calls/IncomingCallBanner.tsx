'use client';

import React from 'react';
import { Phone, PhoneOff, Video } from 'lucide-react';
import { useCallStore } from '@/stores/callStore';
import { useWebRTC } from '@/hooks/useWebRTC';

export function IncomingCallBanner() {
  const incomingCall = useCallStore((s) => s.incomingCall);
  const setIncomingCall = useCallStore((s) => s.setIncomingCall);
  const { startCall } = useWebRTC();

  if (!incomingCall) return null;

  const handleAccept = () => {
    startCall(incomingCall.callerId, incomingCall.type);
    setIncomingCall(null);
  };

  const handleDecline = () => {
    setIncomingCall(null);
  };

  return (
    <div className="fixed top-4 right-4 z-50 w-80 p-4 rounded-2xl bg-[#FAF8F2] border border-[#1E3A8A] shadow-2xl animate-slide-up flex items-center justify-between gap-3">
      {/* Caller Info */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-[#1E3A8A] flex items-center justify-center text-white font-bold shadow-xs">
          {incomingCall.callerName ? incomingCall.callerName.charAt(0).toUpperCase() : 'U'}
        </div>
        <div>
          <h4 className="text-sm font-bold text-[#0F172A]">{incomingCall.callerName}</h4>
          <p className="text-xs text-[#1E3A8A] flex items-center gap-1 animate-pulse font-medium">
            {incomingCall.type === 'VIDEO' ? <Video className="w-3 h-3" /> : <Phone className="w-3 h-3" />}
            Incoming {incomingCall.type === 'VIDEO' ? 'Video' : 'Voice'} Call...
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleDecline}
          className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-all"
          title="Decline"
        >
          <PhoneOff className="w-4 h-4" />
        </button>

        <button
          onClick={handleAccept}
          className="p-2.5 rounded-xl bg-[#1E3A8A] hover:bg-[#2563EB] text-white shadow-md shadow-[#1E3A8A]/30 transition-all animate-bounce"
          title="Accept"
        >
          <Phone className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
