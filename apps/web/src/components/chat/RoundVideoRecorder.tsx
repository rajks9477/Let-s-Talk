'use client';

import React, { useState, useRef } from 'react';
import { X, Check, Camera } from 'lucide-react';
import { api } from '@/lib/api';

interface Props {
  onSendVideo: (videoUrl: string) => void;
  onClose: () => void;
}

export function RoundVideoRecorder({ onSendVideo, onClose }: Props) {
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to access camera for round video:', err);
    }
  };

  const stopAndSend = async () => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      try {
        const formData = new FormData();
        formData.append('file', blob, 'round_video.webm');
        const res = await api.uploadMedia(formData);
        if (res.success && res.media) {
          onSendVideo(res.media.fileUrl);
        }
      } catch (err) {
        console.error('Failed to upload round video:', err);
      }
      onClose();
    };

    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
  };

  return (
    <div className="fixed inset-0 bg-[#0A192F]/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4">
      <div className="relative flex flex-col items-center">
        {/* Round Circular Camera Preview */}
        <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border-4 border-[#1E3A8A] overflow-hidden shadow-2xl bg-[#0F2744] relative mb-6">
          <video
            ref={videoRef}
            muted
            playsInline
            className="w-full h-full object-cover transform -scale-x-100"
          />
          {!isRecording && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0F2744]/70 text-white p-4 text-center">
              <Camera className="w-10 h-10 text-[#93C5FD] mb-2" />
              <p className="text-xs font-semibold">Ready for Round Instant Video</p>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-3 rounded-full bg-[#FAF8F2] hover:bg-[#ECE3D4] text-[#0F172A] border border-[#E2D8C7] shadow-md"
          >
            <X className="w-6 h-6" />
          </button>

          {!isRecording ? (
            <button
              onClick={startCamera}
              className="px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-2 shadow-lg shadow-rose-600/30"
            >
              <div className="w-3 h-3 rounded-full bg-white animate-ping" /> Record
            </button>
          ) : (
            <button
              onClick={stopAndSend}
              className="px-6 py-3 rounded-full bg-[#1E3A8A] hover:bg-[#2563EB] text-white font-bold flex items-center gap-2 shadow-lg shadow-[#1E3A8A]/30"
            >
              <Check className="w-5 h-5" /> Send Video Note
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
