'use client';

import React, { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

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
    used: 'SENSEIN Keratin Bond Restorative Mask',
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
    used: 'SENSEIN Intense Hydration Mask',
    productSlug: '/shop?category=Mask',
    beforeImage: '/images/transformations/curls-before.jpg',
    afterImage: '/images/transformations/curls-after.jpg',
    initialPos: 40,
  },
  {
    id: 'bond-repair',
    badge: 'BOND REPAIR',
    price: 1149,
    title: 'Chemically Treated Hair to Deep Rebuilt Strength',
    used: 'SENSEIN Bond Repair Shampoo',
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

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    updatePosition(e.clientX);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-luxury transition-all duration-300 flex flex-col">
      {/* Top Header Labels */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border/70 text-[11px] font-bold tracking-widest text-charcoal uppercase select-none">
        <span>BEFORE</span>
        <span>AFTER</span>
      </div>

      {/* Interactive Image Split Stage */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => setIsDragging(false)}
        className="relative aspect-[3/4] w-full overflow-hidden select-none cursor-ew-resize touch-none"
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

        {/* Vertical Divider Line */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-white shadow-[0_0_10px_rgba(0,0,0,0.6)] z-20 pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        />

        {/* Circular Drag Handle */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-2xl border border-border flex items-center justify-center text-charcoal z-30 pointer-events-none transition-transform duration-150 ${
            isDragging ? 'scale-115 shadow-plum/30' : 'scale-100'
          }`}
          style={{ left: `${sliderPos}%` }}
        >
          {/* Custom SVG double arrow <> */}
          <svg className="w-3.5 h-3.5 text-charcoal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="8 17 3 12 8 7" />
            <polyline points="16 7 21 12 16 17" />
          </svg>
        </div>
      </div>

      {/* Card Info Details */}
      <div className="p-5 flex-1 flex flex-col justify-between bg-white">
        <div>
          {/* Badge & Price */}
          <div className="flex items-center justify-between gap-2">
            <span className="bg-plum/10 text-plum text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-[3px]">
              {item.badge}
            </span>
            <span className="text-base font-bold text-charcoal tracking-tight">
              ₹{item.price.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-serif text-[15px] sm:text-base font-bold text-charcoal mt-2.5 leading-snug line-clamp-2">
            {item.title}
          </h3>

          {/* Used Product */}
          <p className="text-xs text-charcoal-muted mt-1.5 font-light">
            Used:{' '}
            <Link href={item.productSlug} className="font-medium text-plum hover:underline">
              {item.used}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export function BeforeAfterSection() {
  return (
    <section className="py-12 sm:py-20 bg-white border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center">
          <h2 className="font-sans text-3xl sm:text-5xl font-black text-charcoal uppercase tracking-tight">
            DIGITS <span className="italic font-serif font-light text-plum">DON'T LIE</span>
          </h2>

          {/* Clinical Proof Statistics Bar */}
          <div className="max-w-3xl mx-auto mt-6 sm:mt-8 bg-[#FAF7F5] rounded-2xl border border-border/80 p-5 sm:p-7 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-border">
              {/* Stat 1 */}
              <div className="flex items-center justify-center gap-3 pt-2 sm:pt-0 sm:px-4">
                <span className="text-3xl sm:text-4xl font-serif font-bold text-charcoal tracking-tight">
                  97%
                </span>
                <span className="text-xs text-charcoal-muted leading-tight text-left max-w-[130px]">
                  wave or curl hold all day long
                </span>
              </div>

              {/* Stat 2 */}
              <div className="flex items-center justify-center gap-3 pt-4 sm:pt-0 sm:px-4">
                <span className="text-3xl sm:text-4xl font-serif font-bold text-charcoal tracking-tight">
                  92%
                </span>
                <span className="text-xs text-charcoal-muted leading-tight text-left max-w-[130px]">
                  better hair definition
                </span>
              </div>

              {/* Stat 3 */}
              <div className="flex items-center justify-center gap-3 pt-4 sm:pt-0 sm:px-4">
                <span className="text-3xl sm:text-4xl font-serif font-bold text-charcoal tracking-tight">
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

        {/* 3 Interactive Split Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-10 sm:mt-14">
          {COMPARISONS.map((item) => (
            <BeforeAfterCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
