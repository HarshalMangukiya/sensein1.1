'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { Save } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);

  if (!user) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Mock save delay
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-charcoal tracking-tight">Account Settings</h1>
        <p className="text-sm text-charcoal-muted mt-1">Manage your personal information and preferences.</p>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-border bg-[#FAF7F5]">
          <h3 className="font-semibold text-charcoal">Profile Details</h3>
        </div>
        
        <form onSubmit={handleSave} className="p-5 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted">Full Name</label>
              <input
                id="name"
                type="text"
                defaultValue={user.name}
                className="w-full px-4 py-3 bg-white border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-plum focus:border-plum transition-shadow text-sm"
              />
            </div>
            
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted">Email Address</label>
              <input
                id="email"
                type="email"
                defaultValue={user.email}
                className="w-full px-4 py-3 bg-white border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-plum focus:border-plum transition-shadow text-sm text-charcoal-muted cursor-not-allowed"
                disabled
              />
              <p className="text-[10px] text-charcoal-subtle">Email cannot be changed.</p>
            </div>
            
            <div className="space-y-1.5">
              <label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted">Phone Number</label>
              <input
                id="phone"
                type="tel"
                placeholder="+91 "
                className="w-full px-4 py-3 bg-white border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-plum focus:border-plum transition-shadow text-sm"
              />
            </div>
          </div>

          <hr className="border-border my-8" />

          <div className="space-y-6">
            <h4 className="text-sm font-bold text-charcoal">Default Shipping Address</h4>
            
            <div className="space-y-1.5">
              <label htmlFor="address" className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted">Street Address</label>
              <input
                id="address"
                type="text"
                placeholder="123 Luxury Avenue"
                className="w-full px-4 py-3 bg-white border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-plum focus:border-plum transition-shadow text-sm"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label htmlFor="city" className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted">City</label>
                <input
                  id="city"
                  type="text"
                  placeholder="Mumbai"
                  className="w-full px-4 py-3 bg-white border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-plum focus:border-plum transition-shadow text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="zip" className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted">PIN Code</label>
                <input
                  id="zip"
                  type="text"
                  placeholder="400001"
                  className="w-full px-4 py-3 bg-white border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-plum focus:border-plum transition-shadow text-sm"
                />
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-plum hover:bg-plum-hover text-white text-xs font-bold uppercase tracking-widest rounded-sm transition-all disabled:opacity-70"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
