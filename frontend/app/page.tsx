'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Award, Heart, CheckCircle2, Star, Gift } from 'lucide-react';
import { ProductCard } from '@/components/product-card';
import { RealResultsCarousel } from '@/components/real-results-carousel';
import { BeforeAfterSection } from '@/components/before-after-section';
import { fetchProducts } from '@/lib/api';
import { LUXURY_PRODUCTS } from '@/lib/products-data';

export default function HomePage() {
  const [bestsellers, setBestsellers] = useState<any[]>(LUXURY_PRODUCTS.slice(0, 4));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchProducts({ sort: 'featured' });
        if (data.products && data.products.length > 0) {
          setBestsellers(data.products.slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to load bestsellers', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-12 sm:space-y-20 lg:space-y-24">
      {/* 1. EDITORIAL HERO SECTION */}
      <section className="relative w-full min-h-[560px] sm:min-h-[660px] lg:min-h-0 lg:aspect-[1376/768] flex items-end bg-[#1F0811] overflow-hidden">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero/editorial-hero.jpg"
            alt="SENSEIN Editorial Paris Campaign"
            className="w-full h-full object-cover object-[36%_top] sm:object-top filter brightness-[0.95] contrast-[1.04]"
          />
          {/* Subtle bottom gradient to ensure text legibility while keeping the model face crystal clear on all screens */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#14040B] via-[#14040B]/80 via-55% sm:via-[#14040B]/60 sm:via-35% to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#14040B]/60 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Hero Content positioned at bottom-left */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-5 sm:pb-8 lg:pb-10 pt-16 sm:pt-20">
          <div className="max-w-xl lg:max-w-2xl text-white space-y-3 sm:space-y-4">
            <h1 className="font-serif text-2xl sm:text-4xl lg:text-[54px] font-semibold leading-[1.14] sm:leading-[1.08] tracking-tight text-white drop-shadow-md">
              Formulated for Perfection. <br />
              <span className="italic font-light text-gold-light">Engineered for Radiance.</span>
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-white/90 font-light leading-relaxed max-w-lg drop-shadow-sm line-clamp-3 sm:line-clamp-none">
              Elevate your daily ritual with high-potency French Plum Elixirs, hydrolyzed micro-keratin peptides, and stem-cell scalp bio-actives. Salon-grade alchemy for transcendent luster.
            </p>

            <div className="pt-1 flex flex-col sm:flex-row gap-2.5 sm:gap-3">
              <Link
                href="/shop"
                className="w-full sm:w-auto px-6 py-3 sm:px-7 sm:py-3.5 bg-white text-plum text-[11px] sm:text-xs font-bold uppercase tracking-[0.16em] sm:tracking-[0.18em] rounded-sm hover:bg-gold-light hover:text-charcoal transition duration-300 flex items-center justify-center gap-2 shadow-lg"
              >
                Explore The Collection
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/shop?category=Mask"
                className="w-full sm:w-auto px-6 py-3 sm:px-7 sm:py-3.5 bg-white/10 hover:bg-white/20 border border-white/40 hover:border-white text-white text-[11px] sm:text-xs font-bold uppercase tracking-[0.16em] sm:tracking-[0.18em] rounded-sm transition duration-300 flex items-center justify-center gap-2 backdrop-blur-sm"
              >
                Discover Keratin Ritual
              </Link>
            </div>

            {/* Badges under hero */}
            <div className="pt-3 border-t border-white/20 grid grid-cols-3 gap-2 sm:gap-4 text-white/85 text-center sm:text-left">
              <div>
                <strong className="block text-white text-xs sm:text-base font-serif">500+</strong>
                <span className="block text-[9px] sm:text-[11px] text-white/70 leading-tight">Luxury Salons</span>
              </div>
              <div>
                <strong className="block text-white text-xs sm:text-base font-serif">87%</strong>
                <span className="block text-[9px] sm:text-[11px] text-white/70 leading-tight">Breakage Cut</span>
              </div>
              <div>
                <strong className="block text-white text-xs sm:text-base font-serif">100%</strong>
                <span className="block text-[9px] sm:text-[11px] text-white/70 leading-tight">Bio-Botanicals</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PRESS & EDITORIAL RECOGNITION TICKER */}
      <section className="py-4 sm:py-6 border-y border-border bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] font-semibold text-charcoal-muted mb-3 sm:mb-4">
            Recognized in Haute Editorial
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-around gap-4 sm:gap-8 opacity-75 grayscale hover:grayscale-0 transition-all">
            <span className="font-serif text-base sm:text-2xl font-bold tracking-widest text-charcoal">
              VOGUE
            </span>
            <span className="font-serif text-base sm:text-2xl font-semibold tracking-wider text-charcoal">
              HARPER'S BAZAAR
            </span>
            <span className="font-serif text-base sm:text-2xl font-bold tracking-widest text-charcoal">
              ELLE
            </span>
            <span className="font-serif text-base sm:text-2xl font-semibold tracking-widest text-charcoal">
              L'OFFICIEL
            </span>
            <span className="font-serif text-base sm:text-2xl font-bold tracking-wider text-charcoal">
              GRAZIA
            </span>
          </div>
        </div>
      </section>

      {/* 3. GAMIFIED MILESTONE CALLOUT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-plum via-[#38101E] to-[#260812] text-white rounded-sm p-5 sm:p-8 shadow-luxury relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6">
            <div className="space-y-1.5 sm:space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1 text-gold text-[11px] sm:text-xs font-semibold uppercase tracking-widest">
                <Gift className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Privilege Unlocks
              </div>
              <h3 className="font-serif text-xl sm:text-3xl font-bold leading-snug">
                Luxury Tier Gifts with Every Order
              </h3>
              <p className="text-xs sm:text-sm text-white/80 max-w-xl leading-relaxed">
                Unlock complimentary deluxe samples at ₹999, our Rosewood & Velvet Travel Pouch at ₹1,999, and a Full-Size French Plum Elixir (₹1,499 value) at ₹2,999.
              </p>
            </div>
            <Link
              href="/shop"
              className="w-full sm:w-auto text-center flex-shrink-0 px-6 py-3.5 bg-gold hover:bg-gold-light text-charcoal text-xs font-bold uppercase tracking-widest rounded-sm transition shadow"
            >
              Start Curating Your Bag
            </Link>
          </div>
        </div>
      </section>

      {/* 4. BESTSELLER FORMULATIONS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 pb-3 sm:pb-4 border-b border-border">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-plum block">
              Curated Formulations
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-charcoal mt-1">
              Bestselling Salon Rituals
            </h2>
          </div>
          <Link
            href="/shop"
            className="mt-3 sm:mt-0 text-xs font-bold uppercase tracking-[0.15em] text-plum hover:text-plum-dark flex items-center gap-1 group"
          >
            View Entire Catalog
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white p-4 h-96 animate-pulse rounded border border-border" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {bestsellers.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 5. SCIENCE OF BOTANICAL FORMULATIONS STORY */}
      <section className="bg-white py-12 sm:py-24 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Image Collage */}
            <div className="relative max-w-md mx-auto lg:max-w-none w-full">
              <div className="aspect-[4/3] rounded-sm overflow-hidden border border-border shadow-luxury">
                <img
                  src="/images/products/mask-1.png"
                  alt="SENSEIN Keratin Bond Restorative Mask"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 w-36 h-36 sm:w-48 sm:h-48 bg-[#FAF7F5] p-2.5 sm:p-3 rounded-sm border border-border shadow-lg">
                <img
                  src="/images/products/serum-1.png"
                  alt="SENSEIN French Plum Serum"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Right Content */}
            <div className="space-y-4 sm:space-y-6 pt-4 lg:pt-0">
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-plum block">
                The Science of Radiance
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-charcoal leading-tight">
                Where French Botanical Heritage Meets Molecular Hair Architecture
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed font-light">
                Traditional salon treatments merely coat hair fibers in heavy silicones. SENSEIN PROFESSIONAL utilizes biomimetic micro-peptides and cold-pressed French Ente Plum seed oil that penetrate the cortex to restructure broken disulfide bonds.
              </p>

              <div className="space-y-3 sm:space-y-4 pt-1 sm:pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-plum/10 text-plum flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-plum" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-charcoal">Ente Plum Seed Cold Press</h4>
                    <p className="text-[11px] sm:text-xs text-charcoal-muted">Rich in oleic and linoleic fatty acids for 72-hour weightless frizz neutralization.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-plum/10 text-plum flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-plum" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-charcoal">Hydrolyzed Biomimetic Keratin</h4>
                    <p className="text-[11px] sm:text-xs text-charcoal-muted">Low-molecular-weight amino acids that fill micro-voids in damaged cuticles.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-plum/10 text-plum flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-plum" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-charcoal">Redensyl & Copper Peptides</h4>
                    <p className="text-[11px] sm:text-xs text-charcoal-muted">Awakens cellular division in dormant hair stem cells for thicker follicular density.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 sm:pt-4">
                <Link
                  href="/shop"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-plum hover:bg-plum-dark text-white text-xs font-bold uppercase tracking-widest rounded-sm transition"
                >
                  Discover Formulation Rituals
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. REAL PEOPLE REAL RESULTS 3D CAROUSEL */}
      <RealResultsCarousel />

      {/* 7. DIGITS DON'T LIE - BEFORE & AFTER INTERACTIVE SLIDER */}
      <BeforeAfterSection />

      {/* 8. WHOLESALE & SALON PARTNERSHIP TEASER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF7F5] border border-border p-6 sm:p-12 rounded-sm flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
          <div className="space-y-2.5 sm:space-y-3 text-center md:text-left">
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-plum block">
              B2B Enterprise Concierge
            </span>
            <h3 className="font-serif text-xl sm:text-3xl font-bold text-charcoal">
              Partner with SENSEIN for Your Salon or Luxury Hotel
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-muted max-w-xl leading-relaxed">
              Wholesale volume tier discounts, certified salon training manuals, and bespoke backbar amenities for elite hospitality and salon groups.
            </p>
          </div>
          <Link
            href="/wholesale"
            className="w-full md:w-auto text-center flex-shrink-0 px-8 py-4 bg-charcoal hover:bg-plum text-white text-xs font-bold uppercase tracking-[0.18em] rounded-sm transition shadow"
          >
            Submit Wholesale Inquiry
          </Link>
        </div>
      </section>
    </div>
  );
}
