'use client';

import React, { useEffect, useState } from 'react';
import { Send, QrCode, ShieldCheck, History, ArrowUpRight, Building, Plus, ChevronRight } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { api } from '@/lib/api';

export function PaymentsTab() {
  const { setModalState } = useUIStore();
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getPaymentHistory();
        if (res.success && res.history) {
          setHistory(res.history);
        }
      } catch (err) {
        console.warn('Using local fallback for payment ledger:', err);
      }
    }
    load();
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAF8F2] overflow-y-auto select-none">
      {/* Header */}
      <div className="h-[60px] px-4 border-b border-[#E2D8C7] flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">Payments</h2>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#1E3A8A] font-bold">
          <ShieldCheck className="w-4 h-4" /> BHIM UPI
        </div>
      </div>

      {/* Action Buttons: Send Payment & Scan QR */}
      <div className="p-4 grid grid-cols-2 gap-3 border-b border-[#E2D8C7]/60">
        <button
          onClick={() => setModalState('isSendMoneyOpen', true)}
          className="py-3 px-4 rounded-2xl bg-[#1E3A8A] hover:bg-[#2563EB] text-white font-bold text-[14px] flex items-center justify-center gap-2 transition-all shadow-md"
        >
          <Send className="w-4 h-4" /> Send payment
        </button>

        <button
          onClick={() => setModalState('isQRCodeOpen', true)}
          className="py-3 px-4 rounded-2xl bg-[#FFFFFF] hover:bg-[#ECE3D4] text-[#0F172A] font-semibold text-[14px] border border-[#E2D8C7] flex items-center justify-center gap-2 transition-all shadow-xs"
        >
          <QrCode className="w-4 h-4 text-[#1E3A8A]" /> Scan QR code
        </button>
      </div>

      {/* Payment Methods / Linked Banks */}
      <div className="p-4 border-b border-[#E2D8C7]/60 space-y-3">
        <h3 className="text-[13px] font-bold text-[#1E3A8A] uppercase tracking-wider">
          Payment methods
        </h3>

        <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E2D8C7] flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF8F2] border border-[#E2D8C7] flex items-center justify-center text-[#1E3A8A]">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-[15px] font-semibold text-[#0F172A]">HDFC Bank •••• 4092</h4>
              <p className="text-[12px] text-[#64748B]">Primary UPI Account • Default</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#94A3B8]" />
        </div>

        <button
          onClick={() => alert('Add bank account modal opened.')}
          className="w-full py-2.5 rounded-xl border border-dashed border-[#E2D8C7] hover:border-[#1E3A8A] text-[#1E3A8A] text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-all bg-[#FFFFFF]"
        >
          <Plus className="w-4 h-4" /> Add payment method
        </button>
      </div>

      {/* Payment History */}
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-[13px] font-bold text-[#1E3A8A] uppercase tracking-wider">
          <History className="w-4 h-4" />
          <span>Payment history</span>
        </div>

        <div className="space-y-1.5">
          {history.map((tx) => (
            <div
              key={tx.id}
              className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E2D8C7] flex items-center justify-between gap-3 shadow-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-[#FAF8F2] border border-[#E2D8C7] flex items-center justify-center text-[#1E3A8A] flex-shrink-0">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-[14px] font-semibold text-[#0F172A] truncate">{tx.vpaReceiver}</h4>
                  <p className="text-[12px] text-[#64748B] truncate">{tx.note || 'UPI Payment'}</p>
                  <span className="text-[10px] text-[#94A3B8] font-mono">UTR: {tx.referenceId}</span>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <span className="text-[15px] font-bold text-[#0F172A]">₹ {tx.amount.toFixed(2)}</span>
                <span className="block text-[11px] text-[#1E3A8A] font-bold">Completed</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
