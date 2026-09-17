'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Sparkles, CheckCircle, ShieldCheck, ArrowRight, KeyRound } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { sendOtp, verifyOtp } from '@/lib/api';
import { BrandLogo } from '@/components/brand-logo';

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, setAuth, user, logout } = useAuthStore();
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [notifyMe, setNotifyMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(300);
  const [debugOtp, setDebugOtp] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  if (!isAuthModalOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await sendOtp(email);
      setStep('otp');
      setTimer(300);
      if (res.debugOtp) {
        setDebugOtp(res.debugOtp);
        setOtp(res.debugOtp); // prefill for frictionless dev experience
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError('Please enter the 6-digit verification code');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await verifyOtp(email, otp);
      setAuth(res.user, res.token);
      closeAuthModal();
      setStep('email');
      setOtp('');
      setEmail('');
    } catch (err: any) {
      setError(err.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={closeAuthModal}
      />

      {/* Modal Dialog Card (Split-Pane layout matching reference screenshot) */}
      <div className="relative bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl z-10 grid grid-cols-1 md:grid-cols-12 animate-in fade-in zoom-in-95 duration-200 border border-neutral-100">
        
        {/* LEFT PANEL: Velvet Plum Brand Showcase with Gold Accents */}
        <div className="md:col-span-5 bg-gradient-to-b from-[#52294A] via-[#3E1C37] to-[#2B1227] p-6 sm:p-8 flex flex-col justify-between text-white relative">
          <div>
            <div className="mb-4 sm:mb-6">
              <BrandLogo
                variant="light"
                width={135}
                height={42}
                imgClassName="h-6 sm:h-7 w-auto"
                href=""
              />
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-[26px] font-black uppercase leading-[1.18] tracking-tight text-white mt-4 sm:mt-6">
              LOGIN NOW TO<br />
              AVAIL <span className="text-[#E5CCA0]">BEST</span><br />
              <span className="text-[#E5CCA0]">OFFERS!</span>
            </h2>
          </div>

          <div className="space-y-3.5 pt-6 sm:pt-8 border-t border-white/10 mt-6">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-[#E5CCA0] shrink-0" />
              <span className="text-[11px] sm:text-xs font-semibold text-white/95">
                Instant 1–Click Secure Login
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle className="w-4 h-4 text-[#E5CCA0] shrink-0" />
              <span className="text-[11px] sm:text-xs font-semibold text-white/95">
                Unlock Secret Member Discounts
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#E5CCA0] shrink-0" />
              <span className="text-[11px] sm:text-xs font-semibold text-white/95">
                Track Orders in Real-Time
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Clean White Form / Profile */}
        <div className="md:col-span-7 p-6 sm:p-8 lg:p-9 flex flex-col justify-center relative bg-white">
          {/* Circular Close Button at top-right */}
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white shadow-md border border-neutral-100 flex items-center justify-center text-neutral-600 hover:text-charcoal hover:bg-neutral-50 transition z-20"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          {user ? (
            /* User Profile View */
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-[#5A3859] text-white text-2xl font-sans font-bold flex items-center justify-center mx-auto mb-4 shadow">
                {user.name.charAt(0)}
              </div>
              <h3 className="font-sans text-2xl font-bold text-neutral-900 tracking-tight">{user.name}</h3>
              <p className="text-xs text-neutral-500 mt-1">{user.email}</p>
              <div className="inline-flex items-center gap-1 mt-3 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
                <CheckCircle className="w-3.5 h-3.5" /> SENSEIN VIP Patron
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-100 space-y-3">
                <button
                  onClick={logout}
                  className="w-full py-2.5 border border-neutral-300 text-neutral-700 text-xs uppercase tracking-widest font-semibold hover:border-red-600 hover:text-red-600 rounded-xl transition"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            /* Login Flow (Matching Screenshot) */
            <div className="space-y-4 pt-4 sm:pt-0">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                  {error}
                </div>
              )}

              {step === 'email' ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter Email Address"
                      className="w-full px-4 py-3.5 bg-neutral-50/70 border border-neutral-200 rounded-xl text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#5A3859] focus:bg-white transition"
                    />
                  </div>

                  <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-neutral-700 font-medium">
                    <input
                      type="checkbox"
                      checked={notifyMe}
                      onChange={(e) => setNotifyMe(e.target.checked)}
                      className="w-4 h-4 rounded text-[#5A3859] accent-[#5A3859] focus:ring-[#5A3859]"
                    />
                    <span>Notify me with offers & updates</span>
                  </label>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-[#5A3859] hover:bg-[#6D436C] text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-60"
                  >
                    <span>{loading ? 'SENDING...' : 'SUBMIT'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-[11px] text-neutral-500 text-center leading-relaxed pt-2">
                    I accept that I have read & understood your{' '}
                    <Link
                      href="/privacy-policy"
                      onClick={closeAuthModal}
                      className="underline text-neutral-800 font-medium hover:text-[#5A3859]"
                    >
                      Privacy Policy
                    </Link>{' '}
                    and{' '}
                    <Link
                      href="/terms-and-conditions"
                      onClick={closeAuthModal}
                      className="underline text-neutral-800 font-medium hover:text-[#5A3859]"
                    >
                      T&Cs
                    </Link>
                    .
                  </p>
                </form>
              ) : (
                /* Step 2: 6-Digit OTP Verification */
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="text-center mb-1">
                    <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                      Verify One-Time Access
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1">
                      Enter the 6-digit code sent to <span className="font-semibold text-neutral-800">{email}</span>
                    </p>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      maxLength={6}
                      autoFocus
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="• • • • • •"
                      className="w-full text-center py-3 bg-neutral-50/80 border border-neutral-200 text-xl font-bold tracking-[0.4em] rounded-xl focus:outline-none focus:border-[#5A3859] text-neutral-900"
                    />
                    <KeyRound className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                  </div>

                  {debugOtp && (
                    <p className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 py-1 px-2 rounded-md text-center font-medium">
                      Fast-Track Dev Code: <strong className="font-bold">{debugOtp}</strong>
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs text-neutral-500">
                    <span>Code expires in: <strong className="text-neutral-800 font-semibold">{formatTimer(timer)}</strong></span>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={timer > 240}
                      className="text-[#5A3859] hover:underline disabled:opacity-50 font-medium"
                    >
                      Resend Code
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-[#5A3859] hover:bg-[#6D436C] text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-60"
                  >
                    <span>{loading ? 'VERIFYING...' : 'VERIFY & ENTER'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep('email')}
                    className="w-full text-center text-xs text-neutral-500 hover:text-neutral-900 underline mt-1"
                  >
                    Change email address
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
