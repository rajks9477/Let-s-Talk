'use client';

import { useState, useRef, useCallback } from 'react';
import { getSocket } from '@/lib/socket';
import { useCallStore } from '@/stores/callStore';

export function useWebRTC() {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const activeCall = useCallStore((s) => s.activeCall);
  const setActiveCall = useCallStore((s) => s.setActiveCall);

  const startCall = useCallback(async (recipientId: string, type: 'VOICE' | 'VIDEO') => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: type === 'VIDEO',
      });
      setLocalStream(stream);

      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      });
      peerConnectionRef.current = pc;

      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      pc.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
          setRemoteStream(event.streams[0]);
        }
      };

      const socket = getSocket();
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('call:ice', {
            recipientId,
            callId: `call_${Date.now()}`,
            candidate: event.candidate,
          });
        }
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const callId = `call_${Date.now()}`;
      socket.emit('call:initiate', {
        recipientId,
        callId,
        type,
      });

      socket.emit('call:offer', {
        recipientId,
        callId,
        sdp: offer,
      });

      setActiveCall({
        callId,
        callerId: 'me',
        callerName: 'You',
        recipientId,
        type,
        status: 'CONNECTED',
        isMuted: false,
        isVideoEnabled: type === 'VIDEO',
        isScreenSharing: false,
      });
    } catch (err) {
      console.error('Failed to start WebRTC call:', err);
    }
  }, [setActiveCall]);

  const endCall = useCallback(() => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (localStream) {
      localStream.getTracks().forEach((t) => t.stop());
      setLocalStream(null);
    }
    setRemoteStream(null);
    setActiveCall(null);
  }, [localStream, setActiveCall]);

  const toggleScreenShare = useCallback(async () => {
    try {
      if (!activeCall?.isScreenSharing) {
        const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        const screenTrack = displayStream.getVideoTracks()[0];
        
        if (peerConnectionRef.current) {
          const sender = peerConnectionRef.current.getSenders().find((s) => s.track?.kind === 'video');
          if (sender) sender.replaceTrack(screenTrack);
        }

        screenTrack.onended = () => {
          endCall();
        };
      }
    } catch (err) {
      console.error('Error toggling screen share:', err);
    }
  }, [activeCall, endCall]);

  return {
    localStream,
    remoteStream,
    startCall,
    endCall,
    toggleScreenShare,
  };
}
