'use client';

import React, { useEffect, useState } from 'react';
import { useAdminStore } from '@/store/admin-store';
import { AdminLogin } from '@/components/admin/admin-login';
import { AdminDashboard } from '@/components/admin/admin-dashboard';

export default function AdminRootPage() {
  const { isAdminAuthenticated } = useAdminStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration flash
  if (!mounted) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#FAF7F5] text-charcoal">
        <div className="flex flex-col items-center gap-4">
          <div className="w-9 h-9 border-2 border-plum border-t-gold rounded-full animate-spin" />
          <p className="text-[11px] uppercase tracking-[0.25em] text-charcoal-muted font-bold">
            Securing SENSEIN Console...
          </p>
        </div>
      </div>
    );
  }

  // If not authenticated as Admin, show the exclusive Admin Login Page
  if (!isAdminAuthenticated) {
    return <AdminLogin />;
  }

  // If authenticated as Admin, render the comprehensive Back-Office Dashboard
  return <AdminDashboard />;
}
