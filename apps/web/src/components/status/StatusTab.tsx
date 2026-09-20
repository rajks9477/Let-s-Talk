'use client';

import React, { useEffect } from 'react';
import { useStatusStore } from '@/stores/statusStore';
import { useUIStore } from '@/stores/uiStore';
import { api } from '@/lib/api';
import { Camera, MoreVertical, Lock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function StatusTab() {
  const { stories, setStories, openViewer } = useStatusStore();
  const { setModalState } = useUIStore();

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getStatusFeed();
        if (res.success && res.feed) {
          setStories(res.feed);
        }
      } catch (err) {
        console.warn('Using local fallback for status stories:', err);
      }
    }
    load();
  }, [setStories]);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAF8F2] overflow-y-auto select-none">
      {/* Header */}
      <div className="h-[60px] px-4 border-b border-[#E2D8C7] flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">Status</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setModalState('isStatusCreatorOpen', true)}
            className="p-2 rounded-full text-[#1E3A8A] hover:bg-[#ECE3D4] transition-all"
            title="Add status"
          >
            <Camera className="w-5 h-5" />
          </button>
          <button
            className="p-2 rounded-full text-[#1E3A8A] hover:bg-[#ECE3D4] transition-all"
            title="Status privacy"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* My Status Card */}
      <div
        onClick={() => setModalState('isStatusCreatorOpen', true)}
        className="px-4 py-3 flex items-center gap-3.5 hover:bg-[#ECE3D4] cursor-pointer transition-colors border-b border-[#E2D8C7]/60"
      >
        <div className="relative flex-shrink-0">
          <div className="w-[49px] h-[49px] rounded-full bg-[#E2D8C7] flex items-center justify-center text-[#0F2744] font-bold text-base border border-[#ECE3D4]">
            You
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-[#1E3A8A] rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-[#FAF8F2]">
            +
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-[15.5px] font-semibold text-[#0F172A]">My status</h4>
          <p className="text-[13px] text-[#64748B]">Tap to add status update</p>
        </div>
      </div>

      {/* Recent Updates List */}
      <div className="p-4">
        <h3 className="text-[13px] font-bold text-[#1E3A8A] uppercase tracking-wider mb-3">
          Recent updates
        </h3>

        <div className="space-y-1">
          {stories.map((story, idx) => {
            const authorName = story.user?.profile?.displayName || 'Contact';

            return (
              <div
                key={story.id}
                onClick={() => openViewer(idx)}
                className="p-2.5 rounded-xl hover:bg-[#ECE3D4] flex items-center gap-3.5 cursor-pointer transition-colors"
              >
                {/* Navy Ring around Status Avatar */}
                <div className="w-[52px] h-[52px] rounded-full p-0.5 border-2 border-[#1E3A8A] flex items-center justify-center flex-shrink-0">
                  <div className="w-full h-full rounded-full bg-[#E2D8C7] flex items-center justify-center text-[#0F2744] font-bold text-sm">
                    {authorName.charAt(0).toUpperCase()}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-[15.5px] font-semibold text-[#0F172A] truncate">{authorName}</h4>
                  <p className="text-[13px] text-[#64748B]">
                    {story.createdAt
                      ? formatDistanceToNow(new Date(story.createdAt), { addSuffix: true })
                      : 'Today'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Encryption Notice Footer */}
      <div className="mt-auto p-4 flex items-center justify-center gap-1.5 text-xs text-[#94A3B8]">
        <Lock className="w-3.5 h-3.5" />
        <span>Your status updates are end-to-end encrypted</span>
      </div>
    </div>
  );
}
