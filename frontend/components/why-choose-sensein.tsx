import React from 'react';
import { ShieldCheck, Droplets, Sparkles, Lock } from 'lucide-react';

const REASONS = [
  {
    id: 'derma',
    icon: ShieldCheck,
    title: 'Dermatologically Tested',
    description: 'Gentle and clinically safe for regular hair care routines',
  },
  {
    id: 'clean',
    icon: Droplets,
    title: 'No Sulphates • No Parabens',
    description: 'Clean formulas that protect scalp health and moisture barrier',
  },
  {
    id: 'indian-hair',
    icon: Sparkles,
    title: 'Made for Indian Hair',
    description: 'Engineered for heat, humidity, hard water & urban pollution',
  },
  {
    id: 'delivery',
    icon: Lock,
    title: 'Express Courier Delivery',
    description: 'Fast doorstep delivery, live tracking & reliable COD option',
  },
];

export function WhyChooseSensein() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Heading */}
      <h2 className="text-center font-sans font-black text-2xl sm:text-3xl md:text-4xl text-charcoal uppercase tracking-tight mb-6 sm:mb-10">
        WHY CHOOSE SENSEIN?
      </h2>

      {/* 2x2 Grid on Mobile, 4 Columns on Desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {REASONS.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-border/80 p-4 sm:p-5 lg:p-6 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col lg:flex-row items-start gap-3 lg:gap-4 group"
            >
              {/* Icon Container */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-plum/5 border border-plum/10 text-plum flex items-center justify-center shrink-0 group-hover:bg-plum group-hover:text-white transition-colors duration-300">
                <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              </div>

              {/* Text Content */}
              <div className="flex-1">
                <h3 className="font-sans font-bold text-charcoal text-xs sm:text-sm lg:text-[14px] leading-snug">
                  {item.title}
                </h3>
                <p className="text-[10px] sm:text-xs text-charcoal-muted mt-1 leading-relaxed font-light">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
