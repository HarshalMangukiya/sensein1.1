import { create } from 'zustand';

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

  isCartBouncing: boolean;
  triggerCartBounce: () => void;

  // Actions
  addItem: (product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    mrp: number;
    size?: string;
    image?: string;
    category?: string;
  }, quantity?: number, openDrawer?: boolean) => void;
  removeItem: (id: string, size?: string) => void;
  updateQuantity: (id: string, delta: number, size?: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;

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

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,
  isCartBouncing: false,
  couponCode: '',
  discountAmount: 0,
  couponError: null,

  triggerCartBounce: () => {
    set({ isCartBouncing: true });
    setTimeout(() => {
      set({ isCartBouncing: false });
    }, 700);
  },

  addItem: (product, quantity = 1, openDrawer = false) => {
    const { items } = get();
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
          image: product.image || 'https://res.cloudinary.com/dqddawu42/image/upload/v1789820271/sensein/products/mask-1.jpg',
          category: product.category,
        },
      ];
    }

    set({ items: updatedItems, isOpen: openDrawer });
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
    if (get().couponCode) {
      get().applyCoupon(get().couponCode);
    }
  },

  updateQuantity: (id: string, delta: number, size?: string) => {
    const { items } = get();
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
    if (get().couponCode) {
      get().applyCoupon(get().couponCode);
    }
  },

  clearCart: () => {
    set({ items: [], couponCode: '', discountAmount: 0, couponError: null });
  },

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

  applyCoupon: (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const subtotal = get().getSubtotal();

    if (!cleanCode) {
      set({ couponError: 'Please enter a valid coupon code' });
      return false;
    }

    if (cleanCode === 'LUXE10') {
      const discount = Math.round(subtotal * 0.1);
      set({ couponCode: cleanCode, discountAmount: discount, couponError: null });
      return true;
    }

    if (cleanCode === 'SENSEIN200') {
      if (subtotal < 1499) {
        set({ couponError: 'SENSEIN200 requires minimum cart value of ₹1,499' });
        return false;
      }
      set({ couponCode: cleanCode, discountAmount: 200, couponError: null });
      return true;
    }

    if (cleanCode === 'VIP500') {
      if (subtotal < 2500) {
        set({ couponError: 'VIP500 requires minimum cart value of ₹2,500' });
        return false;
      }
      set({ couponCode: cleanCode, discountAmount: 500, couponError: null });
      return true;
    }

    set({ couponError: 'Invalid promo code. Try LUXE10 for 10% off' });
    return false;
  },

  removeCoupon: () => set({ couponCode: '', discountAmount: 0, couponError: null }),

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
    if (items.length > 0 && items.every((i) => i.id === 'sensein-test-pay-01' || i.slug === 'sensein-payment-verification-test' || i.price <= 1)) {
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
