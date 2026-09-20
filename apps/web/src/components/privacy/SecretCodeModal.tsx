'use client';

import React, { useState } from 'react';
import { X, Lock, KeyRound } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useChatStore } from '@/stores/chatStore';
import { api } from '@/lib/api';

export function SecretCodeModal() {
  const { isSecretCodeModalOpen, setModalState } = useUIStore();
  const { unlockSecretCode } = useChatStore();
  const [code, setCode] = useState('');
  const [isSettingMode, setIsSettingMode] = useState(false);
  const [newCode, setNewCode] = useState('');

  if (!isSecretCodeModalOpen) return null;

  const handleUnlock = () => {
    if (code === '7777' || code.toLowerCase() === 'secret') {
      unlockSecretCode(true);
      setModalState('isSecretCodeModalOpen', false);
      setCode('');
    } else {
      alert('Incorrect Secret Code. Tip: Default demo code is "7777" or "secret"');
    }
  };

  const handleSaveSecretCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    try {
      await api.setSecretCode(newCode.trim());
      alert('New Secret Code successfully saved! You can also type this directly into the search bar to unlock hidden chats.');
      setIsSettingMode(false);
    } catch (err) {
      console.error('Failed to save secret code:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0A192F]/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 select-none">
      <div className="w-full max-w-sm bg-[#FAF8F2] border border-[#E2D8C7] rounded-3xl shadow-2xl p-6 text-center animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E2D8C7] mb-4">
          <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
            <Lock className="w-5 h-5 text-amber-500" />
            <span>{isSettingMode ? 'Configure Secret Code' : 'Locked Chats Vault'}</span>
          </div>
          <button
            onClick={() => setModalState('isSecretCodeModalOpen', false)}
            className="p-1 rounded-full text-[#64748B] hover:text-[#0F172A] hover:bg-[#ECE3D4]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isSettingMode ? (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 mx-auto">
              <KeyRound className="w-6 h-6" />
            </div>

            <div>
              <h4 className="text-sm font-bold text-[#0F172A]">Enter Secret Code</h4>
              <p className="text-xs text-[#64748B] mt-0.5">
                Type secret passcode to reveal hidden conversations
              </p>
            </div>

            <input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
              placeholder="e.g. 7777"
              className="w-full bg-[#FFFFFF] text-center font-mono text-lg font-bold text-[#0F172A] rounded-xl py-2.5 border border-[#E2D8C7] focus:border-amber-500 focus:outline-none shadow-xs"
              autoFocus
            />

            <button
              onClick={handleUnlock}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 transition-all"
            >
              Unlock Locked Chats
            </button>

            <button
              onClick={() => setIsSettingMode(true)}
              className="text-xs text-[#1E3A8A] hover:underline font-semibold transition-colors"
            >
              Change / Setup Secret Code
            </button>
          </div>
        ) : (
          <form onSubmit={handleSaveSecretCode} className="space-y-4">
            <p className="text-xs text-[#64748B]">
              Choose a custom word, emoji or number to hide your locked chats.
            </p>

            <input
              type="text"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              placeholder="Enter new Secret Code..."
              className="w-full bg-[#FFFFFF] text-center font-mono text-sm font-bold text-[#0F172A] rounded-xl py-2.5 border border-[#E2D8C7] focus:border-[#1E3A8A] focus:outline-none shadow-xs"
              required
            />

            <button
              type="submit"
              className="w-full py-2.5 bg-[#1E3A8A] hover:bg-[#2563EB] text-white font-bold text-xs rounded-xl shadow-md shadow-[#1E3A8A]/20 transition-all"
            >
              Save Secret Code
            </button>

            <button
              type="button"
              onClick={() => setIsSettingMode(false)}
              className="text-xs text-[#64748B] hover:text-[#0F172A]"
            >
              Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
