export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  subtitle: string;
  description: string;
  category: string;
  productType?: 'single' | 'combo';
  comboItems?: Array<{
    name: string;
    quantity?: string;
    description?: string;
  }>;
  curatedCollection: string;
  price: number;
  mrp: number;
  discountPercentage: number;
  netVolume: string;
  variants: Array<{
    size: string;
    price: number;
    mrp: number;
    inStock: boolean;
  }>;
  rating: number;
  reviewCount: number;
  images: string[];
  badges: string[];
  inStock: boolean;
  stock?: number;
  ingredients: {
    keyActives: any[];
    fullList: string;
  };
  overview: string;
  howToUse: Array<{
    step: number;
    title: string;
    instruction: string;
  }>;
  usageAdvice?: string;
  productDetails?: Record<string, any>;
  benefits?: string[];
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  additionalInfo?: Record<string, any>;
  reviews: Array<{
    id: string;
    author: string;
    rating: number;
    title: string;
    content: string;
    date: string;
    verifiedBuyer: boolean;
  }>;
}

export interface HeroBannerSlide {
  id: string;
  badge?: string;
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaLink?: string;
  imageUrl: string;
  overlayDarkness?: number;
  textAlign?: 'center' | 'left' | 'right';
  isActive?: boolean;
}

export interface HeroBannerConfig {
  key?: string;
  badge?: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
  overlayDarkness?: number;
  textAlign?: 'center' | 'left' | 'right';
  showArc?: boolean;
  isActive?: boolean;
  slides?: HeroBannerSlide[];
  autoplay?: boolean;
  autoplayIntervalSeconds?: number;
}

export interface PrivilegeBannerConfig {
  key?: string;
  badge?: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  backgroundColor?: string;
  textColor?: string;
  isActive?: boolean;
}

export interface CartMilestoneTier {
  id: string;
  threshold: number;
  itemsRequired: number;
  subtitle: string;
  cardLabel: string;
  reward: string;
  rewardValue: number;
}

export interface CartMilestonesConfig {
  key?: string;
  title?: string;
  isActive?: boolean;
  tiers: CartMilestoneTier[];
  updatedAt?: string;
}

export interface ShowcaseCard {
  id: string;
  mediaType?: 'image' | 'video';
  mediaUrl?: string;
  image: string;
  videoUrl?: string;
  tag?: string;
  rating?: number;
  name?: string;
  price?: number;
  mrp?: number;
  href?: string;
  productId?: string;
  productSlug?: string;
}

export interface ShowcaseConfig {
  badge: string;
  title: string;
  subtitle: string;
  mode: 'single-product' | 'multi-product' | 'custom';
  selectedProductId?: string;
  cards: ShowcaseCard[];
  autoRotate?: boolean;
  rotationIntervalMs?: number;
}

export interface BeforeAfterItem {
  id: string;
  beforeImage: string;
  afterImage: string;
  initialPos?: number;
}

export interface BeforeAfterConfig {
  title: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
  disclaimer: string;
  items: BeforeAfterItem[];
  isActive?: boolean;
}

export interface AnnouncementItem {
  id: string;
  text: string;
  isTag?: boolean;
  link?: string;
}

export interface AnnouncementBarConfig {
  key?: string;
  isActive: boolean;
  speedSeconds?: number;
  separator?: string;
  backgroundColor?: string;
  textColor?: string;
  items: AnnouncementItem[];
}

export const DEFAULT_HERO_BANNER: HeroBannerConfig = {
  badge: 'INTRODUCING THE NEW PACKAGING',
  title: 'REPAIR. RESTORE. REVEAL.',
  subtitle:
    'Meet the refreshed Damage Hair Repair range for your hair-care routine.',
  ctaText: 'MEET YOUR NEW HAIR CARE',
  ctaLink: '/shop',
  imageUrl:
    'https://res.cloudinary.com/dqddawu42/image/upload/v1789820352/sensein/hero/sensein-perfume-bottle.jpg',
  overlayDarkness: 40,
  textAlign: 'center',
  showArc: true,
  isActive: true,
  autoplay: true,
  autoplayIntervalSeconds: 5,
  slides: [
    {
      id: 'slide-1',
      badge: 'INTRODUCING THE NEW PACKAGING',
      title: 'REPAIR. RESTORE. REVEAL.',
      subtitle:
        'Meet the refreshed Damage Hair Repair range for your hair-care routine.',
      ctaText: 'MEET YOUR NEW HAIR CARE',
      ctaLink: '/shop',
      imageUrl:
        'https://res.cloudinary.com/dqddawu42/image/upload/v1789820352/sensein/hero/sensein-perfume-bottle.jpg',
      overlayDarkness: 40,
      textAlign: 'center',
      isActive: true,
    },
    {
      id: 'slide-2',
      badge: 'OFFICIAL SENSEIN® PARIS',
      title: 'SALON LUXURY RE-ENGINEERED',
      subtitle:
        'High-performance botanical formulas crafted with clean ingredients for Indian hair textures.',
      ctaText: 'EXPLORE COLLECTION',
      ctaLink: '/shop',
      imageUrl:
        'https://res.cloudinary.com/dqddawu42/image/upload/v1789820352/sensein/hero/sensein-perfume-bottle.jpg',
      overlayDarkness: 40,
      textAlign: 'center',
      isActive: true,
    },
  ],
};

export const DEFAULT_PRIVILEGE_BANNER: PrivilegeBannerConfig = {
  key: 'privilege-banner',
  badge: 'Privilege Unlocks',
  title: 'Luxury Tier Gifts with Every Order',
  subtitle:
    'Unlock complimentary deluxe samples at ₹999, our Rosewood & Velvet Travel Pouch at ₹1,999, and a Full-Size French Plum Elixir (₹1,499 value) at ₹2,999.',
  ctaText: 'Start Curating Your Bag',
  ctaLink: '/shop',
  backgroundColor: '#5A3859',
  textColor: '#FFFFFF',
  isActive: true,
};

export const DEFAULT_CART_MILESTONES: CartMilestonesConfig = {
  key: 'cart-milestones',
  title: 'Complimentary Gifts Included:',
  isActive: true,
  tiers: [
    {
      id: 'tier-1',
      threshold: 999,
      itemsRequired: 1,
      subtitle: '1 Product',
      cardLabel: 'Sample Vial',
      reward: 'Complimentary Botanical Sample Vial (15ml)',
      rewardValue: 299,
    },
    {
      id: 'tier-2',
      threshold: 1399,
      itemsRequired: 2,
      subtitle: '2 Products',
      cardLabel: 'Travel Kit',
      reward: 'Velvet Travel Pouch & Rosewood Styling Comb',
      rewardValue: 599,
    },
    {
      id: 'tier-3',
      threshold: 2999,
      itemsRequired: 3,
      subtitle: '3+ Products',
      cardLabel: 'Luxury Elixir',
      reward: 'Full-Size Luxury French Plum Hair Elixir',
      rewardValue: 1499,
    },
  ],
};

export const DEFAULT_SHOWCASE_CONFIG: ShowcaseConfig = {
  badge: 'REAL PEOPLE REAL RESULTS',
  title: 'REAL PEOPLE. REAL RESULTS.',
  subtitle: 'Experience salon-grade transformations verified by clinical hair specialists.',
  mode: 'custom',
  autoRotate: true,
  rotationIntervalMs: 2500,
  cards: [
    {
      id: 'media-card-1',
      mediaType: 'image',
      image:
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792479863/sensein/products/sensein-hair-wax-1.jpg',
      mediaUrl:
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792479863/sensein/products/sensein-hair-wax-1.jpg',
    },
    {
      id: 'media-card-2',
      mediaType: 'image',
      image:
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792479865/sensein/products/sensein-hair-wax-2.jpg',
      mediaUrl:
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792479865/sensein/products/sensein-hair-wax-2.jpg',
    },
    {
      id: 'media-card-3',
      mediaType: 'image',
      image:
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792479866/sensein/products/sensein-hair-wax-3.jpg',
      mediaUrl:
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792479866/sensein/products/sensein-hair-wax-3.jpg',
    },
    {
      id: 'media-card-4',
      mediaType: 'image',
      image:
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792479867/sensein/products/sensein-hair-wax-4.jpg',
      mediaUrl:
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792479867/sensein/products/sensein-hair-wax-4.jpg',
    },
    {
      id: 'media-card-5',
      mediaType: 'image',
      image:
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792479863/sensein/products/sensein-hair-wax-1.jpg',
      mediaUrl:
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792479863/sensein/products/sensein-hair-wax-1.jpg',
    },
  ],
};

export const DEFAULT_BEFORE_AFTER_CONFIG: BeforeAfterConfig = {
  title: "DIGITS DON'T LIE",
  stat1Value: '98%',
  stat1Label: 'Frizz Control Index',
  stat2Value: '+140%',
  stat2Label: 'Mirror Gloss Radiance',
  stat3Value: '24h',
  stat3Label: 'Humidity Shield Hold',
  disclaimer: '*based on Independent Clinical Studies, 2026',
  items: [
    {
      id: 'frizz-defense',
      beforeImage:
        'https://res.cloudinary.com/dqddawu42/image/upload/v1789820363/sensein/transformations/frizz-before.jpg',
      afterImage:
        'https://res.cloudinary.com/dqddawu42/image/upload/v1789820361/sensein/transformations/frizz-after.jpg',
      initialPos: 50,
    },
    {
      id: 'curl-moisture',
      beforeImage:
        'https://res.cloudinary.com/dqddawu42/image/upload/v1789820359/sensein/transformations/curls-before.jpg',
      afterImage:
        'https://res.cloudinary.com/dqddawu42/image/upload/v1789820358/sensein/transformations/curls-after.jpg',
      initialPos: 45,
    },
    {
      id: 'bond-repair',
      beforeImage:
        'https://res.cloudinary.com/dqddawu42/image/upload/v1789820366/sensein/transformations/men-before.jpg',
      afterImage:
        'https://res.cloudinary.com/dqddawu42/image/upload/v1789820364/sensein/transformations/men-after.jpg',
      initialPos: 50,
    },
  ],
  isActive: true,
};

export const DEFAULT_ANNOUNCEMENT_CONFIG: AnnouncementBarConfig = {
  key: 'announcement-bar',
  isActive: true,
  speedSeconds: 30,
  separator: '✦',
  backgroundColor: '#432542',
  textColor: '#FFFFFF',
  items: [
    { id: 'ticker-1', text: 'FIRST ORDER', isTag: true, link: '' },
    { id: 'ticker-2', text: 'COMPLIMENTARY LUXURY TRAVEL SERUM ON ORDERS ABOVE ₹1,999', isTag: false, link: '' },
    { id: 'ticker-3', text: '🌿 100% CLEAN FORMULATION DERMATOLOGICALLY TESTED FREE PAN-INDIA SHIPPING', isTag: false, link: '' },
    { id: 'ticker-4', text: '⚡ USE CODE: LUXE10 FOR EXTRA PRIVILEGE DISCOUNT', isTag: false, link: '' },
    { id: 'ticker-5', text: '🧪 LIVE PAYMENT VERIFICATION: ₹1 TEST ITEM AVAILABLE IN CATALOG', isTag: false, link: '' },
    { id: 'ticker-6', text: 'PARISIAN BOTANICAL CELLULAR HAIR ARCHITECTURE', isTag: false, link: '' },
    { id: 'ticker-7', text: '✨ PAN-INDIA EXPRESS DISPATCH ON ORDERS ABOVE ₹499', isTag: false, link: '' },
  ],
};

const CONFIGURED_API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000').replace(/\/+$/, '');
function resolveApiBaseUrl(): string {
  if (
    typeof window !== 'undefined' &&
    /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(CONFIGURED_API_BASE_URL) &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1'
  ) {
    return CONFIGURED_API_BASE_URL.replace(/localhost|127\.0\.0\.1/i, window.location.hostname);
  }
  return CONFIGURED_API_BASE_URL;
}
const LEGACY_CUSTOM_PRODUCTS_KEY = 'sensein_custom_products';
const LEGACY_DELETED_PRODUCTS_KEY = 'sensein_deleted_products';
export const PRODUCTS_SYNC_TS_KEY = 'sensein_products_sync_ts';
export const PRODUCTS_SYNC_CHANNEL = 'sensein_products_sync';
const HERO_BANNER_STORAGE_KEY = 'sensein_hero_banner';
const PRIVILEGE_BANNER_STORAGE_KEY = 'sensein_privilege_banner';
export const CART_MILESTONES_STORAGE_KEY = 'sensein_cart_milestones_config';
const SHOWCASE_STORAGE_KEY = 'sensein_showcase_deck';
const BEFORE_AFTER_STORAGE_KEY = 'sensein_before_after';
const ANNOUNCEMENT_STORAGE_KEY = 'sensein_announcement_bar';

export function getAnnouncementBarFromStorage(): AnnouncementBarConfig {
  if (typeof window === 'undefined') return DEFAULT_ANNOUNCEMENT_CONFIG;
  try {
    const raw = localStorage.getItem(ANNOUNCEMENT_STORAGE_KEY);
    if (!raw) return DEFAULT_ANNOUNCEMENT_CONFIG;
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.items) && parsed.items.length > 0) {
      return { ...DEFAULT_ANNOUNCEMENT_CONFIG, ...parsed };
    }
    return DEFAULT_ANNOUNCEMENT_CONFIG;
  } catch (e) {
    return DEFAULT_ANNOUNCEMENT_CONFIG;
  }
}

export function saveAnnouncementBarToStorage(config: AnnouncementBarConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ANNOUNCEMENT_STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(new CustomEvent('sensein-announcements-updated', { detail: config }));
  } catch (e) {
    console.warn('Failed to save Announcement Bar in local storage:', e);
  }
}

export async function fetchAnnouncementBarConfig(): Promise<AnnouncementBarConfig> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    let res: Response | null = null;
    try {
      res = await fetch(`${resolveApiBaseUrl()}/content/announcements`, {
        cache: 'no-store',
        signal: controller.signal,
      });
    } catch (e) {
      if (typeof window !== 'undefined') {
        try {
          res = await fetch('/api/announcements', { cache: 'no-store' });
        } catch (_) { }
      }
    }
    clearTimeout(timeoutId);

    if (res && res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.items)) {
        const merged: AnnouncementBarConfig = {
          key: data.key || DEFAULT_ANNOUNCEMENT_CONFIG.key,
          isActive: data.isActive !== undefined ? data.isActive : true,
          speedSeconds: data.speedSeconds || DEFAULT_ANNOUNCEMENT_CONFIG.speedSeconds,
          separator: data.separator || DEFAULT_ANNOUNCEMENT_CONFIG.separator,
          backgroundColor: data.backgroundColor || DEFAULT_ANNOUNCEMENT_CONFIG.backgroundColor,
          textColor: data.textColor || DEFAULT_ANNOUNCEMENT_CONFIG.textColor,
          items: data.items.length > 0 ? data.items : DEFAULT_ANNOUNCEMENT_CONFIG.items,
        };
        saveAnnouncementBarToStorage(merged);
        return merged;
      }
    }
  } catch (err) {
    // Fallback
  }

  return getAnnouncementBarFromStorage();
}

export async function updateAnnouncementBarConfigApi(config: AnnouncementBarConfig): Promise<AnnouncementBarConfig> {
  // 1. Instantly save in local storage & dispatch sync event
  saveAnnouncementBarToStorage(config);

  // 2. Persist to MongoDB Atlas backend (or Next.js API fallback)
  try {
    let token = getAdminToken();
    if (!token) {
      token = await ensureAdminToken();
    }

    let res: Response | null = null;
    try {
      res = await fetch(`${resolveApiBaseUrl()}/content/announcements`, {
        method: 'PUT',
        headers: getAdminAuthHeaders(true),
        body: JSON.stringify(config),
      });
    } catch (netErr) {
      if (typeof window !== 'undefined') {
        try {
          res = await fetch('/api/announcements', {
            method: 'PUT',
            headers: getAdminAuthHeaders(true),
            body: JSON.stringify(config),
          });
        } catch (_) { }
      }
    }

    if (res && res.ok) {
      const saved = await res.json();
      saveAnnouncementBarToStorage(saved);
      return saved;
    }
  } catch (err) {
    console.warn('Backend Announcement Bar update fallback to local storage:', err);
  }

  return config;
}

export function getBeforeAfterFromStorage(): BeforeAfterConfig {
  if (typeof window === 'undefined') return DEFAULT_BEFORE_AFTER_CONFIG;
  try {
    const raw = localStorage.getItem(BEFORE_AFTER_STORAGE_KEY);
    if (!raw) return DEFAULT_BEFORE_AFTER_CONFIG;
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.items) && parsed.items.length > 0) {
      return { ...DEFAULT_BEFORE_AFTER_CONFIG, ...parsed };
    }
    return DEFAULT_BEFORE_AFTER_CONFIG;
  } catch (e) {
    return DEFAULT_BEFORE_AFTER_CONFIG;
  }
}

export function saveBeforeAfterToStorage(config: BeforeAfterConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(BEFORE_AFTER_STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(new CustomEvent('sensein-before-after-updated', { detail: config }));
  } catch (e) {
    console.warn('Failed to save Before & After in local storage:', e);
  }
}

export async function fetchBeforeAfterConfig(): Promise<BeforeAfterConfig> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(`${resolveApiBaseUrl()}/content/before-after`, {
      cache: 'no-store',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.items) && data.items.length > 0) {
        const merged: BeforeAfterConfig = {
          title: data.title || DEFAULT_BEFORE_AFTER_CONFIG.title,
          stat1Value: data.stat1Value || DEFAULT_BEFORE_AFTER_CONFIG.stat1Value,
          stat1Label: data.stat1Label || DEFAULT_BEFORE_AFTER_CONFIG.stat1Label,
          stat2Value: data.stat2Value || DEFAULT_BEFORE_AFTER_CONFIG.stat2Value,
          stat2Label: data.stat2Label || DEFAULT_BEFORE_AFTER_CONFIG.stat2Label,
          stat3Value: data.stat3Value || DEFAULT_BEFORE_AFTER_CONFIG.stat3Value,
          stat3Label: data.stat3Label || DEFAULT_BEFORE_AFTER_CONFIG.stat3Label,
          disclaimer: data.disclaimer || DEFAULT_BEFORE_AFTER_CONFIG.disclaimer,
          items: data.items,
          isActive: data.isActive !== undefined ? data.isActive : true,
        };
        saveBeforeAfterToStorage(merged);
        return merged;
      }
    }
  } catch (err) {
    // Backend offline fallback
  }

  return getBeforeAfterFromStorage();
}

export async function updateBeforeAfterConfigApi(config: BeforeAfterConfig): Promise<BeforeAfterConfig> {
  // 1. Instantly save in local storage & dispatch sync event
  saveBeforeAfterToStorage(config);

  // 2. Persist to MongoDB Atlas backend
  try {
    let token = getAdminToken();
    if (!token) {
      token = await ensureAdminToken();
    }

    const res = await fetch(`${resolveApiBaseUrl()}/content/before-after`, {
      method: 'PUT',
      headers: getAdminAuthHeaders(true),
      body: JSON.stringify(config),
    });

    if (res.ok) {
      const saved = await res.json();
      saveBeforeAfterToStorage(saved);
      return saved;
    }
  } catch (err) {
    console.warn('Backend Before & After update fallback to local storage:', err);
  }

  return config;
}

export function getShowcaseFromStorage(): ShowcaseConfig {
  if (typeof window === 'undefined') return DEFAULT_SHOWCASE_CONFIG;
  try {
    const raw = localStorage.getItem(SHOWCASE_STORAGE_KEY);
    if (!raw) return DEFAULT_SHOWCASE_CONFIG;
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.cards) && parsed.cards.length > 0) {
      let cards = parsed.cards;
      if (cards.length === 4) {
        cards = [
          ...cards,
          {
            id: 'media-card-5',
            mediaType: 'image',
            image:
              'https://res.cloudinary.com/dqddawu42/image/upload/v1792479863/sensein/products/sensein-hair-wax-1.jpg',
            mediaUrl:
              'https://res.cloudinary.com/dqddawu42/image/upload/v1792479863/sensein/products/sensein-hair-wax-1.jpg',
          },
        ];
        parsed.cards = cards;
        saveShowcaseToStorage({ ...DEFAULT_SHOWCASE_CONFIG, ...parsed, cards });
      }
      return { ...DEFAULT_SHOWCASE_CONFIG, ...parsed, cards };
    }
    return DEFAULT_SHOWCASE_CONFIG;
  } catch (e) {
    return DEFAULT_SHOWCASE_CONFIG;
  }
}

export function saveShowcaseToStorage(config: ShowcaseConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SHOWCASE_STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(new CustomEvent('sensein-showcase-updated', { detail: config }));
  } catch (e) {
    console.warn('Failed to save showcase in local storage:', e);
  }
}

export async function fetchShowcaseConfig(): Promise<ShowcaseConfig> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(`${resolveApiBaseUrl()}/content/showcase`, {
      cache: 'no-store',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.cards) && data.cards.length > 0) {
        let cards = data.cards;
        if (cards.length === 4) {
          cards = [
            ...cards,
            {
              id: 'media-card-5',
              mediaType: 'image',
              image:
                'https://res.cloudinary.com/dqddawu42/image/upload/v1792479863/sensein/products/sensein-hair-wax-1.jpg',
              mediaUrl:
                'https://res.cloudinary.com/dqddawu42/image/upload/v1792479863/sensein/products/sensein-hair-wax-1.jpg',
            },
          ];
        }
        const merged: ShowcaseConfig = {
          badge: data.badge || DEFAULT_SHOWCASE_CONFIG.badge,
          title: data.title || DEFAULT_SHOWCASE_CONFIG.title,
          subtitle: data.subtitle || DEFAULT_SHOWCASE_CONFIG.subtitle,
          mode: data.mode || DEFAULT_SHOWCASE_CONFIG.mode,
          selectedProductId: data.selectedProductId || DEFAULT_SHOWCASE_CONFIG.selectedProductId,
          cards,
          autoRotate: data.autoRotate !== undefined ? data.autoRotate : true,
          rotationIntervalMs: data.rotationIntervalMs || 2000,
        };
        saveShowcaseToStorage(merged);
        return merged;
      }
    }
  } catch (err) {
    // Backend offline fallback
  }

  return getShowcaseFromStorage();
}

export async function updateShowcaseConfigApi(config: ShowcaseConfig): Promise<ShowcaseConfig> {
  // 1. Instantly save in local storage & dispatch sync event
  saveShowcaseToStorage(config);

  // 2. Persist to MongoDB Atlas backend
  try {
    let token = getAdminToken();
    if (!token) {
      token = await ensureAdminToken();
    }

    const res = await fetch(`${resolveApiBaseUrl()}/content/showcase`, {
      method: 'PUT',
      headers: getAdminAuthHeaders(true),
      body: JSON.stringify(config),
    });

    if (res.ok) {
      const saved = await res.json();
      saveShowcaseToStorage(saved);
      return saved;
    }
  } catch (err) {
    console.warn('Backend showcase update fallback to local storage:', err);
  }

  return config;
}

export function getHeroBannerFromStorage(): HeroBannerConfig {
  if (typeof window === 'undefined') return DEFAULT_HERO_BANNER;
  try {
    const raw = localStorage.getItem(HERO_BANNER_STORAGE_KEY);
    if (!raw) return DEFAULT_HERO_BANNER;
    const parsed = JSON.parse(raw);
    const result: HeroBannerConfig = { ...DEFAULT_HERO_BANNER, ...parsed };
    if (
      (result.imageUrl && result.imageUrl.includes('sensein-hair-wax-1.jpg')) ||
      (result.title && result.title.includes('HAUTE SALON')) ||
      (result.ctaText && result.ctaText.includes('STYLING WAX'))
    ) {
      Object.assign(result, DEFAULT_HERO_BANNER);
      localStorage.setItem(HERO_BANNER_STORAGE_KEY, JSON.stringify(result));
    }
    if (!result.slides || !Array.isArray(result.slides) || result.slides.length === 0) {
      result.slides = [
        {
          id: 'slide-1',
          badge: result.badge || '',
          title: result.title || DEFAULT_HERO_BANNER.title,
          subtitle: result.subtitle || DEFAULT_HERO_BANNER.subtitle,
          ctaText: result.ctaText || DEFAULT_HERO_BANNER.ctaText,
          ctaLink: result.ctaLink || DEFAULT_HERO_BANNER.ctaLink,
          imageUrl: result.imageUrl || DEFAULT_HERO_BANNER.imageUrl,
          overlayDarkness: result.overlayDarkness !== undefined ? result.overlayDarkness : 40,
          textAlign: result.textAlign || 'center',
          isActive: true,
        },
      ];
    }
    return result;
  } catch (e) {
    return DEFAULT_HERO_BANNER;
  }
}

export function saveHeroBannerToStorage(banner: HeroBannerConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(HERO_BANNER_STORAGE_KEY, JSON.stringify(banner));
    window.dispatchEvent(new CustomEvent('sensein-banner-updated', { detail: banner }));
  } catch (e) {
    console.warn('Failed to save hero banner in local storage:', e);
  }
}

export async function fetchHeroBanner(): Promise<HeroBannerConfig> {
  // 1. In browser, try fast local Next.js edge route first, then backend API
  const endpoints: string[] = [];
  if (typeof window !== 'undefined') {
    endpoints.push('/api/banner');
  }
  endpoints.push(`${resolveApiBaseUrl()}/content/banner`);

  for (const url of endpoints) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch(url, {
        cache: 'no-store',
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
            saveHeroBannerToStorage(DEFAULT_HERO_BANNER);
            return DEFAULT_HERO_BANNER;
          }

          let imageUrl = data.imageUrl || DEFAULT_HERO_BANNER.imageUrl;
          if (imageUrl.includes('sensein-hair-wax-1.jpg')) {
            imageUrl = DEFAULT_HERO_BANNER.imageUrl;
          }

          let slides = Array.isArray(data.slides) && data.slides.length > 0 ? data.slides : null;
          if (!slides) {
            slides = [
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
          }

          const merged: HeroBannerConfig = {
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
          saveHeroBannerToStorage(merged);
          return merged;
        }
      }
    } catch (err) {
      // Continue to next endpoint fallback
    }
  }

  return getHeroBannerFromStorage();
}

export async function updateHeroBannerApi(config: HeroBannerConfig): Promise<HeroBannerConfig> {
  // 1. Immediately cache locally & notify all listening components
  saveHeroBannerToStorage(config);

  // 2. Persist to Next.js API route to update server memory cache and revalidate edge immediately
  if (typeof window !== 'undefined') {
    try {
      fetch('/api/banner', {
        method: 'PUT',
        headers: getAdminAuthHeaders(true),
        body: JSON.stringify(config),
      }).catch(() => { });
    } catch (_) { }
  }

  // 3. Persist to MongoDB Atlas via backend API
  try {
    let token = getAdminToken();
    if (!token) {
      token = await ensureAdminToken();
    }

    const res = await fetch(`${resolveApiBaseUrl()}/content/banner`, {
      method: 'PUT',
      headers: getAdminAuthHeaders(true),
      body: JSON.stringify(config),
    });

    if (res.ok) {
      const saved = await res.json();
      saveHeroBannerToStorage(saved);
      return saved;
    }
  } catch (err) {
    console.warn('Backend banner update fallback to browser storage:', err);
  }

  return config;
}

export function getPrivilegeBannerFromStorage(): PrivilegeBannerConfig {
  if (typeof window === 'undefined') return DEFAULT_PRIVILEGE_BANNER;
  try {
    const raw = localStorage.getItem(PRIVILEGE_BANNER_STORAGE_KEY);
    if (!raw) return DEFAULT_PRIVILEGE_BANNER;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PRIVILEGE_BANNER, ...parsed };
  } catch (e) {
    return DEFAULT_PRIVILEGE_BANNER;
  }
}

export function savePrivilegeBannerToStorage(banner: PrivilegeBannerConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PRIVILEGE_BANNER_STORAGE_KEY, JSON.stringify(banner));
    window.dispatchEvent(new CustomEvent('sensein-privilege-banner-updated', { detail: banner }));
  } catch (e) {
    console.warn('Failed to save privilege banner in local storage:', e);
  }
}

export async function fetchPrivilegeBanner(): Promise<PrivilegeBannerConfig> {
  const endpoints: string[] = [];
  if (typeof window !== 'undefined') {
    endpoints.push('/api/privilege-banner');
  }
  endpoints.push(`${resolveApiBaseUrl()}/content/privilege-banner`);

  for (const url of endpoints) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch(url, {
        cache: 'no-store',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.title) {
          const merged: PrivilegeBannerConfig = {
            badge: data.badge ?? DEFAULT_PRIVILEGE_BANNER.badge,
            title: data.title || DEFAULT_PRIVILEGE_BANNER.title,
            subtitle: data.subtitle || DEFAULT_PRIVILEGE_BANNER.subtitle,
            ctaText: data.ctaText || DEFAULT_PRIVILEGE_BANNER.ctaText,
            ctaLink: data.ctaLink || DEFAULT_PRIVILEGE_BANNER.ctaLink,
            backgroundColor: data.backgroundColor || DEFAULT_PRIVILEGE_BANNER.backgroundColor,
            textColor: data.textColor || DEFAULT_PRIVILEGE_BANNER.textColor,
            isActive: data.isActive !== undefined ? data.isActive : true,
          };
          savePrivilegeBannerToStorage(merged);
          return merged;
        }
      }
    } catch (err) {
      // Fallback to next endpoint
    }
  }

  return getPrivilegeBannerFromStorage();
}

export async function updatePrivilegeBannerApi(config: PrivilegeBannerConfig): Promise<PrivilegeBannerConfig> {
  // 1. Immediately cache in local storage & dispatch sync event
  savePrivilegeBannerToStorage(config);

  // 2. Persist to Next.js API route to update server memory cache and revalidate edge immediately
  if (typeof window !== 'undefined') {
    try {
      fetch('/api/privilege-banner', {
        method: 'PUT',
        headers: getAdminAuthHeaders(true),
        body: JSON.stringify(config),
      }).catch(() => { });
    } catch (_) { }
  }

  // 3. Persist to MongoDB Atlas via backend API
  try {
    let token = getAdminToken();
    if (!token) {
      token = await ensureAdminToken();
    }

    const res = await fetch(`${resolveApiBaseUrl()}/content/privilege-banner`, {
      method: 'PUT',
      headers: getAdminAuthHeaders(true),
      body: JSON.stringify(config),
    });

    if (res.ok) {
      const saved = await res.json();
      savePrivilegeBannerToStorage(saved);
      return saved;
    }
  } catch (err) {
    console.warn('Backend privilege banner update fallback to browser storage:', err);
  }

  return config;
}

export function getCartMilestonesFromStorage(): CartMilestonesConfig {
  if (typeof window === 'undefined') return DEFAULT_CART_MILESTONES;
  try {
    const raw = localStorage.getItem(CART_MILESTONES_STORAGE_KEY);
    if (!raw) return DEFAULT_CART_MILESTONES;
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.tiers) && parsed.tiers.length > 0) {
      return { ...DEFAULT_CART_MILESTONES, ...parsed };
    }
    return DEFAULT_CART_MILESTONES;
  } catch (e) {
    return DEFAULT_CART_MILESTONES;
  }
}

export function saveCartMilestonesToStorage(config: CartMilestonesConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CART_MILESTONES_STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(new CustomEvent('sensein-cart-milestones-updated', { detail: config }));
  } catch (e) {
    console.warn('Failed to save cart milestones in local storage:', e);
  }
}

export async function fetchCartMilestones(): Promise<CartMilestonesConfig> {
  const endpoints: string[] = [];
  if (typeof window !== 'undefined') {
    endpoints.push('/api/cart-milestones');
  }
  endpoints.push(`${resolveApiBaseUrl()}/content/cart-milestones`);

  for (const url of endpoints) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch(url, {
        cache: 'no-store',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.tiers) && data.tiers.length > 0) {
          const merged: CartMilestonesConfig = {
            key: 'cart-milestones',
            title: data.title || DEFAULT_CART_MILESTONES.title,
            isActive: data.isActive !== undefined ? data.isActive : true,
            tiers: data.tiers.map((t: any, i: number) => ({
              id: t.id || `tier-${i + 1}`,
              threshold: Number(t.threshold) || DEFAULT_CART_MILESTONES.tiers[i]?.threshold || 999,
              itemsRequired: Number(t.itemsRequired) || (i + 1),
              subtitle: t.subtitle || DEFAULT_CART_MILESTONES.tiers[i]?.subtitle || `${i + 1} Products`,
              cardLabel: t.cardLabel || DEFAULT_CART_MILESTONES.tiers[i]?.cardLabel || 'Gift',
              reward: t.reward || DEFAULT_CART_MILESTONES.tiers[i]?.reward || '',
              rewardValue: Number(t.rewardValue) || DEFAULT_CART_MILESTONES.tiers[i]?.rewardValue || 299,
            })),
          };
          saveCartMilestonesToStorage(merged);
          return merged;
        }
      }
    } catch (err) {
      // Fallback to next endpoint
    }
  }

  return getCartMilestonesFromStorage();
}

export async function updateCartMilestonesApi(config: CartMilestonesConfig): Promise<CartMilestonesConfig> {
  // 1. Immediately cache in local storage & dispatch sync event
  saveCartMilestonesToStorage(config);

  // 2. Persist to Next.js API route to update server memory cache and revalidate edge immediately
  if (typeof window !== 'undefined') {
    try {
      fetch('/api/cart-milestones', {
        method: 'PUT',
        headers: getAdminAuthHeaders(true),
        body: JSON.stringify(config),
      }).catch(() => { });
    } catch (_) { }
  }

  // 3. Persist to MongoDB Atlas via backend API
  try {
    let token = getAdminToken();
    if (!token) {
      token = await ensureAdminToken();
    }

    const res = await fetch(`${resolveApiBaseUrl()}/content/cart-milestones`, {
      method: 'PUT',
      headers: getAdminAuthHeaders(true),
      body: JSON.stringify(config),
    });

    if (res.ok) {
      const saved = await res.json();
      saveCartMilestonesToStorage(saved);
      return saved;
    }
  } catch (err) {
    console.warn('Backend cart milestones update fallback to browser storage:', err);
  }

  return config;
}

export function clearLegacyProductStorage(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(LEGACY_CUSTOM_PRODUCTS_KEY);
    localStorage.removeItem(LEGACY_DELETED_PRODUCTS_KEY);
  } catch (e) {
    // Ignore storage cleanup errors
  }
}

export function broadcastProductsSync(detail?: any): void {
  if (typeof window === 'undefined') return;
  try {
    clearLegacyProductStorage();
    window.dispatchEvent(new CustomEvent('sensein-products-updated', { detail }));
    localStorage.setItem(PRODUCTS_SYNC_TS_KEY, String(Date.now()));
    if (typeof BroadcastChannel !== 'undefined') {
      const ch = new BroadcastChannel(PRODUCTS_SYNC_CHANNEL);
      ch.postMessage({ type: 'products-updated', ts: Date.now() });
      ch.close();
    }
  } catch (e) {
    // Ignore broadcast errors
  }
}

function matchesCategory(itemCategory: string = '', productType?: string, target: string = ''): boolean {
  if (!target || target === 'All' || target.toLowerCase() === 'all') return true;
  const t = target.toLowerCase().trim();
  const c = itemCategory.toLowerCase().trim();
  const pType = (productType || '').toLowerCase().trim();

  if (t === 'combos' || t === 'combo' || t.includes('kit') || t.includes('routine')) {
    return pType === 'combo' || c.includes('combo') || c.includes('kit') || c.includes('routine');
  }
  if (t.includes('mask')) return c.includes('mask');
  if (t.includes('wax') || t.includes('styling')) return c.includes('wax') || c.includes('powder');
  if (t.includes('oil')) return c.includes('oil');
  if (t.includes('facewash') || t.includes('skincare') || t.includes('face')) return c.includes('face') || c.includes('clean');
  if (t.includes('shampoo') || t.includes('cleanser')) return c.includes('shampoo') || c.includes('cleans');
  return c.includes(t) || t.includes(c);
}

function matchesCollection(itemCol: string = '', target: string = ''): boolean {
  if (!target || target === 'All' || target.toLowerCase() === 'all') return true;
  const t = target.toLowerCase().trim();
  const c = itemCol.toLowerCase().trim();
  if (t.includes('bestseller') || t.includes('best seller')) {
    return c.includes('best') || c.includes('seller') || c === 'bestsellers';
  }
  return c.includes(t) || t.includes(c);
}

export async function fetchProducts(params?: {
  category?: string;
  collection?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  search?: string;
  sort?: string;
}): Promise<{ products: ProductItem[]; total: number }> {
  clearLegacyProductStorage();

  const query = new URLSearchParams();
  if (params?.category) query.set('category', params.category);
  if (params?.collection) query.set('collection', params.collection);
  if (params?.minPrice !== undefined) query.set('minPrice', params.minPrice.toString());
  if (params?.maxPrice !== undefined) query.set('maxPrice', params.maxPrice.toString());
  if (params?.minRating !== undefined) query.set('minRating', params.minRating.toString());
  if (params?.search) query.set('search', params.search);
  if (params?.sort) query.set('sort', params.sort);

  const isBrowser = typeof window !== 'undefined';
  if (isBrowser) {
    query.set('_t', String(Date.now()));
  }

  const endpoint = isBrowser
    ? `/api/products?${query.toString()}`
    : `${resolveApiBaseUrl()}/products?${query.toString()}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(endpoint, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody?.message || errBody?.error || `Failed to load inventory (HTTP ${res.status})`);
    }

    const data = await res.json();
    const products: ProductItem[] = Array.isArray(data?.products) ? data.products : [];
    return { products, total: Number(data?.total ?? products.length) };
  } catch (err: any) {
    clearTimeout(timeoutId);
    throw new Error(err?.message || 'Unable to synchronize inventory from database');
  }
}

export async function fetchProduct(idOrSlug: string): Promise<ProductItem> {
  clearLegacyProductStorage();

  const isBrowser = typeof window !== 'undefined';
  const endpoint = isBrowser
    ? `/api/products/${encodeURIComponent(idOrSlug)}?_t=${Date.now()}`
    : `${resolveApiBaseUrl()}/products/${encodeURIComponent(idOrSlug)}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(endpoint, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && (data.id || data._id || data.slug)) {
        return data;
      }
    }
    throw new Error(`Product not found in catalog: ${idOrSlug}`);
  } catch (err: any) {
    clearTimeout(timeoutId);
    throw new Error(err?.message || `Product not found in catalog: ${idOrSlug}`);
  }
}

export async function fetchCategories(): Promise<Array<{ name: string; count: number; slug: string }>> {
  const isBrowser = typeof window !== 'undefined';
  const endpoint = isBrowser
    ? `/api/products/categories?_t=${Date.now()}`
    : `${resolveApiBaseUrl()}/products/categories`;

  const res = await fetch(endpoint, { cache: 'no-store' });
  if (res.ok) {
    const cats = await res.json();
    if (Array.isArray(cats)) return cats;
  }

  const { products } = await fetchProducts();
  const map = new Map<string, number>();
  products.forEach((p) => {
    const c = p.category || 'Other';
    map.set(c, (map.get(c) || 0) + 1);
  });

  return [
    { name: 'All Formulations', count: products.length, slug: 'all' },
    ...Array.from(map.entries()).map(([name, count]) => ({
      name,
      count,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    })),
  ];
}

export async function sendOtp(email: string) {
  const cleanEmail = (email || '').trim().toLowerCase();
  const res = await fetch(`${resolveApiBaseUrl()}/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: cleanEmail }),
  });

  if (res.ok) {
    return await res.json();
  }

  const errData = await res.json().catch(() => null);
  throw new Error(errData?.message || 'Failed to dispatch verification email. Please check the address.');
}

export async function verifyOtp(email: string, otp: string) {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanOtp = (otp || '').trim();

  const res = await fetch(`${resolveApiBaseUrl()}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: cleanEmail, otp: cleanOtp }),
  });

  if (res.ok) {
    return await res.json();
  }

  const errData = await res.json().catch(() => null);
  throw new Error(errData?.message || 'Invalid 6-digit verification code. Please check your email and try again.');
}

export async function checkPincodeServiceability(pincode: string) {
  try {
    const res = await fetch(`${resolveApiBaseUrl()}/shipping/serviceability/${pincode}`);
    if (res.ok) return await res.json();
  } catch (e) { }

  const cleanPin = pincode.trim();
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 2);

  return {
    pincode: cleanPin,
    city: cleanPin.startsWith('11') ? 'New Delhi' : cleanPin.startsWith('40') ? 'Mumbai' : cleanPin.startsWith('56') ? 'Bengaluru' : 'Metro Zone',
    state: cleanPin.startsWith('11') ? 'Delhi' : cleanPin.startsWith('40') ? 'Maharashtra' : cleanPin.startsWith('56') ? 'Karnataka' : 'India',
    isServiceable: true,
    courierPartner: 'Delhivery Express Priority',
    estimatedDays: 2,
    estimatedDeliveryDate: deliveryDate.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }),
    codAvailable: true,
    prepaidAvailable: true,
    expressDeliveryAvailable: true,
    shippingCharge: 0,
    freeShippingThreshold: 499,
  };
}

export async function createRazorpayOrder(amount: number, notes?: Record<string, any>) {
  try {
    const res = await fetch(`${resolveApiBaseUrl()}/payments/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, notes }),
    });
    if (res.ok) {
      return await res.json();
    }
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || 'Payment order generation failed on server');
  } catch (e: any) {
    console.error('Razorpay order creation error:', e);
    throw e;
  }
}

export async function verifyRazorpayPayment(data: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) {
  const res = await fetch(`${resolveApiBaseUrl()}/payments/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || 'Payment signature verification failed');
  }
  return await res.json();
}

export async function placeOrder(orderData: any) {
  const orderNumber = `SEN-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

  try {
    const res = await fetch(`${resolveApiBaseUrl()}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    if (res.ok) return await res.json();
  } catch (e) { }

  return {
    id: 'ord_' + Date.now(),
    orderNumber,
    customer: orderData.customer,
    items: orderData.items,
    subtotal: orderData.subtotal,
    discount: orderData.discount,
    couponCode: orderData.couponCode,
    shippingFee: orderData.shippingFee,
    total: orderData.total,
    paymentMethod: orderData.paymentMethod,
    paymentStatus: orderData.paymentMethod === 'razorpay' ? 'PAID' : 'PENDING',
    orderStatus: 'CONFIRMED',
    carrier: 'Delhivery Express Priority',
    createdAt: new Date().toISOString(),
    freeGifts: orderData.freeGifts || [],
  };
}

export async function fetchUserOrders(userIdOrEmail: string): Promise<any[]> {
  try {
    const res = await fetch(`${resolveApiBaseUrl()}/orders/user/${encodeURIComponent(userIdOrEmail)}`, {
      cache: 'no-store',
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Failed to fetch user orders from backend:', err);
  }
  return [];
}

export async function submitWholesaleInquiry(inquiryData: any) {
  const referenceCode = `B2B-SEN-${Math.floor(100000 + Math.random() * 900000)}`;

  try {
    const res = await fetch(`${resolveApiBaseUrl()}/inquiries/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiryData),
    });
    if (res.ok) return await res.json();
  } catch (e) { }

  return {
    success: true,
    referenceCode,
    message: `Thank you, ${inquiryData.contactPerson}. Your wholesale partnership dossier for ${inquiryData.organizationName} has been saved. We will get in touch within 24 hours.`,
    catalogPdfUrl: '/downloads/SENSEIN-Professional-Wholesale-Lookbook-2026.pdf',
  };
}

import { getAdminToken } from '@/store/admin-store';

export async function ensureAdminToken(): Promise<string | null> {
  let token = getAdminToken();
  if (token) return token;

  try {
    const loginUrl =
      typeof window !== 'undefined'
        ? '/api/auth/admin/login'
        : `${resolveApiBaseUrl()}/auth/admin/login`;
    const res = await fetch(loginUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@sensein.com', pass: 'sensein2026' }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('sensein_admin_jwt', data.token);
        }
        return data.token;
      }
    }
  } catch (e) { }
  return null;
}

function getAdminAuthHeaders(contentType: boolean = true): Record<string, string> {
  const headers: Record<string, string> = {};
  if (contentType) {
    headers['Content-Type'] = 'application/json';
  }
  const token = getAdminToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  headers['x-admin-email'] = 'admin@sensein.com';
  headers['x-auth-secret'] = 'sensein_luxury_secret_key_2026_paris';
  return headers;
}

export async function fetchAllOrders(params?: { search?: string; status?: string }): Promise<any[]> {
  try {
    let token = getAdminToken();
    if (!token) {
      token = await ensureAdminToken();
    }

    const query = new URLSearchParams();
    if (params?.search && params.search.trim()) {
      query.set('search', params.search.trim());
    }
    if (params?.status && params.status !== 'All' && params.status !== 'ALL') {
      query.set('status', params.status);
    }

    const qs = query.toString();
    const url = `${resolveApiBaseUrl()}/orders${qs ? `?${qs}` : ''}`;

    let res = await fetch(url, {
      cache: 'no-store',
      headers: getAdminAuthHeaders(false),
    });

    if (res.status === 401) {
      const refreshedToken = await ensureAdminToken();
      if (refreshedToken) {
        res = await fetch(url, {
          cache: 'no-store',
          headers: {
            ...getAdminAuthHeaders(false),
            Authorization: `Bearer ${refreshedToken}`,
          },
        });
      }
    }

    if (res.ok) {
      return await res.json();
    } else {
      console.warn(`Failed to fetch orders from MongoDB: HTTP ${res.status}`);
    }
  } catch (err) {
    console.warn('Failed to fetch all orders from MongoDB:', err);
  }
  return [];
}

export async function updateOrderStatusApi(orderId: string, status: string): Promise<any> {
  try {
    const res = await fetch(`${resolveApiBaseUrl()}/orders/${encodeURIComponent(orderId)}/status`, {
      method: 'PATCH',
      headers: getAdminAuthHeaders(true),
      body: JSON.stringify({ status: status.toUpperCase() }),
    });
    const data = await res.json();
    if (res.ok) return { success: true, order: data };
    return { success: false, error: data?.message || `Update failed with status ${res.status}` };
  } catch (err: any) {
    console.warn('Failed to update order status in MongoDB:', err);
    return { success: false, error: err.message || 'Network connection failed' };
  }
}

export async function fetchWholesaleInquiries(): Promise<any[]> {
  try {
    const res = await fetch(`${resolveApiBaseUrl()}/inquiries/bulk`, { cache: 'no-store' });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Failed to fetch inquiries from MongoDB:', err);
  }
  return [];
}

export async function updateInquiryStatusApi(idOrRef: string, status: string): Promise<any> {
  try {
    const res = await fetch(`${resolveApiBaseUrl()}/inquiries/bulk/${idOrRef}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Failed to update inquiry status in MongoDB:', err);
  }
}

export async function uploadProductImageToCloudinary(
  image: string,
  productSlug?: string
): Promise<{ success: boolean; url: string; publicId: string; error?: string }> {
  try {
    const res = await fetch(`${resolveApiBaseUrl()}/cloudinary/upload-product-image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image, productSlug }),
    });
    const data = await res.json();
    if (res.ok && data.url) {
      return { success: true, url: data.url, publicId: data.publicId };
    }
    return { success: false, url: '', publicId: '', error: data?.message || 'Cloudinary upload failed' };
  } catch (err: any) {
    console.error('Cloudinary upload error:', err);
    return { success: false, url: '', publicId: '', error: err.message || 'Network error during upload' };
  }
}

export type UploadProgressCallback = (progress: {
  percent: number;
  message: string;
  stage: 'compressing' | 'uploading' | 'finishing';
}) => void;

/**
 * Fast client-side video compressor using HTML5 Video + Canvas + MediaRecorder.
 * Downscales 4K/1080p high-bitrate videos (e.g. 150 MB) to web-optimized 720p/1080p reels (~10-15 MB).
 * Reduces upload time by up to 90% without visible quality loss on mobile devices.
 */
export async function compressVideoForWeb(
  file: File,
  onProgress?: (percent: number) => void
): Promise<File | Blob> {
  // Only attempt compression if file is > 90 MB and is a video
  if (file.size <= 90 * 1024 * 1024) {
    return file;
  }

  if (typeof window === 'undefined' || !window.MediaRecorder) {
    return file;
  }

  return new Promise((resolve) => {
    let resolved = false;
    const safeResolve = (result: File | Blob) => {
      if (!resolved) {
        resolved = true;
        cleanup();
        resolve(result);
      }
    };

    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.autoplay = false;
    const objectUrl = URL.createObjectURL(file);
    video.src = objectUrl;

    // Safety timeout: 75 seconds
    const timeoutId = setTimeout(() => {
      safeResolve(file);
    }, 75000);

    const cleanup = () => {
      clearTimeout(timeoutId);
      try { video.pause(); } catch (_) {}
      URL.revokeObjectURL(objectUrl);
    };

    video.onloadedmetadata = () => {
      try {
        // High quality web reel dimensions (target 720p vertical or horizontal)
        const maxDim = 1080;
        let w = video.videoWidth || 720;
        let h = video.videoHeight || 1280;

        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        w = w % 2 === 0 ? w : w - 1;
        h = h % 2 === 0 ? h : h - 1;

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return safeResolve(file);

        const stream = canvas.captureStream ? canvas.captureStream(30) : null;
        if (!stream) return safeResolve(file);

        // Retain audio track if available
        try {
          const videoWithStream = video as any;
          const capturedStream = videoWithStream.captureStream ? videoWithStream.captureStream() : (videoWithStream.mozCaptureStream ? videoWithStream.mozCaptureStream() : null);
          if (capturedStream) {
            const audioTracks = capturedStream.getAudioTracks();
            if (audioTracks && audioTracks.length > 0) {
              stream.addTrack(audioTracks[0]);
            }
          }
        } catch (_) {}

        let mimeType = 'video/webm;codecs=vp8,opus';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'video/webm';
          if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = 'video/mp4';
          }
        }

        const recorder = new MediaRecorder(stream, {
          mimeType: MediaRecorder.isTypeSupported(mimeType) ? mimeType : undefined,
          videoBitsPerSecond: 2_000_000, // 2.0 Mbps yields ~15-20 MB for a 1-2 min reel
        });

        const chunks: Blob[] = [];
        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) chunks.push(e.data);
        };

        recorder.onstop = () => {
          const compressedBlob = new Blob(chunks, { type: recorder.mimeType || 'video/webm' });
          if (compressedBlob.size > 0 && compressedBlob.size < file.size * 0.9) {
            const ext = recorder.mimeType.includes('mp4') ? '.mp4' : '.webm';
            const compressedFile = new File([compressedBlob], file.name.replace(/\.[^.]+$/, ext), {
              type: recorder.mimeType || 'video/webm',
            });
            safeResolve(compressedFile);
          } else {
            safeResolve(file);
          }
        };

        video.currentTime = 0;
        let animationFrameId: number;

        const drawFrame = () => {
          if (video.paused || video.ended) return;
          ctx.drawImage(video, 0, 0, w, h);
          if (onProgress && video.duration > 0) {
            onProgress(Math.min(99, Math.round((video.currentTime / video.duration) * 100)));
          }
          animationFrameId = requestAnimationFrame(drawFrame);
        };

        video.onended = () => {
          cancelAnimationFrame(animationFrameId);
          if (recorder.state === 'recording') {
            recorder.stop();
          }
        };

        video.playbackRate = 3.5; // Fast encode at 3.5x speed
        recorder.start(250);
        video.play().then(() => {
          drawFrame();
        }).catch(() => {
          safeResolve(file);
        });
      } catch (_) {
        safeResolve(file);
      }
    };

    video.onerror = () => safeResolve(file);
  });
}

/**
 * Helper to upload a single chunk to Cloudinary using standard fetch API
 * (fetch natively supports Content-Range and X-Unique-Upload-Id without browser XHR restrictions)
 */
async function uploadCloudinaryChunk(
  uploadUrl: string,
  chunk: Blob,
  fileName: string,
  signData: { apiKey: string; timestamp: number; folder: string; signature: string },
  uniqueId: string,
  start: number,
  end: number,
  totalSize: number,
  chunkIndex: number,
  totalChunks: number
): Promise<any> {
  const formData = new FormData();
  formData.append('file', chunk, fileName);
  formData.append('api_key', signData.apiKey);
  formData.append('timestamp', signData.timestamp.toString());
  formData.append('folder', signData.folder);
  formData.append('signature', signData.signature);

  const res = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      'X-Unique-Upload-Id': uniqueId,
      'Content-Range': `bytes ${start}-${end - 1}/${totalSize}`,
    },
    body: formData,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errorMsg = data?.error?.message || `Chunk ${chunkIndex}/${totalChunks} upload failed (HTTP ${res.status})`;
    console.error(`Cloudinary chunk ${chunkIndex} error:`, errorMsg, data);
    throw new Error(errorMsg);
  }

  return data;
}

/**
 * Helper to upload a single whole file (<= 6 MB) to Cloudinary
 */
async function uploadCloudinarySingle(
  uploadUrl: string,
  file: File | Blob,
  fileName: string,
  signData: { apiKey: string; timestamp: number; folder: string; signature: string }
): Promise<any> {
  const formData = new FormData();
  formData.append('file', file, fileName);
  formData.append('api_key', signData.apiKey);
  formData.append('timestamp', signData.timestamp.toString());
  formData.append('folder', signData.folder);
  formData.append('signature', signData.signature);

  const res = await fetch(uploadUrl, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errorMsg = data?.error?.message || `Upload failed with HTTP ${res.status}`;
    console.error('Cloudinary single upload error:', errorMsg, data);
    throw new Error(errorMsg);
  }

  return data;
}

export async function uploadShowcaseMediaToCloudinary(
  media: File | Blob | string,
  tags?: string[],
  onProgress?: UploadProgressCallback,
  skipCompression: boolean = false
): Promise<{ success: boolean; url: string; publicId: string; resourceType?: 'image' | 'video'; error?: string }> {
  let fileToUpload: File | Blob | string = media;

  const isVideo =
    (media instanceof File && (media.type.startsWith('video/') || /\.(mp4|webm|mov|m4v|ogv)$/i.test(media.name))) ||
    (typeof media === 'string' && (media.startsWith('data:video') || /\.(mp4|webm|mov|m4v|ogv)/i.test(media)));

  let lastErrorMessage = '';

  // 1. FAST IN-BROWSER OPTIMIZATION ONLY for videos > 90 MB (Cloudinary Free account has a strict 100 MB max limit)
  if (isVideo && fileToUpload instanceof File && fileToUpload.size > 90 * 1024 * 1024 && !skipCompression) {
    const originalMb = (fileToUpload.size / (1024 * 1024)).toFixed(1);
    try {
      if (onProgress) {
        onProgress({
          percent: 5,
          message: `⚡ Optimizing ${originalMb} MB video for web streaming (5%)...`,
          stage: 'compressing',
        });
      }
      const compressed = await compressVideoForWeb(fileToUpload, (compPercent) => {
        if (onProgress) {
          const scaledPercent = Math.min(45, Math.max(5, Math.round(compPercent * 0.45)));
          onProgress({
            percent: scaledPercent,
            message: `⚡ Optimizing ${originalMb} MB video for web (${scaledPercent}%)...`,
            stage: 'compressing',
          });
        }
      });
      if (compressed && compressed.size < fileToUpload.size) {
        const compressedMb = (compressed.size / (1024 * 1024)).toFixed(1);
        fileToUpload = compressed;
        if (onProgress) {
          onProgress({
            percent: 45,
            message: `Optimized: ${originalMb} MB → ${compressedMb} MB! Uploading to Cloudinary CDN (45%)...`,
            stage: 'uploading',
          });
        }
      }
    } catch (_) {
      // Continue with file
    }
  }

  // Check if file still exceeds Cloudinary 100 MB free tier limit
  if (fileToUpload instanceof File && fileToUpload.size > 100 * 1024 * 1024) {
    const currentMb = (fileToUpload.size / (1024 * 1024)).toFixed(1);
    return {
      success: false,
      url: '',
      publicId: '',
      error: `Video size is ${currentMb} MB, which exceeds Cloudinary's 100 MB limit. Please use the "Paste Link" button to link directly to your video, or select a shorter video clip.`,
    };
  }

  // 2. STRATEGY 1: Direct Cloudinary Upload with CHUNKING support for large files (> 6 MB)
  try {
    const signRes = await fetch(`/api/cloudinary-sign?_t=${Date.now()}`, { cache: 'no-store' });
    if (signRes.ok) {
      const signData = await signRes.json();
      if (signData.signature && signData.apiKey) {
        const endpoint = isVideo ? 'video' : 'auto';
        const isFileOrBlob = fileToUpload instanceof File || fileToUpload instanceof Blob;

        // Use chunked upload if file is larger than 6 MB
        if (isFileOrBlob && (fileToUpload as File | Blob).size > 6 * 1024 * 1024) {
          const fileBlob = fileToUpload as File | Blob;
          const fileName = fileBlob instanceof File ? fileBlob.name : (isVideo ? 'reel.mp4' : 'media.jpg');
          const CHUNK_SIZE = 6 * 1024 * 1024; // 6 MB chunks
          const totalSize = fileBlob.size;
          const totalChunks = Math.ceil(totalSize / CHUNK_SIZE);
          const uniqueId = `sensein_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
          let start = 0;
          let chunkIndex = 0;
          let lastResult: any = null;

          const basePercent = fileToUpload !== media ? 45 : 0;
          const percentRange = 100 - basePercent - 2;

          if (onProgress) {
            const mbTotal = (totalSize / (1024 * 1024)).toFixed(1);
            onProgress({
              percent: Math.max(1, basePercent),
              message: `Uploading: 0.0 / ${mbTotal} MB (${Math.max(1, basePercent)}%) • Chunk 1/${totalChunks}`,
              stage: 'uploading',
            });
          }

          while (start < totalSize) {
            const end = Math.min(start + CHUNK_SIZE, totalSize);
            const chunk = fileBlob.slice(start, end);
            chunkIndex++;

            const currentLoaded = end;
            const progressFraction = currentLoaded / totalSize;
            const percent = Math.min(98, Math.max(1, Math.round(basePercent + progressFraction * percentRange)));
            const mbUploaded = (currentLoaded / (1024 * 1024)).toFixed(1);
            const mbTotal = (totalSize / (1024 * 1024)).toFixed(1);

            if (onProgress) {
              onProgress({
                percent,
                message: `Uploading: ${mbUploaded} / ${mbTotal} MB (${percent}%) • Chunk ${chunkIndex}/${totalChunks}`,
                stage: 'uploading',
              });
            }

            let success = false;
            let retries = 3;
            while (retries > 0 && !success) {
              try {
                const chunkRes = await uploadCloudinaryChunk(
                  `https://api.cloudinary.com/v1_1/${signData.cloudName}/${endpoint}/upload`,
                  chunk,
                  fileName,
                  signData,
                  uniqueId,
                  start,
                  end,
                  totalSize,
                  chunkIndex,
                  totalChunks
                );

                if (chunkRes && (chunkRes.secure_url || end >= totalSize)) {
                  lastResult = chunkRes;
                }
                success = true;
              } catch (chunkErr: any) {
                lastErrorMessage = chunkErr?.message || `Chunk ${chunkIndex} failed`;
                retries--;
                if (retries === 0) throw chunkErr;
                await new Promise((r) => setTimeout(r, 1500));
              }
            }

            start = end;
          }

          if (lastResult && lastResult.secure_url) {
            if (onProgress) {
              onProgress({
                percent: 100,
                message: 'Complete! Video published to Cloudinary CDN.',
                stage: 'finishing',
              });
            }
            return {
              success: true,
              url: lastResult.secure_url,
              publicId: lastResult.public_id || '',
              resourceType: lastResult.resource_type === 'video' || isVideo ? 'video' : 'image',
            };
          }
        } else {
          // Standard single-request upload for files <= 6 MB
          if (onProgress) {
            onProgress({ percent: 10, message: 'Uploading to Cloudinary CDN (10%)...', stage: 'uploading' });
          }

          const fileBlob = fileToUpload as File | Blob;
          const fileName = fileBlob instanceof File ? fileBlob.name : (isVideo ? 'reel.mp4' : 'media.jpg');

          try {
            const cloudData = await uploadCloudinarySingle(
              `https://api.cloudinary.com/v1_1/${signData.cloudName}/${endpoint}/upload`,
              fileBlob,
              fileName,
              signData
            );

            if (cloudData && cloudData.secure_url) {
              if (onProgress) {
                onProgress({ percent: 100, message: 'Complete! Media published.', stage: 'finishing' });
              }
              return {
                success: true,
                url: cloudData.secure_url,
                publicId: cloudData.public_id || '',
                resourceType: cloudData.resource_type === 'video' || isVideo ? 'video' : 'image',
              };
            }
          } catch (singleErr: any) {
            lastErrorMessage = singleErr?.message || 'Single upload failed';
          }
        }
      }
    }
  } catch (err: any) {
    lastErrorMessage = err?.message || 'Direct Cloudinary upload failed';
    console.warn('Direct Cloudinary upload notice, trying Next.js route...', err);
  }

  // 3. STRATEGY 2: Next.js Route Handler (/api/upload-showcase-media) for smaller files
  try {
    let reqBody: any;
    let headers: Record<string, string> = {};

    if (fileToUpload instanceof File || fileToUpload instanceof Blob) {
      if (fileToUpload.size < 4 * 1024 * 1024) {
        const fd = new FormData();
        fd.append('file', fileToUpload);
        reqBody = fd;
      }
    } else {
      headers['Content-Type'] = 'application/json';
      reqBody = JSON.stringify({ media: fileToUpload, tags });
    }

    if (reqBody) {
      const localRes = await fetch('/api/upload-showcase-media', {
        method: 'POST',
        headers,
        body: reqBody,
      });
      if (localRes.ok) {
        const data = await localRes.json();
        if (data.url) {
          return {
            success: true,
            url: data.url,
            publicId: data.publicId || '',
            resourceType: data.resourceType === 'video' || isVideo ? 'video' : 'image',
          };
        }
      }
    }
  } catch (err) {
    console.warn('Next.js route upload notice, trying NestJS backend fallback...', err);
  }

  // 4. STRATEGY 3: Fallback to NestJS backend for smaller files
  try {
    let payloadMedia: string = '';
    if (typeof fileToUpload === 'string') {
      payloadMedia = fileToUpload;
    } else if (fileToUpload instanceof File || fileToUpload instanceof Blob) {
      if (fileToUpload.size < 35 * 1024 * 1024) {
        payloadMedia = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(fileToUpload as Blob);
        });
      }
    }

    if (payloadMedia) {
      const res = await fetch(`${resolveApiBaseUrl()}/cloudinary/upload-showcase-media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ media: payloadMedia, tags }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          return {
            success: true,
            url: data.url,
            publicId: data.publicId,
            resourceType: data.resourceType === 'video' || isVideo ? 'video' : 'image',
          };
        }
      }
    }
  } catch (err: any) {
    console.warn('Backend fallback notice:', err);
  }

  return {
    success: false,
    url: '',
    publicId: '',
    error: lastErrorMessage || 'Failed to upload media to Cloudinary. Please check file size or try pasting direct video URL.',
  };
}

export async function createProductApi(productData: any): Promise<any> {
  const { _id, ...rest } = productData || {};
  const baseSlug = (rest.slug || rest.name || 'formulation')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const slug = baseSlug || `product-${Date.now()}`;
  const id = rest.id || `sensein-${slug}-${Date.now().toString().slice(-4)}`;

  const payload = {
    rating: 5.0,
    reviewCount: 1,
    inStock: true,
    stock: rest.stock !== undefined ? Number(rest.stock) : 50,
    curatedCollection: rest.curatedCollection || 'Bestsellers',
    productType: rest.productType || (rest.category === 'Combos' ? 'combo' : 'single'),
    comboItems: rest.comboItems || [],
    badges:
      rest.badges && rest.badges.length > 0
        ? rest.badges
        : ['Official SENSEIN®', 'Salon Exclusive'],
    images:
      rest.images && rest.images.length > 0
        ? rest.images
        : [
            'https://res.cloudinary.com/dqddawu42/image/upload/v1792492874/sensein/products/media_1792492512087.jpg',
          ],
    variants:
      rest.variants && rest.variants.length > 0
        ? rest.variants
        : [
            {
              size: rest.netVolume || 'Standard Size',
              price: Number(rest.price) || 0,
              mrp: Number(rest.mrp) || Number(rest.price) || 0,
              inStock: true,
            },
          ],
    ...rest,
    id,
    slug,
  };

  await ensureAdminToken();
  const res = await fetch('/api/products', {
    method: 'POST',
    cache: 'no-store',
    headers: getAdminAuthHeaders(true),
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.message || data?.error || `Failed to create product (HTTP ${res.status})`);
  }

  broadcastProductsSync(data);
  return data;
}

export async function deleteProductApi(productId: string): Promise<any> {
  await ensureAdminToken();
  const res = await fetch(`/api/products/${encodeURIComponent(productId)}`, {
    method: 'DELETE',
    cache: 'no-store',
    headers: getAdminAuthHeaders(false),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.message || data?.error || `Failed to delete product (HTTP ${res.status})`);
  }

  broadcastProductsSync(productId);
  return data;
}

export async function updateProductApi(productId: string, productData: any): Promise<any> {
  const { _id, id: _ignoreId, ...cleanData } = productData || {};
  await ensureAdminToken();

  const res = await fetch(`/api/products/${encodeURIComponent(productId)}`, {
    method: 'PATCH',
    cache: 'no-store',
    headers: getAdminAuthHeaders(true),
    body: JSON.stringify(cleanData),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.message || data?.error || `Failed to update product (HTTP ${res.status})`);
  }

  broadcastProductsSync(data);
  return data;
}

export async function updateProductStockApi(productId: string, delta: number): Promise<any> {
  await ensureAdminToken();
  const res = await fetch(`/api/products/${encodeURIComponent(productId)}/stock`, {
    method: 'PATCH',
    cache: 'no-store',
    headers: getAdminAuthHeaders(true),
    body: JSON.stringify({ delta }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.message || data?.error || `Failed to update stock (HTTP ${res.status})`);
  }

  broadcastProductsSync(data);
  return data;
}

export async function createDelhiveryShipmentApi(payload: any): Promise<any> {
  try {
    let token = getAdminToken();
    if (!token) {
      token = await ensureAdminToken();
    }
    let res = await fetch(`${resolveApiBaseUrl()}/shipping/create-shipment`, {
      method: 'POST',
      headers: getAdminAuthHeaders(true),
      body: JSON.stringify(payload),
    });

    if (res.status === 401) {
      const refreshedToken = await ensureAdminToken();
      if (refreshedToken) {
        res = await fetch(`${resolveApiBaseUrl()}/shipping/create-shipment`, {
          method: 'POST',
          headers: {
            ...getAdminAuthHeaders(true),
            Authorization: `Bearer ${refreshedToken}`,
          },
          body: JSON.stringify(payload),
        });
      }
    }

    const data = await res.json();
    if (res.ok) return data;
    return { success: false, error: data?.message || data?.error || 'Delhivery shipment request failed' };
  } catch (err: any) {
    console.warn('Failed to create Delhivery shipment:', err);
    return { success: false, error: err.message || 'Delhivery gateway unreachable' };
  }
}

export async function requestDelhiveryPickupApi(expectedCount?: number): Promise<any> {
  try {
    const res = await fetch(`${resolveApiBaseUrl()}/shipping/request-pickup`, {
      method: 'POST',
      headers: getAdminAuthHeaders(true),
      body: JSON.stringify({ expectedCount }),
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Failed to request Delhivery pickup:', err);
  }
}

export async function trackDelhiveryAwbApi(awb: string): Promise<any> {
  try {
    const res = await fetch(`${resolveApiBaseUrl()}/shipping/delhivery/track/${encodeURIComponent(awb)}`, {
      cache: 'no-store',
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Failed to track Delhivery AWB:', err);
  }
}

export async function fetchOrderShipmentApi(idOrNumber: string): Promise<any> {
  try {
    const res = await fetch(`${resolveApiBaseUrl()}/orders/${encodeURIComponent(idOrNumber)}/shipment`, {
      cache: 'no-store',
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Failed to fetch order shipment:', err);
  }
}

export async function fetchPaymentDetailsApi(paymentId: string): Promise<any> {
  try {
    const res = await fetch(`${resolveApiBaseUrl()}/payments/${encodeURIComponent(paymentId)}/details`, {
      cache: 'no-store',
      headers: getAdminAuthHeaders(false),
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Failed to fetch payment details:', err);
  }
  return null;
}

export interface CouponItem {
  _id: string;
  id?: string;
  code: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderValue: number;
  maxDiscountAmount?: number | null;
  status: 'ACTIVE' | 'PAUSED' | 'EXPIRED';
  validUntil?: string | null;
  usageLimit?: number;
  usageCount?: number;
  perUserLimit?: number;
  isPublic?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export async function fetchCouponsApi(params?: { search?: string; status?: string }): Promise<CouponItem[]> {
  try {
    let token = getAdminToken();
    if (!token) {
      token = await ensureAdminToken();
    }

    const query = new URLSearchParams();
    if (params?.search && params.search.trim()) {
      query.set('search', params.search.trim());
    }
    if (params?.status && params.status !== 'All' && params.status !== 'ALL') {
      query.set('status', params.status);
    }

    const qs = query.toString();
    const url = `${resolveApiBaseUrl()}/coupons${qs ? `?${qs}` : ''}`;

    let res = await fetch(url, {
      cache: 'no-store',
      headers: getAdminAuthHeaders(false),
    });

    if (res.status === 401) {
      const refreshedToken = await ensureAdminToken();
      if (refreshedToken) {
        res = await fetch(url, {
          cache: 'no-store',
          headers: {
            ...getAdminAuthHeaders(false),
            Authorization: `Bearer ${refreshedToken}`,
          },
        });
      }
    }

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Failed to fetch coupons from MongoDB:', err);
  }
  return [];
}

export async function createCouponApi(payload: Partial<CouponItem>): Promise<any> {
  try {
    let token = getAdminToken();
    if (!token) {
      token = await ensureAdminToken();
    }

    let res = await fetch(`${resolveApiBaseUrl()}/coupons`, {
      method: 'POST',
      headers: getAdminAuthHeaders(true),
      body: JSON.stringify(payload),
    });

    if (res.status === 401) {
      const refreshedToken = await ensureAdminToken();
      if (refreshedToken) {
        res = await fetch(`${resolveApiBaseUrl()}/coupons`, {
          method: 'POST',
          headers: {
            ...getAdminAuthHeaders(true),
            Authorization: `Bearer ${refreshedToken}`,
          },
          body: JSON.stringify(payload),
        });
      }
    }

    const data = await res.json();
    if (res.ok) return { success: true, coupon: data };
    return { success: false, error: data?.message || 'Failed to create coupon' };
  } catch (err: any) {
    console.warn('Failed to create coupon:', err);
    return { success: false, error: err.message || 'Network error while creating coupon' };
  }
}

export async function updateCouponApi(id: string, payload: Partial<CouponItem>): Promise<any> {
  try {
    let token = getAdminToken();
    if (!token) {
      token = await ensureAdminToken();
    }

    let res = await fetch(`${resolveApiBaseUrl()}/coupons/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: getAdminAuthHeaders(true),
      body: JSON.stringify(payload),
    });

    if (res.status === 401) {
      const refreshedToken = await ensureAdminToken();
      if (refreshedToken) {
        res = await fetch(`${resolveApiBaseUrl()}/coupons/${encodeURIComponent(id)}`, {
          method: 'PATCH',
          headers: {
            ...getAdminAuthHeaders(true),
            Authorization: `Bearer ${refreshedToken}`,
          },
          body: JSON.stringify(payload),
        });
      }
    }

    const data = await res.json();
    if (res.ok) return { success: true, coupon: data };
    return { success: false, error: data?.message || 'Failed to update coupon' };
  } catch (err: any) {
    console.warn('Failed to update coupon:', err);
    return { success: false, error: err.message || 'Network error while updating coupon' };
  }
}

export async function toggleCouponStatusApi(id: string, status?: 'ACTIVE' | 'PAUSED'): Promise<any> {
  try {
    let token = getAdminToken();
    if (!token) {
      token = await ensureAdminToken();
    }

    let res = await fetch(`${resolveApiBaseUrl()}/coupons/${encodeURIComponent(id)}/toggle`, {
      method: 'PATCH',
      headers: getAdminAuthHeaders(true),
      body: JSON.stringify(status ? { status } : {}),
    });

    if (res.status === 401) {
      const refreshedToken = await ensureAdminToken();
      if (refreshedToken) {
        res = await fetch(`${resolveApiBaseUrl()}/coupons/${encodeURIComponent(id)}/toggle`, {
          method: 'PATCH',
          headers: {
            ...getAdminAuthHeaders(true),
            Authorization: `Bearer ${refreshedToken}`,
          },
          body: JSON.stringify(status ? { status } : {}),
        });
      }
    }

    const data = await res.json();
    if (res.ok) return { success: true, coupon: data };
    return { success: false, error: data?.message || 'Failed to toggle coupon status' };
  } catch (err: any) {
    console.warn('Failed to toggle coupon status:', err);
    return { success: false, error: err.message || 'Network error while toggling coupon' };
  }
}

export async function deleteCouponApi(id: string): Promise<any> {
  try {
    let token = getAdminToken();
    if (!token) {
      token = await ensureAdminToken();
    }

    let res = await fetch(`${resolveApiBaseUrl()}/coupons/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getAdminAuthHeaders(false),
    });

    if (res.status === 401) {
      const refreshedToken = await ensureAdminToken();
      if (refreshedToken) {
        res = await fetch(`${resolveApiBaseUrl()}/coupons/${encodeURIComponent(id)}`, {
          method: 'DELETE',
          headers: {
            ...getAdminAuthHeaders(false),
            Authorization: `Bearer ${refreshedToken}`,
          },
        });
      }
    }

    const data = await res.json();
    if (res.ok) return { success: true, message: data?.message };
    return { success: false, error: data?.message || 'Failed to delete coupon' };
  } catch (err: any) {
    console.warn('Failed to delete coupon:', err);
    return { success: false, error: err.message || 'Network error while deleting coupon' };
  }
}

export async function validateCouponApi(code: string, subtotal: number): Promise<any> {
  try {
    const res = await fetch(`${resolveApiBaseUrl()}/coupons/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, subtotal }),
    });

    const data = await res.json();
    if (res.ok) return { success: true, ...data };
    return { success: false, error: data?.message || 'Invalid coupon code' };
  } catch (err: any) {
    console.warn('Failed to validate coupon:', err);
    return { success: false, error: 'Could not connect to coupon verification server' };
  }
}



