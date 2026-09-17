'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, User as UserIcon, X, ChevronRight, Sparkles, Package, Mail } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';
import { BrandLogo } from '@/components/brand-logo';

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
          isScrolled ? 'py-2.5 sm:py-3 shadow-sm' : 'py-3 sm:py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left: Wave Icon Menu Toggle */}
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="text-charcoal hover:text-plum transition p-1.5 sm:p-2 focus:outline-none cursor-pointer rounded-md hover:bg-black/5"
                aria-label="Open menu drawer"
              >
                {/* 3-Wavy lines icon matching reference exactly */}
                <svg
                  className="w-5 h-4 sm:w-6 sm:h-5"
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

            {/* Center: Luxury SENSEIN Logo */}
            <div className="text-center absolute left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-auto">
              <BrandLogo
                src="/images/sensein-navbar-logo.png"
                variant="dark"
                width={240}
                height={45}
                priority
                unoptimized
                imgClassName="h-[21px] sm:h-7 md:h-9 lg:h-10 w-auto max-w-[125px] xs:max-w-[155px] sm:max-w-none object-contain"
              />
            </div>

            {/* Right: Search, User, Cart Icons */}
            <div className="flex items-center space-x-1.5 sm:space-x-3.5 md:space-x-5">
              {/* Quick Search */}
              <button
                onClick={onOpenSearch}
                className="text-charcoal hover:text-plum transition p-1.5 sm:p-2 focus:outline-none rounded-full hover:bg-black/5"
                aria-label="Search catalog"
              >
                <Search className="w-[18px] h-[18px] sm:w-5 sm:h-5 stroke-[1.8]" />
              </button>

              {/* User Profile / OTP Modal */}
              <button
                onClick={openAuthModal}
                className="text-charcoal hover:text-plum transition p-1.5 sm:p-2 focus:outline-none rounded-full hover:bg-black/5"
                aria-label="Account login"
              >
                {user ? (
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-plum text-white text-[10px] sm:text-[11px] font-semibold flex items-center justify-center shadow-xs">
                    {user.name.charAt(0)}
                  </div>
                ) : (
                  <UserIcon className="w-[18px] h-[18px] sm:w-5 sm:h-5 stroke-[1.8]" />
                )}
              </button>

              {/* Shopping Cart with circular Badge */}
              <button
                id="header-cart-btn"
                onClick={openCart}
                className={`relative text-charcoal hover:text-plum transition-all duration-300 p-1.5 sm:p-2 flex items-center rounded-full hover:bg-black/5 ${
                  isCartBouncing ? 'scale-125 text-plum ring-2 ring-plum/20' : 'scale-100'
                }`}
                aria-label="Shopping Cart"
              >
                <ShoppingCart className={`w-[18px] h-[18px] sm:w-5 sm:h-5 stroke-[1.8] transition-transform duration-300 ${
                  isCartBouncing ? 'rotate-[-12deg]' : ''
                }`} />
                {itemCount > 0 ? (
                  <span className={`absolute -top-0.5 -right-0.5 sm:-top-1.5 sm:-right-2 bg-plum text-white text-[9px] sm:text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-xs transition-all duration-300 ${
                    isCartBouncing ? 'scale-125 bg-plum-dark ring-2 ring-gold' : 'scale-100'
                  }`}>
                    {itemCount}
                  </span>
                ) : (
                  <span className={`absolute -top-0.5 -right-0.5 sm:-top-1.5 sm:-right-2 bg-plum text-white text-[9px] sm:text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-xs transition-all duration-300 ${
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

      {/* Slide-out Navigation Drawer matching reference screenshot */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] overflow-hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 max-w-[320px] sm:max-w-xs w-full bg-white shadow-2xl p-5 flex flex-col justify-between z-10 animate-in slide-in-from-left duration-300">
            {/* Top Logo & Close Button */}
            <div>
              <div className="flex items-center justify-between pb-3.5 border-b border-neutral-100">
                <BrandLogo
                  variant="dark"
                  width={130}
                  height={40}
                  imgClassName="h-7 w-auto"
                />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 text-neutral-600 hover:text-[#5A3859] transition rounded"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Top Banner: EXPLORE ALL PRODUCTS */}
              <div className="mt-3.5">
                <Link
                  href="/shop"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-[#5A3859] hover:bg-[#6D436C] text-white rounded-xl shadow-xs transition-all group"
                >
                  <span className="text-xs font-bold uppercase tracking-wider">
                    EXPLORE ALL PRODUCTS
                  </span>
                  <ChevronRight className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {/* Category Section Header */}
              <div className="mt-5">
                <h4 className="text-[10px] uppercase tracking-wider font-bold text-neutral-400 mb-1.5 px-1">
                  PRODUCT CATEGORIES
                </h4>

                {/* Categories List */}
                <div className="space-y-0.5 max-h-[calc(100vh-320px)] overflow-y-auto pr-1">
                  {[
                    { name: 'Shampoo', value: 'Shampoo' },
                    { name: 'Mask', value: 'Mask' },
                    { name: 'Serum', value: 'Serum' },
                    { name: 'Perfume', value: 'Perfume' },
                    { name: 'Cream', value: 'Cream' },
                    { name: 'Facewash', value: 'Facewash' },
                    { name: 'Wax', value: 'Wax' },
                    { name: 'Travelling Kit', value: 'Travelling Kit' },
                    { name: 'Oil', value: 'Oil' },
                    { name: 'Powder', value: 'Powder' },
                  ].map((cat) => (
                    <Link
                      key={cat.name}
                      href={`/shop?category=${encodeURIComponent(cat.value)}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between py-1.5 px-1.5 rounded-md hover:bg-neutral-50 transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 group-hover:bg-[#5A3859] transition-colors" />
                        <span className="text-[13px] text-neutral-700 font-medium group-hover:text-[#5A3859] transition-colors">
                          {cat.name}
                        </span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-[#5A3859] group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions: BULK ORDER & WHATSAPP SUPPORT */}
            <div className="pt-3 border-t border-neutral-100 space-y-2">
              {/* BULK ORDER / WHOLESALE */}
              <Link
                href="/wholesale"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-between px-3 py-2.5 bg-white border border-neutral-200 hover:border-[#5A3859] rounded-xl transition-all shadow-2xs group"
              >
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-neutral-700 group-hover:text-[#5A3859] transition-colors" />
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-800 group-hover:text-[#5A3859] transition-colors">
                    BULK ORDER
                  </span>
                </div>
                <div className="flex items-center gap-0.5 text-[10px] font-bold tracking-wider text-neutral-500 uppercase group-hover:text-[#5A3859] transition-colors">
                  <span>WHOLESALE</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </Link>

              {/* EMAIL SUPPORT */}
              <a
                href="mailto:mrdwarkesh@gmail.com?subject=SENSEIN%20Concierge%20Support%20Inquiry"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#5A3859] hover:bg-[#6D436C] text-white rounded-xl shadow-xs transition-all font-bold text-xs uppercase tracking-wider"
              >
                <Mail className="w-4 h-4" />
                <span>EMAIL SUPPORT</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
