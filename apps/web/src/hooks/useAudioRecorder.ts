'use client';

import { useState, useRef, useCallback } from 'react';

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioWaveform, setAudioWaveform] = useState<number[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      setRecordingDuration(0);
      setAudioWaveform([]);

      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
        // Simulate live sound amplitude bar
        setAudioWaveform((prev) => [...prev.slice(-30), Math.floor(Math.random() * 80 + 20)]);
      }, 1000);
    } catch (err) {
      console.error('Audio recording permission denied or failed:', err);
    }
  }, []);

  const stopRecording = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current) {
        setIsRecording(false);
        resolve(null);
        return;
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        if (timerRef.current) clearInterval(timerRef.current);
        setIsRecording(false);
        resolve(audioBlob);
      };

      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
    });
  }, []);

  const cancelRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
      mediaRecorderRef.current = null;
    }
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
    setRecordingDuration(0);
    setAudioWaveform([]);
  }, []);

  return {
    isRecording,
    recordingDuration,
    audioWaveform,
    startRecording,
    stopRecording,
    cancelRecording,
  };
}
