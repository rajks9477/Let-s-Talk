'use client';

import { useEffect } from 'react';
import { getSocket } from '@/lib/socket';
import { useChatStore } from '@/stores/chatStore';
import { useCallStore } from '@/stores/callStore';
import { Message } from '@/types';

export function useSocket() {
  const addMessage = useChatStore((s) => s.addMessage);
  const setTyping = useChatStore((s) => s.setTyping);
  const updateMessage = useChatStore((s) => s.updateMessage);
  const setIncomingCall = useCallStore((s) => s.setIncomingCall);

  useEffect(() => {
    const socket = getSocket();

    socket.on('message:new', (message: Message) => {
      addMessage(message.chatId, message);
    });

    socket.on('message:reaction', ({ chatId, messageId, emoji, userId, user }: any) => {
      // update reaction in store
      updateMessage(chatId, {
        id: messageId,
        reactions: [{ userId, emoji, user }],
      });
    });

    socket.on('typing:update', ({ chatId, typingUsers }: any) => {
      setTyping(chatId, typingUsers);
    });

    socket.on('call:incoming', (callData: any) => {
      setIncomingCall(callData);
    });

    return () => {
      socket.off('message:new');
      socket.off('message:reaction');
      socket.off('typing:update');
      socket.off('call:incoming');
    };
  }, [addMessage, setTyping, updateMessage, setIncomingCall]);
}
