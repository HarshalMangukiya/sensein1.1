'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AnnouncementBar } from '@/components/announcement-bar';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CartDrawer } from '@/components/cart-drawer';
import { AuthModal } from '@/components/auth-modal';

export function StoreLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAdminRoute = pathname ? pathname.startsWith('/admin') : false;

  // On admin routes, render full-bleed without consumer store elements
  if (isAdminRoute) {
    return (
      <div className="min-h-screen w-full bg-[#FAF7F5] text-charcoal antialiased">
        {children}
      </div>
    );
  }

  // Consumer storefront layout
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F5] text-charcoal antialiased">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <AuthModal />
    </div>
  );
}
