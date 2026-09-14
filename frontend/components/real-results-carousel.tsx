'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Sparkles, Star, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';

interface CarouselCard {
  id: string;
  tag: string;
  rating: number;
  name: string;
  price: number;
  mrp: number;
  image: string;
  href: string;
}

const CAROUSEL_CARDS: CarouselCard[] = [
  {
    id: 'powder-card',
    tag: 'STYLE POWDER',
    rating: 4.8,
    name: 'SENSEIN® Volumizing Hair Style Powder',
    price: 749,
    mrp: 1199,
    image: '/images/carousel/card-powder.jpg',
    href: '/shop',
  },
  {
    id: 'wax-card',
    tag: 'CREAM WAX',
    rating: 4.8,
    name: 'SENSEIN® Soft Touch Hair Cream Wax',
    price: 749,
    mrp: 1099,
    image: '/images/carousel/card-wax.jpg',
    href: '/shop',
  },
  {
    id: 'serum-card',
    tag: 'HAIR SERUM',
    rating: 5.0,
    name: 'SENSEIN® French Plum Illuminating Serum',
    price: 1499,
    mrp: 2199,
    image: '/images/carousel/card-serum.jpg',
    href: '/product/bio-active-french-plum-illuminating-hair-serum',
  },
  {
    id: 'mask-card',
    tag: 'RESTORATIVE MASK',
    rating: 4.9,
    name: 'SENSEIN® Keratin Bond Restorative Mask',
    price: 1299,
    mrp: 1999,
    image: '/images/carousel/card-mask.jpg',
    href: '/product/keratin-bond-intense-restorative-hair-mask',
  },
  {
    id: 'shampoo-card',
    tag: 'CELLULAR SHAMPOO',
    rating: 4.8,
    name: 'SENSEIN® Black Caviar Cleansing Shampoo',
    price: 1149,
    mrp: 1699,
    image: '/images/carousel/card-shampoo.jpg',
    href: '/product/black-caviar-cellular-cleansing-shampoo',
  },
];

export function RealResultsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Detect mobile screen for responsive spacing
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Automatic change every 2 seconds (2000ms)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % CAROUSEL_CARDS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + CAROUSEL_CARDS.length) % CAROUSEL_CARDS.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % CAROUSEL_CARDS.length);
  };

  // Touch handlers for mobile swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 40) {
      handleNext();
    } else if (diff < -40) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  return (
    <section className="py-12 sm:py-20 bg-[#FAF7F5] overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-plum/20 bg-plum/5 text-plum text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-gold fill-gold" />
          REAL PEOPLE REAL RESULTS
        </div>

        {/* Section Heading */}
        <h2 className="font-sans text-3xl sm:text-5xl font-black text-charcoal uppercase tracking-tight">
          REAL PEOPLE. REAL RESULTS.
        </h2>

        {/* Section Subtitle */}
        <p className="text-xs sm:text-sm text-charcoal-muted max-w-lg mx-auto mt-2 font-normal">
          Experience salon-grade transformations verified by clinical hair specialists.
        </p>

        {/* 3D Carousel Stage */}
        <div
          className="relative mt-8 sm:mt-12 h-[450px] sm:h-[530px] flex items-center justify-center"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{ perspective: '1200px' }}
        >
          {/* Navigation Arrow Left */}
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-6 lg:left-16 z-40 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-luxury border border-border flex items-center justify-center text-charcoal hover:text-plum hover:scale-110 active:scale-95 transition duration-200 cursor-pointer"
            aria-label="Previous card"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Navigation Arrow Right */}
          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-6 lg:right-16 z-40 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-luxury border border-border flex items-center justify-center text-charcoal hover:text-plum hover:scale-110 active:scale-95 transition duration-200 cursor-pointer"
            aria-label="Next card"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Cards Deck */}
          <div className="relative w-full h-full flex items-center justify-center">
            {CAROUSEL_CARDS.map((card, idx) => {
              const total = CAROUSEL_CARDS.length;
              let offset = (idx - activeIndex) % total;
              if (offset > total / 2) offset -= total;
              if (offset < -total / 2) offset += total;

              const isCenter = offset === 0;
              const spacing = isMobile ? 80 : 165;
              const farSpacing = isMobile ? 145 : 310;

              let translateX = 0;
              let rotate = 0;
              let scale = 1;
              let zIndex = 10;
              let opacity = 1;
              let filter = 'brightness(100%)';
              let pointerEvents: 'auto' | 'none' = 'auto';

              if (offset === 0) {
                translateX = 0;
                rotate = 0;
                scale = isMobile ? 1.02 : 1.08;
                zIndex = 30;
                opacity = 1;
                filter = 'brightness(100%)';
              } else if (offset === -1) {
                translateX = -spacing;
                rotate = isMobile ? -6 : -8;
                scale = isMobile ? 0.88 : 0.88;
                zIndex = 20;
                opacity = 0.75;
                filter = 'brightness(68%)';
              } else if (offset === 1) {
                translateX = spacing;
                rotate = isMobile ? 6 : 8;
                scale = isMobile ? 0.88 : 0.88;
                zIndex = 20;
                opacity = 0.75;
                filter = 'brightness(68%)';
              } else if (offset === -2) {
                translateX = -farSpacing;
                rotate = isMobile ? -12 : -15;
                scale = isMobile ? 0.76 : 0.74;
                zIndex = 10;
                opacity = 0.45;
                filter = 'brightness(45%)';
              } else if (offset === 2) {
                translateX = farSpacing;
                rotate = isMobile ? 12 : 15;
                scale = isMobile ? 0.76 : 0.74;
                zIndex = 10;
                opacity = 0.45;
                filter = 'brightness(45%)';
              } else {
                translateX = offset > 0 ? farSpacing + 120 : -farSpacing - 120;
                rotate = offset > 0 ? 20 : -20;
                scale = 0.6;
                zIndex = 0;
                opacity = 0;
                pointerEvents = 'none';
              }

              return (
                <div
                  key={card.id}
                  onClick={() => !isCenter && setActiveIndex(idx)}
                  className={`absolute top-1/2 -translate-y-1/2 w-[220px] sm:w-[270px] md:w-[290px] h-[370px] sm:h-[460px] md:h-[490px] rounded-3xl overflow-hidden shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                    isCenter ? 'cursor-default ring-2 ring-plum/20' : 'cursor-pointer hover:opacity-90'
                  }`}
                  style={{
                    transform: `translate3d(calc(-50% + ${translateX}px), -50%, 0) rotate(${rotate}deg) scale(${scale})`,
                    left: '50%',
                    zIndex,
                    opacity,
                    filter,
                    pointerEvents,
                    boxShadow: isCenter
                      ? '0 25px 50px -12px rgba(36, 10, 20, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.15)'
                      : '0 15px 30px -10px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  {/* Phone Device Border / Bezel Frame */}
                  <div className="absolute inset-0 rounded-3xl border-[3px] border-black/80 z-20 pointer-events-none" />

                  {/* Card Background Image */}
                  <img
                    src={card.image}
                    alt={card.name}
                    className="w-full h-full object-cover object-center transform transition-transform duration-700"
                  />

                  {/* Subtle Gradient Overlays for Video/Reels Aesthetic */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 via-45% to-black/30 pointer-events-none" />

                  {/* Bottom Product Info Floating Pill (Active Card Focus) */}
                  <div
                    className={`absolute bottom-3 sm:bottom-3.5 left-2.5 sm:left-3 right-2.5 sm:right-3 bg-black/85 backdrop-blur-md rounded-xl p-2.5 sm:p-3 border border-white/15 text-left text-white shadow-2xl transition-all duration-500 z-30 ${
                      isCenter ? 'opacity-100 translate-y-0' : 'opacity-85 translate-y-1'
                    }`}
                  >
                    {/* Tag & Rating */}
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="bg-[#4D3A16] text-[#F5C754] text-[8px] sm:text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[3px] border border-[#F5C754]/30">
                        {card.tag}
                      </span>
                      <div className="flex items-center gap-1 text-[#F5C754] text-[10px] sm:text-xs font-bold">
                        <Star className="w-3 h-3 fill-[#F5C754]" />
                        <span>{card.rating}</span>
                      </div>
                    </div>

                    {/* Product Name */}
                    <div className="text-[11px] sm:text-[13px] font-bold text-white mt-1 sm:mt-1.5 line-clamp-1">
                      {card.name}
                    </div>

                    {/* Price & Shop CTA */}
                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-white/10">
                      <span className="text-xs sm:text-sm font-bold text-white">
                        ₹{card.price.toLocaleString('en-IN')}
                      </span>
                      <Link
                        href={card.href}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white hover:bg-gold-light text-charcoal font-bold text-[9px] sm:text-[10px] uppercase tracking-wider px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-[3px] transition duration-200 flex items-center gap-1 shadow hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        <ShoppingBag className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        SHOP NOW
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Carousel Indicator Dots */}
        <div className="flex items-center justify-center gap-2 mt-4 sm:mt-6">
          {CAROUSEL_CARDS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === activeIndex
                  ? 'w-6 bg-plum shadow-sm'
                  : 'w-1.5 bg-charcoal/20 hover:bg-charcoal/40'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
