'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Gift,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from 'lucide-react';
import { ProductCard } from '@/components/product-card';
import { RealResultsCarousel } from '@/components/real-results-carousel';
import { BeforeAfterSection } from '@/components/before-after-section';
import { WhyChooseSensein } from '@/components/why-choose-sensein';
import {
  fetchProducts,
  getDeletedProductKeys,
  getCustomProductsFromStorage,
  fetchHeroBanner,
  getHeroBannerFromStorage,
  saveHeroBannerToStorage,
  DEFAULT_HERO_BANNER,
  HeroBannerConfig,
  HeroBannerSlide,
  fetchPrivilegeBanner,
  getPrivilegeBannerFromStorage,
  savePrivilegeBannerToStorage,
  DEFAULT_PRIVILEGE_BANNER,
  PrivilegeBannerConfig,
} from '@/lib/api';

interface HomePageClientProps {
  initialBanner?: HeroBannerConfig;
  initialProducts?: any[];
  initialPrivilegeBanner?: PrivilegeBannerConfig;
}

export function HomePageClient({
  initialBanner,
  initialProducts,
  initialPrivilegeBanner,
}: HomePageClientProps) {
  const [bestsellers, setBestsellers] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const deletedKeys = getDeletedProductKeys();
      const customProducts = getCustomProductsFromStorage();
      const isDeleted = (p: any) => {
        if (!deletedKeys.size) return false;
        const s = (p.slug || '').toLowerCase().trim();
        const id = (p.id || p._id || '').toString().toLowerCase().trim();
        return deletedKeys.has(s) || deletedKeys.has(id);
      };

      const fromInitial = (initialProducts || []).filter((p) => !isDeleted(p));
      const seen = new Set(fromInitial.map((p) => (p.slug || p.id || '').toLowerCase()));
      const extraCustom = customProducts.filter(
        (p) => !isDeleted(p) && !seen.has((p.slug || p.id || '').toLowerCase())
      );
      return [...extraCustom, ...fromInitial];
    }
    return initialProducts || [];
  });
  const [loading, setLoading] = useState(!initialProducts || initialProducts.length === 0);
  const [banner, setBanner] = useState<HeroBannerConfig>(() => {
    if (initialBanner && initialBanner.title) {
      return initialBanner;
    }
    return DEFAULT_HERO_BANNER;
  });
  const [privilegeBanner, setPrivilegeBanner] = useState<PrivilegeBannerConfig>(() => {
    if (initialPrivilegeBanner && initialPrivilegeBanner.title) {
      return initialPrivilegeBanner;
    }
    return DEFAULT_PRIVILEGE_BANNER;
  });

  // --- SLIDESHOW STATE ---
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  // Extract active slides
  const rawSlides: HeroBannerSlide[] =
    banner.slides && Array.isArray(banner.slides) && banner.slides.length > 0
      ? banner.slides
      : [
        {
          id: 'slide-1',
          badge: banner.badge,
          title: banner.title || DEFAULT_HERO_BANNER.title,
          subtitle: banner.subtitle || DEFAULT_HERO_BANNER.subtitle,
          ctaText: banner.ctaText || DEFAULT_HERO_BANNER.ctaText,
          ctaLink: banner.ctaLink || DEFAULT_HERO_BANNER.ctaLink,
          imageUrl: banner.imageUrl || DEFAULT_HERO_BANNER.imageUrl,
          overlayDarkness: banner.overlayDarkness ?? 40,
          textAlign: banner.textAlign || 'center',
          isActive: true,
        },
      ];

  const activeSlides = rawSlides.filter((s) => s.isActive !== false);
  const slidesToRender = activeSlides.length > 0 ? activeSlides : rawSlides;

  // Boundary check on slide index
  useEffect(() => {
    if (currentSlideIndex >= slidesToRender.length) {
      setCurrentSlideIndex(0);
    }
  }, [slidesToRender.length, currentSlideIndex]);

  // Autoplay timer
  useEffect(() => {
    const isAutoplayEnabled = banner.autoplay !== false;
    if (!isAutoplayEnabled || slidesToRender.length <= 1 || isPaused) {
      return;
    }

    const intervalSeconds = banner.autoplayIntervalSeconds || 5;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slidesToRender.length);
    }, intervalSeconds * 1000);

    return () => clearInterval(timer);
  }, [banner.autoplay, banner.autoplayIntervalSeconds, slidesToRender.length, isPaused]);

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev === 0 ? slidesToRender.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % slidesToRender.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNextSlide();
      } else {
        handlePrevSlide();
      }
    }
    touchStartXRef.current = null;
  };

  // --- BESTSELLERS CAROUSEL CONTROLS ---
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
        if (data && Array.isArray(data.products)) {
          setBestsellers(data.products);
        }
      } catch (err) {
        console.error('Failed to load bestsellers', err);
      } finally {
        setLoading(false);
      }
    }

    // Always fetch fresh products on client mount so deletions and additions sync immediately
    loadData();

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

    async function loadPrivilegeBanner() {
      try {
        const pb = await fetchPrivilegeBanner();
        if (pb && pb.title) {
          setPrivilegeBanner(pb);
        }
      } catch (err) {
        console.error('Failed to load privilege banner', err);
      }
    }
    loadPrivilegeBanner();

    if (typeof window !== 'undefined') {
      const storedPb = getPrivilegeBannerFromStorage();
      if (storedPb && storedPb.title) {
        setPrivilegeBanner(storedPb);
      }
    }

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

    const handlePrivilegeBannerUpdated = (e: any) => {
      if (e.detail) {
        setPrivilegeBanner(e.detail);
      } else {
        loadPrivilegeBanner();
      }
    };

    // Cross-tab synchronization when updated in another tab
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'sensein_hero_banner' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setBanner((prev) => ({ ...prev, ...parsed }));
        } catch (_) { }
      }
      if (e.key === 'sensein_privilege_banner' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setPrivilegeBanner((prev) => ({ ...prev, ...parsed }));
        } catch (_) { }
      }
      if (e.key === 'sensein_custom_products' || e.key === 'sensein_deleted_products') {
        loadData();
      }
    };

    window.addEventListener('sensein-products-updated', handleProductsUpdated);
    window.addEventListener('sensein-banner-updated', handleBannerUpdated);
    window.addEventListener('sensein-privilege-banner-updated', handlePrivilegeBannerUpdated);
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('sensein-products-updated', handleProductsUpdated);
      window.removeEventListener('sensein-banner-updated', handleBannerUpdated);
      window.removeEventListener('sensein-privilege-banner-updated', handlePrivilegeBannerUpdated);
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

  return (
    <div className="space-y-12 sm:space-y-20 lg:space-y-24">
      {/* 1. EDITORIAL HERO SLIDESHOW SECTION */}
      <section
        className="relative w-full min-h-[520px] sm:min-h-[600px] lg:min-h-[660px] flex items-center justify-center bg-[#150A14] overflow-hidden select-none group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Render each slide as a layered absolute pane with smooth crossfade */}
        {slidesToRender.map((slide, idx) => {
          const isCurrent = idx === currentSlideIndex;
          const slideImage = slide.imageUrl || DEFAULT_HERO_BANNER.imageUrl;

          return (
            <div
              key={slide.id || `slide-${idx}`}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              aria-hidden={!isCurrent}
            >
              {/* Background Photography with Depth Filter */}
              <div className="absolute inset-0 z-0">
                <img
                  src={slideImage}
                  alt={slide.title || 'SENSEIN Luxury Fragrance & Formulation'}
                  fetchPriority={idx === 0 ? 'high' : 'auto'}
                  decoding="sync"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  className="w-full h-full object-cover object-center filter brightness-[0.85] contrast-[1.08] transition-transform duration-1000 transform scale-100"
                />
                {/* Dynamic Darkness Overlay */}
                <div
                  className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-300"
                  style={{ opacity: (slide.overlayDarkness ?? banner.overlayDarkness ?? 40) / 100 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#150A14] via-transparent to-black/50 pointer-events-none" />
              </div>

              {/* Slide Content Centered or Aligned */}
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <div
                  className={`w-full max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 lg:py-28 flex flex-col ${slide.textAlign === 'left'
                    ? 'items-start text-left'
                    : slide.textAlign === 'right'
                      ? 'items-end text-right'
                      : 'items-center text-center'
                    }`}
                >
                  {slide.badge && (
                    <span className="inline-block text-[10px] sm:text-xs uppercase tracking-[0.25em] font-bold text-gold/90 bg-black/40 backdrop-blur-md px-3.5 py-1 rounded-full border border-gold/30 mb-4 drop-shadow-md animate-in fade-in duration-500">
                      {slide.badge}
                    </span>
                  )}

                  <h1 className="font-display text-3xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight leading-[1.14] text-white uppercase drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)] animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {slide.title}
                  </h1>

                  <p className="mt-4 sm:mt-5 text-xs sm:text-sm md:text-base text-white/90 font-light max-w-xl mx-auto leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] animate-in fade-in slide-in-from-bottom-3 duration-700">
                    {slide.subtitle}
                  </p>

                  <div className="mt-7 sm:mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <Link
                      href={slide.ctaLink || '/shop'}
                      className="inline-flex items-center justify-center px-8 py-3.5 sm:px-10 sm:py-4 bg-[#5A3859] hover:bg-[#6D436C] text-white text-xs sm:text-[13px] font-bold uppercase tracking-[0.2em] rounded-sm transition-all duration-300 shadow-2xl hover:shadow-[0_10px_25px_-5px_rgba(90,56,89,0.5)] transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                      {slide.ctaText || 'EXPLORE COLLECTION'}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* --- SLIDESHOW NAVIGATION CONTROLS --- */}
        {slidesToRender.length > 1 && (
          <>
            {/* Left Previous Slide Button */}
            <button
              type="button"
              onClick={handlePrevSlide}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/30 hover:bg-black/60 text-white/80 hover:text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 shadow-xl opacity-80 sm:opacity-0 group-hover:opacity-100"
              aria-label="Previous banner slide"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Right Next Slide Button */}
            <button
              type="button"
              onClick={handleNextSlide}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/30 hover:bg-black/60 text-white/80 hover:text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 shadow-xl opacity-80 sm:opacity-0 group-hover:opacity-100"
              aria-label="Next banner slide"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Bottom Interactive Indicator Dots / Pills */}
            <div className="absolute bottom-6 sm:bottom-9 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 shadow-xl">
              {slidesToRender.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentSlideIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`transition-all duration-300 rounded-full ${idx === currentSlideIndex
                    ? 'w-7 sm:w-9 h-2 bg-gradient-to-r from-gold to-white shadow-md'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                    }`}
                />
              ))}
            </div>

            {/* Top Right Mini Counter Pill */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-mono tracking-widest text-white/80">
              0{currentSlideIndex + 1} / 0{slidesToRender.length}
            </div>
          </>
        )}

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
      {privilegeBanner.isActive !== false && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="text-white rounded-sm p-5 sm:p-8 shadow-luxury relative overflow-hidden border border-white/10 transition-colors duration-300"
            style={{ backgroundColor: privilegeBanner.backgroundColor || '#5A3859' }}
          >
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6">
              <div className="space-y-1.5 sm:space-y-2 text-center md:text-left">
                {privilegeBanner.badge && (
                  <div className="inline-flex items-center gap-1.5 text-[#E8D5C4] text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em]">
                    <Gift className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37]" /> {privilegeBanner.badge}
                  </div>
                )}
                <h3 className="font-sans text-xl sm:text-3xl font-bold leading-snug tracking-tight text-white">
                  {privilegeBanner.title}
                </h3>
                <p className="text-xs sm:text-sm text-white/85 max-w-xl leading-relaxed font-light">
                  {privilegeBanner.subtitle}
                </p>
              </div>
              <Link
                href={privilegeBanner.ctaLink || '/shop'}
                className="w-full sm:w-auto text-center flex-shrink-0 px-7 py-3.5 bg-white hover:bg-[#FAF7F5] text-[#5A3859] hover:text-[#432542] text-xs font-bold uppercase tracking-widest rounded-sm transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {privilegeBanner.ctaText || 'Start Curating Your Bag'}
              </Link>
            </div>
          </div>
        </section>
      )}

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
            className={`absolute -left-2 sm:-left-4 top-[36%] -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-md border border-neutral-200/90 flex items-center justify-center text-charcoal hover:bg-neutral-50 hover:scale-105 active:scale-95 transition-all duration-200 ${!canScrollLeft ? 'opacity-30 cursor-not-allowed pointer-events-none' : 'opacity-90 hover:opacity-100'
              }`}
            aria-label="Previous products"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-charcoal" />
          </button>

          {/* Circular Next Button */}
          <button
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            className={`absolute -right-2 sm:-right-4 top-[36%] -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-md border border-neutral-200/90 flex items-center justify-center text-charcoal hover:bg-neutral-50 hover:scale-105 active:scale-95 transition-all duration-200 ${!canScrollRight ? 'opacity-30 cursor-not-allowed pointer-events-none' : 'opacity-90 hover:opacity-100'
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
                  key={product.id || product.slug || product._id}
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
