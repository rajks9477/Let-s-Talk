'use client';

import React, { useState } from 'react';
import { Poll } from '@/types';
import { CheckCircle2, Circle, Vote } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';

interface Props {
  poll: Poll;
}

export function PollBubble({ poll }: Props) {
  const { user } = useAuthStore();
  const [localPoll, setLocalPoll] = useState<Poll>(poll);
  const currentUserId = user?.id || 'me';

  const totalVotes = localPoll.options.reduce((acc, opt) => acc + (opt.votes?.length || 0), 0);

  const handleVote = async (optionId: string) => {
    try {
      // Optimistic vote update
      setLocalPoll((prev) => ({
        ...prev,
        options: prev.options.map((opt) => {
          if (opt.id === optionId) {
            const hasVoted = opt.votes?.some((v) => v.userId === currentUserId);
            return {
              ...opt,
              votes: hasVoted
                ? opt.votes.filter((v) => v.userId !== currentUserId)
                : [...(opt.votes || []), { userId: currentUserId }],
            };
          }
          return prev.isMultipleChoice
            ? opt
            : { ...opt, votes: (opt.votes || []).filter((v) => v.userId !== currentUserId) };
        }),
      }));

      await api.votePoll(localPoll.id, optionId);
    } catch (err) {
      console.error('Error voting in poll:', err);
    }
  };

  return (
    <div className="flex flex-col gap-3 min-w-[240px] max-w-[340px] p-1">
      {/* Poll Header */}
      <div className="flex items-start gap-2">
        <Vote className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-semibold text-inherit leading-snug">{localPoll.question}</h4>
          <span className="text-[10px] opacity-75">
            {localPoll.isMultipleChoice ? 'Select one or more' : 'Select one option'} • {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
          </span>
        </div>
      </div>

      {/* Options List */}
      <div className="flex flex-col gap-2">
        {localPoll.options.map((opt) => {
          const voteCount = opt.votes?.length || 0;
          const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
          const isVotedByMe = opt.votes?.some((v) => v.userId === currentUserId);

          return (
            <button
              key={opt.id}
              onClick={() => handleVote(opt.id)}
              className="relative overflow-hidden w-full p-2.5 rounded-xl bg-black/5 hover:bg-black/10 border border-black/10 text-left transition-all"
            >
              {/* Animated Progress Fill Bar */}
              <div
                style={{ width: `${percentage}%` }}
                className="absolute inset-y-0 left-0 bg-[#1E3A8A]/20 transition-all duration-300 pointer-events-none"
              />

              <div className="relative z-10 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-medium">
                  {isVotedByMe ? (
                    <CheckCircle2 className="w-4 h-4 text-[#1E3A8A] fill-[#1E3A8A]/20" />
                  ) : (
                    <Circle className="w-4 h-4 opacity-50" />
                  )}
                  <span>{opt.text}</span>
                </div>
                <span className="text-xs font-semibold opacity-75">{percentage}%</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
