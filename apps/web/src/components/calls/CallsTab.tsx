'use client';

import React from 'react';
import { Phone, Video, Link, ArrowDownLeft, ArrowUpRight, PhoneMissed } from 'lucide-react';
import { useWebRTC } from '@/hooks/useWebRTC';

export function CallsTab() {
  const { startCall } = useWebRTC();

  const demoCalls = [
    {
      id: 'c1',
      name: 'Sarah Jenkins',
      type: 'VIDEO',
      direction: 'INCOMING',
      time: 'Today, 11:32 AM',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
    {
      id: 'c2',
      name: 'Core Engineering Group',
      type: 'VOICE',
      direction: 'OUTGOING',
      time: 'Yesterday, 4:15 PM',
      avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150',
    },
    {
      id: 'c3',
      name: 'David Miller',
      type: 'VIDEO',
      direction: 'MISSED',
      time: '18/09/2026',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAF8F2] overflow-y-auto select-none">
      {/* Header */}
      <div className="h-[60px] px-4 border-b border-[#E2D8C7] flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">Calls</h2>
      </div>

      {/* Create Call Link Card */}
      <div className="p-4 flex items-center gap-3.5 hover:bg-[#ECE3D4] cursor-pointer transition-colors border-b border-[#E2D8C7]/60">
        <div className="w-[49px] h-[49px] rounded-full bg-[#1E3A8A] flex items-center justify-center text-white shadow-md flex-shrink-0">
          <Link className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-[15.5px] font-semibold text-[#0F172A]">Create call link</h4>
          <p className="text-[13px] text-[#64748B]">Share a link for your Let's Talk call</p>
        </div>
      </div>

      {/* Recent Calls List */}
      <div className="p-4 space-y-3">
        <h3 className="text-[13px] font-bold text-[#1E3A8A] uppercase tracking-wider">
          Recent
        </h3>

        <div className="space-y-1">
          {demoCalls.map((call) => (
            <div
              key={call.id}
              className="p-3 rounded-2xl hover:bg-[#ECE3D4] flex items-center justify-between gap-3 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-[49px] h-[49px] rounded-full bg-[#ECE3D4] overflow-hidden flex items-center justify-center text-[#0F2744] font-semibold flex-shrink-0 border border-[#E2D8C7]">
                  <img src={call.avatar} alt={call.name} className="w-full h-full object-cover" />
                </div>

                <div className="min-w-0">
                  <h4 className={`text-[15px] font-semibold truncate ${call.direction === 'MISSED' ? 'text-rose-600' : 'text-[#0F172A]'}`}>
                    {call.name}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[13px] text-[#64748B] mt-0.5">
                    {call.direction === 'INCOMING' && <ArrowDownLeft className="w-3.5 h-3.5 text-[#1E3A8A]" />}
                    {call.direction === 'OUTGOING' && <ArrowUpRight className="w-3.5 h-3.5 text-[#1E3A8A]" />}
                    {call.direction === 'MISSED' && <PhoneMissed className="w-3.5 h-3.5 text-rose-500" />}
                    <span>{call.time}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => startCall('usr_demo', call.type as any)}
                className="p-2.5 rounded-full hover:bg-[#ECE3D4] text-[#1E3A8A] transition-all flex-shrink-0"
              >
                {call.type === 'VIDEO' ? <Video className="w-5 h-5" /> : <Phone className="w-5 h-5" />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
