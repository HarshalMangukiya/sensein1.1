import { create } from 'zustand';
import { validateCouponApi } from '@/lib/api';

export interface CartItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  mrp: number;
  quantity: number;
  size?: string;
  image?: string;
  category?: string;
}

export interface Milestone {
  threshold: number;
  itemsRequired: number;
  reward: string;
  rewardValue: number;
  unlocked: boolean;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  couponCode: string;
  discountAmount: number;
  couponError: string | null;
  activeUserEmail: string | null;

  isCartBouncing: boolean;
  triggerCartBounce: () => void;

  // Actions
  addItem: (
    product: {
      id: string;
      name: string;
      slug: string;
      price: number;
      mrp: number;
      size?: string;
      image?: string;
      category?: string;
    },
    quantity?: number,
    openDrawer?: boolean
  ) => void;
  removeItem: (id: string, size?: string) => void;
  updateQuantity: (id: string, delta: number, size?: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  applyCoupon: (code: string) => boolean;
  applyCouponAsync: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  switchUserCart: (newUserEmail: string | null) => void;
  syncWithCurrentUser: () => void;

  // Computed Getters
  getSubtotal: () => number;
  getTotalDiscount: () => number;
  getShippingFee: () => number;
  getFinalTotal: () => number;
  getItemCount: () => number;
  getMilestones: () => {
    milestones: Milestone[];
    nextMilestone: Milestone | null;
    amountNeededForNext: number;
    productsNeededForNext: number;
    currentTierIndex: number;
    progressPercentage: number;
  };
}

// Helpers for User-Scoped Cart Storage
function getActiveEmailFromBrowser(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('sensein_user');
    if (raw) {
      const u = JSON.parse(raw);
      if (u?.email && typeof u.email === 'string') {
        return u.email.trim().toLowerCase();
      }
    }
  } catch (e) {}
  return null;
}

function getCartStorageKey(email?: string | null): string {
  const cleanEmail =
    email && typeof email === 'string' && email.trim()
      ? email.trim().toLowerCase()
      : getActiveEmailFromBrowser();

  if (cleanEmail) {
    return `sensein_cart_user_${cleanEmail}`;
  }
  return 'sensein_cart_guest';
}

interface StoredCartData {
  items: CartItem[];
  couponCode: string;
  discountAmount: number;
}

function readStoredCart(email?: string | null): StoredCartData {
  if (typeof window === 'undefined') {
    return { items: [], couponCode: '', discountAmount: 0 };
  }
  try {
    const key = getCartStorageKey(email);
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.items)) {
        return {
          items: parsed.items,
          couponCode: typeof parsed.couponCode === 'string' ? parsed.couponCode : '',
          discountAmount: typeof parsed.discountAmount === 'number' ? parsed.discountAmount : 0,
        };
      }
    }
  } catch (e) {}
  return { items: [], couponCode: '', discountAmount: 0 };
}

function persistCart(
  email: string | null | undefined,
  data: { items: CartItem[]; couponCode: string; discountAmount: number }
) {
  if (typeof window === 'undefined') return;
  try {
    const key = getCartStorageKey(email);
    localStorage.setItem(
      key,
      JSON.stringify({
        items: data.items,
        couponCode: data.couponCode,
        discountAmount: data.discountAmount,
        updatedAt: Date.now(),
      })
    );
  } catch (e) {}
}

const initialEmail = getActiveEmailFromBrowser();
const initialData = readStoredCart(initialEmail);

export const useCartStore = create<CartStore>((set, get) => ({
  items: initialData.items,
  activeUserEmail: initialEmail,
  isOpen: false,
  isCartBouncing: false,
  couponCode: initialData.couponCode,
  discountAmount: initialData.discountAmount,
  couponError: null,

  triggerCartBounce: () => {
    set({ isCartBouncing: true });
    setTimeout(() => {
      set({ isCartBouncing: false });
    }, 700);
  },

  switchUserCart: (newUserEmail: string | null) => {
    const currentEmail = get().activeUserEmail;
    // 1. Save current active cart before switching
    if (currentEmail) {
      persistCart(currentEmail, {
        items: get().items,
        couponCode: get().couponCode,
        discountAmount: get().discountAmount,
      });
    }

    const cleanNewEmail =
      newUserEmail && typeof newUserEmail === 'string' && newUserEmail.trim()
        ? newUserEmail.trim().toLowerCase()
        : null;

    // 2. Load the target user's cart from their specific storage key
    const targetData = readStoredCart(cleanNewEmail);

    set({
      activeUserEmail: cleanNewEmail,
      items: targetData.items,
      couponCode: targetData.couponCode,
      discountAmount: targetData.discountAmount,
      couponError: null,
    });
  },

  syncWithCurrentUser: () => {
    const browserEmail = getActiveEmailFromBrowser();
    if (get().activeUserEmail !== browserEmail) {
      get().switchUserCart(browserEmail);
    }
  },

  addItem: (product, quantity = 1, openDrawer = false) => {
    const { items, activeUserEmail } = get();
    const existingIndex = items.findIndex(
      (item) => item.id === product.id && item.size === product.size
    );

    let updatedItems: CartItem[];
    if (existingIndex > -1) {
      updatedItems = items.map((item, idx) =>
        idx === existingIndex
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      updatedItems = [
        ...items,
        {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          mrp: product.mrp,
          quantity,
          size: product.size || '250ml',
          image:
            product.image ||
            'https://res.cloudinary.com/dqddawu42/image/upload/v1789820271/sensein/products/mask-1.jpg',
          category: product.category,
        },
      ];
    }

    set({ items: updatedItems, isOpen: openDrawer });
    persistCart(activeUserEmail, {
      items: updatedItems,
      couponCode: get().couponCode,
      discountAmount: get().discountAmount,
    });

    // Recalculate coupon if applied
    if (get().couponCode) {
      get().applyCoupon(get().couponCode);
    }
  },

  removeItem: (id: string, size?: string) => {
    const updatedItems = get().items.filter(
      (item) => !(item.id === id && (!size || item.size === size))
    );
    set({ items: updatedItems });
    persistCart(get().activeUserEmail, {
      items: updatedItems,
      couponCode: get().couponCode,
      discountAmount: get().discountAmount,
    });
    if (get().couponCode) {
      get().applyCoupon(get().couponCode);
    }
  },

  updateQuantity: (id: string, delta: number, size?: string) => {
    const { items, activeUserEmail } = get();
    const updatedItems = items
      .map((item) => {
        if (item.id === id && (!size || item.size === size)) {
          const newQuantity = item.quantity + delta;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
        }
        return item;
      })
      .filter(Boolean) as CartItem[];

    set({ items: updatedItems });
    persistCart(activeUserEmail, {
      items: updatedItems,
      couponCode: get().couponCode,
      discountAmount: get().discountAmount,
    });
    if (get().couponCode) {
      get().applyCoupon(get().couponCode);
    }
  },

  clearCart: () => {
    const currentEmail = get().activeUserEmail;
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(getCartStorageKey(currentEmail));
      } catch (e) {}
    }
    set({ items: [], couponCode: '', discountAmount: 0, couponError: null });
  },

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

  applyCouponAsync: async (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const subtotal = get().getSubtotal();
    const email = get().activeUserEmail;

    if (!cleanCode) {
      set({ couponError: 'Please enter a valid coupon code', couponCode: '', discountAmount: 0 });
      persistCart(email, { items: get().items, couponCode: '', discountAmount: 0 });
      return false;
    }

    try {
      const res = await validateCouponApi(cleanCode, subtotal);
      if (res && res.valid) {
        set({
          couponCode: cleanCode,
          discountAmount: res.discountAmount,
          couponError: null,
        });
        persistCart(email, { items: get().items, couponCode: cleanCode, discountAmount: res.discountAmount });
        return true;
      } else if (res && res.error) {
        set({
          couponError: res.error,
          couponCode: '',
          discountAmount: 0,
        });
        persistCart(email, { items: get().items, couponCode: '', discountAmount: 0 });
        return false;
      }
    } catch (e) {
      // Backend unreachable, fallback to offline rules
    }

    // Local fallback rules
    if (cleanCode === 'LUXE10') {
      const discount = Math.round(subtotal * 0.1);
      set({ couponCode: cleanCode, discountAmount: discount, couponError: null });
      persistCart(email, { items: get().items, couponCode: cleanCode, discountAmount: discount });
      return true;
    }

    if (cleanCode === 'SENSEIN200') {
      if (subtotal < 1499) {
        set({ couponError: 'SENSEIN200 requires minimum cart value of ₹1,499', couponCode: '', discountAmount: 0 });
        persistCart(email, { items: get().items, couponCode: '', discountAmount: 0 });
        return false;
      }
      set({ couponCode: cleanCode, discountAmount: 200, couponError: null });
      persistCart(email, { items: get().items, couponCode: cleanCode, discountAmount: 200 });
      return true;
    }

    if (cleanCode === 'VIP500') {
      if (subtotal < 2500) {
        set({ couponError: 'VIP500 requires minimum cart value of ₹2,500', couponCode: '', discountAmount: 0 });
        persistCart(email, { items: get().items, couponCode: '', discountAmount: 0 });
        return false;
      }
      set({ couponCode: cleanCode, discountAmount: 500, couponError: null });
      persistCart(email, { items: get().items, couponCode: cleanCode, discountAmount: 500 });
      return true;
    }

    set({ couponError: 'Invalid promo code. Check code or minimum order requirement.' });
    return false;
  },

  applyCoupon: (code: string) => {
    // Fire async verification immediately to validate against MongoDB Atlas
    get().applyCouponAsync(code);

    const cleanCode = code.trim().toUpperCase();
    const subtotal = get().getSubtotal();
    const email = get().activeUserEmail;

    if (!cleanCode) {
      set({ couponError: 'Please enter a valid coupon code' });
      return false;
    }

    if (cleanCode === 'LUXE10') {
      const discount = Math.round(subtotal * 0.1);
      set({ couponCode: cleanCode, discountAmount: discount, couponError: null });
      persistCart(email, { items: get().items, couponCode: cleanCode, discountAmount: discount });
      return true;
    }

    if (cleanCode === 'SENSEIN200') {
      if (subtotal < 1499) {
        set({ couponError: 'SENSEIN200 requires minimum cart value of ₹1,499' });
        return false;
      }
      set({ couponCode: cleanCode, discountAmount: 200, couponError: null });
      persistCart(email, { items: get().items, couponCode: cleanCode, discountAmount: 200 });
      return true;
    }

    if (cleanCode === 'VIP500') {
      if (subtotal < 2500) {
        set({ couponError: 'VIP500 requires minimum cart value of ₹2,500' });
        return false;
      }
      set({ couponCode: cleanCode, discountAmount: 500, couponError: null });
      persistCart(email, { items: get().items, couponCode: cleanCode, discountAmount: 500 });
      return true;
    }

    set({ couponCode: cleanCode, couponError: null });
    return true;
  },

  removeCoupon: () => {
    set({ couponCode: '', discountAmount: 0, couponError: null });
    persistCart(get().activeUserEmail, {
      items: get().items,
      couponCode: '',
      discountAmount: 0,
    });
  },

  getSubtotal: () => {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  getTotalDiscount: () => {
    return get().discountAmount;
  },

  getShippingFee: () => {
    const subtotal = get().getSubtotal();
    if (subtotal === 0) return 0;
    // Waive shipping fee for ₹1 test verification items so testing is exactly ₹1
    const items = get().items;
    if (
      items.length > 0 &&
      items.every(
        (i) =>
          i.id === 'sensein-test-pay-01' ||
          i.slug === 'sensein-payment-verification-test' ||
          i.price <= 1
      )
    ) {
      return 0;
    }
    return subtotal >= 499 ? 0 : 99;
  },

  getFinalTotal: () => {
    const subtotal = get().getSubtotal();
    const discount = get().discountAmount;
    const shipping = get().getShippingFee();
    return Math.max(0, subtotal - discount + shipping);
  },

  getItemCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },

  getMilestones: () => {
    const itemCount = get().getItemCount();
    const milestones: Milestone[] = [
      {
        threshold: 999,
        itemsRequired: 1,
        reward: 'Complimentary Botanical Sample Vial (15ml)',
        rewardValue: 299,
        unlocked: itemCount >= 1,
      },
      {
        threshold: 1999,
        itemsRequired: 2,
        reward: 'Velvet Travel Pouch & Rosewood Styling Comb',
        rewardValue: 599,
        unlocked: itemCount >= 2,
      },
      {
        threshold: 2999,
        itemsRequired: 3,
        reward: 'Full-Size Luxury French Plum Hair Elixir',
        rewardValue: 1499,
        unlocked: itemCount >= 3,
      },
    ];

    let nextMilestone: Milestone | null = null;
    let productsNeededForNext = 0;
    let currentTierIndex = 0;

    for (let i = 0; i < milestones.length; i++) {
      if (itemCount < milestones[i].itemsRequired) {
        nextMilestone = milestones[i];
        productsNeededForNext = milestones[i].itemsRequired - itemCount;
        currentTierIndex = i;
        break;
      }
    }

    if (!nextMilestone && milestones.length > 0) {
      currentTierIndex = milestones.length;
    }

    // Progress bar calculations (0% for 0, 33% for 1, 67% for 2, 100% for 3+)
    const progressPercentage = Math.min(100, Math.round((itemCount / 3) * 100));

    return {
      milestones,
      nextMilestone,
      amountNeededForNext: productsNeededForNext,
      productsNeededForNext,
      currentTierIndex,
      progressPercentage,
    };
  },
}));
