'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useCallStore } from '@/stores/callStore';
import { useWebRTC } from '@/hooks/useWebRTC';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  ScreenShare,
  PhoneOff,
  Hand,
  ShieldCheck,
} from 'lucide-react';

export function CallModal() {
  const currentCall = useCallStore((s) => s.currentCall);
  const toggleMute = useCallStore((s) => s.toggleMute);
  const toggleVideo = useCallStore((s) => s.toggleVideo);
  const { localStream, remoteStream, endCall, toggleScreenShare } = useWebRTC();
  const [duration, setDuration] = useState(0);
  const [hasRaisedHand, setHasRaisedHand] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  useEffect(() => {
    if (!currentCall) {
      setDuration(0);
      return;
    }
    const timer = setInterval(() => setDuration((d) => d + 1), 1000);
    return () => clearInterval(timer);
  }, [currentCall]);

  if (!currentCall) return null;

  const isVideo = currentCall.type === 'VIDEO' || currentCall.isVideoEnabled;

  return (
    <div className="fixed inset-0 bg-[#0A192F]/95 backdrop-blur-md z-50 flex flex-col items-center justify-between p-6 animate-fade-in select-none">
      {/* Top Bar Header */}
      <div className="w-full max-w-4xl flex items-center justify-between z-10">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#93C5FD] bg-[#0F2744] border border-[#1E3A8A] px-3 py-1.5 rounded-full shadow-lg">
          <ShieldCheck className="w-4 h-4 text-[#60A5FA]" />
          <span>Encrypted WebRTC Call</span>
        </div>

        <div className="font-mono text-sm font-bold text-white bg-[#0F2744] px-4 py-1.5 rounded-full border border-[#1E3A8A] shadow-lg">
          {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
        </div>

        <div className="w-24" /> {/* Spacer */}
      </div>

      {/* Main Video/Audio Grid */}
      <div className="w-full max-w-4xl flex-1 flex items-center justify-center relative my-4">
        {isVideo ? (
          <div className="w-full h-full max-h-[70vh] rounded-3xl overflow-hidden bg-[#0F2744] border border-[#1E3A8A] relative shadow-2xl flex items-center justify-center">
            {/* Remote Video Stream */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />

            {!remoteStream && (
              <div className="flex flex-col items-center justify-center text-center text-[#93C5FD]">
                <div className="w-24 h-24 rounded-full bg-[#1E3A8A] border-2 border-[#60A5FA] flex items-center justify-center text-3xl font-bold text-white mb-3 shadow-xl">
                  {currentCall.callerName ? currentCall.callerName.charAt(0).toUpperCase() : 'U'}
                </div>
                <h3 className="text-lg font-bold text-white">{currentCall.callerName}</h3>
                <p className="text-xs text-[#93C5FD] animate-pulse mt-1">Connecting secure video...</p>
              </div>
            )}

            {/* Local Picture-in-Picture Video */}
            <div className="absolute bottom-4 right-4 w-36 h-48 md:w-44 md:h-60 rounded-2xl overflow-hidden bg-[#0F2744] border-2 border-[#2563EB] shadow-2xl">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover transform -scale-x-100"
              />
            </div>
          </div>
        ) : (
          /* Voice Call Big Avatar Card */
          <div className="flex flex-col items-center justify-center text-center p-8">
            <div className="relative mb-6">
              <div className="w-32 h-32 rounded-full bg-[#1E3A8A] border-4 border-[#60A5FA] flex items-center justify-center text-4xl font-bold text-white shadow-2xl ring-8 ring-[#1E3A8A]/30">
                {currentCall.callerName ? currentCall.callerName.charAt(0).toUpperCase() : 'U'}
              </div>
              {hasRaisedHand && (
                <span className="absolute top-0 right-0 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white text-base shadow-lg animate-bounce">
                  ✋
                </span>
              )}
            </div>

            <h2 className="text-xl font-bold text-white mb-1">{currentCall.callerName}</h2>
            <p className="text-xs text-[#93C5FD] font-medium tracking-wide">
              {currentCall.status === 'CONNECTED' ? 'Voice Call in Progress' : 'Ringing...'}
            </p>
          </div>
        )}
      </div>

      {/* Control Action Toolbar */}
      <div className="flex items-center gap-3 md:gap-4 bg-[#0F2744] border border-[#1E3A8A] px-6 py-3.5 rounded-3xl shadow-2xl z-10">
        {/* Mute Toggle */}
        <button
          onClick={toggleMute}
          className={`p-3.5 rounded-2xl transition-all ${
            currentCall.isMuted
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              : 'bg-[#1E3A8A] hover:bg-[#2563EB] text-white'
          }`}
          title={currentCall.isMuted ? 'Unmute Mic' : 'Mute Mic'}
        >
          {currentCall.isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Video Toggle */}
        <button
          onClick={toggleVideo}
          className={`p-3.5 rounded-2xl transition-all ${
            !currentCall.isVideoEnabled
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              : 'bg-[#1E3A8A] hover:bg-[#2563EB] text-white'
          }`}
          title={currentCall.isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
        >
          {currentCall.isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </button>

        {/* Screen Share */}
        <button
          onClick={toggleScreenShare}
          className={`p-3.5 rounded-2xl transition-all ${
            currentCall.isScreenSharing
              ? 'bg-[#2563EB] text-white shadow-lg'
              : 'bg-[#1E3A8A] hover:bg-[#2563EB] text-white'
          }`}
          title="Share Screen with Audio"
        >
          <ScreenShare className="w-5 h-5" />
        </button>

        {/* Raise Hand */}
        <button
          onClick={() => setHasRaisedHand(!hasRaisedHand)}
          className={`p-3.5 rounded-2xl transition-all ${
            hasRaisedHand
              ? 'bg-amber-500 text-white shadow-lg'
              : 'bg-[#1E3A8A] hover:bg-[#2563EB] text-white'
          }`}
          title="Raise Hand"
        >
          <Hand className="w-5 h-5" />
        </button>

        {/* End Call Button */}
        <button
          onClick={endCall}
          className="px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all hover:scale-105"
          title="End Call"
        >
          <PhoneOff className="w-5 h-5" />
          <span className="text-xs">End</span>
        </button>
      </div>
    </div>
  );
}
