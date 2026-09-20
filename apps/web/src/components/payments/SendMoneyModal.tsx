'use client';

import React, { useState } from 'react';
import { X, CreditCard, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { api } from '@/lib/api';

export function SendMoneyModal() {
  const { isSendMoneyOpen, setModalState } = useUIStore();
  const [vpa, setVpa] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [verifiedName, setVerifiedName] = useState<string | null>(null);
  const [loadingVerify, setLoadingVerify] = useState(false);

  if (!isSendMoneyOpen) return null;

  const handleVerify = async () => {
    if (!vpa.trim()) return;
    setLoadingVerify(true);
    try {
      const res = await api.verifyVPA(vpa.trim());
      if (res.success) {
        setVerifiedName(res.verifiedName);
      }
    } catch (err: any) {
      alert(err.message || 'Invalid VPA format');
    } finally {
      setLoadingVerify(false);
    }
  };

  const handleProceed = () => {
    if (!vpa || !amount || parseFloat(amount) <= 0) return;
    setModalState('isSendMoneyOpen', false);
    setModalState('isUPIPinOpen', true);
  };

  return (
    <div className="fixed inset-0 bg-[#0A192F]/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-[#FAF8F2] border border-[#E2D8C7] rounded-2xl shadow-2xl p-5 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E2D8C7] mb-4">
          <div className="flex items-center gap-2 text-[#1E3A8A] font-bold text-sm">
            <CreditCard className="w-5 h-5" />
            <span>Send Money via UPI</span>
          </div>
          <button
            onClick={() => setModalState('isSendMoneyOpen', false)}
            className="text-[#64748B] hover:text-[#0F172A] p-1 rounded-lg hover:bg-[#ECE3D4]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#64748B] mb-1">
              Recipient VPA (UPI ID)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={vpa}
                onChange={(e) => {
                  setVpa(e.target.value);
                  setVerifiedName(null);
                }}
                placeholder="e.g. rahul@okaxis or cafe@upi"
                className="flex-1 bg-[#FFFFFF] text-sm text-[#0F172A] rounded-xl px-3.5 py-2.5 border border-[#E2D8C7] focus:border-[#1E3A8A] focus:outline-none shadow-xs"
              />
              <button
                type="button"
                onClick={handleVerify}
                disabled={loadingVerify}
                className="px-3 py-2.5 bg-[#1E3A8A] hover:bg-[#2563EB] text-white text-xs font-semibold rounded-xl transition-all shadow-xs"
              >
                {loadingVerify ? 'Checking...' : 'Verify'}
              </button>
            </div>
            {verifiedName && (
              <p className="text-xs text-[#1E3A8A] font-medium mt-1 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Verified: {verifiedName}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#64748B] mb-1">Amount (₹ INR)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-[#FFFFFF] text-2xl font-bold text-[#0F172A] rounded-xl px-3.5 py-2 border border-[#E2D8C7] focus:border-[#1E3A8A] focus:outline-none shadow-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#64748B] mb-1">Note (Optional)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Dinner, Rent, Project Milestone"
              className="w-full bg-[#FFFFFF] text-xs text-[#0F172A] rounded-xl px-3.5 py-2 border border-[#E2D8C7] focus:border-[#1E3A8A] focus:outline-none shadow-xs"
            />
          </div>

          <div className="flex items-center gap-2 text-[11px] text-[#64748B] bg-[#FFFFFF] p-2.5 rounded-xl border border-[#E2D8C7]">
            <ShieldCheck className="w-4 h-4 text-[#1E3A8A] flex-shrink-0" />
            <span>Encrypted sandbox bank transfer. UPI PIN will be required on next step.</span>
          </div>

          <button
            onClick={handleProceed}
            className="w-full py-3 bg-[#1E3A8A] hover:bg-[#2563EB] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-[#1E3A8A]/20 flex items-center justify-center gap-2"
          >
            <span>Proceed to UPI PIN Authorization</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
