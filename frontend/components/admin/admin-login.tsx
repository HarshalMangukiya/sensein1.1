'use client';

import React, { useState } from 'react';
import { ShieldCheck, Eye, EyeOff, KeyRound, ArrowRight, AlertCircle } from 'lucide-react';
import { useAdminStore } from '@/store/admin-store';
import { BrandLogo } from '@/components/brand-logo';

export function AdminLogin() {
  const { login } = useAdminStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login(username, password);
      if (!res.success) {
        setError(res.error || 'Authentication failed. Please check credentials.');
      }
    } catch (err) {
      setError('An unexpected security challenge error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#FDFBF9] via-[#FAF7F5] to-[#F5EFEB] text-charcoal px-4 py-12 relative overflow-hidden">
      {/* Subtle ambient luxury light orbs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-plum/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

      {/* Security Console Card */}
      <div className="relative z-10 w-full max-w-md bg-white border border-border rounded-2xl p-8 sm:p-10 shadow-[0_20px_50px_rgba(90,56,89,0.08)]">
        {/* Top Gold Accent Bar */}
        <div className="absolute top-0 left-10 right-10 h-1 bg-gradient-to-r from-transparent via-plum to-transparent opacity-80" />

        {/* Brand Header */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center mb-3">
            <BrandLogo
              src="https://res.cloudinary.com/dqddawu42/image/upload/v1789820764/sensein/brand/sensein-navbar-logo.png"
              variant="dark"
              width={170}
              height={36}
              priority
              unoptimized
              imgClassName="h-8 w-auto object-contain"
            />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-plum/5 border border-plum/15 rounded-full mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-plum" />
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-plum">
              Executive Console
            </span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-charcoal tracking-tight">
            Administrator Access
          </h1>
          <p className="text-xs text-charcoal-muted mt-1 font-light">
            Restricted perimeter. Please authenticate with executive credentials.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5 text-red-700 text-xs animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal mb-1.5">
              Admin User ID
            </label>
            <input
              type="text"
              required
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[#D9D2CA] focus:border-plum rounded-lg text-sm text-charcoal focus:outline-none focus:ring-1 focus:ring-plum transition-all shadow-2xs"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal">
                Password
              </label>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-[#D9D2CA] focus:border-plum rounded-lg text-sm text-charcoal focus:outline-none focus:ring-1 focus:ring-plum transition-all pr-10 shadow-2xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-subtle hover:text-charcoal transition-colors"
                aria-label="Toggle password view"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 bg-plum hover:bg-plum-hover text-white font-bold text-xs uppercase tracking-[0.2em] rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group disabled:opacity-60"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <KeyRound className="w-4 h-4 text-gold group-hover:rotate-12 transition-transform" />
                  <span>Verify & Enter Console</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Security Disclaimers */}
        <div className="mt-8 pt-6 border-t border-border text-center space-y-1.5">
          <p className="text-[10px] text-charcoal-muted tracking-wider uppercase font-semibold">
            256-Bit End-To-End TLS Encrypted • Zero Trust Console
          </p>
          <p className="text-[10px] text-charcoal-subtle font-light">
            Unauthorized intrusion attempts are recorded and reported.
          </p>
        </div>
      </div>
    </div>
  );
}
