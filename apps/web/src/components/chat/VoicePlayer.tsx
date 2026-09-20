'use client';

import React, { useState, useRef } from 'react';
import { Play, Pause, Mic, Sparkles } from 'lucide-react';

interface Props {
  audioUrl: string;
  waveform?: number[];
  durationSec?: number;
  isSender?: boolean;
}

export function VoicePlayer({ audioUrl, waveform, durationSec = 14, isSender = false }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(1);
  const [showTranscription, setShowTranscription] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const defaultWaveform = waveform && waveform.length > 0 ? waveform : [
    25, 45, 70, 85, 55, 35, 45, 80, 95, 70, 45, 30, 40, 85, 90, 65, 50, 35, 60, 70, 45, 35, 50, 65
  ];

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSpeedChange = () => {
    const nextSpeed = speed === 1 ? 1.5 : speed === 1.5 ? 2 : 1;
    setSpeed(nextSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
    }
  };

  return (
    <div className="flex flex-col gap-1.5 min-w-[240px] max-w-[340px] py-1 select-none">
      <audio
        ref={audioRef}
        src={audioUrl}
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
      />

      <div className="flex items-center gap-2.5">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all flex-shrink-0 shadow-md ${
            isSender
              ? 'text-[#0F2744] bg-[#FFFFFF] hover:bg-slate-100'
              : 'text-white bg-[#1E3A8A] hover:bg-[#2563EB]'
          }`}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current ml-0.5" />
          )}
        </button>

        {/* Dynamic Waveform Dots */}
        <div className="flex-1 flex items-center gap-1 h-7 px-1">
          {defaultWaveform.slice(0, 26).map((height, i) => (
            <div
              key={i}
              style={{ height: `${Math.max(12, height * 0.3)}px` }}
              className={`w-1 rounded-full transition-all ${
                isPlaying && i % 4 === 0
                  ? isSender ? 'bg-[#93C5FD] animate-pulse' : 'bg-[#1E3A8A] animate-pulse'
                  : isSender
                  ? 'bg-white/70'
                  : 'bg-[#94A3B8]'
              }`}
            />
          ))}
        </div>

        {/* Speed Toggle */}
        <button
          onClick={handleSpeedChange}
          className={`px-2 py-0.5 rounded-full text-[11px] font-bold border transition-all ${
            isSender
              ? 'bg-[#0F2744]/40 text-white border-white/20 hover:bg-[#0F2744]/60'
              : 'bg-[#FAF8F2] text-[#0F172A] border-[#E2D8C7] hover:bg-[#ECE3D4]'
          }`}
        >
          {speed}x
        </button>
      </div>

      {/* Footer Subtext */}
      <div className={`flex items-center justify-between text-[11px] px-1 ${
        isSender ? 'text-[#93C5FD]' : 'text-[#64748B]'
      }`}>
        <span className="flex items-center gap-1">
          <Mic className={`w-3 h-3 ${isSender ? 'text-[#93C5FD]' : 'text-[#1E3A8A]'}`} /> 0:{durationSec.toString().padStart(2, '0')}
        </span>
        <button
          onClick={() => setShowTranscription(!showTranscription)}
          className={`flex items-center gap-1 hover:underline ${isSender ? 'text-[#93C5FD]' : 'text-[#1E3A8A]'}`}
        >
          <Sparkles className="w-3 h-3" />
          {showTranscription ? 'Hide' : 'Transcript'}
        </button>
      </div>

      {showTranscription && (
        <div className={`p-2 rounded-lg border text-xs animate-fade-in mt-1 ${
          isSender
            ? 'bg-[#0F2744]/50 border-white/10 text-white/90'
            : 'bg-[#FAF8F2] border-[#E2D8C7] text-[#0F172A]'
        }`}>
          <p className="italic">
            "Hey! Just checking in on the project milestones. Let me know when you're available for a quick sync."
          </p>
        </div>
      )}
    </div>
  );
}
