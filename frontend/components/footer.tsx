'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, Shield, Award, Sparkles, Heart } from 'lucide-react';
import { BrandLogo } from '@/components/brand-logo';

export function Footer() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#5A3859] text-white pt-12 sm:pt-16 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Feature Badges */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 pb-10 sm:pb-12 border-b border-white/10 text-left">
          <div className="flex items-center justify-start gap-3 sm:gap-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center text-gold flex-shrink-0">
              <Award className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="text-[11px] sm:text-xs uppercase tracking-wider sm:tracking-widest font-semibold text-white">
                Salon Formulations
              </h4>
              <p className="text-[10px] sm:text-[11px] text-white/60 mt-0.5">Bio-Active French Actives</p>
            </div>
          </div>

          <div className="flex items-center justify-start gap-3 sm:gap-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center text-gold flex-shrink-0">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="text-[11px] sm:text-xs uppercase tracking-wider sm:tracking-widest font-semibold text-white">
                100% Authentic
              </h4>
              <p className="text-[10px] sm:text-[11px] text-white/60 mt-0.5">Direct from Clinical Lab</p>
            </div>
          </div>

          <div className="flex items-center justify-start gap-3 sm:gap-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center text-gold flex-shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="text-[11px] sm:text-xs uppercase tracking-wider sm:tracking-widest font-semibold text-white">
                Pan-India Express
              </h4>
              <p className="text-[10px] sm:text-[11px] text-white/60 mt-0.5">Free Shipping ₹499+</p>
            </div>
          </div>

          <div className="flex items-center justify-start gap-3 sm:gap-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center text-gold flex-shrink-0">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="text-[11px] sm:text-xs uppercase tracking-wider sm:tracking-widest font-semibold text-white">
                Cruelty-Free Clean
              </h4>
              <p className="text-[10px] sm:text-[11px] text-white/60 mt-0.5">No Parabens or Sulfates</p>
            </div>
          </div>
        </div>

        {/* Middle Navigation & Newsletter */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 sm:gap-10 py-10 sm:py-12 border-b border-white/10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="mb-2">
              <BrandLogo
                variant="light"
                width={185}
                height={57}
                imgClassName="h-9 sm:h-10 w-auto"
              />
            </div>
            <p className="text-xs text-white/70 max-w-sm leading-relaxed font-light">
              Pioneering cellular trichology and high-luxury cosmetic rituals. Engineered in Parisian laboratories, crafted for discerning connoisseurs worldwide.
            </p>
            <div className="pt-2">
              <span className="text-[11px] uppercase tracking-widest text-gold font-medium block mb-1">
                Concierge Assistance
              </span>
              <p className="text-xs text-white/80">+91 98110 22334 • mrdwarkesh@gmail.com</p>
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h5 className="text-xs uppercase tracking-widest font-semibold text-gold mb-4">
              Rituals & Shop
            </h5>
            <ul className="space-y-2.5 text-xs text-white/70">
              <li>
                <Link href="/shop?category=Mask" className="hover:text-white transition">
                  Keratin Repair Masks
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Shampoo" className="hover:text-white transition">
                  Caviar Stem-Cell Cleansers
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Serum" className="hover:text-white transition">
                  Illuminating Plum Serums
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Elixir" className="hover:text-white transition">
                  Scalp Redensifying Elixirs
                </Link>
              </li>
              <li>
                <Link href="/shop?collection=Bestsellers" className="hover:text-white transition">
                  Awarded Formulations
                </Link>
              </li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h5 className="text-xs uppercase tracking-widest font-semibold text-gold mb-4">
              Wholesale & Lab
            </h5>
            <ul className="space-y-2.5 text-xs text-white/70">
              <li>
                <Link href="/wholesale" className="hover:text-white transition">
                  Corporate & Wholesale
                </Link>
              </li>
              <li>
                <Link href="/wholesale" className="hover:text-white transition">
                  Salon Distribution
                </Link>
              </li>
              <li>
                <Link href="/wholesale" className="hover:text-white transition">
                  Luxury Hotel Amenities
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-white transition">
                  Formulation Philosophy
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div>
            <h5 className="text-xs uppercase tracking-widest font-semibold text-gold mb-4">
              Private Salon Circle
            </h5>
            <p className="text-xs text-white/70 mb-3 leading-relaxed">
              Subscribe for private formulation launches and receive an immediate 10% privilege code.
            </p>
            {subscribed ? (
              <div className="p-3 bg-white/10 rounded text-xs text-gold border border-gold/30">
                ✓ Welcome to the Circle. Use code <strong>LUXE10</strong> at checkout.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded text-xs text-white placeholder-white/50 focus:outline-none focus:border-gold"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 p-1 text-gold hover:text-white transition"
                    aria-label="Submit email"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/50">
          <p>© {new Date().getFullYear()} SENSEIN PROFESSIONAL. All Rights Reserved.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <Link href="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="hover:text-white transition">Terms & Conditions</Link>
            <Link href="/wholesale" className="hover:text-white transition">Wholesale Inquiry</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
