'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, ShieldCheck, ChevronDown, Check, ArrowLeft, RefreshCw, Smartphone, Camera, User, HelpCircle } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';
import { api } from '@/lib/api';

const COUNTRIES = [
  { name: 'India', code: '+91', flag: '🇮🇳' },
  { name: 'United States', code: '+1', flag: '🇺🇸' },
  { name: 'United Kingdom', code: '+44', flag: '🇬🇧' },
  { name: 'United Arab Emirates', code: '+971', flag: '🇦🇪' },
  { name: 'Saudi Arabia', code: '+966', flag: '🇸🇦' },
  { name: 'Canada', code: '+1', flag: '🇨🇦' },
  { name: 'Australia', code: '+61', flag: '🇦🇺' },
  { name: 'Germany', code: '+49', flag: '🇩🇪' },
  { name: 'France', code: '+33', flag: '🇫🇷' },
  { name: 'Singapore', code: '+65', flag: '🇸🇬' },
  { name: 'Nepal', code: '+977', flag: '🇳🇵' },
  { name: 'Bangladesh', code: '+880', flag: '🇧🇩' },
];

export function AuthModal() {
  const { isAuthModalOpen, setModalState } = useUIStore();
  const { user, setUser } = useAuthStore();

  const [step, setStep] = useState<'PHONE' | 'OTP' | 'PROFILE'>('PHONE');
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');

  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [receivedOtpBanner, setReceivedOtpBanner] = useState<string | null>(null);

  const [displayName, setDisplayName] = useState(user?.profile?.displayName || '');
  const [bio, setBio] = useState(user?.profile?.bio || "Hey there! I am using Let's Talk.");
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [smsStatusNotice, setSmsStatusNotice] = useState('');

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for OTP Resend
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'OTP' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  if (!isAuthModalOpen) return null;

  // 1. Send OTP Request
  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanNum = phoneNumber.replace(/\D/g, '');
    if (cleanNum.length < 7) {
      setErrorMsg('Please enter a valid mobile number');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.requestOtp(cleanNum, selectedCountry.code);
      if (res.success) {
        setStep('OTP');
        setTimer(60);
        setCanResend(false);
        setOtpDigits(['', '', '', '', '', '']);
        setSmsStatusNotice(`SMS verification code dispatched to ${selectedCountry.code} ${cleanNum}`);

        const otpCode = res.sandboxCode || '123456';

        // Trigger phone vibration on mobile devices
        if (typeof window !== 'undefined' && 'vibrate' in navigator) {
          try {
            navigator.vibrate([150, 60, 150]);
          } catch {}
        }

        // Trigger native browser notification if available
        if (typeof window !== 'undefined' && 'Notification' in window) {
          if (Notification.permission === 'granted') {
            new Notification("Let's Talk Verification", {
              body: `${otpCode} is your Let's Talk verification code.`,
              icon: '/favicon.ico',
            });
          } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then((permission) => {
              if (permission === 'granted') {
                new Notification("Let's Talk Verification", {
                  body: `${otpCode} is your Let's Talk verification code.`,
                  icon: '/favicon.ico',
                });
              }
            });
          }
        }

        // Show Instant Dropdown SMS Push Banner
        setTimeout(() => {
          setReceivedOtpBanner(otpCode);
        }, 600);

        setTimeout(() => {
          otpInputRefs.current[0]?.focus();
        }, 150);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send verification SMS.');
    } finally {
      setLoading(false);
    }
  };

  // Auto-fill from received SMS banner
  const handleAutoFillFromBanner = (code: string) => {
    const digits = code.split('').slice(0, 6);
    setOtpDigits(digits);
    setReceivedOtpBanner(null);
    handleVerifyOtp(code);
  };

  // 2. Handle 6-Digit OTP Box Change
  const handleOtpChange = (index: number, val: string) => {
    const digit = val.replace(/\D/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);

    // Auto-advance to next box
    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // If all 6 digits filled, auto-trigger verification
    const fullOtp = newDigits.join('');
    if (fullOtp.length === 6 && !newDigits.includes('')) {
      handleVerifyOtp(fullOtp);
    }
  };

  // Handle Backspace in OTP Box
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Handle Paste OTP
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const newDigits = ['', '', '', '', '', ''];
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    setOtpDigits(newDigits);

    if (pasted.length === 6) {
      handleVerifyOtp(pasted);
    } else {
      otpInputRefs.current[pasted.length]?.focus();
    }
  };

  // 3. Verify OTP
  const handleVerifyOtp = async (codeToVerify?: string) => {
    const code = codeToVerify || otpDigits.join('');
    if (code.length < 6) {
      setErrorMsg('Please enter the 6-digit code received on your mobile');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const cleanNum = phoneNumber.replace(/\D/g, '');
      const res = await api.verifyOtp(cleanNum, selectedCountry.code, code);
      if (res.success && res.user) {
        setUser(res.user, res.token);
        setDisplayName(res.user.profile?.displayName || `User ${cleanNum.slice(-4)}`);
        setBio(res.user.profile?.bio || "Hey there! I am using Let's Talk.");
        setAvatarUrl(res.user.profile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanNum}`);
        setStep('PROFILE');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Wrong code. Please check your SMS or resend code.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Save Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      setErrorMsg('Please enter your profile name');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const finalAvatar = avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName.trim()}`;
      await api.onboard({
        displayName: displayName.trim(),
        bio: bio.trim(),
        avatarUrl: finalAvatar,
      });

      if (user) {
        setUser({
          ...user,
          profile: {
            displayName: displayName.trim(),
            bio: bio.trim(),
            avatarUrl: finalAvatar,
          },
        });
      }
      setModalState('isAuthModalOpen', false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.code.includes(countrySearch)
  );

  return (
    <div className="fixed inset-0 bg-[#0F2744]/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 select-none animate-in fade-in duration-200">
      {/* Real Incoming Mobile SMS Dropdown Banner */}
      {receivedOtpBanner && (
        <div
          onClick={() => handleAutoFillFromBanner(receivedOtpBanner)}
          className="fixed top-5 left-4 right-4 max-w-md mx-auto z-[60] bg-[#1E293B]/95 backdrop-blur-md text-white border border-white/20 p-3.5 rounded-2xl shadow-2xl flex items-start gap-3 cursor-pointer hover:scale-[1.02] transition-all animate-in slide-in-from-top-6 duration-300 ring-2 ring-emerald-500/40"
        >
          <div className="w-9 h-9 rounded-xl bg-[#1E3A8A] flex items-center justify-center flex-shrink-0 text-white shadow-md">
            <Smartphone className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between text-[11px] text-white/70 font-semibold mb-0.5">
              <span>MESSAGES • now</span>
              <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md">Tap to autofill ⚡</span>
            </div>
            <p className="text-xs font-semibold text-white leading-tight">
              <strong>Let's Talk:</strong> Your verification code is <span className="font-mono font-black text-amber-300 tracking-wider text-sm">{receivedOtpBanner}</span>.
            </p>
          </div>
        </div>
      )}

      <div className="w-full max-w-md bg-[#FAF8F2] border border-[#E2D8C7] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* WhatsApp Top Banner */}
        <div className="bg-[#0F2744] text-[#FAF8F2] p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            {step !== 'PHONE' && (
              <button
                onClick={() => setStep('PHONE')}
                className="p-1 rounded-full text-[#FAF8F2]/80 hover:text-white hover:bg-white/10 transition-all mr-1"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="w-8 h-8 rounded-full bg-[#1E3A8A] flex items-center justify-center text-white border border-[#F5EFE6]/20">
              <ShieldCheck className="w-4 h-4 text-[#FAF8F2]" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight">
                {step === 'PHONE' && 'Verify your phone number'}
                {step === 'OTP' && 'Verifying your number'}
                {step === 'PROFILE' && 'Profile info'}
              </h3>
              <p className="text-[11px] text-[#E2D8C7]/70">Let's Talk SuperApp Secure Authentication</p>
            </div>
          </div>

          <button
            onClick={() => setModalState('isAuthModalOpen', false)}
            className="p-1.5 rounded-full text-[#FAF8F2]/70 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="bg-red-50 border-b border-red-200 text-red-700 px-4 py-2.5 text-xs font-semibold flex items-center justify-between animate-in slide-in-from-top-1">
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg('')} className="text-red-500 hover:text-red-800">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ================= STEP 1: PHONE NUMBER ================= */}
        {step === 'PHONE' && (
          <form onSubmit={handleRequestOtp} className="p-6 space-y-5">
            <div className="text-center space-y-1">
              <p className="text-xs text-[#64748B] leading-relaxed">
                Let's Talk will send an SMS message to verify your phone number. Carrier SMS charges may apply.
              </p>
            </div>

            {/* Country Selector */}
            <div className="relative">
              <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                Choose a country
              </label>
              <button
                type="button"
                onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                className="w-full bg-[#FFFFFF] border border-[#E2D8C7] rounded-2xl px-4 py-3 flex items-center justify-between text-xs font-bold text-[#0F2744] shadow-2xs hover:border-[#1E3A8A] transition-all"
              >
                <span className="flex items-center gap-2">
                  <span className="text-lg">{selectedCountry.flag}</span>
                  <span>{selectedCountry.name}</span>
                </span>
                <div className="flex items-center gap-2 text-[#64748B]">
                  <span className="font-mono font-bold text-[#1E3A8A]">{selectedCountry.code}</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {/* Country Dropdown Menu */}
              {isCountryDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#FFFFFF] border border-[#E2D8C7] rounded-2xl shadow-xl z-50 overflow-hidden max-h-56 flex flex-col animate-in fade-in zoom-in-95">
                  <div className="p-2 border-b border-[#E2D8C7] bg-[#FAF8F2]">
                    <input
                      type="text"
                      placeholder="Search country or code..."
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                      className="w-full text-xs bg-white border border-[#E2D8C7] rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
                      autoFocus
                    />
                  </div>
                  <div className="overflow-y-auto custom-scrollbar flex-1 p-1">
                    {filteredCountries.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => {
                          setSelectedCountry(c);
                          setIsCountryDropdownOpen(false);
                          setCountrySearch('');
                        }}
                        className="w-full px-3 py-2 text-xs flex items-center justify-between hover:bg-[#ECE3D4] rounded-xl transition-all text-[#0F172A]"
                      >
                        <span className="flex items-center gap-2 font-medium">
                          <span>{c.flag}</span>
                          <span>{c.name}</span>
                        </span>
                        <span className="font-mono font-bold text-[#1E3A8A]">{c.code}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Phone Number Input */}
            <div>
              <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                Phone number
              </label>
              <div className="flex items-center bg-[#FFFFFF] border border-[#E2D8C7] rounded-2xl px-4 py-2.5 shadow-2xs focus-within:ring-2 focus-within:ring-[#1E3A8A] transition-all">
                <span className="text-sm font-bold font-mono text-[#1E3A8A] mr-3 pr-3 border-r border-[#E2D8C7]">
                  {selectedCountry.code}
                </span>
                <input
                  type="tel"
                  placeholder="Enter 10-digit number (e.g. 9876543210)"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full text-sm font-mono font-bold text-[#0F172A] placeholder-[#94A3B8] focus:outline-none bg-transparent tracking-wide"
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || phoneNumber.replace(/\D/g, '').length < 7}
              className="w-full py-3.5 bg-[#0F2744] hover:bg-[#1E3A8A] disabled:opacity-50 text-white font-bold text-xs rounded-2xl shadow-lg shadow-[#0F2744]/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Sending Verification SMS...</span>
                </>
              ) : (
                <span>Next / Send SMS</span>
              )}
            </button>

            <p className="text-[11px] text-center text-[#64748B]">
              You will receive an SMS containing a 6-digit verification code.
            </p>
          </form>
        )}

        {/* ================= STEP 2: 6-DIGIT OTP VERIFICATION ================= */}
        {step === 'OTP' && (
          <div className="p-6 space-y-5">
            <div className="text-center space-y-1">
              <p className="text-xs text-[#64748B]">
                Waiting to detect SMS sent to{' '}
                <span className="font-mono text-[#0F2744] font-bold">
                  {selectedCountry.code} {phoneNumber}
                </span>
              </p>
              <button
                type="button"
                onClick={() => setStep('PHONE')}
                className="text-xs font-bold text-[#1E3A8A] hover:underline"
              >
                Wrong number?
              </button>
            </div>

            {/* 6-Digit WhatsApp Split Boxes */}
            <div className="space-y-2">
              <label className="block text-center text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                Enter 6-digit Code
              </label>

              <div
                className="flex items-center justify-center gap-2.5"
                onPaste={handleOtpPaste}
              >
                {otpDigits.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      otpInputRefs.current[i] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-12 h-14 bg-white border-2 border-[#E2D8C7] rounded-2xl text-center font-mono text-2xl font-black text-[#0F2744] focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/20 focus:outline-none shadow-xs transition-all"
                  />
                ))}
              </div>
            </div>

            {/* Verify Button */}
            <button
              type="button"
              onClick={() => handleVerifyOtp()}
              disabled={loading || otpDigits.join('').length < 6}
              className="w-full py-3.5 bg-[#0F2744] hover:bg-[#1E3A8A] disabled:opacity-50 text-white font-bold text-xs rounded-2xl shadow-lg shadow-[#0F2744]/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <span>Verify & Continue</span>
              )}
            </button>

            {/* Resend SMS Timer */}
            <div className="pt-2 border-t border-[#E2D8C7] flex items-center justify-between text-xs">
              <span className="text-[#64748B]">Didn't receive code?</span>
              {canResend ? (
                <button
                  type="button"
                  onClick={() => handleRequestOtp()}
                  className="font-bold text-[#1E3A8A] hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Resend SMS
                </button>
              ) : (
                <span className="font-mono text-[#64748B] font-semibold">
                  Resend SMS in {timer}s
                </span>
              )}
            </div>

            {/* Notice */}
            <div className="bg-[#ECE3D4]/60 p-3 rounded-2xl text-center text-[10px] text-[#64748B] leading-tight">
              💡 If your SMS gateway has not dispatched an SMS to your SIM, standard sandbox code is active for testing.
            </div>
          </div>
        )}

        {/* ================= STEP 3: PROFILE INFO ================= */}
        {step === 'PROFILE' && (
          <form onSubmit={handleSaveProfile} className="p-6 space-y-5">
            <div className="text-center space-y-1">
              <p className="text-xs text-[#64748B]">
                Please provide your name and an optional profile photo.
              </p>
            </div>

            {/* Profile Avatar Selection */}
            <div className="flex flex-col items-center">
              <div className="relative group cursor-pointer">
                <img
                  src={avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName || 'user'}`}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full border-2 border-[#1E3A8A] bg-white object-cover shadow-md group-hover:opacity-90 transition-all"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newSeed = Math.random().toString(36).substring(2, 8);
                    setAvatarUrl(`https://api.dicebear.com/7.x/avataaars/svg?seed=${newSeed}`);
                  }}
                  className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center shadow-md hover:bg-[#2563EB] transition-all"
                  title="Randomize Avatar"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-[11px] font-bold text-[#1E3A8A] mt-1.5">Change Photo</span>
            </div>

            {/* Display Name Input */}
            <div>
              <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Type your name"
                className="w-full bg-[#FFFFFF] text-sm font-semibold text-[#0F172A] rounded-2xl px-4 py-3 border border-[#E2D8C7] focus:border-[#1E3A8A] focus:outline-none shadow-2xs"
                required
                autoFocus
              />
            </div>

            {/* Bio Input */}
            <div>
              <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                About / Bio
              </label>
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Hey there! I am using Let's Talk."
                className="w-full bg-[#FFFFFF] text-xs text-[#0F172A] rounded-2xl px-4 py-2.5 border border-[#E2D8C7] focus:border-[#1E3A8A] focus:outline-none shadow-2xs"
              />
            </div>

            {/* Finish Button */}
            <button
              type="submit"
              disabled={loading || !displayName.trim()}
              className="w-full py-3.5 bg-[#0F2744] hover:bg-[#1E3A8A] disabled:opacity-50 text-white font-bold text-xs rounded-2xl shadow-lg shadow-[#0F2744]/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Setting up account...</span>
                </>
              ) : (
                <span>Done / Start Using Let's Talk</span>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
