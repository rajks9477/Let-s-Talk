import { create } from 'zustand';
import { Chat, Message } from '../types/index';

interface ChatState {
  chats: Chat[];
  activeChat: Chat | null;
  messages: Record<string, Message[]>; // chatId -> Message[]
  searchQuery: string;
  activeFilter: 'ALL' | 'UNREAD' | 'FAVORITES' | 'GROUPS';
  typingMap: Record<string, string[]>; // chatId -> userIds
  secretCodeUnlocked: boolean;
  
  setChats: (chats: Chat[]) => void;
  setActiveChat: (chat: Chat | null) => void;
  setMessages: (chatId: string, messages: Message[]) => void;
  addMessage: (chatId: string, message: Message) => void;
  updateMessage: (chatId: string, updated: Partial<Message> & { id: string }) => void;
  setSearchQuery: (query: string) => void;
  setActiveFilter: (filter: 'ALL' | 'UNREAD' | 'FAVORITES' | 'GROUPS') => void;
  setTyping: (chatId: string, userIds: string[]) => void;
  unlockSecretCode: (unlocked: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  chats: [],
  activeChat: null,
  messages: {},
  searchQuery: '',
  activeFilter: 'ALL',
  typingMap: {},
  secretCodeUnlocked: false,

  setChats: (chats) => set({ chats }),
  setActiveChat: (activeChat) => set({ activeChat }),
  setMessages: (chatId, messages) =>
    set((state) => ({ messages: { ...state.messages, [chatId]: messages } })),
  addMessage: (chatId, message) =>
    set((state) => {
      const current = state.messages[chatId] || [];
      // avoid duplicates
      if (current.some((m) => m.id === message.id)) return state;
      return { messages: { ...state.messages, [chatId]: [...current, message] } };
    }),
  updateMessage: (chatId, updated) =>
    set((state) => {
      const current = state.messages[chatId] || [];
      return {
        messages: {
          ...state.messages,
          [chatId]: current.map((m) => (m.id === updated.id ? { ...m, ...updated } : m)),
        },
      };
    }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setActiveFilter: (activeFilter) => set({ activeFilter }),
  setTyping: (chatId, userIds) =>
    set((state) => ({ typingMap: { ...state.typingMap, [chatId]: userIds } })),
  unlockSecretCode: (secretCodeUnlocked) => set({ secretCodeUnlocked }),
}));
