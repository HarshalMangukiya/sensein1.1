'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  CheckCircle,
  Tag,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  Lock,
  UserCheck,
  LogIn,
  AlertCircle,
} from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';
import { checkPincodeServiceability, createRazorpayOrder, placeOrder } from '@/lib/api';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user, openAuthModal, logout } = useAuthStore();
  const [authNotice, setAuthNotice] = useState<string | null>(null);

  const {
    items,
    getSubtotal,
    getTotalDiscount,
    getShippingFee,
    getFinalTotal,
    getMilestones,
    couponCode,
    applyCoupon,
    removeCoupon,
    clearCart,
  } = useCartStore();

  const [formData, setFormData] = useState({
    name: user?.name || 'Aditi Sharma',
    email: user?.email || 'aditi.sharma@luxuryatelier.in',
    phone: '9811022334',
    address: 'Penthouse 4B, The Magnolias',
    landmark: 'Golf Course Road',
    pincode: '122001',
    city: 'Gurugram',
    state: 'Haryana',
  });

  const paymentMethod = 'razorpay' as const;
  const [loading, setLoading] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<any | null>(null);
  const [inputCoupon, setInputCoupon] = useState('');

  const subtotal = getSubtotal();
  const discount = getTotalDiscount();
  const shipping = getShippingFee();
  const finalTotal = getFinalTotal();
  const { milestones } = getMilestones();
  const unlockedGifts = milestones.filter((m) => m.unlocked).map((m) => m.reward);

  // Sync user info from auth store when logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
      }));
      setAuthNotice(null);
    }
  }, [user]);

  // Auto pincode check when length is 6
  useEffect(() => {
    if (/^\d{6}$/.test(formData.pincode)) {
      lookupPincode(formData.pincode);
    }
  }, [formData.pincode]);

  const lookupPincode = async (code: string) => {
    setPincodeLoading(true);
    try {
      const res = await checkPincodeServiceability(code);
      setFormData((prev) => ({
        ...prev,
        city: res.city.split('(')[0].trim(),
        state: res.state,
      }));
    } catch (err) {
      // Keep existing city/state
    } finally {
      setPincodeLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayButtonClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      e.stopPropagation();
      setAuthNotice('Authentication required: Please log in with your email to proceed with payment.');
      openAuthModal();
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    if (!user) {
      setAuthNotice('Authentication required: Please log in with your email to proceed with payment.');
      openAuthModal();
      return;
    }

    setLoading(true);
    try {
      // 1. Create order on NestJS backend
      const orderRes = await createRazorpayOrder(finalTotal, {
        customerName: formData.name,
        email: formData.email,
        userId: user.id,
      });

      // 2. Open Razorpay or fallback
      if (window.Razorpay && !orderRes.simulated) {
        const options = {
          key: orderRes.keyId,
          amount: orderRes.order.amount,
          currency: 'INR',
          name: 'SENSEIN PROFESSIONAL',
          description: 'Luxury Haircare Ritual Order',
          image: 'https://res.cloudinary.com/dqddawu42/image/upload/v1789820271/sensein/products/mask-1.jpg',
          order_id: orderRes.order.id,
          handler: async (response: any) => {
            const orderRecord = await placeOrder({
              customer: { ...formData, userId: user.id },
              items,
              subtotal,
              discount,
              couponCode,
              shippingFee: shipping,
              total: finalTotal,
              paymentMethod: 'razorpay',
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              freeGifts: unlockedGifts,
            });
            setOrderConfirmed(orderRecord);
            clearCart();
          },
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: '#5A3859',
          },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Direct placement fallback
        const orderRecord = await placeOrder({
          customer: { ...formData, userId: user.id },
          items,
          subtotal,
          discount,
          couponCode,
          shippingFee: shipping,
          total: finalTotal,
          paymentMethod: 'razorpay',
          freeGifts: unlockedGifts,
        });
        setOrderConfirmed(orderRecord);
        clearCart();
      }
    } catch (err) {
      alert('Order placement failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ORDER SUCCESS CONFIRMATION SCREEN
  if (orderConfirmed) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-light flex items-center justify-center mx-auto mb-6 text-emerald">
          <CheckCircle className="w-10 h-10" />
        </div>
        <span className="text-xs uppercase tracking-widest text-plum font-bold block mb-1">
          Payment Confirmed
        </span>
        <h1 className="font-sans text-3xl sm:text-4xl font-bold text-charcoal tracking-tight">
          Thank you for choosing SENSEIN
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-muted mt-2 max-w-md mx-auto">
          Your ritual formulations are being hand-packaged in our climate-controlled lab.
        </p>

        <div className="my-8 p-6 bg-white border border-border rounded-sm text-left space-y-4 shadow-xs">
          <div className="flex justify-between items-center pb-4 border-b border-border">
            <div>
              <span className="text-[11px] text-charcoal-muted uppercase tracking-wider block">Order Reference</span>
              <strong className="font-mono text-base text-plum font-bold">{orderConfirmed.orderNumber}</strong>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-charcoal-muted uppercase tracking-wider block">Airway Bill (AWB)</span>
              <strong className="font-mono text-sm text-charcoal">{orderConfirmed.awbNumber}</strong>
            </div>
          </div>

          <div className="text-xs space-y-1">
            <div className="font-semibold text-charcoal">Delivery Address:</div>
            <p className="text-charcoal-muted">
              {orderConfirmed.customer.name}, {orderConfirmed.customer.address}, {orderConfirmed.customer.city} - {orderConfirmed.customer.pincode}
            </p>
            <p className="text-charcoal-muted">Contact: {orderConfirmed.customer.phone} • Carrier: {orderConfirmed.carrier}</p>
          </div>

          <div className="pt-2 border-t border-border flex justify-between items-baseline">
            <span className="text-xs font-semibold text-charcoal">Total Amount Paid</span>
            <span className="text-lg font-bold text-plum">₹{orderConfirmed.total.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <Link
          href="/shop"
          className="inline-block px-8 py-3.5 bg-plum hover:bg-plum-dark text-white text-xs uppercase tracking-widest font-semibold rounded-sm transition"
        >
          Continue Exploring
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 text-charcoal-muted mx-auto mb-4 opacity-40" />
        <h2 className="font-sans text-2xl font-bold text-charcoal tracking-tight">Your Bag is Empty</h2>
        <p className="text-xs text-charcoal-muted mt-2 mb-6">
          Add items to your bag before proceeding to luxury checkout.
        </p>
        <Link
          href="/shop"
          className="px-6 py-3 bg-plum text-white text-xs uppercase tracking-widest font-semibold rounded"
        >
          Explore Formulations
        </Link>
      </div>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <span className="text-[11px] uppercase tracking-widest text-plum font-bold">Frictionless Checkout</span>
          <h1 className="font-sans text-3xl font-bold text-charcoal mt-1 tracking-tight">Delivery & Payment Details</h1>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* LEFT COLUMN: CONTACT, ADDRESS & PAYMENT SELECTION */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Customer Contact */}
            <div className="bg-white p-6 rounded-sm border border-border space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-sans text-lg font-bold text-charcoal tracking-tight">
                  1. Customer Contact & Identification
                </h3>
                {user ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald bg-emerald/10 px-2.5 py-1 rounded-full">
                    <CheckCircle className="w-3.5 h-3.5" /> Authenticated Patron
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={openAuthModal}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-plum hover:text-plum-dark underline"
                  >
                    <LogIn className="w-3.5 h-3.5" /> Sign In with OTP
                  </button>
                )}
              </div>

              {/* Patron Authentication Banner */}
              {user ? (
                <div className="p-3 bg-emerald-light/40 border border-emerald/20 rounded-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-plum text-white text-xs font-sans font-bold flex items-center justify-center shadow-xs shrink-0">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-charcoal">
                        {user.name} <span className="font-normal text-charcoal-muted">({user.email})</span>
                      </p>
                      <p className="text-[11px] text-charcoal-muted">SENSEIN VIP Patron • Order tracking will be linked to your account</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={logout}
                    className="text-xs text-charcoal-muted hover:text-red-600 underline shrink-0"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="p-3.5 bg-plum/5 border border-plum/20 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-plum/10 text-plum flex items-center justify-center shrink-0">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-charcoal">Client Login Required Before Payment</p>
                      <p className="text-[11px] text-charcoal-muted">Sign in to authenticate your order, access VIP benefits, and pay securely.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={openAuthModal}
                    className="px-3.5 py-1.5 bg-plum hover:bg-plum-dark text-white text-xs font-bold uppercase tracking-wider rounded-sm transition shrink-0"
                  >
                    Log In Now
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 bg-[#FAF7F5] border border-border rounded-sm focus:outline-none focus:border-plum"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 bg-[#FAF7F5] border border-border rounded-sm focus:outline-none focus:border-plum"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal mb-1">
                    Email for Dispatch Notifications & Invoices
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 bg-[#FAF7F5] border border-border rounded-sm focus:outline-none focus:border-plum"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Delivery Address with Pincode lookup */}
            <div className="bg-white p-6 rounded-sm border border-border space-y-4">
              <h3 className="font-sans text-lg font-bold text-charcoal border-b border-border pb-3 flex items-center justify-between tracking-tight">
                <span>2. Delivery Address (Pan-India)</span>
                {pincodeLoading && <span className="text-[10px] text-plum font-sans font-normal animate-pulse">Detecting Zone...</span>}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal mb-1">
                    Street Address / Villa / Apartment
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 bg-[#FAF7F5] border border-border rounded-sm focus:outline-none focus:border-plum"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal mb-1">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 bg-[#FAF7F5] border border-border rounded-sm focus:outline-none focus:border-plum"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal mb-1">
                    6-Digit Postal PIN Code
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    maxLength={6}
                    required
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 bg-[#FAF7F5] border border-border rounded-sm focus:outline-none focus:border-plum font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 bg-[#FAF7F5] border border-border rounded-sm focus:outline-none focus:border-plum"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 bg-[#FAF7F5] border border-border rounded-sm focus:outline-none focus:border-plum"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method Selection */}
            <div className="bg-white p-6 rounded-sm border border-border space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-sans text-lg font-bold text-charcoal tracking-tight">
                  3. Payment Method (Prepaid Only)
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-plum/10 text-plum border border-plum/20">
                  Guaranteed Dispatch
                </span>
              </div>
              <div className="space-y-3 text-xs">
                <div className="p-4 rounded border border-plum bg-plum/5 ring-1 ring-plum flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-4 h-4 rounded-full bg-plum text-white flex items-center justify-center text-[10px] font-bold mt-0.5">
                      ✓
                    </div>
                    <div>
                      <span className="font-bold text-charcoal block text-sm">
                        Razorpay Secure Online Payment (Prepaid)
                      </span>
                      <span className="text-[11px] text-charcoal-muted block mt-0.5">
                        Instant priority dispatch via Blue Dart Express
                      </span>
                      <div className="flex flex-wrap gap-2 mt-2 text-[10px] text-charcoal-subtle font-medium">
                        <span className="px-2 py-0.5 bg-white border border-border rounded">UPI (GPay / PhonePe / Paytm)</span>
                        <span className="px-2 py-0.5 bg-white border border-border rounded">Credit / Debit Cards</span>
                        <span className="px-2 py-0.5 bg-white border border-border rounded">NetBanking</span>
                        <span className="px-2 py-0.5 bg-white border border-border rounded">Cred</span>
                      </div>
                    </div>
                  </div>
                  <CreditCard className="w-6 h-6 text-plum shrink-0" />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: STICKY ORDER SUMMARY */}
          <div className="lg:col-span-5 sticky top-24 space-y-6">
            <div className="bg-white p-6 rounded-sm border border-border space-y-6 shadow-xs">
              <h3 className="font-sans text-lg font-bold text-charcoal border-b border-border pb-3 tracking-tight">
                Order Summary ({items.length} Items)
              </h3>

              {/* Items preview */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex items-center gap-3 text-xs">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-contain bg-alabaster rounded p-1 border border-border"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="font-sans font-semibold text-charcoal truncate tracking-tight">{item.name}</h5>
                      <span className="text-charcoal-muted text-[11px]">
                        Qty: {item.quantity} • {item.size}
                      </span>
                    </div>
                    <span className="font-bold text-charcoal">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Free Gifts Banner */}
              {unlockedGifts.length > 0 && (
                <div className="p-3 bg-emerald-light/40 border border-emerald/20 rounded text-xs text-emerald space-y-1">
                  <span className="font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Unlocked Tier Gifts:
                  </span>
                  {unlockedGifts.map((gift, i) => (
                    <div key={i} className="text-[11px] text-emerald-accent">
                      ✓ {gift}
                    </div>
                  ))}
                </div>
              )}

              {/* Coupon Field */}
              <div>
                {couponCode ? (
                  <div className="flex items-center justify-between bg-emerald-light/40 border border-emerald/30 p-2.5 rounded text-xs">
                    <span className="text-emerald font-semibold flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" /> Code: {couponCode} (-₹{discount})
                    </span>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-charcoal-muted hover:text-red-600 underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputCoupon}
                      onChange={(e) => setInputCoupon(e.target.value)}
                      placeholder="Coupon (e.g. LUXE10)"
                      className="flex-1 px-3 py-2 bg-[#FAF7F5] border border-border text-xs rounded uppercase tracking-wider"
                    />
                    <button
                      type="button"
                      onClick={() => applyCoupon(inputCoupon)}
                      className="px-4 py-2 bg-charcoal hover:bg-plum text-white text-xs font-semibold uppercase tracking-wider rounded"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              {/* Financial Breakdown */}
              <div className="space-y-2 text-xs pt-3 border-t border-border">
                <div className="flex justify-between text-charcoal">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald font-medium">
                    <span>Discount Privilege</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-charcoal">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <strong className="text-emerald">FREE</strong> : `₹${shipping}`}</span>
                </div>

                <div className="pt-3 border-t border-border flex justify-between items-baseline">
                  <span className="font-sans text-lg font-bold text-charcoal tracking-tight">Total Amount</span>
                  <span className="text-2xl font-bold text-plum">
                    ₹{finalTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Authentication Status / Requirement Notice */}
              {!user ? (
                <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-sm text-xs text-amber-950 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span className="font-medium text-[11px]">Account login required before payment</span>
                  </div>
                  <button
                    type="button"
                    onClick={openAuthModal}
                    className="font-bold text-plum hover:underline text-[11px] uppercase tracking-wider shrink-0"
                  >
                    Log In
                  </button>
                </div>
              ) : (
                <div className="p-2.5 bg-emerald/5 border border-emerald/20 rounded-sm flex items-center justify-between text-xs text-charcoal">
                  <div className="flex items-center gap-2 truncate">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald shrink-0" />
                    <span className="truncate text-[11px]">Paying as <strong>{user.name}</strong></span>
                  </div>
                  <span className="text-[10px] text-emerald bg-emerald/10 font-semibold px-2 py-0.5 rounded-full shrink-0">
                    VIP Patron
                  </span>
                </div>
              )}

              {authNotice && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-sm text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{authNotice}</span>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                onClick={handlePayButtonClick}
                disabled={loading}
                className="w-full py-4 bg-plum hover:bg-plum-dark text-white text-xs font-bold uppercase tracking-[0.18em] rounded-sm transition shadow flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading
                  ? 'Processing Order...'
                  : !user
                  ? 'Log In & Pay with Razorpay'
                  : 'Pay with Razorpay (Prepaid)'}
                {!user ? <Lock className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-charcoal-muted">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald" />
                <span>Encrypted 256-Bit SSL • Authorized Razorpay Gateway</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
