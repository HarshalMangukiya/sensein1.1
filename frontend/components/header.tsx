'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, User as UserIcon, X, ChevronRight } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';

interface HeaderProps {
  onOpenSearch?: () => void;
}

export function Header({ onOpenSearch }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { openCart, getItemCount, isCartBouncing } = useCartStore();
  const { user, openAuthModal } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const itemCount = mounted ? getItemCount() : 0;

  const navLinks = [
    { label: 'Shop All Formulations', href: '/shop' },
    { label: 'Hair Masks & Treatments', href: '/shop?category=Mask' },
    { label: 'Shampoos & Cleansers', href: '/shop?category=Shampoo' },
    { label: 'Elixirs & Serums', href: '/shop?category=Serum' },
    { label: 'Awarded Bestsellers', href: '/shop?collection=Bestsellers' },
    { label: 'B2B Wholesale & Salons', href: '/wholesale' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 bg-white border-b border-[#EAE5E0] ${
          isScrolled ? 'py-3 shadow-sm' : 'py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left: Wave Icon Menu Toggle */}
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="text-charcoal hover:text-plum transition p-2 focus:outline-none cursor-pointer rounded-sm hover:bg-black/5"
                aria-label="Open menu drawer"
              >
                {/* 3-Wavy lines icon matching reference exactly */}
                <svg
                  className="w-6 h-5"
                  viewBox="0 0 24 18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                >
                  <path d="M2 3c3-1.8 6-1.8 9 0s6 1.8 9 0" />
                  <path d="M2 9c3-1.8 6-1.8 9 0s6 1.8 9 0" />
                  <path d="M2 15c3-1.8 6-1.8 9 0s6 1.8 9 0" />
                </svg>
              </button>
            </div>

            {/* Center: Luxury SENSEIN® PROFESSIONAL Logo */}
            <div className="text-center absolute left-1/2 -translate-x-1/2">
              <Link href="/" className="inline-flex flex-col items-center group select-none">
                <div className="flex items-start">
                  <span className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.24em] text-[#1A1A1A] group-hover:text-plum transition-colors">
                    SENSEIN
                  </span>
                  <span className="text-[10px] font-sans font-bold ml-0.5 mt-0.5 text-[#1A1A1A]">
                    ®
                  </span>
                </div>
                <span className="text-[9px] sm:text-[10px] tracking-[0.38em] font-sans font-bold text-charcoal-muted uppercase mt-0.5">
                  PROFESSIONAL
                </span>
              </Link>
            </div>

            {/* Right: Search, User, Cart Icons */}
            <div className="flex items-center space-x-4 sm:space-x-5">
              {/* Quick Search */}
              <button
                onClick={onOpenSearch}
                className="text-charcoal hover:text-plum transition p-1"
                aria-label="Search catalog"
              >
                <Search className="w-5 h-5 stroke-[1.8]" />
              </button>

              {/* User Profile / OTP Modal */}
              <button
                onClick={openAuthModal}
                className="text-charcoal hover:text-plum transition p-1"
                aria-label="Account login"
              >
                {user ? (
                  <div className="w-6 h-6 rounded-full bg-plum text-white text-[11px] font-semibold flex items-center justify-center shadow-xs">
                    {user.name.charAt(0)}
                  </div>
                ) : (
                  <UserIcon className="w-5 h-5 stroke-[1.8]" />
                )}
              </button>

              {/* Shopping Cart with circular Badge */}
              <button
                id="header-cart-btn"
                onClick={openCart}
                className={`relative text-charcoal hover:text-plum transition-all duration-300 p-1 flex items-center ${
                  isCartBouncing ? 'scale-125 text-plum ring-2 ring-plum/20 rounded-full' : 'scale-100'
                }`}
                aria-label="Shopping Cart"
              >
                <ShoppingCart className={`w-5 h-5 stroke-[1.8] transition-transform duration-300 ${
                  isCartBouncing ? 'rotate-[-12deg]' : ''
                }`} />
                {itemCount > 0 ? (
                  <span className={`absolute -top-1.5 -right-2 bg-plum text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-xs transition-all duration-300 ${
                    isCartBouncing ? 'scale-125 bg-plum-dark ring-2 ring-gold' : 'scale-100'
                  }`}>
                    {itemCount}
                  </span>
                ) : (
                  <span className={`absolute -top-1.5 -right-2 bg-plum text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-xs transition-all duration-300 ${
                    isCartBouncing ? 'scale-125 bg-plum-dark ring-2 ring-gold' : 'scale-100'
                  }`}>
                    0
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Slide-out Navigation Drawer for the 3-wave menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] overflow-hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-[#FAF7F5] shadow-2xl p-6 flex flex-col justify-between z-10 animate-in slide-in-from-left duration-300">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-border">
                <div>
                  <div className="flex items-start">
                    <span className="font-serif text-xl font-bold tracking-[0.22em] text-plum">
                      SENSEIN
                    </span>
                    <span className="text-[9px] font-sans font-bold ml-0.5 text-plum">®</span>
                  </div>
                  <span className="block text-[8px] tracking-[0.3em] text-charcoal-muted uppercase mt-0.5">
                    PROFESSIONAL
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-charcoal hover:text-plum transition rounded"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-8 space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between py-2.5 text-xs font-semibold tracking-wider text-charcoal hover:text-plum border-b border-border/50 uppercase"
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-charcoal-muted" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-border space-y-3">
              <Link
                href="/wholesale"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full block text-center py-3 bg-plum text-white text-xs uppercase tracking-widest font-bold rounded hover:bg-plum-dark transition shadow-sm"
              >
                Wholesale Concierge
              </Link>
              <p className="text-[10px] text-center text-charcoal-muted tracking-wider">
                PARIS • NEW DELHI • MUMBAI
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
