'use client';

import React, { useState } from 'react';
import { X, Lock, CheckCircle2 } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { api } from '@/lib/api';

export function UPIPinModal() {
  const { isUPIPinOpen, setModalState } = useUIStore();
  const [pin, setPin] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isUPIPinOpen) return null;

  const handleKeyPress = (num: string) => {
    if (pin.length < 6) {
      setPin([...pin, num]);
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  const handleSubmit = async () => {
    if (pin.length !== 6) return;
    setLoading(true);

    try {
      // Simulate real sandbox transaction confirmation
      await api.transferUPI({
        receiverVpa: 'merchant.partner@upi',
        amount: 850.00,
        note: 'UPI Payment Verified',
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setPin([]);
        setModalState('isUPIPinOpen', false);
      }, 1800);
    } catch (err) {
      console.error('Payment transfer failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0A192F]/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 select-none">
      <div className="w-full max-w-sm bg-[#FAF8F2] border border-[#E2D8C7] rounded-3xl shadow-2xl p-6 text-center animate-scale-in">
        {/* Header */}
        <div className="flex justify-end mb-2">
          <button
            onClick={() => {
              setPin([]);
              setModalState('isUPIPinOpen', false);
            }}
            className="p-1 rounded-full text-[#64748B] hover:text-[#0F172A]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 flex flex-col items-center justify-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-[#1E3A8A]/10 border-2 border-[#1E3A8A] flex items-center justify-center text-[#1E3A8A] mb-4 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-[#0F172A] mb-1">Payment Successful!</h3>
            <p className="text-xs text-[#64748B]">₹ 850.00 transferred instantly via UPI</p>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 rounded-2xl bg-[#1E3A8A]/10 border border-[#1E3A8A]/30 flex items-center justify-center text-[#1E3A8A] mx-auto mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A]">Enter 6-Digit UPI PIN</h3>
            <p className="text-[11px] text-[#64748B] mb-6">Zero-PIN Storage: PIN is never sent to backend servers</p>

            {/* PIN Dots Indicator */}
            <div className="flex items-center justify-center gap-3 mb-8">
              {[0, 1, 2, 3, 4, 5].map((idx) => (
                <div
                  key={idx}
                  className={`w-3.5 h-3.5 rounded-full border transition-all ${
                    pin.length > idx
                      ? 'bg-[#1E3A8A] border-[#1E3A8A] shadow-md shadow-[#1E3A8A]/40'
                      : 'border-[#E2D8C7] bg-[#FFFFFF]'
                  }`}
                />
              ))}
            </div>

            {/* Numeric Keypad */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                <button
                  key={num}
                  onClick={() => handleKeyPress(num)}
                  className="py-3 rounded-2xl bg-[#FFFFFF] hover:bg-[#ECE3D4] text-lg font-bold text-[#0F172A] transition-all active:scale-95 border border-[#E2D8C7] shadow-xs"
                >
                  {num}
                </button>
              ))}
              <div />
              <button
                onClick={() => handleKeyPress('0')}
                className="py-3 rounded-2xl bg-[#FFFFFF] hover:bg-[#ECE3D4] text-lg font-bold text-[#0F172A] transition-all active:scale-95 border border-[#E2D8C7] shadow-xs"
              >
                0
              </button>
              <button
                onClick={handleBackspace}
                className="py-3 rounded-2xl bg-[#FFFFFF] hover:bg-rose-50 text-sm font-semibold text-rose-600 transition-all active:scale-95 border border-[#E2D8C7] shadow-xs"
              >
                ⌫
              </button>
            </div>

            <button
              onClick={handleSubmit}
              disabled={pin.length !== 6 || loading}
              className={`w-full py-3 rounded-xl text-xs font-bold transition-all shadow-md ${
                pin.length === 6
                  ? 'bg-[#1E3A8A] hover:bg-[#2563EB] text-white shadow-[#1E3A8A]/30'
                  : 'bg-[#ECE3D4] text-[#94A3B8] border border-[#E2D8C7] cursor-not-allowed'
              }`}
            >
              {loading ? 'Authorizing Bank Transfer...' : 'Authorize Transfer'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
