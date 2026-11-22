'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Sparkles, Star, ChevronLeft, ChevronRight, Video as VideoIcon, Play } from 'lucide-react';
import {
  ShowcaseConfig,
  ShowcaseCard,
  DEFAULT_SHOWCASE_CONFIG,
  fetchShowcaseConfig,
} from '@/lib/api';

function isVideoMedia(card: ShowcaseCard): boolean {
  if (card.mediaType === 'video') return true;
  const url = (card.videoUrl || card.mediaUrl || card.image || '').toLowerCase();
  return (
    url.endsWith('.mp4') ||
    url.endsWith('.webm') ||
    url.endsWith('.mov') ||
    url.endsWith('.ogg') ||
    url.includes('/video/upload/') ||
    url.includes('stream') ||
    url.includes('video')
  );
}

export function RealResultsCarousel() {
  const [config, setConfig] = useState<ShowcaseConfig>(DEFAULT_SHOWCASE_CONFIG);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const cards = config.cards && config.cards.length > 0 ? config.cards : DEFAULT_SHOWCASE_CONFIG.cards;

  // Load live showcase configuration & listen to instant updates
  useEffect(() => {
    async function loadConfig() {
      try {
        const data = await fetchShowcaseConfig();
        if (data && Array.isArray(data.cards) && data.cards.length > 0) {
          setConfig(data);
        }
      } catch (err) {
        console.error('Failed to load showcase config:', err);
      }
    }
    loadConfig();

    const handleUpdate = (e: any) => {
      if (e.detail) {
        setConfig(e.detail);
      } else {
        loadConfig();
      }
    };

    window.addEventListener('sensein-showcase-updated', handleUpdate);
    return () => {
      window.removeEventListener('sensein-showcase-updated', handleUpdate);
    };
  }, []);

  // Detect mobile screen for responsive spacing
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Automatic change interval
  useEffect(() => {
    if (isPaused || config.autoRotate === false) return;
    const intervalMs = config.rotationIntervalMs || 2000;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % cards.length);
    }, intervalMs);
    return () => clearInterval(interval);
  }, [isPaused, config.autoRotate, config.rotationIntervalMs, cards.length]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % cards.length);
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
        {config.badge && (
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-plum/20 bg-plum/5 text-plum text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-gold fill-gold" />
            {config.badge}
          </div>
        )}

        {/* Section Heading */}
        <h2 className="font-sans text-3xl sm:text-5xl font-black text-charcoal uppercase tracking-tight">
          {config.title || 'REAL PEOPLE. REAL RESULTS.'}
        </h2>

        {/* Section Subtitle */}
        <p className="text-xs sm:text-sm text-charcoal-muted max-w-lg mx-auto mt-2 font-normal">
          {config.subtitle || 'Experience salon-grade transformations verified by clinical hair specialists.'}
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
            {cards.map((card, idx) => {
              const total = cards.length;
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
                  key={card.id || idx}
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

                  {/* Media Content (Photo or Video) */}
                  {isVideoMedia(card) ? (
                    <video
                      src={card.videoUrl || card.mediaUrl || card.image}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <img
                      src={card.mediaUrl || card.image}
                      alt={card.name || 'SENSEIN'}
                      className="w-full h-full object-cover object-center transform transition-transform duration-700"
                    />
                  )}

                  {/* Video Reel Badge if Video */}
                  {isVideoMedia(card) && (
                    <div className="absolute top-3.5 right-3.5 z-30 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20 flex items-center gap-1 text-[9px] text-white font-medium shadow-md pointer-events-none">
                      <Play className="w-2.5 h-2.5 fill-white text-white" />
                      <span>REEL</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Carousel Indicator Dots */}
        <div className="flex items-center justify-center gap-2 mt-4 sm:mt-6">
          {cards.map((_, idx) => (
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
