import { create } from 'zustand';
import { StatusStory } from '../types/index';

interface StatusState {
  stories: StatusStory[];
  activeStoryIndex: number;
  isViewing: boolean;
  setStories: (stories: StatusStory[]) => void;
  openViewer: (index: number) => void;
  closeViewer: () => void;
  nextStory: () => void;
  prevStory: () => void;
}

export const useStatusStore = create<StatusState>((set, get) => ({
  stories: [],
  activeStoryIndex: 0,
  isViewing: false,

  setStories: (stories) => set({ stories }),
  openViewer: (index) => set({ activeStoryIndex: index, isViewing: true }),
  closeViewer: () => set({ isViewing: false }),
  nextStory: () => {
    const { activeStoryIndex, stories } = get();
    if (activeStoryIndex < stories.length - 1) {
      set({ activeStoryIndex: activeStoryIndex + 1 });
    } else {
      set({ isViewing: false });
    }
  },
  prevStory: () => {
    const { activeStoryIndex } = get();
    if (activeStoryIndex > 0) {
      set({ activeStoryIndex: activeStoryIndex - 1 });
    }
  },
}));
