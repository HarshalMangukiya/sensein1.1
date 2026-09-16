'use client';

import React from 'react';

const tickerItems = [
  { text: 'FIRST ORDER', isTag: true },
  { text: 'COMPLIMENTARY LUXURY TRAVEL SERUM ON ORDERS ABOVE ₹1,999' },
  { text: '🌿 100% CLEAN FORMULATION DERMATOLOGICALLY TESTED FREE PAN-INDIA SHIPPING' },
  { text: '⚡ USE CODE: LUXE10 FOR EXTRA PRIVILEGE DISCOUNT' },
  { text: 'PARISIAN BOTANICAL CELLULAR HAIR ARCHITECTURE' },
  { text: '✨ PAN-INDIA EXPRESS DISPATCH ON ORDERS ABOVE ₹499' },
];

export function AnnouncementBar() {
  return (
    <div className="bg-[#432542] text-white py-2.5 overflow-hidden border-b border-[#311730] select-none relative z-50">
      <div className="flex w-max animate-ticker-right hover:[animation-play-state:paused]">
        {/* First repetition */}
        <div className="flex items-center flex-shrink-0">
          {tickerItems.map((item, idx) => (
            <React.Fragment key={`rep1-${idx}`}>
              <span className="text-[11px] uppercase tracking-[0.16em] font-medium text-white/95 whitespace-nowrap px-4">
                {item.text}
              </span>
              <span className="text-gold text-[11px] font-bold select-none" aria-hidden="true">
                ✦
              </span>
            </React.Fragment>
          ))}
        </div>

        {/* Second identical repetition for infinite seamless looping */}
        <div className="flex items-center flex-shrink-0">
          {tickerItems.map((item, idx) => (
            <React.Fragment key={`rep2-${idx}`}>
              <span className="text-[11px] uppercase tracking-[0.16em] font-medium text-white/95 whitespace-nowrap px-4">
                {item.text}
              </span>
              <span className="text-gold text-[11px] font-bold select-none" aria-hidden="true">
                ✦
              </span>
            </React.Fragment>
          ))}
        </div>

        {/* Third repetition for ultra-wide displays */}
        <div className="flex items-center flex-shrink-0">
          {tickerItems.map((item, idx) => (
            <React.Fragment key={`rep3-${idx}`}>
              <span className="text-[11px] uppercase tracking-[0.16em] font-medium text-white/95 whitespace-nowrap px-4">
                {item.text}
              </span>
              <span className="text-gold text-[11px] font-bold select-none" aria-hidden="true">
                ✦
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
