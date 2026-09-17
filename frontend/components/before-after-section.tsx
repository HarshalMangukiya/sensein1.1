'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';

interface ComparisonItem {
  id: string;
  badge: string;
  price: number;
  title: string;
  used: string;
  productSlug: string;
  beforeImage: string;
  afterImage: string;
  initialPos?: number;
}

const COMPARISONS: ComparisonItem[] = [
  {
    id: 'frizz-defense',
    badge: 'FRIZZ DEFENSE',
    price: 1299,
    title: 'Frizz & Wavy to Mirror-Smooth Glass Hair',
    used: 'Sensein Damage Repair Conditioner',
    productSlug: '/product/keratin-bond-intense-restorative-hair-mask',
    beforeImage: '/images/transformations/frizz-before.jpg',
    afterImage: '/images/transformations/frizz-after.jpg',
    initialPos: 50,
  },
  {
    id: 'curl-moisture',
    badge: 'CURL MOISTURE',
    price: 1499,
    title: 'Dry Strands to Defined Bouncy Curls',
    used: 'Sensein Intense Hydration Mask',
    productSlug: '/shop?category=Mask',
    beforeImage: '/images/transformations/curls-before.jpg',
    afterImage: '/images/transformations/curls-after.jpg',
    initialPos: 45,
  },
  {
    id: 'bond-repair',
    badge: 'BOND REPAIR',
    price: 1299,
    title: 'Chemically Treated Hair to Deep Rebuilt...',
    used: 'Sensein Bond Repair Shampoo',
    productSlug: '/product/black-caviar-cellular-cleansing-shampoo',
    beforeImage: '/images/transformations/men-before.jpg',
    afterImage: '/images/transformations/men-after.jpg',
    initialPos: 50,
  },
];

function BeforeAfterCard({ item }: { item: ComparisonItem }) {
  const [sliderPos, setSliderPos] = useState(item.initialPos || 50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = Math.max(3, Math.min(97, (x / rect.width) * 100));
    setSliderPos(percentage);
  }, []);

  const handleLinePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    updatePosition(e.clientX);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (err) {}
  };

  const handleLinePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.preventDefault();
    updatePosition(e.clientX);
  };

  const handleLinePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (err) {}
    }
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleWindowPointerMove = (e: PointerEvent) => {
      updatePosition(e.clientX);
    };

    const handleWindowPointerUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('pointermove', handleWindowPointerMove);
    window.addEventListener('pointerup', handleWindowPointerUp);
    window.addEventListener('pointercancel', handleWindowPointerUp);

    return () => {
      window.removeEventListener('pointermove', handleWindowPointerMove);
      window.removeEventListener('pointerup', handleWindowPointerUp);
      window.removeEventListener('pointercancel', handleWindowPointerUp);
    };
  }, [isDragging, updatePosition]);

  return (
    <div className="bg-white rounded-2xl border border-border/80 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col">
      {/* Top Header Labels */}
      <div className="flex items-center justify-between px-3.5 py-2 text-[10px] font-bold tracking-widest text-charcoal/70 uppercase select-none">
        <span>BEFORE</span>
        <span>AFTER</span>
      </div>

      {/* Interactive Image Split Stage (Compact aspect ratio & touch-pan-y for smooth mobile scroll) */}
      <div
        ref={containerRef}
        className="relative aspect-[4/4.3] w-full overflow-hidden select-none touch-pan-y"
      >
        {/* After Image (Full Background) */}
        <img
          src={item.afterImage}
          alt={`${item.title} After`}
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
        />

        {/* Before Image (Clipped overlay) */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
          style={{
            clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
          }}
        >
          <img
            src={item.beforeImage}
            alt={`${item.title} Before`}
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
          />
        </div>

        {/* Interactive Slider Divider Line & Handle Hitbox (Click ONLY on Line to Move Left/Right) */}
        <div
          onPointerDown={handleLinePointerDown}
          onPointerMove={handleLinePointerMove}
          onPointerUp={handleLinePointerUp}
          onPointerCancel={handleLinePointerUp}
          className="absolute top-0 bottom-0 w-10 -ml-5 z-30 cursor-ew-resize touch-none flex items-center justify-center group select-none"
          style={{ left: `${sliderPos}%` }}
        >
          {/* Visible Vertical Divider Line */}
          <div className="w-[2px] h-full bg-white shadow-[0_0_6px_rgba(0,0,0,0.6)] pointer-events-none" />

          {/* Circular Drag Handle */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white shadow-lg border border-border/80 flex items-center justify-center text-charcoal pointer-events-none transition-transform duration-150 ${
              isDragging ? 'scale-115 shadow-plum/40 ring-2 ring-plum/20' : 'scale-100 group-hover:scale-110'
            }`}
          >
            {/* Custom SVG double arrow <> */}
            <svg
              className="w-3 h-3 text-charcoal"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="8 17 3 12 8 7" />
              <polyline points="16 7 21 12 16 17" />
            </svg>
          </div>
        </div>
      </div>

      {/* Card Info Details */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between bg-white">
        <div>
          {/* Badge & Price */}
          <div className="flex items-center justify-between gap-2">
            <span className="bg-[#F4EFF3] text-plum text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[3px]">
              {item.badge}
            </span>
            <span className="text-xs sm:text-sm font-bold text-charcoal tracking-tight">
              ₹{item.price.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-sans text-xs sm:text-[13px] font-bold text-charcoal mt-2 leading-snug line-clamp-1 tracking-tight">
            {item.title}
          </h3>

          {/* Used Product */}
          <p className="text-[10px] sm:text-[11px] text-charcoal-muted mt-0.5 font-light line-clamp-1">
            Used:{' '}
            <Link href={item.productSlug} className="font-medium text-plum hover:underline">
              {item.used}
            </Link>
          </p>
        </div>

        {/* Shop Solution Button (Matching Reference Screenshot) */}
        <Link
          href={item.productSlug}
          className="mt-3 w-full py-2 px-3 bg-[#1A1A1A] hover:bg-plum text-white text-[11px] font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-xs group/btn"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Shop Solution</span>
          <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

export function BeforeAfterSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

      const cardWidth = clientWidth * 0.88;
      const idx = Math.round(scrollLeft / (cardWidth || 1));
      setActiveIndex(Math.min(COMPARISONS.length - 1, Math.max(0, idx)));
    }
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.clientWidth * 0.9;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

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
  }, []);

  return (
    <section className="py-12 sm:py-20 bg-white border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center">
          <h2 className="font-sans text-3xl sm:text-5xl font-black text-charcoal uppercase tracking-tight">
            DIGITS <span className="italic font-black text-plum">DON'T LIE</span>
          </h2>

          {/* Clinical Proof Statistics Bar */}
          <div className="max-w-3xl mx-auto mt-6 sm:mt-8 bg-[#FAF7F5] rounded-2xl border border-border/80 p-5 sm:p-7 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-border">
              {/* Stat 1 */}
              <div className="flex items-center justify-center gap-3 pt-2 sm:pt-0 sm:px-4">
                <span className="text-3xl sm:text-4xl font-mono font-black text-charcoal tracking-tight">
                  97%
                </span>
                <span className="text-xs text-charcoal-muted leading-tight text-left max-w-[130px]">
                  wave or curl hold all day long
                </span>
              </div>

              {/* Stat 2 */}
              <div className="flex items-center justify-center gap-3 pt-4 sm:pt-0 sm:px-4">
                <span className="text-3xl sm:text-4xl font-mono font-black text-charcoal tracking-tight">
                  92%
                </span>
                <span className="text-xs text-charcoal-muted leading-tight text-left max-w-[130px]">
                  better hair definition
                </span>
              </div>

              {/* Stat 3 */}
              <div className="flex items-center justify-center gap-3 pt-4 sm:pt-0 sm:px-4">
                <span className="text-3xl sm:text-4xl font-mono font-black text-charcoal tracking-tight">
                  48%
                </span>
                <span className="text-xs text-charcoal-muted leading-tight text-left max-w-[130px]">
                  reduction in hair dryness
                </span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-charcoal-muted/70 text-center mt-2.5 italic">
            *based on Independent Clinical Studies, 2026
          </p>
        </div>

        {/* 3 Interactive Split Cards (Compact Max-Width & Single-Row Carousel on Mobile) */}
        <div className="relative group mt-8 sm:mt-12 max-w-4xl mx-auto">
          {/* Circular Previous Button (Mobile/Tablet) */}
          <button
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            className={`md:hidden absolute -left-2 sm:-left-3 top-[38%] -translate-y-1/2 z-40 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-md border border-neutral-200/90 flex items-center justify-center text-charcoal hover:bg-neutral-50 active:scale-95 transition-all duration-200 ${
              !canScrollLeft ? 'opacity-30 cursor-not-allowed pointer-events-none' : 'opacity-90 hover:opacity-100'
            }`}
            aria-label="Previous transformation"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-charcoal" />
          </button>

          {/* Circular Next Button (Mobile/Tablet) */}
          <button
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            className={`md:hidden absolute -right-2 sm:-right-3 top-[38%] -translate-y-1/2 z-40 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-md border border-neutral-200/90 flex items-center justify-center text-charcoal hover:bg-neutral-50 active:scale-95 transition-all duration-200 ${
              !canScrollRight ? 'opacity-30 cursor-not-allowed pointer-events-none' : 'opacity-90 hover:opacity-100'
            }`}
            aria-label="Next transformation"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-charcoal" />
          </button>

          {/* Scrollable Cards Container */}
          <div
            ref={scrollContainerRef}
            className="flex md:grid md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 overflow-x-auto md:overflow-visible scroll-smooth snap-x snap-mandatory no-scrollbar pb-3 pt-1 px-1 -mx-1"
          >
            {COMPARISONS.map((item) => (
              <div
                key={item.id}
                className="w-[260px] sm:w-[280px] md:w-auto shrink-0 snap-center md:shrink md:snap-align-none"
              >
                <BeforeAfterCard item={item} />
              </div>
            ))}
          </div>

          {/* Mobile Pagination Indicator Dots */}
          <div className="flex md:hidden items-center justify-center gap-1.5 mt-4">
            {COMPARISONS.map((item, i) => (
              <button
                key={item.id}
                onClick={() => {
                  if (scrollContainerRef.current) {
                    const scrollAmount = scrollContainerRef.current.clientWidth * 0.9 * i;
                    scrollContainerRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
                  }
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeIndex === i ? 'w-6 bg-plum' : 'w-1.5 bg-neutral-300'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
