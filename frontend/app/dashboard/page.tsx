'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Package, CreditCard, Heart, MapPin, Award } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { fetchUserOrders } from '@/lib/api';

export default function DashboardOverview() {
  const { user } = useAuthStore();
  const [latestOrder, setLatestOrder] = useState<any | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(true);

  useEffect(() => {
    async function loadLatest() {
      if (!user) {
        setLoadingOrder(false);
        return;
      }
      try {
        const orders = await fetchUserOrders(user.email || user.id);
        if (orders && orders.length > 0) {
          setLatestOrder(orders[0]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingOrder(false);
      }
    }
    loadLatest();
  }, [user]);

  if (!user) return null;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-charcoal tracking-tight">Overview</h1>
        <p className="text-sm text-charcoal-muted mt-1">Manage your account, track orders, and view your privileges.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {/* Tier / Loyalty Card */}
        <div className="bg-gradient-to-br from-[#5A3859] to-[#432542] rounded-xl p-6 sm:p-8 text-white relative overflow-hidden shadow-luxury">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-black/20 rounded-full backdrop-blur-sm border border-white/10 mb-4">
                <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#E8D5C4]">SENSEIN Insider</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-wide">Velvet Tier</h3>
              <p className="text-sm text-white/80 mt-1 font-light">1,250 points until Platinum Tier</p>
            </div>

            <div className="mt-8 space-y-2">
              <div className="flex justify-between text-xs font-semibold text-white/90">
                <span>Current Points</span>
                <span>2,750</span>
              </div>
              <div className="w-full bg-black/30 rounded-full h-1.5">
                <div className="bg-[#D4AF37] h-1.5 rounded-full" style={{ width: '68%' }}></div>
              </div>
              <p className="text-[10px] text-white/70 pt-1 text-right">Points expire in 11 months</p>
            </div>
          </div>
        </div>

        {/* Recent Order Summary from MongoDB Atlas */}
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-border shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-sans font-bold text-lg text-charcoal">Latest Order</h3>
              {latestOrder && (
                <span className="px-2.5 py-1 bg-emerald-light text-emerald-accent text-[10px] font-bold uppercase tracking-wider rounded-sm">
                  {latestOrder.orderStatus || 'CONFIRMED'}
                </span>
              )}
            </div>
            
            {loadingOrder ? (
              <div className="space-y-2 animate-pulse py-2">
                <div className="h-4 bg-alabaster rounded w-1/2"></div>
                <div className="h-5 bg-alabaster rounded w-3/4"></div>
              </div>
            ) : latestOrder ? (
              <div className="space-y-1 mb-6">
                <p className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider">
                  Order #{latestOrder.orderNumber}
                </p>
                <p className="text-sm text-charcoal font-medium line-clamp-1">
                  {latestOrder.items?.[0]?.name || 'Luxury Formulation'}
                  {latestOrder.items?.length > 1 ? ` & ${latestOrder.items.length - 1} more item` : ''}
                </p>
                <p className="text-xs text-charcoal-subtle">
                  Placed on{' '}
                  {latestOrder.createdAt
                    ? new Date(latestOrder.createdAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'Recently'}{' '}
                  • <strong className="text-plum">₹{(latestOrder.total || 0).toLocaleString('en-IN')}</strong>
                </p>
              </div>
            ) : (
              <div className="space-y-1 mb-6">
                <p className="text-xs text-charcoal-muted">No orders placed yet.</p>
                <p className="text-sm text-charcoal">Begin your luxury ritual experience today.</p>
              </div>
            )}
          </div>

          <Link
            href={latestOrder ? "/dashboard/orders" : "/shop"}
            className="inline-flex items-center justify-center w-full sm:w-auto px-5 py-2.5 border border-[#5A3859] text-[#5A3859] hover:bg-[#5A3859] hover:text-white transition-colors text-xs font-bold uppercase tracking-widest rounded-sm"
          >
            {latestOrder ? "Track Order" : "Explore Formulations"}
          </Link>
        </div>
      </div>

      {/* Quick Links Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 pt-4">
        <Link href="/dashboard/orders" className="bg-white p-5 rounded-xl border border-border hover:border-plum/50 hover:shadow-md transition-all group">
          <div className="w-10 h-10 rounded-full bg-plum/5 flex items-center justify-center mb-3 group-hover:bg-plum/10 transition-colors">
            <Package className="w-5 h-5 text-plum" />
          </div>
          <h4 className="text-sm font-bold text-charcoal mb-1">Order History</h4>
          <p className="text-xs text-charcoal-muted line-clamp-2">View past orders and tracking.</p>
        </Link>

        <Link href="/dashboard/settings" className="bg-white p-5 rounded-xl border border-border hover:border-plum/50 hover:shadow-md transition-all group">
          <div className="w-10 h-10 rounded-full bg-plum/5 flex items-center justify-center mb-3 group-hover:bg-plum/10 transition-colors">
            <MapPin className="w-5 h-5 text-plum" />
          </div>
          <h4 className="text-sm font-bold text-charcoal mb-1">Addresses</h4>
          <p className="text-xs text-charcoal-muted line-clamp-2">Manage shipping destinations.</p>
        </Link>

        <Link href="/dashboard/settings" className="bg-white p-5 rounded-xl border border-border hover:border-plum/50 hover:shadow-md transition-all group">
          <div className="w-10 h-10 rounded-full bg-plum/5 flex items-center justify-center mb-3 group-hover:bg-plum/10 transition-colors">
            <CreditCard className="w-5 h-5 text-plum" />
          </div>
          <h4 className="text-sm font-bold text-charcoal mb-1">Payment Methods</h4>
          <p className="text-xs text-charcoal-muted line-clamp-2">Securely saved cards.</p>
        </Link>

        <Link href="/shop" className="bg-[#FAF7F5] p-5 rounded-xl border border-border hover:border-plum/50 hover:shadow-md transition-all group relative overflow-hidden">
          <div className="w-10 h-10 rounded-full bg-plum/10 flex items-center justify-center mb-3 group-hover:bg-plum/20 transition-colors relative z-10">
            <Heart className="w-5 h-5 text-plum" />
          </div>
          <h4 className="text-sm font-bold text-charcoal mb-1 relative z-10">Continue Shopping</h4>
          <p className="text-xs text-charcoal-muted line-clamp-2 relative z-10">Explore new collections.</p>
          <ArrowRight className="absolute bottom-5 right-5 w-5 h-5 text-plum opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>
    </div>
  );
}
