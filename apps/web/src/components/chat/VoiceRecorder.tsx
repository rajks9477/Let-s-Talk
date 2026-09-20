'use client';

import React from 'react';
import { Mic, Trash2, Send } from 'lucide-react';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { api } from '@/lib/api';

interface Props {
  onSendVoice: (audioUrl: string, waveform: number[], durationSec: number) => void;
}

export function VoiceRecorder({ onSendVoice }: Props) {
  const { isRecording, recordingDuration, audioWaveform, startRecording, stopRecording, cancelRecording } =
    useAudioRecorder();

  const handleStart = () => {
    startRecording();
  };

  const handleFinish = async () => {
    const audioBlob = await stopRecording();
    if (!audioBlob) return;

    try {
      // Upload recorded audio blob
      const formData = new FormData();
      formData.append('file', audioBlob, 'voice_message.webm');
      const res = await api.uploadMedia(formData);

      if (res.success && res.media) {
        onSendVoice(res.media.fileUrl, audioWaveform, Math.max(1, recordingDuration));
      }
    } catch (err) {
      console.error('Failed to upload voice recording:', err);
    }
  };

  if (!isRecording) {
    return (
      <button
        onClick={handleStart}
        className="p-2.5 rounded-full text-[#64748B] hover:text-[#1E3A8A] hover:bg-[#ECE3D4] transition-all"
        title="Record Voice Message"
      >
        <Mic className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-between gap-3 bg-[#FFFFFF] px-4 py-2 rounded-xl border border-[#1E3A8A]/40 animate-fade-in shadow-md">
      {/* Recording Indicator & Timer */}
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
        <span className="text-xs font-mono font-bold text-rose-600">
          0:{recordingDuration.toString().padStart(2, '0')}
        </span>
      </div>

      {/* Live Audio Waveform visualizer */}
      <div className="flex-1 flex items-center gap-0.5 h-6 overflow-hidden px-2">
        {audioWaveform.map((amp, idx) => (
          <div
            key={idx}
            style={{ height: `${Math.max(15, amp * 0.3)}px` }}
            className="w-1 bg-[#1E3A8A] rounded-full animate-pulse"
          />
        ))}
      </div>

      {/* Actions (Delete, Send) */}
      <div className="flex items-center gap-2">
        <button
          onClick={cancelRecording}
          className="p-2 rounded-lg bg-[#FAF8F2] hover:bg-rose-50 text-[#64748B] hover:text-rose-600 transition-all border border-[#E2D8C7]"
          title="Cancel"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <button
          onClick={handleFinish}
          className="p-2 rounded-lg bg-[#1E3A8A] hover:bg-[#2563EB] text-white transition-all shadow-md shadow-[#1E3A8A]/20"
          title="Send Voice Message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
