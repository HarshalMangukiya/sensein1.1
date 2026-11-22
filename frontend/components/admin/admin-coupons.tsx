'use client';

import React, { useState, useEffect } from 'react';
import {
  Tag,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Edit2,
  Trash2,
  Play,
  Pause,
  Copy,
  Check,
  AlertCircle,
  Clock,
  Sparkles,
  Loader2,
  Percent,
  DollarSign,
  Ticket,
  Calendar,
  X,
  CheckCircle2,
} from 'lucide-react';
import {
  fetchCouponsApi,
  createCouponApi,
  updateCouponApi,
  toggleCouponStatusApi,
  deleteCouponApi,
  CouponItem,
} from '@/lib/api';

interface AdminCouponsProps {
  setToast: (toast: { text: string; type: 'success' | 'error' | 'info' } | null) => void;
  onCouponsCountChange?: (count: number) => void;
}

export function AdminCoupons({ setToast, onCouponsCountChange }: AdminCouponsProps) {
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'PAUSED' | 'EXPIRED'>('ALL');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'PERCENTAGE' | 'FIXED'>('ALL');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponItem | null>(null);

  // Action loaders
  const [submitting, setSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form State
  const initialFormState = {
    code: '',
    description: '',
    discountType: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED',
    discountValue: 10,
    minOrderValue: 999,
    maxDiscountAmount: '' as number | '',
    status: 'ACTIVE' as 'ACTIVE' | 'PAUSED',
    validUntil: '',
    usageLimit: 0,
    isPublic: true,
  };
  const [formData, setFormData] = useState(initialFormState);

  // Fetch coupons from backend / MongoDB Atlas
  const loadCoupons = async () => {
    try {
      setLoading(true);
      const data = await fetchCouponsApi();
      if (Array.isArray(data)) {
        setCoupons(data);
        onCouponsCountChange?.(data.length);
      }
    } catch (err: any) {
      console.error('Failed to load coupons:', err);
      setToast({ text: 'Failed to load coupons from MongoDB Atlas', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  // Quick Copy to Clipboard
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setToast({ text: `Coupon code '${code}' copied to clipboard!`, type: 'info' });
    setTimeout(() => {
      setCopiedCode(null);
    }, 2500);
  };

  // Generate random luxury code
  const handleGenerateCode = () => {
    const prefixes = ['LUXE', 'VIP', 'SENSEIN', 'PARIS', 'ELITE', 'RITUAL', 'GLOW'];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomNum = Math.floor(10 + Math.random() * 90);
    setFormData((prev) => ({
      ...prev,
      code: `${randomPrefix}${randomNum}`,
    }));
  };

  // Create new coupon
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim()) {
      setToast({ text: 'Please enter a valid coupon code', type: 'error' });
      return;
    }

    try {
      setSubmitting(true);
      const payload: Partial<CouponItem> = {
        code: formData.code.trim().toUpperCase(),
        description: formData.description.trim(),
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        minOrderValue: Number(formData.minOrderValue) || 0,
        maxDiscountAmount:
          formData.discountType === 'PERCENTAGE' && formData.maxDiscountAmount !== ''
            ? Number(formData.maxDiscountAmount)
            : undefined,
        status: formData.status,
        validUntil: formData.validUntil ? new Date(formData.validUntil).toISOString() : null,
        usageLimit: Number(formData.usageLimit) || 0,
        isPublic: formData.isPublic,
      };

      const res = await createCouponApi(payload);
      if (res?.success) {
        setToast({
          text: `Coupon '${payload.code}' successfully created and stored in MongoDB!`,
          type: 'success',
        });
        setIsCreateModalOpen(false);
        setFormData(initialFormState);
        await loadCoupons();
      } else {
        setToast({ text: res?.error || 'Failed to create coupon', type: 'error' });
      }
    } catch (err: any) {
      setToast({ text: err.message || 'Error creating coupon', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (coupon: CouponItem) => {
    setEditingCoupon(coupon);
    let dateStr = '';
    if (coupon.validUntil) {
      try {
        dateStr = new Date(coupon.validUntil).toISOString().split('T')[0];
      } catch (e) {}
    }

    setFormData({
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderValue: coupon.minOrderValue,
      maxDiscountAmount: coupon.maxDiscountAmount !== undefined && coupon.maxDiscountAmount !== null ? coupon.maxDiscountAmount : '',
      status: coupon.status === 'EXPIRED' ? 'PAUSED' : coupon.status,
      validUntil: dateStr,
      usageLimit: coupon.usageLimit || 0,
      isPublic: coupon.isPublic ?? true,
    });
    setIsEditModalOpen(true);
  };

  // Update existing coupon
  const handleUpdateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCoupon) return;

    const couponId = editingCoupon._id || editingCoupon.id;
    if (!couponId) return;

    try {
      setSubmitting(true);
      const payload: Partial<CouponItem> = {
        code: formData.code.trim().toUpperCase(),
        description: formData.description.trim(),
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        minOrderValue: Number(formData.minOrderValue) || 0,
        maxDiscountAmount:
          formData.discountType === 'PERCENTAGE' && formData.maxDiscountAmount !== ''
            ? Number(formData.maxDiscountAmount)
            : undefined,
        status: formData.status,
        validUntil: formData.validUntil ? new Date(formData.validUntil).toISOString() : null,
        usageLimit: Number(formData.usageLimit) || 0,
        isPublic: formData.isPublic,
      };

      const res = await updateCouponApi(couponId, payload);
      if (res?.success) {
        setToast({
          text: `Coupon '${payload.code}' successfully updated!`,
          type: 'success',
        });
        setIsEditModalOpen(false);
        setEditingCoupon(null);
        await loadCoupons();
      } else {
        setToast({ text: res?.error || 'Failed to update coupon', type: 'error' });
      }
    } catch (err: any) {
      setToast({ text: err.message || 'Error updating coupon', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  // 1-Click Toggle Live vs Pause
  const handleToggleLivePause = async (coupon: CouponItem) => {
    const couponId = coupon._id || coupon.id;
    if (!couponId || togglingId) return;

    const targetStatus = coupon.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    setTogglingId(couponId);

    // Optimistic UI update
    setCoupons((prev) =>
      prev.map((c) =>
        (c._id === couponId || c.id === couponId)
          ? { ...c, status: targetStatus }
          : c
      )
    );

    try {
      const res = await toggleCouponStatusApi(couponId, targetStatus);
      if (res?.success) {
        setToast({
          text:
            targetStatus === 'ACTIVE'
              ? `Coupon '${coupon.code}' is now LIVE for shoppers!`
              : `Coupon '${coupon.code}' has been PAUSED.`,
          type: targetStatus === 'ACTIVE' ? 'success' : 'info',
        });
      } else {
        // Rollback
        await loadCoupons();
        setToast({ text: res?.error || 'Failed to toggle status', type: 'error' });
      }
    } catch (err: any) {
      await loadCoupons();
      setToast({ text: err.message || 'Error toggling status', type: 'error' });
    } finally {
      setTogglingId(null);
    }
  };

  // Delete Coupon
  const handleDeleteCoupon = async (coupon: CouponItem) => {
    const couponId = coupon._id || coupon.id;
    if (!couponId || deletingId) return;

    if (!confirm(`Are you sure you want to delete coupon code '${coupon.code}' permanently?`)) {
      return;
    }

    setDeletingId(couponId);
    try {
      const res = await deleteCouponApi(couponId);
      if (res?.success) {
        setCoupons((prev) => prev.filter((c) => c._id !== couponId && c.id !== couponId));
        setToast({ text: `Coupon '${coupon.code}' removed successfully.`, type: 'success' });
      } else {
        setToast({ text: res?.error || 'Failed to delete coupon', type: 'error' });
      }
    } catch (err: any) {
      setToast({ text: err.message || 'Error deleting coupon', type: 'error' });
    } finally {
      setDeletingId(null);
    }
  };

  // Filtered coupons
  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch =
      coupon.code.toLowerCase().includes(search.toLowerCase()) ||
      coupon.description.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL'
        ? true
        : coupon.status === statusFilter;

    const matchesType =
      typeFilter === 'ALL'
        ? true
        : coupon.discountType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Overview metrics
  const activeCount = coupons.filter((c) => c.status === 'ACTIVE').length;
  const pausedCount = coupons.filter((c) => c.status === 'PAUSED').length;
  const totalUses = coupons.reduce((sum, c) => sum + (c.usageCount || 0), 0);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-serif font-bold text-charcoal tracking-tight">
              Promotions & Coupon Management
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-plum/10 border border-plum/20 text-plum font-bold text-[10px] uppercase tracking-wider">
              Live Mongo Atlas
            </span>
          </div>
          <p className="text-xs text-charcoal-muted mt-1">
            Create, edit, pause, and activate promotional voucher codes and automated discount rules.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={loadCoupons}
            disabled={loading}
            title="Refresh coupons from database"
            className="p-2.5 bg-white border border-border hover:border-plum/40 text-charcoal hover:text-plum rounded-lg transition-colors shadow-2xs disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-plum' : ''}`} />
          </button>

          <button
            onClick={() => {
              setFormData(initialFormState);
              setIsCreateModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-plum hover:bg-plum-hover text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all shadow-sm hover:shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Create Coupon</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="p-5 rounded-xl bg-white border border-border shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-charcoal-muted mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Campaigns</span>
            <div className="p-2 rounded-lg bg-plum/10 text-plum">
              <Ticket className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold font-sans text-charcoal">{coupons.length}</h3>
          <p className="text-[11px] text-charcoal-muted mt-2">Configured in store</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-border shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-charcoal-muted mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Live & Active</span>
            <div className="p-2 rounded-lg bg-emerald-light text-emerald-accent">
              <Play className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold font-sans text-emerald-accent flex items-center gap-2">
            {activeCount}
            <span className="w-2 h-2 rounded-full bg-emerald-accent animate-pulse" />
          </h3>
          <p className="text-[11px] text-emerald-accent mt-2 font-semibold">Available for customers</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-border shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-charcoal-muted mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Paused Codes</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Pause className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold font-sans text-amber-600">{pausedCount}</h3>
          <p className="text-[11px] text-charcoal-muted mt-2">Temporarily held offline</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-border shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-charcoal-muted mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Redemptions</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold font-sans text-charcoal">{totalUses}</h3>
          <p className="text-[11px] text-blue-600 mt-2 font-semibold">Total checkout claims</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white border border-border rounded-xl shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search coupon code or campaign description..."
            className="w-full pl-10 pr-4 py-2 bg-[#FAF7F5] border border-border rounded-lg text-xs text-charcoal placeholder:text-charcoal-muted focus:outline-none focus:border-plum focus:ring-1 focus:ring-plum transition"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-muted hover:text-charcoal"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Badges / Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center bg-[#FAF7F5] border border-border rounded-lg p-0.5 text-[11px]">
            {(['ALL', 'ACTIVE', 'PAUSED'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-md font-semibold transition ${
                  statusFilter === st
                    ? 'bg-plum text-white shadow-2xs'
                    : 'text-charcoal-muted hover:text-charcoal'
                }`}
              >
                {st === 'ALL' ? 'All Status' : st === 'ACTIVE' ? 'Live Only' : 'Paused'}
              </button>
            ))}
          </div>

          {/* Discount Type Filter */}
          <div className="flex items-center bg-[#FAF7F5] border border-border rounded-lg p-0.5 text-[11px]">
            {(['ALL', 'PERCENTAGE', 'FIXED'] as const).map((tp) => (
              <button
                key={tp}
                onClick={() => setTypeFilter(tp)}
                className={`px-3 py-1.5 rounded-md font-semibold transition ${
                  typeFilter === tp
                    ? 'bg-plum text-white shadow-2xs'
                    : 'text-charcoal-muted hover:text-charcoal'
                }`}
              >
                {tp === 'ALL' ? 'All Types' : tp === 'PERCENTAGE' ? '% Off' : '₹ Flat'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Coupons List / Cards */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-charcoal-muted bg-white border border-border rounded-xl">
          <Loader2 className="w-8 h-8 animate-spin text-plum" />
          <p className="text-xs uppercase font-bold tracking-widest text-charcoal">
            Syncing Coupon Portfolio from MongoDB Atlas...
          </p>
        </div>
      ) : filteredCoupons.length === 0 ? (
        <div className="py-16 text-center bg-white border border-dashed border-border rounded-xl p-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-plum/10 text-plum flex items-center justify-center mx-auto">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider">No Coupons Found</h3>
            <p className="text-xs text-charcoal-muted mt-1 max-w-sm mx-auto">
              {search || statusFilter !== 'ALL' || typeFilter !== 'ALL'
                ? 'Try adjusting your search criteria or filter options.'
                : 'No promotional codes exist yet. Create your first luxury coupon code to reward patrons.'}
            </p>
          </div>
          <button
            onClick={() => {
              setSearch('');
              setStatusFilter('ALL');
              setTypeFilter('ALL');
              if (coupons.length === 0) setIsCreateModalOpen(true);
            }}
            className="px-4 py-2 bg-plum text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-plum-hover transition"
          >
            {coupons.length === 0 ? 'Create First Coupon' : 'Clear Filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredCoupons.map((coupon) => {
            const couponId = coupon._id || coupon.id || coupon.code;
            const isLive = coupon.status === 'ACTIVE';
            const isPaused = coupon.status === 'PAUSED';
            const isToggling = togglingId === couponId;
            const isDeleting = deletingId === couponId;

            return (
              <div
                key={couponId}
                className={`relative bg-white rounded-xl border transition-all duration-200 overflow-hidden shadow-xs hover:shadow-md flex flex-col justify-between ${
                  isLive
                    ? 'border-border hover:border-plum/40'
                    : 'border-amber-200/80 bg-amber-50/20'
                }`}
              >
                {/* Top Banner Ribbon */}
                <div className="p-4 sm:p-5 border-b border-border/80">
                  <div className="flex items-start justify-between gap-3">
                    {/* Code Badge with Click-to-copy */}
                    <div>
                      <div className="inline-flex items-center gap-2 bg-[#FAF7F5] border border-border/80 hover:border-plum px-3 py-1.5 rounded-lg group transition">
                        <Tag className="w-3.5 h-3.5 text-plum" />
                        <span className="font-mono font-bold text-charcoal text-sm tracking-wider">
                          {coupon.code}
                        </span>
                        <button
                          onClick={() => handleCopyCode(coupon.code)}
                          title="Copy Code"
                          className="text-charcoal-muted hover:text-plum p-0.5 rounded transition"
                        >
                          {copiedCode === coupon.code ? (
                            <Check className="w-3.5 h-3.5 text-emerald-accent" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      {/* Status Badge */}
                      <div className="mt-2.5 flex items-center gap-2">
                        {isLive ? (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-accent bg-emerald-light px-2.5 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-accent animate-pulse" />
                            Live Code
                          </span>
                        ) : isPaused ? (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                            <Pause className="w-3 h-3" />
                            Paused
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-charcoal-muted bg-neutral-100 px-2.5 py-0.5 rounded-full">
                            Expired
                          </span>
                        )}

                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#FAF7F5] border border-border text-charcoal-muted">
                          {coupon.discountType === 'PERCENTAGE' ? 'Percentage %' : 'Flat Cash ₹'}
                        </span>
                      </div>
                    </div>

                    {/* Discount Value Highlight */}
                    <div className="text-right">
                      <div className="text-xl sm:text-2xl font-serif font-bold text-plum tracking-tight">
                        {coupon.discountType === 'PERCENTAGE'
                          ? `${coupon.discountValue}% OFF`
                          : `₹${coupon.discountValue.toLocaleString('en-IN')} OFF`}
                      </div>
                      {coupon.maxDiscountAmount && coupon.discountType === 'PERCENTAGE' ? (
                        <p className="text-[10px] text-charcoal-muted font-medium">
                          Up to ₹{coupon.maxDiscountAmount}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-charcoal mt-3 line-clamp-2 leading-relaxed">
                    {coupon.description || 'Promotional coupon grant'}
                  </p>
                </div>

                {/* Details Breakdown */}
                <div className="p-4 sm:p-5 space-y-2.5 text-xs bg-[#FAF7F5]/50 flex-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-charcoal-muted font-medium">Min Order Cart:</span>
                    <span className="font-semibold text-charcoal">
                      {coupon.minOrderValue > 0
                        ? `₹${coupon.minOrderValue.toLocaleString('en-IN')}`
                        : 'No Minimum'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-charcoal-muted font-medium">Redemptions:</span>
                    <span className="font-mono font-semibold text-charcoal">
                      {coupon.usageCount || 0}
                      {coupon.usageLimit && coupon.usageLimit > 0 ? ` / ${coupon.usageLimit}` : ' (Unlimited)'}
                    </span>
                  </div>

                  {coupon.validUntil && (
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-charcoal-muted font-medium">Valid Until:</span>
                      <span className="font-medium text-charcoal flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-plum" />
                        {new Date(coupon.validUntil).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Action Footer */}
                <div className="p-3.5 bg-white border-t border-border flex items-center justify-between gap-2">
                  {/* Primary 1-Click Live / Pause Toggle Button */}
                  <button
                    onClick={() => handleToggleLivePause(coupon)}
                    disabled={isToggling}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-2xs ${
                      isLive
                        ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {isToggling ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : isLive ? (
                      <>
                        <Pause className="w-3.5 h-3.5" />
                        <span>Pause Code</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Go Live</span>
                      </>
                    )}
                  </button>

                  {/* Edit Button */}
                  <button
                    onClick={() => openEditModal(coupon)}
                    title="Edit Coupon Details"
                    className="p-2 bg-[#FAF7F5] hover:bg-neutral-200 text-charcoal border border-border rounded-lg transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteCoupon(coupon)}
                    disabled={isDeleting}
                    title="Delete Coupon"
                    className="p-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg transition-colors"
                  >
                    {isDeleting ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE COUPON MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-border rounded-2xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-plum/10 text-plum flex items-center justify-center">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-charcoal">Create New Coupon Code</h3>
                  <p className="text-[11px] text-charcoal-muted">Deploy a promotional voucher directly into MongoDB</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 text-charcoal-muted hover:text-charcoal rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateCoupon} className="py-4 space-y-4 text-xs">
              {/* Code + Generate */}
              <div>
                <label className="block text-xs font-semibold uppercase text-charcoal mb-1">
                  Coupon Code <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. LUXE25, VIP500"
                    className="flex-1 px-3.5 py-2.5 bg-[#FAF7F5] border border-border rounded-lg text-sm font-mono font-bold uppercase tracking-wider text-charcoal focus:outline-none focus:border-plum focus:ring-1 focus:ring-plum"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateCode}
                    className="px-3.5 py-2 bg-white hover:bg-neutral-100 border border-border text-charcoal rounded-lg font-semibold text-xs flex items-center gap-1.5 transition"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-plum" />
                    <span>Auto Generate</span>
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold uppercase text-charcoal mb-1">
                  Campaign Description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. 20% privilege savings on luxury botanical formulations"
                  className="w-full px-3.5 py-2 bg-[#FAF7F5] border border-border rounded-lg text-xs text-charcoal focus:outline-none focus:border-plum focus:ring-1 focus:ring-plum"
                />
              </div>

              {/* Discount Type Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase text-charcoal mb-1">
                  Discount Calculation Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, discountType: 'PERCENTAGE' })}
                    className={`p-3 rounded-lg border text-left flex items-center gap-2.5 transition ${
                      formData.discountType === 'PERCENTAGE'
                        ? 'border-plum bg-plum/5 text-plum font-bold shadow-2xs'
                        : 'border-border text-charcoal-muted hover:border-plum/40'
                    }`}
                  >
                    <Percent className="w-4 h-4" />
                    <div>
                      <p className="font-semibold text-charcoal">Percentage (%)</p>
                      <p className="text-[10px] text-charcoal-muted">e.g. 10% or 20% off</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, discountType: 'FIXED' })}
                    className={`p-3 rounded-lg border text-left flex items-center gap-2.5 transition ${
                      formData.discountType === 'FIXED'
                        ? 'border-plum bg-plum/5 text-plum font-bold shadow-2xs'
                        : 'border-border text-charcoal-muted hover:border-plum/40'
                    }`}
                  >
                    <DollarSign className="w-4 h-4" />
                    <div>
                      <p className="font-semibold text-charcoal">Flat Cash (₹)</p>
                      <p className="text-[10px] text-charcoal-muted">e.g. Flat ₹200 or ₹500 off</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Discount Value & Max Cap */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-charcoal mb-1">
                    {formData.discountType === 'PERCENTAGE' ? 'Discount Percentage (%)' : 'Flat Discount Amount (₹)'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={formData.discountType === 'PERCENTAGE' ? 95 : 100000}
                    required
                    placeholder="0"
                    value={formData.discountValue ?? ''}
                    onFocus={(e) => {
                      if (e.target.value === '0') setFormData((prev: any) => ({ ...prev, discountValue: '' }));
                      else e.target.select();
                    }}
                    onChange={(e) => {
                      const raw = e.target.value;
                      if (raw === '') {
                        setFormData((prev: any) => ({ ...prev, discountValue: '' }));
                        return;
                      }
                      const clean = raw.replace(/^0+(?=\d)/, '');
                      setFormData((prev: any) => ({ ...prev, discountValue: clean === '' ? '' : Number(clean) }));
                    }}
                    className="w-full px-3.5 py-2 bg-[#FAF7F5] border border-border rounded-lg text-xs font-bold text-charcoal focus:outline-none focus:border-plum focus:ring-1 focus:ring-plum"
                  />
                </div>

                {formData.discountType === 'PERCENTAGE' && (
                  <div>
                    <label className="block text-xs font-semibold uppercase text-charcoal mb-1">
                      Max Discount Cap (₹, Optional)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.maxDiscountAmount ?? ''}
                      onFocus={(e) => {
                        if (e.target.value === '0') setFormData((prev: any) => ({ ...prev, maxDiscountAmount: '' }));
                        else e.target.select();
                      }}
                      onChange={(e) => {
                        const raw = e.target.value;
                        if (raw === '') {
                          setFormData((prev: any) => ({ ...prev, maxDiscountAmount: '' }));
                          return;
                        }
                        const clean = raw.replace(/^0+(?=\d)/, '');
                        setFormData((prev: any) => ({ ...prev, maxDiscountAmount: clean === '' ? '' : Number(clean) }));
                      }}
                      placeholder="e.g. 500 (No cap if empty)"
                      className="w-full px-3.5 py-2 bg-[#FAF7F5] border border-border rounded-lg text-xs text-charcoal focus:outline-none focus:border-plum focus:ring-1 focus:ring-plum"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold uppercase text-charcoal mb-1">
                    Minimum Cart Value (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.minOrderValue ?? ''}
                    onFocus={(e) => {
                      if (e.target.value === '0') setFormData((prev: any) => ({ ...prev, minOrderValue: '' }));
                      else e.target.select();
                    }}
                    onChange={(e) => {
                      const raw = e.target.value;
                      if (raw === '') {
                        setFormData((prev: any) => ({ ...prev, minOrderValue: '' }));
                        return;
                      }
                      const clean = raw.replace(/^0+(?=\d)/, '');
                      setFormData((prev: any) => ({ ...prev, minOrderValue: clean === '' ? '' : Number(clean) }));
                    }}
                    placeholder="e.g. 1499 (0 for no minimum)"
                    className="w-full px-3.5 py-2 bg-[#FAF7F5] border border-border rounded-lg text-xs text-charcoal focus:outline-none focus:border-plum focus:ring-1 focus:ring-plum"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-charcoal mb-1">
                    Total Redemption Limit
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.usageLimit ?? ''}
                    onFocus={(e) => {
                      if (e.target.value === '0') setFormData((prev: any) => ({ ...prev, usageLimit: '' }));
                      else e.target.select();
                    }}
                    onChange={(e) => {
                      const raw = e.target.value;
                      if (raw === '') {
                        setFormData((prev: any) => ({ ...prev, usageLimit: '' }));
                        return;
                      }
                      const clean = raw.replace(/^0+(?=\d)/, '');
                      setFormData((prev: any) => ({ ...prev, usageLimit: clean === '' ? '' : Number(clean) }));
                    }}
                    placeholder="0 = Unlimited uses"
                    className="w-full px-3.5 py-2 bg-[#FAF7F5] border border-border rounded-lg text-xs text-charcoal focus:outline-none focus:border-plum focus:ring-1 focus:ring-plum"
                  />
                </div>
              </div>

              {/* Expiry Date & Initial Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-charcoal mb-1">
                    Expiry Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#FAF7F5] border border-border rounded-lg text-xs text-charcoal focus:outline-none focus:border-plum focus:ring-1 focus:ring-plum"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-charcoal mb-1">
                    Initial Activation State
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3.5 py-2 bg-[#FAF7F5] border border-border rounded-lg text-xs text-charcoal font-semibold focus:outline-none focus:border-plum focus:ring-1 focus:ring-plum"
                  >
                    <option value="ACTIVE">● Go Live Immediately (ACTIVE)</option>
                    <option value="PAUSED">❚❚ Save as Paused (PAUSED)</option>
                  </select>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-[#FAF7F5] hover:bg-neutral-200 text-charcoal text-xs font-semibold uppercase tracking-wider rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2 bg-plum hover:bg-plum-hover text-white text-xs font-bold uppercase tracking-wider rounded-lg transition shadow-xs disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving to Atlas...</span>
                    </>
                  ) : (
                    <span>Create & Deploy Coupon</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT COUPON MODAL */}
      {isEditModalOpen && editingCoupon && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-border rounded-2xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-plum/10 text-plum flex items-center justify-center">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-charcoal">Edit Coupon Code</h3>
                  <p className="text-[11px] text-charcoal-muted">
                    Modifying configuration for <span className="font-mono font-bold text-plum">{editingCoupon.code}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 text-charcoal-muted hover:text-charcoal rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleUpdateCoupon} className="py-4 space-y-4 text-xs">
              {/* Code */}
              <div>
                <label className="block text-xs font-semibold uppercase text-charcoal mb-1">
                  Coupon Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F5] border border-border rounded-lg text-sm font-mono font-bold uppercase tracking-wider text-charcoal focus:outline-none focus:border-plum focus:ring-1 focus:ring-plum"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold uppercase text-charcoal mb-1">
                  Campaign Description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#FAF7F5] border border-border rounded-lg text-xs text-charcoal focus:outline-none focus:border-plum focus:ring-1 focus:ring-plum"
                />
              </div>

              {/* Discount Type Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase text-charcoal mb-1">
                  Discount Calculation Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, discountType: 'PERCENTAGE' })}
                    className={`p-3 rounded-lg border text-left flex items-center gap-2.5 transition ${
                      formData.discountType === 'PERCENTAGE'
                        ? 'border-plum bg-plum/5 text-plum font-bold shadow-2xs'
                        : 'border-border text-charcoal-muted hover:border-plum/40'
                    }`}
                  >
                    <Percent className="w-4 h-4" />
                    <div>
                      <p className="font-semibold text-charcoal">Percentage (%)</p>
                      <p className="text-[10px] text-charcoal-muted">e.g. 10% or 20% off</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, discountType: 'FIXED' })}
                    className={`p-3 rounded-lg border text-left flex items-center gap-2.5 transition ${
                      formData.discountType === 'FIXED'
                        ? 'border-plum bg-plum/5 text-plum font-bold shadow-2xs'
                        : 'border-border text-charcoal-muted hover:border-plum/40'
                    }`}
                  >
                    <DollarSign className="w-4 h-4" />
                    <div>
                      <p className="font-semibold text-charcoal">Flat Cash (₹)</p>
                      <p className="text-[10px] text-charcoal-muted">e.g. Flat ₹200 or ₹500 off</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Discount Value & Max Cap */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-charcoal mb-1">
                    {formData.discountType === 'PERCENTAGE' ? 'Discount Percentage (%)' : 'Flat Discount Amount (₹)'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={formData.discountType === 'PERCENTAGE' ? 95 : 100000}
                    required
                    placeholder="0"
                    value={formData.discountValue ?? ''}
                    onFocus={(e) => {
                      if (e.target.value === '0') setFormData((prev: any) => ({ ...prev, discountValue: '' }));
                      else e.target.select();
                    }}
                    onChange={(e) => {
                      const raw = e.target.value;
                      if (raw === '') {
                        setFormData((prev: any) => ({ ...prev, discountValue: '' }));
                        return;
                      }
                      const clean = raw.replace(/^0+(?=\d)/, '');
                      setFormData((prev: any) => ({ ...prev, discountValue: clean === '' ? '' : Number(clean) }));
                    }}
                    className="w-full px-3.5 py-2 bg-[#FAF7F5] border border-border rounded-lg text-xs font-bold text-charcoal focus:outline-none focus:border-plum focus:ring-1 focus:ring-plum"
                  />
                </div>

                {formData.discountType === 'PERCENTAGE' && (
                  <div>
                    <label className="block text-xs font-semibold uppercase text-charcoal mb-1">
                      Max Discount Cap (₹, Optional)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.maxDiscountAmount ?? ''}
                      onFocus={(e) => {
                        if (e.target.value === '0') setFormData((prev: any) => ({ ...prev, maxDiscountAmount: '' }));
                        else e.target.select();
                      }}
                      onChange={(e) => {
                        const raw = e.target.value;
                        if (raw === '') {
                          setFormData((prev: any) => ({ ...prev, maxDiscountAmount: '' }));
                          return;
                        }
                        const clean = raw.replace(/^0+(?=\d)/, '');
                        setFormData((prev: any) => ({ ...prev, maxDiscountAmount: clean === '' ? '' : Number(clean) }));
                      }}
                      placeholder="e.g. 500 (No cap if empty)"
                      className="w-full px-3.5 py-2 bg-[#FAF7F5] border border-border rounded-lg text-xs text-charcoal focus:outline-none focus:border-plum focus:ring-1 focus:ring-plum"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold uppercase text-charcoal mb-1">
                    Minimum Cart Value (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.minOrderValue ?? ''}
                    onFocus={(e) => {
                      if (e.target.value === '0') setFormData((prev: any) => ({ ...prev, minOrderValue: '' }));
                      else e.target.select();
                    }}
                    onChange={(e) => {
                      const raw = e.target.value;
                      if (raw === '') {
                        setFormData((prev: any) => ({ ...prev, minOrderValue: '' }));
                        return;
                      }
                      const clean = raw.replace(/^0+(?=\d)/, '');
                      setFormData((prev: any) => ({ ...prev, minOrderValue: clean === '' ? '' : Number(clean) }));
                    }}
                    placeholder="e.g. 1499"
                    className="w-full px-3.5 py-2 bg-[#FAF7F5] border border-border rounded-lg text-xs text-charcoal focus:outline-none focus:border-plum focus:ring-1 focus:ring-plum"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-charcoal mb-1">
                    Total Redemption Limit
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.usageLimit ?? ''}
                    onFocus={(e) => {
                      if (e.target.value === '0') setFormData((prev: any) => ({ ...prev, usageLimit: '' }));
                      else e.target.select();
                    }}
                    onChange={(e) => {
                      const raw = e.target.value;
                      if (raw === '') {
                        setFormData((prev: any) => ({ ...prev, usageLimit: '' }));
                        return;
                      }
                      const clean = raw.replace(/^0+(?=\d)/, '');
                      setFormData((prev: any) => ({ ...prev, usageLimit: clean === '' ? '' : Number(clean) }));
                    }}
                    placeholder="0 = Unlimited uses"
                    className="w-full px-3.5 py-2 bg-[#FAF7F5] border border-border rounded-lg text-xs text-charcoal focus:outline-none focus:border-plum focus:ring-1 focus:ring-plum"
                  />
                </div>
              </div>

              {/* Expiry Date & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-charcoal mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#FAF7F5] border border-border rounded-lg text-xs text-charcoal focus:outline-none focus:border-plum focus:ring-1 focus:ring-plum"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-charcoal mb-1">
                    Live / Pause Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3.5 py-2 bg-[#FAF7F5] border border-border rounded-lg text-xs text-charcoal font-semibold focus:outline-none focus:border-plum focus:ring-1 focus:ring-plum"
                  >
                    <option value="ACTIVE">● Live (ACTIVE - Valid for Shoppers)</option>
                    <option value="PAUSED">❚❚ Paused (PAUSED - Temporarily Held)</option>
                  </select>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-[#FAF7F5] hover:bg-neutral-200 text-charcoal text-xs font-semibold uppercase tracking-wider rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2 bg-plum hover:bg-plum-hover text-white text-xs font-bold uppercase tracking-wider rounded-lg transition shadow-xs disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
