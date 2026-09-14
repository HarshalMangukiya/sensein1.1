'use client';

import React, { useState, useEffect } from 'react';
import { X, Mail, KeyRound, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { sendOtp, verifyOtp } from '@/lib/api';

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, setAuth, user, logout } = useAuthStore();
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
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
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={closeAuthModal}
      />

      {/* Modal Dialog */}
      <div className="relative bg-[#FAF7F5] w-full max-w-md rounded-sm border border-border shadow-2xl p-8 z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-1 text-charcoal hover:text-plum transition rounded-full"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {user ? (
          /* User Profile View */
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-plum text-white text-2xl font-serif font-bold flex items-center justify-center mx-auto mb-4 shadow">
              {user.name.charAt(0)}
            </div>
            <h3 className="font-serif text-2xl font-bold text-charcoal">{user.name}</h3>
            <p className="text-xs text-charcoal-muted mt-1">{user.email}</p>
            <div className="inline-flex items-center gap-1 mt-3 px-3 py-1 rounded-full bg-emerald-light/50 text-emerald text-xs font-medium">
              <CheckCircle className="w-3.5 h-3.5" /> SENSEIN VIP Patron
            </div>

            <div className="mt-8 pt-6 border-t border-border space-y-3">
              <button
                onClick={logout}
                className="w-full py-2.5 border border-charcoal/30 text-charcoal text-xs uppercase tracking-widest font-semibold hover:border-red-600 hover:text-red-600 rounded transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          /* OTP Login Flow */
          <div>
            <div className="text-center mb-6">
              <span className="font-serif text-2xl font-bold tracking-[0.2em] text-plum block">
                SENSEIN
              </span>
              <span className="text-[9px] tracking-[0.35em] text-charcoal-muted uppercase block mt-0.5">
                PROFESSIONAL • PARIS
              </span>
              <h3 className="font-serif text-xl font-bold text-charcoal mt-5">
                {step === 'email' ? 'Client Identification' : 'Verify One-Time Access'}
              </h3>
              <p className="text-xs text-charcoal-muted mt-1.5">
                {step === 'email'
                  ? 'Access your saved rituals, orders, and bespoke concierge tier benefits.'
                  : `Enter the 6-digit code sent to ${email}`}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
                {error}
              </div>
            )}

            {step === 'email' ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-charcoal mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. aditi@luxuryatelier.com"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-border text-sm rounded-sm focus:outline-none focus:border-plum text-charcoal"
                    />
                    <Mail className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-3.5" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-plum hover:bg-plum-dark text-white text-xs font-bold uppercase tracking-[0.16em] rounded-sm transition flex items-center justify-center gap-2 shadow hover:shadow-md disabled:opacity-60"
                >
                  {loading ? 'Dispatching...' : 'Request Access Code'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-charcoal mb-1.5">
                    6-Digit Verification Code
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={6}
                      autoFocus
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="• • • • • •"
                      className="w-full text-center py-3 bg-white border border-border text-xl font-bold tracking-[0.4em] rounded-sm focus:outline-none focus:border-plum text-charcoal"
                    />
                    <KeyRound className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-3.5" />
                  </div>
                  {debugOtp && (
                    <p className="text-[11px] text-emerald mt-1 text-center font-medium">
                      Dev Fast-Track Code: <strong className="font-bold">{debugOtp}</strong>
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-charcoal-muted">
                  <span>Code expires in: <strong className="text-charcoal font-semibold">{formatTimer(timer)}</strong></span>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={timer > 240}
                    className="text-plum hover:underline disabled:opacity-50 font-medium"
                  >
                    Resend Code
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-plum hover:bg-plum-dark text-white text-xs font-bold uppercase tracking-[0.16em] rounded-sm transition flex items-center justify-center gap-2 shadow hover:shadow-md disabled:opacity-60"
                >
                  {loading ? 'Verifying...' : 'Authenticate & Enter'}
                  <Sparkles className="w-4 h-4 text-gold" />
                </button>

                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="w-full text-center text-xs text-charcoal-muted hover:text-charcoal transition"
                >
                  Change email address
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
