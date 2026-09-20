'use client';

import React, { useState } from 'react';
import { Event } from '@/types';
import { MapPin, Check, X, HelpCircle, Bell } from 'lucide-react';
import { api } from '@/lib/api';
import { format } from 'date-fns';
import { useAuthStore } from '@/stores/authStore';

interface Props {
  event: Event;
}

export function EventBubble({ event }: Props) {
  const { user } = useAuthStore();
  const currentUserId = user?.id || 'me';
  const myParticipant = event.participants?.find((p) => p.userId === currentUserId);
  const [currentRsvp, setCurrentRsvp] = useState<string>(myParticipant?.rsvp || 'GOING');

  const handleRsvp = async (rsvp: 'GOING' | 'NOT_GOING' | 'MAYBE') => {
    setCurrentRsvp(rsvp);
    try {
      await api.rsvpEvent(event.id, rsvp);
    } catch (err) {
      console.error('RSVP update failed:', err);
    }
  };

  const goingCount = event.participants?.filter((p) => p.rsvp === 'GOING').length || 1;

  return (
    <div className="flex flex-col gap-3 min-w-[260px] max-w-[340px] p-2.5 bg-black/5 rounded-xl border border-black/10">
      {/* Event Header Banner */}
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-[#1E3A8A] border border-[#1E3A8A]/40 flex flex-col items-center justify-center text-white font-bold shadow-xs">
          <span className="text-[10px] uppercase font-semibold text-[#93C5FD]">
            {format(new Date(event.startTime), 'MMM')}
          </span>
          <span className="text-base leading-none">{format(new Date(event.startTime), 'dd')}</span>
        </div>

        <div className="flex-1">
          <h4 className="text-sm font-bold text-inherit leading-tight">{event.title}</h4>
          <p className="text-xs text-[#2563EB] font-medium mt-0.5">
            {format(new Date(event.startTime), 'EEEE, h:mm a')}
          </p>
        </div>
      </div>

      {/* Description & Location */}
      {event.description && <p className="text-xs opacity-90">{event.description}</p>}

      {event.location && (
        <div className="flex items-center gap-1.5 text-xs opacity-75">
          <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
          <span className="truncate">{event.location}</span>
        </div>
      )}

      {/* RSVP Action Buttons */}
      <div className="pt-2 border-t border-black/10 flex items-center justify-between gap-1">
        <button
          onClick={() => handleRsvp('GOING')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
            currentRsvp === 'GOING'
              ? 'bg-[#1E3A8A] text-white shadow-xs'
              : 'bg-black/5 hover:bg-black/10 opacity-75'
          }`}
        >
          <Check className="w-3.5 h-3.5" /> Going
        </button>

        <button
          onClick={() => handleRsvp('MAYBE')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
            currentRsvp === 'MAYBE'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'bg-black/5 hover:bg-black/10 opacity-75'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" /> Maybe
        </button>

        <button
          onClick={() => handleRsvp('NOT_GOING')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
            currentRsvp === 'NOT_GOING'
              ? 'bg-rose-500 text-white shadow-xs'
              : 'bg-black/5 hover:bg-black/10 opacity-75'
          }`}
        >
          <X className="w-3.5 h-3.5" /> Can't Go
        </button>
      </div>

      <div className="flex items-center justify-between text-[10px] opacity-75 px-1">
        <span>{goingCount} {goingCount === 1 ? 'person' : 'people'} going</span>
        <span className="flex items-center gap-1">
          <Bell className="w-3 h-3 text-[#1E3A8A]" /> Reminder 30m prior
        </span>
      </div>
    </div>
  );
}
