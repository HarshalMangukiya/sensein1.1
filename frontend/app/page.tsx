import React from 'react';
import { HomePageClient } from '@/components/home-page-client';
import { DEFAULT_HERO_BANNER, HeroBannerConfig } from '@/lib/api';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000').replace(/\/+$/, '');

// Edge revalidation interval (seconds); instantly purged on admin update via revalidatePath('/')
export const revalidate = 30;

async function getHeroBannerServer(): Promise<HeroBannerConfig> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(`${API_BASE_URL}/content/banner`, {
      next: { revalidate: 30, tags: ['hero-banner'] },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.title) {
        if (
          (data.imageUrl && data.imageUrl.includes('sensein-hair-wax-1.jpg')) ||
          (data.title && data.title.includes('HAUTE SALON')) ||
          (data.ctaText && data.ctaText.includes('STYLING WAX'))
        ) {
          return DEFAULT_HERO_BANNER;
        }
        const imageUrl = data.imageUrl || DEFAULT_HERO_BANNER.imageUrl;
        const slides = Array.isArray(data.slides) && data.slides.length > 0 ? data.slides : [
          {
            id: 'slide-1',
            badge: data.badge ?? DEFAULT_HERO_BANNER.badge,
            title: data.title || DEFAULT_HERO_BANNER.title,
            subtitle: data.subtitle || DEFAULT_HERO_BANNER.subtitle,
            ctaText: data.ctaText || DEFAULT_HERO_BANNER.ctaText,
            ctaLink: data.ctaLink || DEFAULT_HERO_BANNER.ctaLink,
            imageUrl,
            overlayDarkness: data.overlayDarkness !== undefined ? data.overlayDarkness : DEFAULT_HERO_BANNER.overlayDarkness,
            textAlign: data.textAlign || DEFAULT_HERO_BANNER.textAlign,
            isActive: true,
          },
        ];

        return {
          badge: data.badge ?? DEFAULT_HERO_BANNER.badge,
          title: data.title || DEFAULT_HERO_BANNER.title,
          subtitle: data.subtitle || DEFAULT_HERO_BANNER.subtitle,
          ctaText: data.ctaText || DEFAULT_HERO_BANNER.ctaText,
          ctaLink: data.ctaLink || DEFAULT_HERO_BANNER.ctaLink,
          imageUrl,
          overlayDarkness: data.overlayDarkness !== undefined ? data.overlayDarkness : DEFAULT_HERO_BANNER.overlayDarkness,
          textAlign: data.textAlign || DEFAULT_HERO_BANNER.textAlign,
          showArc: data.showArc !== undefined ? data.showArc : DEFAULT_HERO_BANNER.showArc,
          isActive: data.isActive !== undefined ? data.isActive : true,
          slides,
          autoplay: data.autoplay !== undefined ? data.autoplay : true,
          autoplayIntervalSeconds: data.autoplayIntervalSeconds || 5,
        };
      }
    }
  } catch (err) {
    // Timeout or serverless cold start fallback
  }
  return DEFAULT_HERO_BANNER;
}

async function getFeaturedProductsServer(): Promise<any[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(`${API_BASE_URL}/products?sort=featured`, {
      next: { revalidate: 60, tags: ['products'] },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return data.products || [];
    }
  } catch (err) {
    // Fallback
  }
  return [];
}

export default async function HomePage() {
  const [initialBanner, initialProducts] = await Promise.all([
    getHeroBannerServer(),
    getFeaturedProductsServer(),
  ]);

  const activeImageUrl = initialBanner.imageUrl || DEFAULT_HERO_BANNER.imageUrl;

  return (
    <>
      <link rel="preload" as="image" href={activeImageUrl} fetchPriority="high" />
      <HomePageClient initialBanner={initialBanner} initialProducts={initialProducts} />
    </>
  );
}
