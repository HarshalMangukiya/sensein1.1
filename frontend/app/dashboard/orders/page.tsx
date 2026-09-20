'use client';

import React, { useState, useEffect } from 'react';
import { Package, ExternalLink, ChevronRight, Truck, CheckCircle2, Copy, Check, Clock, ShieldCheck, X } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth-store';
import { fetchUserOrders } from '@/lib/api';

export default function OrdersPage() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [selectedTracking, setSelectedTracking] = useState<any | null>(null);
  const [copiedAWB, setCopiedAWB] = useState<string | null>(null);

  useEffect(() => {
    async function loadOrders() {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const userIdentifier = user.email || user.id;
        const data = await fetchUserOrders(userIdentifier);
        setOrders(data || []);
      } catch (err) {
        console.error('Failed to load user orders:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, [user]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAWB(text);
    setTimeout(() => setCopiedAWB(null), 2000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-charcoal tracking-tight">Order History</h1>
        <p className="text-sm text-charcoal-muted mt-1">
          Live orders synchronized directly from SENSEIN secure database.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div key={n} className="bg-white border border-border rounded-xl p-6 animate-pulse space-y-4 shadow-sm">
              <div className="h-6 bg-alabaster rounded w-1/3"></div>
              <div className="h-16 bg-alabaster rounded w-full"></div>
              <div className="h-10 bg-alabaster rounded w-1/4"></div>
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-border rounded-xl p-8 sm:p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-plum/5 text-plum flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="font-sans font-bold text-xl text-charcoal">No Ritual Orders Yet</h3>
          <p className="text-xs sm:text-sm text-charcoal-muted max-w-md mx-auto">
            Your sacred formulation journey awaits. Discover our bio-active botanical haircare and luxury skincare archives.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-block px-8 py-3 bg-plum hover:bg-plum-dark text-white text-xs uppercase tracking-widest font-bold rounded-sm transition shadow-xs"
            >
              Explore Formulations
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {orders.map((order) => {
            const dateStr = order.createdAt
              ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              : 'Recent Order';

            return (
              <div
                key={order.id || order.orderNumber}
                className="bg-white border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Header Bar */}
                <div className="bg-[#FAF7F5] border-b border-border px-4 py-3.5 sm:px-6 sm:py-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-6 sm:gap-8">
                    <div>
                      <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-charcoal-muted">
                        Order Placed
                      </p>
                      <p className="text-sm font-semibold text-charcoal mt-0.5">{dateStr}</p>
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-charcoal-muted">
                        Total Amount
                      </p>
                      <p className="text-sm font-bold text-plum mt-0.5">
                        ₹{(order.total || 0).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-charcoal-muted">
                        Payment Status
                      </p>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mt-0.5">
                        <CheckCircle2 className="w-3 h-3" /> {order.paymentStatus || 'PAID'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-left sm:text-right">
                      <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-charcoal-muted mb-0.5">
                        Order Reference
                      </p>
                      <p className="text-sm font-mono font-bold text-charcoal">{order.orderNumber}</p>
                    </div>
                    <button
                      onClick={() => setSelectedInvoice(order)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-plum hover:text-plum-hover transition-colors px-3 py-1.5 rounded bg-plum/5 hover:bg-plum/10"
                    >
                      Invoice <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 sm:p-6 space-y-4">
                  {/* Status Banner */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-light text-emerald-accent">
                      <Package className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        {order.orderStatus || 'CONFIRMED'}
                      </span>
                    </div>

                    {order.awbNumber && (
                      <div className="flex items-center gap-2 text-xs text-charcoal-muted">
                        <span className="text-[11px] font-semibold uppercase tracking-wider">Airway Bill (AWB):</span>
                        <code className="font-mono bg-alabaster px-2 py-0.5 rounded border border-border text-charcoal font-bold">
                          {order.awbNumber}
                        </code>
                        <button
                          onClick={() => copyToClipboard(order.awbNumber)}
                          className="p-1 hover:text-plum transition"
                          title="Copy AWB Tracking Number"
                        >
                          {copiedAWB === order.awbNumber ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Items list */}
                  <div className="space-y-4 pt-1">
                    {(order.items || []).map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#FAF7F5] rounded-md border border-border flex items-center justify-center flex-shrink-0 p-2 overflow-hidden">
                          <img
                            src={item.image || 'https://res.cloudinary.com/dqddawu42/image/upload/v1789818163/sensein/products/bxsjmi3kfmsq7jigqkfv.png'}
                            alt={item.name}
                            className="w-full h-full object-contain mix-blend-multiply"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm sm:text-base font-semibold text-charcoal truncate">
                            {item.name}
                          </h4>
                          <p className="text-xs text-charcoal-muted mt-1">
                            Qty: {item.quantity || 1} {item.size ? `• ${item.size}` : ''} • ₹
                            {(item.price || 0).toLocaleString('en-IN')}
                          </p>
                          {order.razorpayPaymentId && (
                            <p className="text-[10px] text-charcoal-subtle font-mono mt-0.5">
                              Payment ID: {order.razorpayPaymentId}
                            </p>
                          )}
                        </div>
                        <div className="text-right font-bold text-sm text-charcoal">
                          ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                        </div>
                      </div>
                    ))}

                    {/* Free gifts banner if present */}
                    {order.freeGifts && order.freeGifts.length > 0 && (
                      <div className="mt-2 p-3 bg-plum/5 rounded border border-plum/15 flex items-center gap-2.5 text-xs text-plum">
                        <span className="px-1.5 py-0.5 bg-plum text-white text-[10px] font-bold rounded uppercase">
                          Privilege Gift
                        </span>
                        <span>{order.freeGifts.join(' • ')}</span>
                      </div>
                    )}
                  </div>

                  {/* Delivery destination */}
                  {order.customer && (
                    <div className="text-xs text-charcoal-muted bg-[#FDFBF9] p-3 rounded border border-border space-y-0.5">
                      <strong className="text-charcoal font-semibold block">Delivery Address:</strong>
                      <p>
                        {order.customer.name} • {order.customer.address}, {order.customer.city} - {order.customer.pincode}
                      </p>
                      <p>Carrier: {order.carrier || 'Blue Dart Luxury Priority Express'}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-6 pt-4 border-t border-border flex flex-wrap gap-3">
                    <button
                      onClick={() => setSelectedTracking(order)}
                      className="flex-1 sm:flex-none text-center px-6 py-2.5 bg-plum hover:bg-plum-hover text-white text-xs font-bold uppercase tracking-widest rounded-sm transition-colors shadow-xs"
                    >
                      Track Package
                    </button>
                    <Link
                      href="/shop"
                      className="flex-1 sm:flex-none text-center px-6 py-2.5 bg-white border border-charcoal text-charcoal hover:bg-[#FAF7F5] text-xs font-bold uppercase tracking-widest rounded-sm transition-colors"
                    >
                      Order Again
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TRACKING MODAL */}
      {selectedTracking && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-xl border border-border shadow-luxury overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border flex items-center justify-between bg-[#FAF7F5]">
              <div>
                <h3 className="font-sans font-bold text-lg text-charcoal">Airway Bill Tracking</h3>
                <p className="text-xs text-charcoal-muted font-mono">{selectedTracking.awbNumber}</p>
              </div>
              <button
                onClick={() => setSelectedTracking(null)}
                className="p-1 text-charcoal-muted hover:text-charcoal transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="p-4 bg-plum/5 rounded-lg border border-plum/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-plum block">Carrier Logistics Partner</span>
                  <strong className="text-sm text-charcoal">{selectedTracking.carrier || 'Blue Dart Priority Express'}</strong>
                </div>
                <Truck className="w-6 h-6 text-plum" />
              </div>

              {/* Tracking timeline */}
              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <strong className="text-charcoal block">Order Formulated & Verified</strong>
                    <span className="text-charcoal-muted text-[11px]">SENSEIN Parisian Clean Formulation Facility</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-plum text-white flex items-center justify-center text-xs shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <strong className="text-charcoal block">Airway Bill Generated (Live AWB: {selectedTracking.awbNumber})</strong>
                    <span className="text-charcoal-muted text-[11px]">Manifested with Blue Dart Express</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs shrink-0 mt-0.5">
                    •
                  </div>
                  <div>
                    <strong className="text-charcoal block">In Transit to Destination Hub</strong>
                    <span className="text-charcoal-muted text-[11px]">
                      Destination: {selectedTracking.customer?.city || 'Your Address'} ({selectedTracking.customer?.pincode})
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-border flex justify-end">
                <button
                  onClick={() => setSelectedTracking(null)}
                  className="px-5 py-2 bg-charcoal text-white text-xs uppercase tracking-widest font-semibold rounded-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INVOICE MODAL */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-xl w-full rounded-xl border border-border shadow-luxury overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex items-center justify-between bg-[#FAF7F5]">
              <div>
                <h3 className="font-serif font-bold text-xl text-plum">SENSEIN PROFESSIONAL</h3>
                <p className="text-[11px] text-charcoal-muted uppercase tracking-widest">Official Tax Invoice</p>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="p-1 text-charcoal-muted hover:text-charcoal transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 text-xs">
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-border">
                <div>
                  <span className="text-charcoal-muted text-[11px] block">Invoice No:</span>
                  <strong className="font-mono text-charcoal">{selectedInvoice.orderNumber}</strong>
                  <span className="text-charcoal-muted text-[11px] block mt-2">Order Date:</span>
                  <span className="text-charcoal">
                    {new Date(selectedInvoice.createdAt || Date.now()).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-charcoal-muted text-[11px] block">Billed To:</span>
                  <strong className="text-charcoal">{selectedInvoice.customer?.name}</strong>
                  <p className="text-charcoal-muted mt-0.5">{selectedInvoice.customer?.email}</p>
                  <p className="text-charcoal-muted">{selectedInvoice.customer?.phone}</p>
                </div>
              </div>

              {/* Items table */}
              <div className="space-y-3">
                <div className="flex justify-between font-bold text-charcoal-muted uppercase text-[10px] pb-1 border-b border-border">
                  <span>Item</span>
                  <span>Amount</span>
                </div>
                {(selectedInvoice.items || []).map((it: any, i: number) => (
                  <div key={i} className="flex justify-between items-center py-1">
                    <div>
                      <strong className="text-charcoal block">{it.name}</strong>
                      <span className="text-[11px] text-charcoal-muted">Qty: {it.quantity || 1} • {it.size || ''}</span>
                    </div>
                    <span className="font-bold text-charcoal">
                      ₹{((it.price || 0) * (it.quantity || 1)).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Financial summary */}
              <div className="pt-4 border-t border-border space-y-1.5 text-xs">
                <div className="flex justify-between text-charcoal-muted">
                  <span>Subtotal</span>
                  <span>₹{(selectedInvoice.subtotal || selectedInvoice.total).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-charcoal-muted">
                  <span>Shipping & Handling</span>
                  <span>₹{(selectedInvoice.shippingFee || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-bold text-charcoal text-sm pt-2 border-t border-border">
                  <span>Total Paid (Razorpay)</span>
                  <span className="text-plum">₹{(selectedInvoice.total || 0).toLocaleString('en-IN')}</span>
                </div>
                {selectedInvoice.razorpayPaymentId && (
                  <p className="text-[11px] text-charcoal-subtle font-mono pt-1">
                    Razorpay Ref: {selectedInvoice.razorpayPaymentId}
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-border flex justify-end gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 border border-charcoal text-charcoal text-xs uppercase tracking-wider font-semibold rounded-sm hover:bg-[#FAF7F5] transition"
                >
                  Print Invoice
                </button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="px-5 py-2 bg-plum text-white text-xs uppercase tracking-widest font-semibold rounded-sm hover:bg-plum-dark transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
