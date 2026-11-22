'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sparkles,
  Save,
  RotateCcw,
  ExternalLink,
  Trash2,
  UploadCloud,
  Loader2,
  MoveUp,
  MoveDown,
  Eye,
  Sliders,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Plus,
} from 'lucide-react';
import {
  BeforeAfterConfig,
  BeforeAfterItem,
  DEFAULT_BEFORE_AFTER_CONFIG,
  fetchBeforeAfterConfig,
  updateBeforeAfterConfigApi,
  uploadShowcaseMediaToCloudinary,
} from '@/lib/api';

interface AdminBeforeAfterEditorProps {
  setToast: (toast: { text: string; type: 'success' | 'error' | 'info' }) => void;
}

// Interactive Live Card Preview Component
function PreviewComparisonCard({
  item,
  index,
  total,
}: {
  item: BeforeAfterItem;
  index: number;
  total: number;
}) {
  const [sliderPos, setSliderPos] = useState(item.initialPos || 50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (item.initialPos !== undefined) {
      setSliderPos(item.initialPos);
    }
  }, [item.initialPos]);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(percentage);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updatePosition(e.clientX);
  };

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: PointerEvent) => updatePosition(e.clientX);
    const onUp = () => setIsDragging(false);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [isDragging, updatePosition]);

  return (
    <div className="bg-white rounded-2xl border border-border/80 overflow-hidden shadow-sm flex flex-col">
      <div className="flex items-center justify-between px-3.5 py-2 text-[10px] font-bold tracking-widest text-charcoal/70 uppercase select-none bg-stone-50/70 border-b border-border/50">
        <span>BEFORE</span>
        <span className="text-[9px] text-charcoal-muted lowercase tracking-normal font-medium">
          card #{index + 1} of {total}
        </span>
        <span>AFTER</span>
      </div>

      <div
        ref={containerRef}
        className="relative aspect-[4/4.5] w-full overflow-hidden select-none touch-pan-y cursor-ew-resize bg-stone-100"
      >
        {/* After Image */}
        {item.afterImage ? (
          <img
            src={item.afterImage}
            alt="After"
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-charcoal-muted text-xs p-4 text-center">
            <span className="font-semibold text-charcoal mb-1">AFTER PHOTO MISSING</span>
            <span>Upload an after photo below</span>
          </div>
        )}

        {/* Before Image */}
        {item.beforeImage && (
          <div
            className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
            style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
          >
            <img
              src={item.beforeImage}
              alt="Before"
              className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
            />
          </div>
        )}

        {/* Interactive Handle */}
        <div
          onPointerDown={handlePointerDown}
          className="absolute top-0 bottom-0 w-8 -ml-4 z-20 flex items-center justify-center cursor-ew-resize"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="w-[2px] h-full bg-white shadow-[0_0_6px_rgba(0,0,0,0.6)] pointer-events-none" />
          <div
            className={`absolute top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white shadow-lg border border-border/80 flex items-center justify-center text-charcoal pointer-events-none transition-transform duration-150 ${
              isDragging ? 'scale-115 ring-2 ring-plum/20' : 'scale-100'
            }`}
          >
            <svg
              className="w-3 h-3 text-charcoal"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="8 17 3 12 8 7" />
              <polyline points="16 7 21 12 16 17" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminBeforeAfterEditor({ setToast }: AdminBeforeAfterEditorProps) {
  const [config, setConfig] = useState<BeforeAfterConfig>(DEFAULT_BEFORE_AFTER_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  // Load existing config on mount
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await fetchBeforeAfterConfig();
        if (data && Array.isArray(data.items) && data.items.length > 0) {
          setConfig(data);
        }
      } catch (err) {
        console.error('Failed to load Before & After config:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Upload handler for single photo slot
  const handleUploadPhoto = async (
    index: number,
    type: 'before' | 'after',
    file: File
  ) => {
    const slotKey = `${index}-${type}`;
    setUploadingSlot(slotKey);
    try {
      const res = await uploadShowcaseMediaToCloudinary(file, ['before-after', type]);
      if (res.success && res.url) {
        const finalUrl = res.url;
        setConfig((prev) => {
          const updated = [...prev.items];
          const current = updated[index] || {
            id: `card-${Date.now()}`,
            beforeImage: '',
            afterImage: '',
            initialPos: 50,
          };
          updated[index] = {
            ...current,
            [type === 'before' ? 'beforeImage' : 'afterImage']: finalUrl,
          };
          return { ...prev, items: updated };
        });
        setToast({
          text: `📸 ${type === 'before' ? 'Before' : 'After'} photo uploaded successfully!`,
          type: 'success',
        });
      } else {
        setToast({ text: res.error || 'Failed to upload photo.', type: 'error' });
      }
    } catch (e: any) {
      setToast({ text: e.message || 'Upload error', type: 'error' });
    } finally {
      setUploadingSlot(null);
    }
  };

  const handleUpdateItemField = (
    index: number,
    field: 'beforeImage' | 'afterImage' | 'initialPos',
    value: any
  ) => {
    setConfig((prev) => {
      const updated = [...prev.items];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return { ...prev, items: updated };
    });
  };

  const handleAddNewCard = () => {
    const newCard: BeforeAfterItem = {
      id: `transformation-${Date.now().toString().slice(-5)}`,
      beforeImage:
        'https://res.cloudinary.com/dqddawu42/image/upload/v1789820363/sensein/transformations/frizz-before.jpg',
      afterImage:
        'https://res.cloudinary.com/dqddawu42/image/upload/v1789820361/sensein/transformations/frizz-after.jpg',
      initialPos: 50,
    };
    setConfig((prev) => ({
      ...prev,
      items: [...prev.items, newCard],
    }));
    setToast({ text: 'Added new comparison card slot.', type: 'info' });
  };

  const handleRemoveCard = (index: number) => {
    if (config.items.length <= 1) {
      alert('You must have at least 1 Before & After transformation card.');
      return;
    }
    setConfig((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
    setToast({ text: 'Removed transformation card.', type: 'info' });
  };

  const handleMoveCard = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= config.items.length) return;

    setConfig((prev) => {
      const updated = [...prev.items];
      const temp = updated[index];
      updated[index] = updated[targetIdx];
      updated[targetIdx] = temp;
      return { ...prev, items: updated };
    });
  };

  const handleResetToDefault = () => {
    if (
      window.confirm(
        'Reset Before & After comparisons to factory default photography?'
      )
    ) {
      setConfig(DEFAULT_BEFORE_AFTER_CONFIG);
      setToast({ text: 'Reset to default photos.', type: 'info' });
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!config.items || config.items.length === 0) {
      alert('Please keep at least one Before & After comparison card.');
      return;
    }

    setSaving(true);
    try {
      await updateBeforeAfterConfigApi(config);
      setToast({
        text: '✨ Before & After transformations saved & published to storefront!',
        type: 'success',
      });
    } catch (err: any) {
      setToast({
        text: err.message || 'Failed to save transformations.',
        type: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-charcoal">
        <Loader2 className="w-8 h-8 animate-spin text-plum mb-3" />
        <p className="text-xs uppercase tracking-widest text-charcoal-muted">
          Loading Before &amp; After Studio...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto pb-16">
      {/* Studio Header Bar */}
      <div className="bg-white rounded-xl border border-border p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-charcoal tracking-tight">
              Before &amp; After Transformations Studio
            </h2>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-200">
              STOREFRONT SYNC
            </span>
          </div>
          <p className="text-xs text-charcoal-muted mt-1 max-w-2xl leading-relaxed">
            Upload clinical Before and After photos for the split-screen comparison cards.
            Visitors interactively drag the split line to inspect hair transformations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="px-3.5 py-2 border border-border rounded-lg text-xs font-semibold text-charcoal-muted hover:text-charcoal hover:bg-stone-50 transition-colors flex items-center gap-1.5"
            title="Reset to default photoshoot comparisons"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 border border-border rounded-lg text-xs font-semibold text-charcoal-muted hover:text-charcoal hover:bg-stone-50 transition-colors flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live</span>
          </a>

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving}
            className="px-5 py-2 bg-plum hover:bg-plum-hover text-white rounded-lg text-xs font-semibold transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Save className="w-4 h-4 text-gold" />
            )}
            <span>{saving ? 'Publishing...' : 'Save & Publish'}</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: LIVE INTERACTIVE PREVIEW */}
      <div className="bg-[#FAF7F5] rounded-2xl border border-border/80 p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-plum" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal">
              Live Interactive Preview ({config.items.length} Cards)
            </h3>
          </div>
          <span className="text-[11px] text-charcoal-muted">
            Drag the center line on any card below to test split slider
          </span>
        </div>

        {/* Live Preview Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {config.items.map((item, idx) => (
            <PreviewComparisonCard
              key={item.id || idx}
              item={item}
              index={idx}
              total={config.items.length}
            />
          ))}
        </div>
      </div>

      {/* SECTION 2: PHOTO UPLOAD & CARD MANAGEMENT */}
      <div className="bg-white rounded-xl border border-border p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider flex items-center gap-2">
              <span>Transformation Comparison Cards</span>
              <span className="px-2 py-0.5 bg-stone-100 text-charcoal text-[11px] font-mono rounded">
                {config.items.length} Total
              </span>
            </h3>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Upload Before and After photos directly for each card. Direct Cloudinary CDN optimized.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddNewCard}
            className="px-4 py-2 bg-stone-900 hover:bg-black text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-2xs"
          >
            <Plus className="w-4 h-4 text-gold" />
            <span>+ Add Transformation Card</span>
          </button>
        </div>

        {/* Cards List */}
        <div className="divide-y divide-border mt-4">
          {config.items.map((item, index) => {
            const beforeUploading = uploadingSlot === `${index}-before`;
            const afterUploading = uploadingSlot === `${index}-after`;

            return (
              <div key={item.id || index} className="py-6 first:pt-2 last:pb-2">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-plum/10 text-plum font-bold text-xs flex items-center justify-center">
                      {index + 1}
                    </span>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal">
                      Card #{index + 1} Comparison Pair
                    </h4>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Reorder Buttons */}
                    <button
                      type="button"
                      onClick={() => handleMoveCard(index, 'up')}
                      disabled={index === 0}
                      title="Move card left / up"
                      className="p-1.5 text-charcoal-muted hover:text-charcoal hover:bg-stone-100 rounded disabled:opacity-25"
                    >
                      <MoveUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveCard(index, 'down')}
                      disabled={index === config.items.length - 1}
                      title="Move card right / down"
                      className="p-1.5 text-charcoal-muted hover:text-charcoal hover:bg-stone-100 rounded disabled:opacity-25"
                    >
                      <MoveDown className="w-3.5 h-3.5" />
                    </button>
                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveCard(index)}
                      title="Remove card"
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded ml-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Dual Upload Columns: Before Photo & After Photo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* BEFORE PHOTO COLUMN */}
                  <div className="bg-[#FAF7F5] rounded-xl border border-border/80 p-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-bold tracking-widest text-charcoal uppercase">
                        BEFORE PHOTO
                      </span>
                      <span className="text-[10px] text-charcoal-muted">Left Side</span>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Image Thumbnail */}
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-border bg-white shrink-0 shadow-2xs">
                        {item.beforeImage ? (
                          <img
                            src={item.beforeImage}
                            alt="Before thumbnail"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-charcoal-muted bg-stone-100">
                            No image
                          </div>
                        )}
                        {beforeUploading && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
                            <Loader2 className="w-5 h-5 animate-spin text-white" />
                          </div>
                        )}
                      </div>

                      {/* Upload Button */}
                      <div className="flex-1 min-w-0 flex flex-col justify-center gap-2">
                        <label className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 bg-white hover:bg-stone-50 border border-border rounded-lg text-xs font-semibold text-charcoal cursor-pointer shadow-2xs transition-colors w-full">
                          <UploadCloud className="w-4 h-4 text-plum" />
                          <span>
                            {beforeUploading
                              ? 'Uploading to Cloudinary...'
                              : item.beforeImage
                              ? 'Change Before Photo'
                              : 'Upload Before Photo'}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={beforeUploading}
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleUploadPhoto(index, 'before', file);
                              e.target.value = '';
                            }}
                          />
                        </label>
                        {item.beforeImage && (
                          <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-medium">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Photo uploaded &amp; ready</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* AFTER PHOTO COLUMN */}
                  <div className="bg-[#FAF7F5] rounded-xl border border-border/80 p-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-bold tracking-widest text-charcoal uppercase">
                        AFTER PHOTO
                      </span>
                      <span className="text-[10px] text-charcoal-muted">Right Side</span>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Image Thumbnail */}
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-border bg-white shrink-0 shadow-2xs">
                        {item.afterImage ? (
                          <img
                            src={item.afterImage}
                            alt="After thumbnail"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-charcoal-muted bg-stone-100">
                            No image
                          </div>
                        )}
                        {afterUploading && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
                            <Loader2 className="w-5 h-5 animate-spin text-white" />
                          </div>
                        )}
                      </div>

                      {/* Upload Button */}
                      <div className="flex-1 min-w-0 flex flex-col justify-center gap-2">
                        <label className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 bg-white hover:bg-stone-50 border border-border rounded-lg text-xs font-semibold text-charcoal cursor-pointer shadow-2xs transition-colors w-full">
                          <UploadCloud className="w-4 h-4 text-plum" />
                          <span>
                            {afterUploading
                              ? 'Uploading to Cloudinary...'
                              : item.afterImage
                              ? 'Change After Photo'
                              : 'Upload After Photo'}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={afterUploading}
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleUploadPhoto(index, 'after', file);
                              e.target.value = '';
                            }}
                          />
                        </label>
                        {item.afterImage && (
                          <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-medium">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Photo uploaded &amp; ready</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Slider Default Center Position */}
                <div className="mt-3 flex items-center justify-between text-[11px] text-charcoal-muted bg-stone-50 px-3.5 py-2 rounded-lg border border-border/50">
                  <span className="flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-plum" />
                    <span>Default Slider Divider Position:</span>
                    <strong className="text-charcoal font-mono">
                      {item.initialPos || 50}%
                    </strong>
                  </span>
                  <div className="flex items-center gap-2 w-48">
                    <input
                      type="range"
                      min={10}
                      max={90}
                      value={item.initialPos || 50}
                      onChange={(e) =>
                        handleUpdateItemField(
                          index,
                          'initialPos',
                          parseInt(e.target.value, 10)
                        )
                      }
                      className="w-full accent-plum cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: EDIT CLINICAL STATS & HEADLINE ACCORDION */}
      <div className="bg-white rounded-xl border border-border shadow-xs overflow-hidden">
        <button
          type="button"
          onClick={() => setShowSettings(!showSettings)}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-stone-50 transition-colors"
        >
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal flex items-center gap-2">
              <span>Section Title &amp; Clinical Proof Statistics</span>
              <span className="text-[10px] text-charcoal-muted lowercase font-normal">
                (optional stats bar)
              </span>
            </h3>
            <p className="text-[11px] text-charcoal-muted mt-0.5">
              Customize the "DIGITS DON'T LIE" section headline and the 3 clinical stats below it.
            </p>
          </div>
          {showSettings ? (
            <ChevronUp className="w-4 h-4 text-charcoal-muted" />
          ) : (
            <ChevronDown className="w-4 h-4 text-charcoal-muted" />
          )}
        </button>

        {showSettings && (
          <div className="p-6 border-t border-border bg-[#FAF7F5] space-y-5 animate-fadeIn">
            {/* Section Active Toggle & Headline */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[11px] font-bold text-charcoal uppercase tracking-wider">
                  Section Headline
                </label>
                <input
                  type="text"
                  value={config.title || "DIGITS DON'T LIE"}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="DIGITS DON'T LIE"
                  className="w-full px-3 py-2 text-xs bg-white border border-border rounded-lg text-charcoal focus:outline-none focus:ring-1 focus:ring-plum"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-charcoal uppercase tracking-wider">
                  Section Visibility
                </label>
                <select
                  value={config.isActive !== false ? 'active' : 'hidden'}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      isActive: e.target.value === 'active',
                    }))
                  }
                  className="w-full px-3 py-2 text-xs bg-white border border-border rounded-lg text-charcoal focus:outline-none focus:ring-1 focus:ring-plum"
                >
                  <option value="active">Active (Visible on Storefront)</option>
                  <option value="hidden">Hidden (Temporarily Hide)</option>
                </select>
              </div>
            </div>

            {/* 3 Clinical Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {/* Stat 1 */}
              <div className="bg-white p-3.5 rounded-lg border border-border space-y-2">
                <span className="text-[10px] font-bold text-charcoal uppercase">
                  Statistic 1
                </span>
                <input
                  type="text"
                  value={config.stat1Value || ''}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, stat1Value: e.target.value }))
                  }
                  placeholder="98%"
                  className="w-full px-2.5 py-1.5 text-xs font-mono font-bold bg-stone-50 border border-border rounded text-charcoal focus:outline-none focus:ring-1 focus:ring-plum"
                />
                <input
                  type="text"
                  value={config.stat1Label || ''}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, stat1Label: e.target.value }))
                  }
                  placeholder="Frizz Control Index"
                  className="w-full px-2.5 py-1.5 text-[11px] bg-stone-50 border border-border rounded text-charcoal focus:outline-none focus:ring-1 focus:ring-plum"
                />
              </div>

              {/* Stat 2 */}
              <div className="bg-white p-3.5 rounded-lg border border-border space-y-2">
                <span className="text-[10px] font-bold text-charcoal uppercase">
                  Statistic 2
                </span>
                <input
                  type="text"
                  value={config.stat2Value || ''}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, stat2Value: e.target.value }))
                  }
                  placeholder="+140%"
                  className="w-full px-2.5 py-1.5 text-xs font-mono font-bold bg-stone-50 border border-border rounded text-charcoal focus:outline-none focus:ring-1 focus:ring-plum"
                />
                <input
                  type="text"
                  value={config.stat2Label || ''}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, stat2Label: e.target.value }))
                  }
                  placeholder="Mirror Gloss Radiance"
                  className="w-full px-2.5 py-1.5 text-[11px] bg-stone-50 border border-border rounded text-charcoal focus:outline-none focus:ring-1 focus:ring-plum"
                />
              </div>

              {/* Stat 3 */}
              <div className="bg-white p-3.5 rounded-lg border border-border space-y-2">
                <span className="text-[10px] font-bold text-charcoal uppercase">
                  Statistic 3
                </span>
                <input
                  type="text"
                  value={config.stat3Value || ''}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, stat3Value: e.target.value }))
                  }
                  placeholder="24h"
                  className="w-full px-2.5 py-1.5 text-xs font-mono font-bold bg-stone-50 border border-border rounded text-charcoal focus:outline-none focus:ring-1 focus:ring-plum"
                />
                <input
                  type="text"
                  value={config.stat3Label || ''}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, stat3Label: e.target.value }))
                  }
                  placeholder="Humidity Shield Hold"
                  className="w-full px-2.5 py-1.5 text-[11px] bg-stone-50 border border-border rounded text-charcoal focus:outline-none focus:ring-1 focus:ring-plum"
                />
              </div>
            </div>

            {/* Disclaimer */}
            <div className="pt-2">
              <label className="text-[11px] font-bold text-charcoal uppercase tracking-wider block mb-1">
                Clinical Study Disclaimer / Footnote
              </label>
              <input
                type="text"
                value={config.disclaimer || ''}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, disclaimer: e.target.value }))
                }
                placeholder="*based on Independent Clinical Studies, 2026"
                className="w-full px-3 py-2 text-xs bg-white border border-border rounded-lg text-charcoal focus:outline-none focus:ring-1 focus:ring-plum"
              />
            </div>
          </div>
        )}
      </div>

      {/* Floating Bottom Action Bar */}
      <div className="sticky bottom-6 z-30 bg-white/95 backdrop-blur-md rounded-xl border border-border p-4 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-charcoal">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>
            Changes sync instantly to the storefront &amp; persist in MongoDB Atlas.
          </span>
        </div>

        <button
          type="button"
          onClick={() => handleSave()}
          disabled={saving}
          className="px-6 py-2.5 bg-plum hover:bg-plum-hover text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin text-white" />
          ) : (
            <Save className="w-4 h-4 text-gold" />
          )}
          <span>{saving ? 'Publishing Changes...' : 'Save & Publish Transformations'}</span>
        </button>
      </div>
    </div>
  );
}
