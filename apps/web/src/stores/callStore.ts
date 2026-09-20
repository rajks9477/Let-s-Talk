import { create } from 'zustand';
import { CallSession } from '../types/index';

interface CallState {
  currentCall: CallSession | null;
  incomingCall: {
    callId: string;
    callerId: string;
    callerName: string;
    callerAvatar?: string;
    type: 'VOICE' | 'VIDEO';
  } | null;
  callHistory: any[];

  setCurrentCall: (call: CallSession | null) => void;
  setIncomingCall: (call: CallState['incomingCall']) => void;
  setCallHistory: (history: any[]) => void;
  toggleMute: () => void;
  toggleVideo: () => void;
  toggleScreenShare: () => void;
}

export const useCallStore = create<CallState>((set) => ({
  currentCall: null,
  incomingCall: null,
  callHistory: [],

  setCurrentCall: (currentCall) => set({ currentCall }),
  setIncomingCall: (incomingCall) => set({ incomingCall }),
  setCallHistory: (callHistory) => set({ callHistory }),
  toggleMute: () =>
    set((state) =>
      state.currentCall
        ? { currentCall: { ...state.currentCall, isMuted: !state.currentCall.isMuted } }
        : state
    ),
  toggleVideo: () =>
    set((state) =>
      state.currentCall
        ? { currentCall: { ...state.currentCall, isVideoEnabled: !state.currentCall.isVideoEnabled } }
        : state
    ),
  toggleScreenShare: () =>
    set((state) =>
      state.currentCall
        ? { currentCall: { ...state.currentCall, isScreenSharing: !state.currentCall.isScreenSharing } }
        : state
    ),
}));
