'use client';

import React from 'react';
import { Users, Megaphone, ChevronRight } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useChatStore } from '@/stores/chatStore';

export function CommunitiesTab() {
  const { setModalState } = useUIStore();
  const { setActiveChat } = useChatStore();

  const demoCommunities = [
    {
      id: 'comm_1',
      name: 'Acme Global Workspace',
      description: 'Official community hub for all team chapters and announcements.',
      groups: [
        { id: 'g_ann', name: 'Announcements', isAnnouncement: true, lastMsg: 'Keynote starts in 15 mins!' },
        { id: 'g_eng', name: 'Core Engineering', lastMsg: 'Release v2.4 deployed to staging!' },
        { id: 'g_des', name: 'Product & UX Design', lastMsg: 'New Figma tokens published.' },
      ],
    },
    {
      id: 'comm_2',
      name: 'Developers India Network',
      description: 'Open community for developers building web, AI, and cloud apps.',
      groups: [
        { id: 'g_in_ann', name: 'Announcements', isAnnouncement: true, lastMsg: 'Hackathon registration open!' },
        { id: 'g_next', name: 'Next.js & React Hub', lastMsg: 'Next.js 15 preview discussion.' },
      ],
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAF8F2] overflow-y-auto select-none">
      {/* Header */}
      <div className="h-[60px] px-4 border-b border-[#E2D8C7] flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">Communities</h2>
      </div>

      {/* New Community Hero Button */}
      <div
        onClick={() => setModalState('isCreateGroupOpen', true)}
        className="p-4 flex items-center gap-3.5 hover:bg-[#ECE3D4] cursor-pointer transition-colors border-b border-[#E2D8C7]/60"
      >
        <div className="w-[49px] h-[49px] rounded-2xl bg-[#1E3A8A] flex items-center justify-center text-white shadow-md flex-shrink-0">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-[15.5px] font-semibold text-[#0F172A]">New community</h4>
          <p className="text-[13px] text-[#64748B]">Organize related groups and send announcements</p>
        </div>
      </div>

      {/* Community Hubs List */}
      <div className="p-4 space-y-4">
        {demoCommunities.map((comm) => (
          <div key={comm.id} className="bg-[#FFFFFF] rounded-2xl p-4 border border-[#E2D8C7] space-y-3 shadow-xs">
            {/* Community Header */}
            <div className="flex items-center gap-3 border-b border-[#E2D8C7] pb-3">
              <div className="w-11 h-11 rounded-xl bg-[#1E3A8A] flex items-center justify-center text-white font-bold text-sm shadow-xs">
                {comm.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[15px] font-semibold text-[#0F172A] truncate">{comm.name}</h4>
                <p className="text-[12px] text-[#64748B] truncate">{comm.description}</p>
              </div>
            </div>

            {/* Sub-groups */}
            <div className="space-y-1">
              {comm.groups.map((grp) => (
                <div
                  key={grp.id}
                  onClick={() => {
                    setActiveChat({
                      id: grp.id,
                      name: `${comm.name} - ${grp.name}`,
                      type: 'GROUP',
                      members: [],
                    });
                  }}
                  className="p-2.5 rounded-xl hover:bg-[#FAF8F2] flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {grp.isAnnouncement ? (
                      <Megaphone className="w-4 h-4 text-[#1E3A8A] flex-shrink-0" />
                    ) : (
                      <Users className="w-4 h-4 text-[#64748B] flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                      <h5 className="text-[14px] font-medium text-[#0F172A] truncate">{grp.name}</h5>
                      <p className="text-[12px] text-[#64748B] truncate">{grp.lastMsg}</p>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-[#94A3B8] flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
