'use client';

import React, { useState, useEffect } from 'react';
import {
  Gift,
  Sparkles,
  Save,
  RotateCcw,
  Check,
  Loader2,
  Layers,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import {
  CartMilestonesConfig,
  CartMilestoneTier,
  DEFAULT_CART_MILESTONES,
  fetchCartMilestones,
  updateCartMilestonesApi,
} from '@/lib/api';

interface AdminMilestonesEditorProps {
  setToast: (toast: { text: string; type: 'success' | 'error' | 'info' }) => void;
}

export function AdminMilestonesEditor({ setToast }: AdminMilestonesEditorProps) {
  const [config, setConfig] = useState<CartMilestonesConfig>(DEFAULT_CART_MILESTONES);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [simulatedAmount, setSimulatedAmount] = useState<number>(699);

  // Load configuration from API / storage
  useEffect(() => {
    async function loadConfig() {
      try {
        setLoading(true);
        const data = await fetchCartMilestones();
        if (data && Array.isArray(data.tiers) && data.tiers.length > 0) {
          setConfig(data);
        }
      } catch (err) {
        console.error('Failed to load cart milestones config', err);
      } finally {
        setLoading(false);
      }
    }
    loadConfig();
  }, []);

  const tiers: CartMilestoneTier[] =
    config.tiers && config.tiers.length > 0 ? config.tiers : DEFAULT_CART_MILESTONES.tiers;

  const handleTierChange = (index: number, field: keyof CartMilestoneTier, value: any) => {
    setConfig((prev) => {
      const updatedTiers = [...(prev.tiers || DEFAULT_CART_MILESTONES.tiers)];
      if (!updatedTiers[index]) return prev;

      updatedTiers[index] = {
        ...updatedTiers[index],
        [field]: value,
      };

      return {
        ...prev,
        tiers: updatedTiers,
      };
    });
  };

  const handleGlobalChange = (field: keyof CartMilestonesConfig, value: any) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleResetToFactory = () => {
    if (confirm('Revert all 3 milestone cards and gift tiers to factory luxury defaults?')) {
      setConfig(DEFAULT_CART_MILESTONES);
      setToast({
        text: 'Milestones reset to luxury default values. Click "Save & Publish" to commit changes.',
        type: 'info',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const sanitized: CartMilestonesConfig = {
        key: 'cart-milestones',
        title: config.title || DEFAULT_CART_MILESTONES.title,
        isActive: config.isActive !== false,
        tiers: tiers.map((t, idx) => ({
          id: t.id || `tier-${idx + 1}`,
          threshold: Number(t.threshold) || DEFAULT_CART_MILESTONES.tiers[idx]?.threshold || 999,
          itemsRequired: Number(t.itemsRequired) || (idx + 1),
          subtitle: t.subtitle || DEFAULT_CART_MILESTONES.tiers[idx]?.subtitle || `${idx + 1} Products`,
          cardLabel: t.cardLabel || DEFAULT_CART_MILESTONES.tiers[idx]?.cardLabel || 'Gift',
          reward: t.reward || DEFAULT_CART_MILESTONES.tiers[idx]?.reward || '',
          rewardValue: Number(t.rewardValue) || DEFAULT_CART_MILESTONES.tiers[idx]?.rewardValue || 299,
        })),
        updatedAt: new Date().toISOString(),
      };

      const result = await updateCartMilestonesApi(sanitized);
      setConfig(result);
      setToast({
        text: 'Milestone cards published successfully! Cart drawer & checkout updated.',
        type: 'success',
      });
    } catch (err: any) {
      console.error('Failed to save milestones', err);
      setToast({
        text: err.message || 'Failed to publish milestone changes.',
        type: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  // Preview simulations: amount-based unlocking & segmented progress
  const sortedTiers = [...tiers].sort((a, b) => Number(a.threshold) - Number(b.threshold));
  const N = sortedTiers.length;
  let progressPct = 0;
  if (N > 0 && simulatedAmount > 0) {
    const segmentWidth = 100 / N;
    if (simulatedAmount < sortedTiers[0].threshold) {
      const ratio = simulatedAmount / Math.max(1, sortedTiers[0].threshold);
      progressPct = Math.min(Math.round(segmentWidth), Math.max(1, Math.round(ratio * segmentWidth)));
    } else if (simulatedAmount >= sortedTiers[N - 1].threshold) {
      progressPct = 100;
    } else {
      for (let i = 0; i < N - 1; i++) {
        const currentT = sortedTiers[i].threshold;
        const nextT = sortedTiers[i + 1].threshold;
        if (simulatedAmount >= currentT && simulatedAmount < nextT) {
          const segRatio = (simulatedAmount - currentT) / Math.max(1, nextT - currentT);
          const pct = (i + 1) * segmentWidth + segRatio * segmentWidth;
          progressPct = Math.min(100, Math.round(pct));
          break;
        }
      }
    }
  }

  let nextTier: CartMilestoneTier | null = null;
  let amountNeeded = 0;
  for (const t of sortedTiers) {
    if (simulatedAmount < t.threshold) {
      nextTier = t;
      amountNeeded = Math.max(0, t.threshold - simulatedAmount);
      break;
    }
  }

  const unlockedTiers = sortedTiers.filter((t) => simulatedAmount >= t.threshold);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Studio Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-plum/10 rounded-lg text-plum">
              <Gift className="w-5 h-5" />
            </span>
            <h2 className="font-sans text-xl font-bold text-charcoal tracking-wide">
              CART REWARD MILESTONE CARDS
            </h2>
          </div>
          <p className="text-xs text-charcoal-muted mt-1">
            Customize the 3 gamified reward cards and unlocked complimentary gifts shown in the Cart Drawer &amp; Checkout.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetToFactory}
            disabled={saving}
            className="px-3 py-2 bg-white border border-border hover:border-plum text-xs font-semibold text-charcoal rounded-xl transition flex items-center gap-1.5 shadow-2xs hover:bg-[#FAF7F5]"
            title="Revert to factory defaults"
          >
            <RotateCcw className="w-3.5 h-3.5 text-charcoal-muted" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving || loading}
            className="px-4 py-2 bg-plum hover:bg-plum-hover text-white text-xs font-bold uppercase tracking-wider rounded-xl transition flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 text-gold" />
                <span>Save &amp; Publish Cards</span>
              </>
            )}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-charcoal-muted">
          <Loader2 className="w-8 h-8 animate-spin text-plum" />
          <span className="text-xs uppercase tracking-wider">Loading milestone configurations...</span>
        </div>
      ) : (
        <div className="space-y-8">
          {/* ============================================================== */}
          {/* INTERACTIVE WYSIWYG PREVIEW CONTAINER (MATCHES SCREENSHOT)   */}
          {/* ============================================================== */}
          <div className="bg-white border border-border rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-plum" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal">
                  Live Cart Drawer Preview (Interactive)
                </h3>
              </div>

              {/* Simulation buttons */}
              <div className="flex flex-wrap items-center gap-1.5 bg-[#FAF7F5] p-1.5 rounded-xl border border-border">
                <span className="text-[10px] font-bold text-charcoal-muted px-1 uppercase">
                  Simulate Amount:
                </span>
                {[
                  { label: '₹0 (Empty)', val: 0 },
                  { label: '₹699 (Below T1)', val: 699 },
                  { label: '₹999 (Tier 1)', val: 999 },
                  { label: '₹1,399 (Tier 2)', val: 1399 },
                  { label: '₹2,999 (All)', val: 2999 },
                ].map((s) => (
                  <button
                    key={s.val}
                    type="button"
                    onClick={() => setSimulatedAmount(s.val)}
                    className={`px-2 py-1 text-[10px] font-bold rounded-lg transition-all ${
                      simulatedAmount === s.val
                        ? 'bg-plum text-white shadow-2xs'
                        : 'text-charcoal hover:bg-white'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
                <div className="flex items-center gap-1 pl-1">
                  <span className="text-[10px] text-charcoal-muted font-bold">Custom:</span>
                  <input
                    type="number"
                    value={simulatedAmount}
                    onChange={(e) => setSimulatedAmount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-16 px-1.5 py-0.5 text-[10px] bg-white border border-border rounded font-bold text-charcoal focus:outline-none focus:border-plum"
                  />
                </div>
              </div>
            </div>

            {/* Rendered Preview Box */}
            <div className="max-w-md mx-auto bg-[#FAF7F5] rounded-2xl border border-border/80 shadow-md overflow-hidden">
              {/* Header simulation */}
              <div className="px-5 py-3 bg-white border-b border-border flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-bold text-charcoal">
                  <ShoppingBag className="w-4 h-4 text-plum" />
                  <span>YOUR LUXURY BAG (₹{simulatedAmount.toLocaleString('en-IN')})</span>
                </div>
                <span className="text-[10px] text-charcoal-muted">Drawer Preview</span>
              </div>

              {/* Gamified Milestone Progress Bar (The Exact Element From Screenshot) */}
              <div className="bg-[#FAF7F5] px-5 py-4 border-b border-border">
                <div className="flex items-center justify-between text-xs font-medium mb-1.5 gap-2">
                  {nextTier ? (
                    <span className="text-charcoal flex items-center gap-1.5 text-[11px] min-w-0 pr-1 truncate">
                      <Gift className="w-3.5 h-3.5 text-plum flex-shrink-0" />
                      <span className="truncate">
                        Add{' '}
                        <strong className="text-plum font-bold">
                          ₹{amountNeeded.toLocaleString('en-IN')} more
                        </strong>{' '}
                        to unlock{' '}
                        <span className="text-emerald font-semibold">
                          {nextTier.reward.split('(')[0].trim()}
                        </span>
                        !
                      </span>
                    </span>
                  ) : (
                    <span className="text-emerald font-semibold flex items-center gap-1.5 text-[11px]">
                      <Sparkles className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                      All Luxury Gifts Unlocked with Your Order!
                    </span>
                  )}
                  <span className="text-[11px] font-bold text-plum ml-2 flex-shrink-0">{progressPct}%</span>
                </div>

                {/* Progress track */}
                <div className="w-full bg-[#EAE5E0] h-2 rounded-full overflow-hidden relative">
                  <div
                    className="bg-gradient-to-r from-plum to-gold h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>

                {/* THE 3 MILESTONE CARDS (Exact match to uploaded images) */}
                <div className="grid grid-cols-3 gap-2.5 mt-3 pt-1">
                  {tiers.map((m, idx) => {
                    const isUnlocked = simulatedAmount >= m.threshold;
                    return (
                      <div
                        key={m.id || idx}
                        className={`text-center p-2 rounded-xl border transition-all select-none ${
                          isUnlocked
                            ? 'bg-emerald-light/50 border-emerald/50 text-emerald shadow-2xs'
                            : 'bg-white border-border text-charcoal-muted hover:border-plum/30'
                        }`}
                      >
                        <div
                          className={`font-bold text-[11px] ${
                            isUnlocked ? 'text-emerald-accent' : 'text-charcoal'
                          }`}
                        >
                          ₹{m.threshold}
                        </div>
                        <div className="text-[9px] opacity-80 font-semibold leading-tight mt-0.5">
                          {m.subtitle}
                        </div>
                        <div
                          className="truncate text-[9.5px] mt-1 font-medium"
                          title={m.reward}
                        >
                          {isUnlocked ? '✓ ' : ''}
                          {m.cardLabel}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Complimentary Gifts Included Summary Preview */}
              <div className="p-4 bg-white space-y-2">
                {unlockedTiers.length > 0 ? (
                  <div className="bg-emerald-light/30 border border-emerald/20 p-3 rounded-xl text-xs space-y-1.5">
                    <div className="font-semibold text-emerald flex items-center gap-1.5 text-[11px]">
                      <Gift className="w-3.5 h-3.5" /> {config.title || 'Complimentary Gifts Included:'}
                    </div>
                    {unlockedTiers.map((m) => (
                      <div
                        key={m.id || m.threshold}
                        className="flex items-center justify-between text-[11px] text-emerald-accent font-medium"
                      >
                        <span className="truncate pr-2">✨ {m.reward}</span>
                        <span className="line-through text-charcoal-muted text-[10px] flex-shrink-0">
                          ₹{m.rewardValue}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 bg-[#FAF7F5] rounded-xl border border-dashed border-border text-center text-[11px] text-charcoal-muted">
                    Spend ₹{(nextTier ? nextTier.threshold - simulatedAmount : 0).toLocaleString('en-IN')} more to unlock your first luxury gift!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* FORM EDITOR: 3 DEDICATED CARDS FOR TIER 1, TIER 2, TIER 3    */}
          {/* ============================================================== */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tiers.map((tier, idx) => {
                const tierNumber = idx + 1;
                const tierTitle =
                  idx === 0
                    ? 'Card 1 (First Milestone)'
                    : idx === 1
                    ? 'Card 2 (Middle Milestone)'
                    : 'Card 3 (Premium Milestone)';

                return (
                  <div
                    key={tier.id || idx}
                    className="p-5 bg-white border border-border rounded-2xl shadow-xs space-y-4 relative flex flex-col justify-between"
                  >
                    <div>
                      {/* Card Header Badge */}
                      <div className="flex items-center justify-between pb-3 border-b border-border/80 mb-4">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-plum/10 text-plum font-bold text-xs flex items-center justify-center">
                            {tierNumber}
                          </span>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal">
                            {tierTitle}
                          </h4>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-plum bg-plum/5 px-2 py-0.5 rounded border border-plum/10">
                          ₹{tier.threshold}
                        </span>
                      </div>

                      <div className="space-y-3.5">
                        {/* Display Amount & Unlock Threshold */}
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal mb-1">
                            Card Price &amp; Unlock Threshold (₹ Total Amount) *
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 text-xs text-charcoal-muted font-bold">
                              ₹
                            </span>
                            <input
                              type="number"
                              required
                              value={tier.threshold}
                              onChange={(e) =>
                                handleTierChange(idx, 'threshold', parseInt(e.target.value) || 0)
                              }
                              placeholder="e.g. 999"
                              className="w-full pl-7 pr-3 py-2 bg-white border border-border focus:border-plum rounded-lg text-xs font-bold text-charcoal focus:outline-none focus:ring-1 focus:ring-plum"
                            />
                          </div>
                          <span className="text-[10px] text-charcoal-muted mt-0.5 block">
                            Displayed on card &amp; cart total required to unlock gift (e.g. ₹999)
                          </span>
                        </div>

                        {/* Middle Line (Product Requirement Label) */}
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal mb-1">
                            Middle Subtitle (Card Text) *
                          </label>
                          <input
                            type="text"
                            required
                            value={tier.subtitle}
                            onChange={(e) => handleTierChange(idx, 'subtitle', e.target.value)}
                            placeholder="e.g. 1 Product"
                            className="w-full px-3 py-2 bg-white border border-border focus:border-plum rounded-lg text-xs font-medium text-charcoal focus:outline-none focus:ring-1 focus:ring-plum"
                          />
                          <span className="text-[10px] text-charcoal-muted mt-0.5 block">
                            Displayed on middle line (e.g. &ldquo;1 Product&rdquo;, &ldquo;2 Products&rdquo;, &ldquo;3+ Products&rdquo;)
                          </span>
                        </div>

                        {/* Number of Products Required to Unlock */}
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal mb-1">
                            Products In Cart Required *
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            required
                            value={tier.itemsRequired}
                            onChange={(e) =>
                              handleTierChange(idx, 'itemsRequired', parseInt(e.target.value) || 1)
                            }
                            className="w-full px-3 py-2 bg-white border border-border focus:border-plum rounded-lg text-xs font-semibold text-charcoal focus:outline-none focus:ring-1 focus:ring-plum"
                          />
                          <span className="text-[10px] text-charcoal-muted mt-0.5 block">
                            Cart product quantity threshold to trigger unlock (e.g. {tierNumber})
                          </span>
                        </div>

                        {/* Bottom Line (Short Card Label) */}
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal mb-1">
                            Bottom Card Gift Label *
                          </label>
                          <input
                            type="text"
                            required
                            value={tier.cardLabel}
                            onChange={(e) => handleTierChange(idx, 'cardLabel', e.target.value)}
                            placeholder="e.g. Sample Vial"
                            className="w-full px-3 py-2 bg-white border border-border focus:border-plum rounded-lg text-xs font-bold text-charcoal focus:outline-none focus:ring-1 focus:ring-plum"
                          />
                          <span className="text-[10px] text-charcoal-muted mt-0.5 block">
                            Short title on bottom of card (e.g. &ldquo;Sample Vial&rdquo;, &ldquo;Travel Kit&rdquo;, &ldquo;Luxury Elixir&rdquo;)
                          </span>
                        </div>

                        {/* Full Reward Name */}
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal mb-1">
                            Full Complimentary Gift Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={tier.reward}
                            onChange={(e) => handleTierChange(idx, 'reward', e.target.value)}
                            placeholder="e.g. Complimentary Botanical Sample Vial (15ml)"
                            className="w-full px-3 py-2 bg-white border border-border focus:border-plum rounded-lg text-xs text-charcoal focus:outline-none focus:ring-1 focus:ring-plum"
                          />
                          <span className="text-[10px] text-charcoal-muted mt-0.5 block">
                            Shown in the progress prompt &amp; &ldquo;Complimentary Gifts Included&rdquo; breakdown
                          </span>
                        </div>

                        {/* Gift Value (Strikethrough MRP) */}
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal mb-1">
                            Complimentary Value (₹ MRP Strikethrough) *
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 text-xs text-charcoal-muted font-bold">
                              ₹
                            </span>
                            <input
                              type="number"
                              required
                              value={tier.rewardValue}
                              onChange={(e) =>
                                handleTierChange(idx, 'rewardValue', parseInt(e.target.value) || 0)
                              }
                              placeholder="e.g. 299"
                              className="w-full pl-7 pr-3 py-2 bg-white border border-border focus:border-plum rounded-lg text-xs font-mono text-charcoal focus:outline-none focus:ring-1 focus:ring-plum"
                            />
                          </div>
                          <span className="text-[10px] text-charcoal-muted mt-0.5 block">
                            Appears as strikethrough value (e.g. <span className="line-through">₹{tier.rewardValue}</span>)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Miniature live preview node of this specific card */}
                    <div className="pt-3 border-t border-border mt-3">
                      <div className="text-[10px] font-bold text-charcoal-muted mb-1 uppercase tracking-wider">
                        Card Preview:
                      </div>
                      <div className="p-2 rounded-lg border border-border bg-[#FAF7F5] text-center">
                        <div className="font-bold text-xs text-charcoal">₹{tier.threshold}</div>
                        <div className="text-[9px] text-charcoal-muted font-semibold">{tier.subtitle}</div>
                        <div className="text-[10px] text-charcoal font-medium mt-0.5">
                          ✓ {tier.cardLabel}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Global Settings & Save Action */}
            <div className="p-6 bg-white border border-border rounded-2xl shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-border/80 pb-3">
                <SlidersHorizontal className="w-4 h-4 text-plum" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal">
                  Section Header &amp; Storefront Toggle
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                    Gifts Section Header Title
                  </label>
                  <input
                    type="text"
                    value={config.title || 'Complimentary Gifts Included:'}
                    onChange={(e) => handleGlobalChange('title', e.target.value)}
                    placeholder="e.g. Complimentary Gifts Included:"
                    className="w-full px-3.5 py-2.5 bg-white border border-border focus:border-plum rounded-lg text-xs text-charcoal focus:outline-none focus:ring-1 focus:ring-plum"
                  />
                </div>

                <div className="flex items-center">
                  <label className="flex items-center justify-between cursor-pointer p-3 bg-[#FAF7F5] rounded-xl border border-border hover:border-plum/30 transition-all select-none w-full">
                    <div>
                      <span className="text-xs font-bold text-charcoal block">
                        Enable Cart Milestones
                      </span>
                      <span className="text-[10px] text-charcoal-muted">
                        Display progress bar and tier cards in cart
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.isActive !== false}
                      onChange={(e) => handleGlobalChange('isActive', e.target.checked)}
                      className="w-4 h-4 accent-plum cursor-pointer rounded"
                    />
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-plum hover:bg-plum-hover transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Publishing Milestone Cards...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 text-gold" />
                      <span>Save &amp; Publish Milestone Tiers</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
