'use client';

import React, { useEffect, useState } from 'react';
import { X, Store, Mail, Globe } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { api } from '@/lib/api';

export function BusinessProfileModal() {
  const { isRightDrawerOpen, rightDrawerContent, closeRightDrawer } = useUIStore();
  const [biz, setBiz] = useState<any>(null);

  useEffect(() => {
    if (isRightDrawerOpen && rightDrawerContent === 'BUSINESS') {
      api.getBusinessProfile().then((res) => {
        if (res.success && res.profile) setBiz(res.profile);
      });
    }
  }, [isRightDrawerOpen, rightDrawerContent]);

  if (!isRightDrawerOpen || rightDrawerContent !== 'BUSINESS') return null;

  return (
    <aside className="w-80 md:w-96 bg-[#FAF8F2] border-l border-[#E2D8C7] flex flex-col h-full z-20 animate-fade-in overflow-y-auto">
      {/* Header */}
      <div className="h-16 px-4 border-b border-[#E2D8C7] flex items-center justify-between bg-[#FFFFFF]">
        <div className="flex items-center gap-2 text-[#1E3A8A] font-bold text-sm">
          <Store className="w-5 h-5" />
          <span>Business Profile</span>
        </div>
        <button
          onClick={closeRightDrawer}
          className="p-1.5 rounded-lg hover:bg-[#ECE3D4] text-[#64748B] hover:text-[#0F172A]"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {biz ? (
        <div className="p-5 space-y-5">
          {/* Business Banner & Info */}
          <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E2D8C7] space-y-2 shadow-xs">
            <h3 className="text-base font-bold text-[#0F172A]">{biz.businessName}</h3>
            <span className="text-xs text-[#1E3A8A] bg-[#1E3A8A]/10 px-2.5 py-0.5 rounded-full border border-[#1E3A8A]/20 inline-block font-semibold">
              {biz.category}
            </span>
            <p className="text-xs text-[#64748B] mt-2">{biz.description}</p>
          </div>

          {/* Contact Details */}
          <div className="space-y-2.5 text-xs text-[#0F172A]">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FFFFFF] border border-[#E2D8C7] shadow-xs">
              <Mail className="w-4 h-4 text-[#1E3A8A]" />
              <span>{biz.email}</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FFFFFF] border border-[#E2D8C7] shadow-xs">
              <Globe className="w-4 h-4 text-[#1E3A8A]" />
              <a href={biz.website} target="_blank" className="text-[#1E3A8A] hover:underline font-medium">
                {biz.website}
              </a>
            </div>
          </div>

          {/* Product Showcase */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#1E3A8A] uppercase tracking-wider">
              Product & Service Catalog
            </h4>

            {biz.catalogs?.[0]?.products?.map((prod: any) => (
              <div
                key={prod.id}
                className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E2D8C7] flex items-center justify-between gap-3 hover:border-[#1E3A8A] transition-all shadow-xs"
              >
                <div>
                  <h5 className="text-xs font-bold text-[#0F172A]">{prod.name}</h5>
                  <p className="text-[11px] text-[#64748B]">{prod.description}</p>
                  <span className="text-xs font-extrabold text-[#1E3A8A] mt-1 block">
                    ₹ {prod.price.toLocaleString()}
                  </span>
                </div>
                <button className="px-3 py-1.5 rounded-xl bg-[#1E3A8A] hover:bg-[#2563EB] text-white text-xs font-semibold shadow-xs">
                  Inquire
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-xs text-[#64748B]">Loading business details...</div>
      )}
    </aside>
  );
}
