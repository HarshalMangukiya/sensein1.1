'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Gift, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from '@/components/product-card';
import { RealResultsCarousel } from '@/components/real-results-carousel';
import { BeforeAfterSection } from '@/components/before-after-section';
import { WhyChooseSensein } from '@/components/why-choose-sensein';
import {
  fetchProducts,
  fetchHeroBanner,
  getHeroBannerFromStorage,
  saveHeroBannerToStorage,
  DEFAULT_HERO_BANNER,
  HeroBannerConfig,
} from '@/lib/api';

interface HomePageClientProps {
  initialBanner?: HeroBannerConfig;
  initialProducts?: any[];
}

export function HomePageClient({ initialBanner, initialProducts }: HomePageClientProps) {
  const [bestsellers, setBestsellers] = useState<any[]>(initialProducts || []);
  const [loading, setLoading] = useState(!initialProducts || initialProducts.length === 0);
  const [banner, setBanner] = useState<HeroBannerConfig>(() => {
    if (initialBanner && initialBanner.title) {
      return initialBanner;
    }
    return DEFAULT_HERO_BANNER;
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = container.clientWidth < 640 
        ? container.clientWidth * 0.85 
        : container.clientWidth * 0.5;
      container.scrollBy({
        left: direction === 'left' ? -cardWidth : cardWidth,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchProducts({ sort: 'featured' });
        if (data.products && data.products.length > 0) {
          setBestsellers(data.products);
        }
      } catch (err) {
        console.error('Failed to load bestsellers', err);
      } finally {
        setLoading(false);
      }
    }

    if (!initialProducts || initialProducts.length === 0) {
      loadData();
    }

    // Instant local synchronization: if SSR sent default but client's local storage has the newly uploaded banner, sync immediately!
    if (typeof window !== 'undefined') {
      const stored = getHeroBannerFromStorage();
      if (
        stored &&
        stored.imageUrl &&
        stored.imageUrl !== DEFAULT_HERO_BANNER.imageUrl
      ) {
        if (banner.imageUrl === DEFAULT_HERO_BANNER.imageUrl) {
          setBanner(stored);
        }
      } else if (banner.imageUrl && banner.imageUrl !== DEFAULT_HERO_BANNER.imageUrl) {
        // Cache SSR banner into local storage for zero-delay future renders
        saveHeroBannerToStorage(banner);
      }
    }

    async function loadBanner() {
      try {
        const b = await fetchHeroBanner();
        if (b && b.imageUrl) {
          setBanner(b);
        }
      } catch (err) {
        console.error('Failed to load hero banner', err);
      }
    }
    loadBanner();

    const handleProductsUpdated = () => {
      loadData();
    };

    const handleBannerUpdated = (e: any) => {
      if (e.detail) {
        setBanner(e.detail);
      } else {
        loadBanner();
      }
    };

    // Cross-tab synchronization when updated in another tab
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'sensein_hero_banner' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setBanner((prev) => ({ ...prev, ...parsed }));
        } catch (_) {}
      }
    };

    window.addEventListener('sensein-products-updated', handleProductsUpdated);
    window.addEventListener('sensein-banner-updated', handleBannerUpdated);
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('sensein-products-updated', handleProductsUpdated);
      window.removeEventListener('sensein-banner-updated', handleBannerUpdated);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      checkScrollButtons();
      container.addEventListener('scroll', checkScrollButtons, { passive: true });
      window.addEventListener('resize', checkScrollButtons);
      return () => {
        container.removeEventListener('scroll', checkScrollButtons);
        window.removeEventListener('resize', checkScrollButtons);
      };
    }
  }, [bestsellers]);

  const activeImage = banner.imageUrl || DEFAULT_HERO_BANNER.imageUrl;

  return (
    <div className="space-y-12 sm:space-y-20 lg:space-y-24">
      {/* 1. EDITORIAL HERO SECTION */}
      <section className="relative w-full min-h-[500px] sm:min-h-[580px] lg:min-h-[640px] flex items-center justify-center bg-[#150A14] overflow-hidden">
        {/* Background Image: High-priority immediate rendering */}
        <div className="absolute inset-0 z-0">
          <img
            src={activeImage}
            alt={banner.title || 'SENSEIN Luxury Fragrance & Elixir'}
            fetchPriority="high"
            decoding="sync"
            loading="eager"
            className="w-full h-full object-cover object-center filter brightness-[0.85] contrast-[1.08] transition-all duration-300"
          />
          {/* Dynamic darkness overlay */}
          <div
            className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-300"
            style={{ opacity: (banner.overlayDarkness ?? 40) / 100 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#150A14] via-transparent to-black/50 pointer-events-none" />
        </div>

        {/* Hero Content Centered */}
        <div
          className={`relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 lg:py-28 flex flex-col ${
            banner.textAlign === 'left'
              ? 'items-start text-left'
              : banner.textAlign === 'right'
              ? 'items-end text-right'
              : 'items-center text-center'
          }`}
        >
          {banner.badge && (
            <span className="inline-block text-[10px] sm:text-xs uppercase tracking-[0.25em] font-bold text-gold/90 bg-black/40 backdrop-blur-md px-3.5 py-1 rounded-full border border-gold/30 mb-4 drop-shadow-md">
              {banner.badge}
            </span>
          )}

          <h1 className="font-display text-3xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight leading-[1.14] text-white uppercase drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
            {banner.title || DEFAULT_HERO_BANNER.title}
          </h1>

          <p className="mt-4 sm:mt-5 text-xs sm:text-sm md:text-base text-white/90 font-light max-w-xl mx-auto leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
            {banner.subtitle || DEFAULT_HERO_BANNER.subtitle}
          </p>

          <div className="mt-7 sm:mt-8">
            <Link
              href={banner.ctaLink || '/shop'}
              className="inline-flex items-center justify-center px-8 py-3.5 sm:px-10 sm:py-4 bg-[#5A3859] hover:bg-[#6D436C] text-white text-xs sm:text-[13px] font-bold uppercase tracking-[0.2em] rounded-sm transition-all duration-300 shadow-2xl hover:shadow-[0_10px_25px_-5px_rgba(90,56,89,0.5)] transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {banner.ctaText || 'EXPLORE COLLECTION'}
            </Link>
          </div>
        </div>

        {/* Rounded Bottom Arc Divider */}
        {banner.showArc !== false && (
          <div className="absolute -bottom-[1px] left-0 right-0 w-full overflow-hidden leading-none z-20 pointer-events-none">
            <svg
              viewBox="0 0 1440 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-6 sm:h-9 lg:h-12 block"
              preserveAspectRatio="none"
            >
              <path
                d="M0,0 Q720,55 1440,0 L1440,60 L0,60 Z"
                fill="#FAF7F5"
              />
            </svg>
          </div>
        )}
      </section>

      {/* 2. CURATED SALON FORMULATION CATEGORIES */}
      <section className="py-4 sm:py-6 border-y border-border bg-white overflow-hidden select-none">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] font-semibold text-charcoal-muted mb-3 sm:mb-4">
            Curated Salon Categories
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-around gap-4 sm:gap-8">
            <span className="font-sans text-xs sm:text-lg lg:text-xl font-extrabold tracking-widest text-charcoal">
              HAIR CARE
            </span>
            <span className="font-sans text-xs sm:text-lg lg:text-xl font-bold tracking-wider text-charcoal">
              SCALP CARE
            </span>
            <span className="font-sans text-xs sm:text-lg lg:text-xl font-extrabold tracking-widest text-charcoal">
              SKIN CARE
            </span>
            <span className="font-sans text-xs sm:text-lg lg:text-xl font-bold tracking-widest text-charcoal">
              HAIR STYLING
            </span>
            <span className="font-sans text-xs sm:text-lg lg:text-xl font-extrabold tracking-wider text-charcoal">
              SALON ESSENTIALS
            </span>
          </div>
        </div>
      </section>

      {/* 3. GAMIFIED MILESTONE CALLOUT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#5A3859] text-white rounded-sm p-5 sm:p-8 shadow-luxury relative overflow-hidden border border-[#764A75]/30">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6">
            <div className="space-y-1.5 sm:space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 text-[#E8D5C4] text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em]">
                <Gift className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37]" /> Privilege Unlocks
              </div>
              <h3 className="font-sans text-xl sm:text-3xl font-bold leading-snug tracking-tight text-white">
                Luxury Tier Gifts with Every Order
              </h3>
              <p className="text-xs sm:text-sm text-white/85 max-w-xl leading-relaxed font-light">
                Unlock complimentary deluxe samples at ₹999, our Rosewood & Velvet Travel Pouch at ₹1,999, and a Full-Size French Plum Elixir (₹1,499 value) at ₹2,999.
              </p>
            </div>
            <Link
              href="/shop"
              className="w-full sm:w-auto text-center flex-shrink-0 px-7 py-3.5 bg-white hover:bg-[#FAF7F5] text-[#5A3859] hover:text-[#432542] text-xs font-bold uppercase tracking-widest rounded-sm transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Start Curating Your Bag
            </Link>
          </div>
        </div>
      </section>

      {/* 4. BESTSELLER FORMULATIONS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 sm:mb-8 pb-3 sm:pb-4 border-b border-border">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-plum block">
              Curated Formulations
            </span>
            <h2 className="font-sans text-2xl sm:text-4xl font-bold text-charcoal mt-1 tracking-tight">
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

        {/* Carousel Container */}
        <div className="relative group">
          {/* Circular Previous Button */}
          <button
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            className={`absolute -left-2 sm:-left-4 top-[36%] -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-md border border-neutral-200/90 flex items-center justify-center text-charcoal hover:bg-neutral-50 hover:scale-105 active:scale-95 transition-all duration-200 ${
              !canScrollLeft ? 'opacity-30 cursor-not-allowed pointer-events-none' : 'opacity-90 hover:opacity-100'
            }`}
            aria-label="Previous products"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-charcoal" />
          </button>

          {/* Circular Next Button */}
          <button
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            className={`absolute -right-2 sm:-right-4 top-[36%] -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-md border border-neutral-200/90 flex items-center justify-center text-charcoal hover:bg-neutral-50 hover:scale-105 active:scale-95 transition-all duration-200 ${
              !canScrollRight ? 'opacity-30 cursor-not-allowed pointer-events-none' : 'opacity-90 hover:opacity-100'
            }`}
            aria-label="Next products"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-charcoal" />
          </button>

          {/* Single-Row Product Carousel */}
          {loading ? (
            <div className="flex gap-3 sm:gap-4 lg:gap-6 overflow-hidden py-1">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="shrink-0 w-[calc(50%-6px)] sm:w-[calc(33.333%-11px)] lg:w-[calc(25%-18px)] bg-white p-4 h-80 animate-pulse rounded-md border border-border"
                />
              ))}
            </div>
          ) : (
            <div
              ref={scrollContainerRef}
              className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar pb-3 pt-1 px-1 -mx-1"
            >
              {bestsellers.map((product) => (
                <div
                  key={product.id}
                  className="shrink-0 snap-start w-[calc(50%-6px)] sm:w-[calc(33.333%-11px)] lg:w-[calc(25%-18px)] flex flex-col"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 6. REAL PEOPLE REAL RESULTS 3D CAROUSEL */}
      <RealResultsCarousel />

      {/* 7. DIGITS DON'T LIE - BEFORE & AFTER INTERACTIVE SLIDER */}
      <BeforeAfterSection />

      {/* 8. WHY CHOOSE SENSEIN? */}
      <WhyChooseSensein />

      {/* 9. WHOLESALE & SALON PARTNERSHIP TEASER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF7F5] border border-border p-6 sm:p-12 rounded-sm flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
          <div className="space-y-2.5 sm:space-y-3 text-center md:text-left">
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-plum block">
              B2B Enterprise Concierge
            </span>
            <h3 className="font-sans text-xl sm:text-3xl font-bold text-charcoal tracking-tight">
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
