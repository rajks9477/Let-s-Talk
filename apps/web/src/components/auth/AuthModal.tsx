'use client';

import React, { useState } from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';
import { api } from '@/lib/api';

export function AuthModal() {
  const { isAuthModalOpen, setModalState } = useUIStore();
  const { user, setUser } = useAuthStore();
  const [step, setStep] = useState<'PHONE' | 'OTP' | 'PROFILE'>('PHONE');
  const [phoneNumber, setPhoneNumber] = useState('9876543210');
  const [countryCode, setCountryCode] = useState('+91');
  const [otp, setOtp] = useState('123456');
  const [displayName, setDisplayName] = useState(user?.profile?.displayName || 'Alex Rivera');
  const [bio, setBio] = useState(user?.profile?.bio || "Hey there! I am using Let's Talk.");
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;
    setLoading(true);

    try {
      const res = await api.requestOtp(phoneNumber.trim(), countryCode);
      if (res.success) {
        setOtp(res.sandboxCode || '123456');
        setStep('OTP');
      }
    } catch (err) {
      console.error('OTP request error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) return;
    setLoading(true);

    try {
      const res = await api.verifyOtp(phoneNumber.trim(), countryCode, otp.trim());
      if (res.success && res.user) {
        setUser(res.user, res.token);
        setStep('PROFILE');
      }
    } catch (err: any) {
      alert(err.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;
    setLoading(true);

    try {
      await api.onboard({
        displayName: displayName.trim(),
        bio: bio.trim(),
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName.trim()}`,
      });

      if (user) {
        setUser({
          ...user,
          profile: {
            displayName: displayName.trim(),
            bio: bio.trim(),
            avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName.trim()}`,
          },
        });
      }
      setModalState('isAuthModalOpen', false);
    } catch (err) {
      console.error('Onboarding failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0A192F]/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 select-none">
      <div className="w-full max-w-sm bg-[#FAF8F2] border border-[#E2D8C7] rounded-3xl shadow-2xl p-6 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E2D8C7] mb-4">
          <div className="flex items-center gap-2 text-[#1E3A8A] font-bold text-sm">
            <ShieldCheck className="w-5 h-5" />
            <span>
              {step === 'PHONE'
                ? 'Sign in to Let\'s Talk'
                : step === 'OTP'
                ? 'Enter Verification Code'
                : 'Complete Your Profile'}
            </span>
          </div>
          <button
            onClick={() => setModalState('isAuthModalOpen', false)}
            className="p-1 rounded-full text-[#64748B] hover:text-[#0F172A] hover:bg-[#ECE3D4]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Phone */}
        {step === 'PHONE' && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <p className="text-xs text-[#64748B]">
              Enter your mobile number to receive a verification code via SMS or Passkey.
            </p>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-16 bg-[#FFFFFF] text-center font-mono text-xs font-bold text-[#0F172A] rounded-xl py-2.5 border border-[#E2D8C7] focus:border-[#1E3A8A] focus:outline-none shadow-xs"
              />
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Phone number"
                className="flex-1 bg-[#FFFFFF] font-mono text-sm text-[#0F172A] rounded-xl px-3.5 py-2.5 border border-[#E2D8C7] focus:border-[#1E3A8A] focus:outline-none shadow-xs"
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#1E3A8A] hover:bg-[#2563EB] text-white font-bold text-xs rounded-xl shadow-md shadow-[#1E3A8A]/20 transition-all"
            >
              {loading ? 'Sending Code...' : 'Next'}
            </button>
          </form>
        )}

        {/* Step 2: OTP */}
        {step === 'OTP' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <p className="text-xs text-[#64748B]">
              Code sent to <span className="font-mono text-[#0F172A] font-bold">{countryCode} {phoneNumber}</span>
            </p>

            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              className="w-full bg-[#FFFFFF] text-center font-mono text-2xl tracking-widest font-bold text-[#1E3A8A] rounded-xl py-2.5 border border-[#E2D8C7] focus:border-[#1E3A8A] focus:outline-none shadow-xs"
              required
              autoFocus
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#1E3A8A] hover:bg-[#2563EB] text-white font-bold text-xs rounded-xl shadow-md shadow-[#1E3A8A]/20 transition-all"
            >
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>

            <button
              type="button"
              onClick={() => setStep('PHONE')}
              className="w-full text-center text-xs text-[#64748B] hover:text-[#0F172A]"
            >
              Edit phone number
            </button>
          </form>
        )}

        {/* Step 3: Profile */}
        {step === 'PROFILE' && (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="flex flex-col items-center mb-2">
              <div className="w-16 h-16 rounded-full bg-[#ECE3D4] border-2 border-[#1E3A8A] flex items-center justify-center font-bold text-xl text-[#1E3A8A] mb-2 shadow-xs">
                {displayName ? displayName.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="text-[11px] text-[#1E3A8A] font-bold">Avatar preview</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#64748B] mb-1">Your Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Type your name"
                className="w-full bg-[#FFFFFF] text-sm text-[#0F172A] rounded-xl px-3.5 py-2 border border-[#E2D8C7] focus:border-[#1E3A8A] focus:outline-none shadow-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#64748B] mb-1">About / Bio</label>
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Hey there! I am using Let's Talk."
                className="w-full bg-[#FFFFFF] text-xs text-[#0F172A] rounded-xl px-3.5 py-2 border border-[#E2D8C7] focus:border-[#1E3A8A] focus:outline-none shadow-xs"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#1E3A8A] hover:bg-[#2563EB] text-white font-bold text-xs rounded-xl shadow-md shadow-[#1E3A8A]/20 transition-all"
            >
              {loading ? 'Saving...' : 'Finish & Start Chatting'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
