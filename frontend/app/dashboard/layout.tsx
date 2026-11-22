'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, Settings, LogOut, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';

const DASHBOARD_LINKS = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Orders', href: '/dashboard/orders', icon: Package },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthModalOpen, openAuthModal } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !user && !isAuthModalOpen) {
      openAuthModal();
      router.push('/');
    }
  }, [user, mounted, router, isAuthModalOpen, openAuthModal]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!mounted || !user) {
    return <div className="min-h-screen flex items-center justify-center bg-[#FAF7F5]"><div className="w-8 h-8 border-2 border-plum border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="min-h-screen bg-[#FAF7F5] flex flex-col md:flex-row">
      {/* Mobile Top Navigation / Breadcrumb Area */}
      <div className="md:hidden bg-white border-b border-border sticky top-[60px] z-30 px-4 py-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {DASHBOARD_LINKS.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap text-xs font-semibold transition-colors ${
                isActive ? 'bg-plum text-white' : 'bg-white text-charcoal border border-border'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {link.name}
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap text-xs font-semibold text-red-600 bg-red-50 border border-red-100 ml-auto"
        >
          <LogOut className="w-3.5 h-3.5" />
          Logout
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 border-r border-border bg-white h-[calc(100vh-65px)] sticky top-[65px] self-start overflow-y-auto no-scrollbar flex-shrink-0">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-sans font-bold text-charcoal tracking-tight">My Account</h2>
          <p className="text-xs text-charcoal-muted mt-1 font-medium">Welcome back, {user.name.split(' ')[0]}</p>
        </div>

        <nav className="flex-1 p-4 space-y-1.5">
          {DASHBOARD_LINKS.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center justify-between px-4 py-3 rounded-md transition-all group ${
                  isActive
                    ? 'bg-plum text-white shadow-md'
                    : 'text-charcoal hover:bg-[#FAF7F5] hover:text-plum'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-charcoal-subtle group-hover:text-plum'}`} />
                  <span className="text-sm font-semibold tracking-wide">{link.name}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 opacity-70" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-md text-red-600 hover:bg-red-50 transition-colors group"
          >
            <LogOut className="w-5 h-5 opacity-70 group-hover:opacity-100" />
            <span className="text-sm font-semibold tracking-wide">Secure Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-10 pb-20">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
