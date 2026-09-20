'use client';

import React, { useEffect, useState } from 'react';
import { useStatusStore } from '@/stores/statusStore';
import { X, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function StatusViewerModal() {
  const { stories, activeStoryIndex, isViewing, closeViewer, nextStory, prevStory } = useStatusStore();
  const [progress, setProgress] = useState(0);

  const currentStory = stories[activeStoryIndex];

  useEffect(() => {
    if (!isViewing || !currentStory) return;

    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextStory();
          return 0;
        }
        return prev + 2; // 5 seconds per story
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isViewing, activeStoryIndex, currentStory, nextStory]);

  if (!isViewing || !currentStory) return null;

  const authorName = currentStory.user?.profile?.displayName || 'Contact';
  const gradient = currentStory.bgGradient || 'from-[#0F2744] to-[#1E3A8A]';

  return (
    <div className="fixed inset-0 bg-[#0A192F] z-50 flex flex-col items-center justify-between p-4 md:p-6 animate-fade-in select-none">
      {/* Top Header & Progress Bar */}
      <div className="w-full max-w-lg z-20 space-y-3">
        {/* Progress Bar Row */}
        <div className="flex items-center gap-1.5 w-full">
          {stories.map((s, idx) => (
            <div key={s.id} className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                style={{
                  width: `${idx < activeStoryIndex ? 100 : idx === activeStoryIndex ? progress : 0}%`,
                }}
                className="h-full bg-white transition-all duration-100"
              />
            </div>
          ))}
        </div>

        {/* Author Details */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1E3A8A] border border-white/30 flex items-center justify-center text-white font-bold text-sm">
              {authorName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="text-sm font-bold text-white leading-tight">{authorName}</h4>
              <span className="text-[11px] text-white/70">
                {currentStory.createdAt
                  ? formatDistanceToNow(new Date(currentStory.createdAt), { addSuffix: true })
                  : 'Recently'}
              </span>
            </div>
          </div>

          <button
            onClick={closeViewer}
            className="p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Story Content Slide */}
      <div
        className={`w-full max-w-lg flex-1 rounded-3xl bg-gradient-to-tr ${gradient} shadow-2xl my-4 relative flex items-center justify-center p-8 overflow-hidden`}
      >
        {/* Left & Right Tap Zones */}
        <div onClick={prevStory} className="absolute inset-y-0 left-0 w-1/3 cursor-pointer z-10" />
        <div onClick={nextStory} className="absolute inset-y-0 right-0 w-1/3 cursor-pointer z-10" />

        <p className="text-white text-center text-2xl md:text-3xl font-bold leading-relaxed z-0 select-text">
          {currentStory.content}
        </p>
      </div>

      {/* Reply to Story Footer */}
      <div className="w-full max-w-lg z-20 flex items-center gap-2">
        <input
          type="text"
          placeholder={`Reply to ${authorName}...`}
          className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 text-sm text-white placeholder-white/60 px-4 py-2.5 rounded-full focus:outline-none"
        />
        <button className="p-2.5 rounded-full bg-[#1E3A8A] hover:bg-[#2563EB] text-white shadow-lg shadow-[#1E3A8A]/30">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
