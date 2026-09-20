'use client';

import React, { useEffect, useState } from 'react';
import { useChannelStore } from '@/stores/channelStore';
import { useUIStore } from '@/stores/uiStore';
import { api } from '@/lib/api';
import { Plus, CheckCircle } from 'lucide-react';

export function ChannelsTab() {
  const { channels, setChannels } = useChannelStore();
  const { setModalState } = useUIStore();
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getDiscoverChannels();
        if (res.success && res.channels) {
          setChannels(res.channels);
        }
      } catch (err) {
        console.warn('Using local fallback for channels:', err);
      }
    }
    load();
  }, [setChannels]);

  const toggleFollow = (id: string) => {
    setFollowingMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAF8F2] overflow-y-auto select-none">
      {/* Header */}
      <div className="h-[60px] px-4 border-b border-[#E2D8C7] flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">Channels</h2>
        <button
          onClick={() => setModalState('isCreateChannelOpen', true)}
          className="p-2 rounded-full text-[#1E3A8A] hover:bg-[#ECE3D4] transition-all"
          title="Create channel"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Intro Banner */}
      <div className="p-4 border-b border-[#E2D8C7]/60">
        <h3 className="text-sm font-semibold text-[#0F172A] mb-1">Stay updated on topics you care about</h3>
        <p className="text-xs text-[#64748B]">
          Find channels to follow below. Channels are public and separate from your chats.
        </p>
      </div>

      {/* Directory of Channels */}
      <div className="p-4 space-y-3">
        <h4 className="text-xs font-bold text-[#1E3A8A] uppercase tracking-wider">
          Recommended Channels
        </h4>

        <div className="space-y-2">
          {channels.map((ch) => {
            const isFollowing = followingMap[ch.id];

            return (
              <div
                key={ch.id}
                className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E2D8C7] flex items-center justify-between gap-3 transition-all hover:bg-[#FAF8F2] shadow-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-full bg-[#1E3A8A] flex items-center justify-center text-white font-bold text-base flex-shrink-0 shadow-xs">
                    {ch.name.charAt(0)}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-semibold text-[#0F172A] truncate">{ch.name}</h4>
                      {ch.isVerified && (
                        <CheckCircle className="w-3.5 h-3.5 text-[#2563EB] fill-[#2563EB]/20 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-[#64748B] truncate mt-0.5">{ch.description}</p>
                    <span className="text-[11px] text-[#94A3B8]">
                      {(ch.subscriberCount || 124000).toLocaleString()} followers
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => toggleFollow(ch.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex-shrink-0 ${
                    isFollowing
                      ? 'bg-[#FAF8F2] text-[#1E3A8A] border border-[#1E3A8A]/40'
                      : 'bg-[#1E3A8A] hover:bg-[#2563EB] text-white shadow-xs'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
