import { create } from 'zustand';
import { Channel } from '../types/index';

interface ChannelState {
  channels: Channel[];
  selectedChannel: Channel | null;
  setChannels: (channels: Channel[]) => void;
  setSelectedChannel: (channel: Channel | null) => void;
}

export const useChannelStore = create<ChannelState>((set) => ({
  channels: [],
  selectedChannel: null,
  setChannels: (channels) => set({ channels }),
  setSelectedChannel: (selectedChannel) => set({ selectedChannel }),
}));
