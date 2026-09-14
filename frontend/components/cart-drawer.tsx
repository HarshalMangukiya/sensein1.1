'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Sparkles,
  Gift,
  ArrowRight,
  ShieldCheck,
  Check,
  Tag,
} from 'lucide-react';
import { useCartStore } from '@/store/cart-store';

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    getSubtotal,
    getTotalDiscount,
    getShippingFee,
    getFinalTotal,
    getMilestones,
    couponCode,
    applyCoupon,
    removeCoupon,
    couponError,
  } = useCartStore();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponAppliedSuccess, setCouponAppliedSuccess] = useState(false);

  const subtotal = getSubtotal();
  const discount = getTotalDiscount();
  const shipping = getShippingFee();
  const finalTotal = getFinalTotal();
  const { milestones, nextMilestone, amountNeededForNext, progressPercentage } = getMilestones();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (applyCoupon(inputCoupon)) {
      setCouponAppliedSuccess(true);
      setTimeout(() => setCouponAppliedSuccess(false), 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
        onClick={closeCart}
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-[#FAF7F5] shadow-drawer flex flex-col z-10 animate-in slide-in-from-right duration-300">
        {/* Top Header */}
        <div className="px-6 py-4 bg-white border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-plum" />
            <h2 className="font-serif text-lg font-bold text-charcoal tracking-wide">
              YOUR LUXURY BAG ({items.reduce((s, i) => s + i.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 text-charcoal hover:text-plum transition rounded-full hover:bg-alabaster"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Gamified Milestone Progress Bar */}
        <div className="bg-[#FAF7F5] px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between text-xs font-medium mb-1.5">
            {nextMilestone ? (
              <span className="text-charcoal flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5 text-plum" />
                Add <strong className="text-plum font-bold">₹{amountNeededForNext}</strong> more to unlock{' '}
                <span className="text-emerald font-semibold">{nextMilestone.reward.split('(')[0]}</span>!
              </span>
            ) : (
              <span className="text-emerald font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                All Luxury Gifts Unlocked with Your Order!
              </span>
            )}
            <span className="text-[11px] font-bold text-plum">{progressPercentage}%</span>
          </div>

          {/* Progress track */}
          <div className="w-full bg-[#EAE5E0] h-2 rounded-full overflow-hidden relative">
            <div
              className="bg-gradient-to-r from-plum to-gold h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Milestone Tier Nodes */}
          <div className="grid grid-cols-3 gap-2 mt-3 pt-1">
            {milestones.map((m, idx) => (
              <div
                key={m.threshold}
                className={`text-center p-1.5 rounded border transition-all text-[10px] ${
                  m.unlocked
                    ? 'bg-emerald-light/40 border-emerald/40 text-emerald font-medium'
                    : 'bg-white/60 border-border text-charcoal-muted'
                }`}
              >
                <div className="font-bold">₹{m.threshold}</div>
                <div className="truncate text-[9px] mt-0.5" title={m.reward}>
                  {m.unlocked ? '✓ ' : ''}
                  {idx === 0 ? 'Sample Vial' : idx === 1 ? 'Travel Kit' : 'Luxury Elixir'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="w-12 h-12 text-charcoal-muted mx-auto mb-4 opacity-40" />
              <p className="font-serif text-lg font-medium text-charcoal mb-1">
                Your Luxury Bag is Empty
              </p>
              <p className="text-xs text-charcoal-muted max-w-xs mx-auto mb-6">
                Explore our botanical formulations and curate your personalized haircare ritual.
              </p>
              <Link
                href="/shop"
                onClick={closeCart}
                className="inline-block px-6 py-2.5 bg-plum text-white text-xs uppercase tracking-widest font-semibold rounded hover:bg-plum-dark transition"
              >
                Explore Catalog
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.id}-${item.size}`}
                className="bg-white p-3.5 rounded-sm border border-border flex gap-3.5 items-center relative group"
              >
                {/* Product Thumbnail */}
                <div className="w-16 h-16 bg-[#FAF7F5] flex-shrink-0 rounded flex items-center justify-center p-1 border border-border/50">
                  <img
                    src={item.image || '/images/products/mask-1.png'}
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-serif text-sm font-semibold text-charcoal truncate pr-2">
                      {item.name}
                    </h4>
                    <button
                      onClick={() => removeItem(item.id, item.size)}
                      className="text-charcoal-subtle hover:text-red-600 transition p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-[11px] text-charcoal-muted mt-0.5">
                    Variant: <span className="font-medium text-charcoal">{item.size || '250ml'}</span>
                  </div>

                  <div className="flex items-center justify-between mt-2.5">
                    {/* Stepper */}
                    <div className="flex items-center border border-border rounded bg-alabaster px-2 py-0.5 space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1, item.size)}
                        className="w-5 h-5 flex items-center justify-center text-charcoal hover:text-plum font-bold"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-semibold text-charcoal w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1, item.size)}
                        className="w-5 h-5 flex items-center justify-center text-charcoal hover:text-plum font-bold"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-sm font-bold text-charcoal">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Unlocked Free Gifts Display */}
          {items.length > 0 && milestones.some((m) => m.unlocked) && (
            <div className="bg-emerald-light/30 border border-emerald/20 p-3 rounded text-xs space-y-1.5">
              <div className="font-semibold text-emerald flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5" /> Complimentary Gifts Included:
              </div>
              {milestones
                .filter((m) => m.unlocked)
                .map((m) => (
                  <div key={m.threshold} className="flex items-center justify-between text-[11px] text-emerald-accent">
                    <span>✨ {m.reward}</span>
                    <span className="line-through text-charcoal-muted text-[10px]">₹{m.rewardValue}</span>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Footer with Coupon & Checkout */}
        {items.length > 0 && (
          <div className="bg-white border-t border-border p-6 space-y-4">
            {/* Coupon Code Section */}
            <div>
              {couponCode ? (
                <div className="flex items-center justify-between bg-emerald-light/40 border border-emerald/30 px-3 py-2 rounded text-xs">
                  <span className="flex items-center gap-1.5 text-emerald font-semibold">
                    <Tag className="w-3.5 h-3.5" /> Code: {couponCode} (-₹{discount})
                  </span>
                  <button
                    onClick={removeCoupon}
                    className="text-charcoal-muted hover:text-red-600 text-xs font-medium underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    placeholder="Enter Coupon (e.g. LUXE10)"
                    className="flex-1 px-3 py-2 bg-[#FAF7F5] border border-border text-xs rounded uppercase tracking-wider focus:outline-none focus:border-plum"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-charcoal hover:bg-plum text-white text-xs font-semibold rounded uppercase tracking-wider transition"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && (
                <p className="text-[11px] text-red-600 mt-1">{couponError}</p>
              )}
              {couponAppliedSuccess && (
                <p className="text-[11px] text-emerald mt-1">Coupon applied successfully!</p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-charcoal">
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Subtotal</span>
                <span className="font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald">
                  <span>Voucher Savings</span>
                  <span>-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-charcoal-muted">Shipping</span>
                <span>{shipping === 0 ? <strong className="text-emerald">FREE</strong> : `₹${shipping}`}</span>
              </div>

              <div className="pt-2 border-t border-border flex justify-between items-baseline">
                <span className="font-serif text-base font-bold text-charcoal">Total Amount</span>
                <span className="text-lg font-bold text-plum">
                  ₹{finalTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Direct Checkout CTA */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="w-full py-3.5 bg-plum hover:bg-plum-dark text-white text-xs font-bold uppercase tracking-[0.16em] rounded transition flex items-center justify-center gap-2 shadow-sm hover:shadow"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Trust Assurances */}
            <div className="flex items-center justify-center gap-4 text-[10px] text-charcoal-muted pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald" /> 256-Bit SSL Secure
              </span>
              <span>•</span>
              <span>Razorpay Verified</span>
              <span>•</span>
              <span>Free Pan-India Delivery</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
