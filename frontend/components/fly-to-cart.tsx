'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cart-store';

interface FlyingItem {
  id: string;
  imageUrl: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

interface FlyToCartContextType {
  flyToCart: (
    source: React.MouseEvent | HTMLElement | { x: number; y: number; width?: number; height?: number },
    imageUrl?: string
  ) => void;
}

const FlyToCartContext = createContext<FlyToCartContextType | null>(null);

export function FlyToCartProvider({ children }: { children: React.ReactNode }) {
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);
  const { triggerCartBounce } = useCartStore();

  const flyToCart = useCallback(
    (
      source: React.MouseEvent | HTMLElement | { x: number; y: number; width?: number; height?: number },
      imageUrl?: string
    ) => {
      // Find header cart button target
      const cartBtn = document.getElementById('header-cart-btn');
      let targetX = window.innerWidth - 60;
      let targetY = 24;

      if (cartBtn) {
        const cartRect = cartBtn.getBoundingClientRect();
        targetX = cartRect.left + cartRect.width / 2 - 24;
        targetY = cartRect.top + cartRect.height / 2 - 24;
      }

      // Determine starting position
      let startX = window.innerWidth / 2;
      let startY = window.innerHeight / 2;

      if ('clientX' in source && 'currentTarget' in source) {
        // It's a React MouseEvent
        const targetElement = source.currentTarget as HTMLElement;
        // Check if there is an image inside the parent card to launch from
        const cardImg = targetElement.closest('.group')?.querySelector('img') ||
                       targetElement.closest('[data-product-card]')?.querySelector('img') ||
                       document.querySelector('[data-main-product-image]');

        if (cardImg) {
          const imgRect = cardImg.getBoundingClientRect();
          startX = imgRect.left + imgRect.width / 2 - 28;
          startY = imgRect.top + imgRect.height / 2 - 28;
        } else {
          const rect = targetElement.getBoundingClientRect();
          startX = rect.left + rect.width / 2 - 28;
          startY = rect.top + rect.height / 2 - 28;
        }
      } else if (source instanceof HTMLElement) {
        const rect = source.getBoundingClientRect();
        startX = rect.left + rect.width / 2 - 28;
        startY = rect.top + rect.height / 2 - 28;
      } else if ('x' in source && 'y' in source) {
        startX = source.x - 28;
        startY = source.y - 28;
      }

      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const resolvedImg = imageUrl || '/images/products/mask-1.png';

      setFlyingItems((prev) => [
        ...prev,
        {
          id,
          imageUrl: resolvedImg,
          startX,
          startY,
          endX: targetX,
          endY: targetY,
        },
      ]);
    },
    []
  );

  const handleAnimationComplete = (id: string) => {
    setFlyingItems((prev) => prev.filter((item) => item.id !== id));
    // Trigger the bounce and sparkle effect on header cart icon
    triggerCartBounce();
  };

  return (
    <FlyToCartContext.Provider value={{ flyToCart }}>
      {children}

      {/* High-priority floating layer above all modals */}
      <div className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden">
        <AnimatePresence>
          {flyingItems.map((item) => {
            // Calculate a graceful upward arc
            const midY = Math.min(item.startY, item.endY) - 70;
            const midX = item.startX + (item.endX - item.startX) * 0.45;

            return (
              <motion.div
                key={item.id}
                initial={{
                  x: item.startX,
                  y: item.startY,
                  scale: 0.95,
                  opacity: 0,
                  rotate: 0,
                }}
                animate={{
                  x: [item.startX, midX, item.endX],
                  y: [item.startY, midY, item.endY],
                  scale: [0.95, 1.1, 0.22],
                  opacity: [0.2, 1, 0.9, 0.1],
                  rotate: [0, -12, 15],
                }}
                exit={{
                  scale: 0,
                  opacity: 0,
                }}
                transition={{
                  duration: 0.8,
                  ease: [0.25, 1, 0.5, 1], // Smooth luxury ballistic curve
                  times: [0, 0.45, 1],
                }}
                onAnimationComplete={() => handleAnimationComplete(item.id)}
                style={{
                  position: 'fixed',
                  left: 0,
                  top: 0,
                  width: 56,
                  height: 56,
                }}
                className="will-change-transform"
              >
                <div className="w-full h-full rounded-xl overflow-hidden shadow-2xl border-2 border-plum/30 bg-white ring-2 ring-white/90">
                  <img
                    src={item.imageUrl}
                    alt="Cart animation preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </FlyToCartContext.Provider>
  );
}

export function useFlyToCart() {
  const context = useContext(FlyToCartContext);
  if (!context) {
    throw new Error('useFlyToCart must be used within a FlyToCartProvider');
  }
  return context;
}
