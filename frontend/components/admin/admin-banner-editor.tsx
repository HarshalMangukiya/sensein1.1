'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Image as ImageIcon,
  Sparkles,
  UploadCloud,
  Check,
  RotateCcw,
  Eye,
  Link2,
  Type,
  Sliders,
  Loader2,
  ExternalLink,
  Layers,
  Save,
} from 'lucide-react';
import {
  HeroBannerConfig,
  DEFAULT_HERO_BANNER,
  fetchHeroBanner,
  updateHeroBannerApi,
  uploadProductImageToCloudinary,
} from '@/lib/api';

interface AdminBannerEditorProps {
  setToast: (toast: { text: string; type: 'success' | 'error' | 'info' }) => void;
}

export function AdminBannerEditor({ setToast }: AdminBannerEditorProps) {
  const [banner, setBanner] = useState<HeroBannerConfig>(DEFAULT_HERO_BANNER);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [activePreviewMode, setActivePreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    async function loadBanner() {
      try {
        setLoading(true);
        const data = await fetchHeroBanner();
        if (data) {
          if (
            (data.imageUrl && data.imageUrl.includes('sensein-hair-wax-1.jpg')) ||
            (data.title && data.title.includes('HAUTE SALON')) ||
            (data.ctaText && data.ctaText.includes('STYLING WAX'))
          ) {
            setBanner(DEFAULT_HERO_BANNER);
          } else {
            setBanner(data);
          }
        }
      } catch (err) {
        console.error('Failed to load banner configuration', err);
      } finally {
        setLoading(false);
      }
    }
    loadBanner();
  }, []);

  const handleChange = (field: keyof HeroBannerConfig, value: any) => {
    setBanner((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        const res = await uploadProductImageToCloudinary(base64, 'hero-banner');
        if (res.success && res.url) {
          setBanner((prev) => ({ ...prev, imageUrl: res.url }));
          setToast({
            text: 'Banner image uploaded to Cloudinary successfully!',
            type: 'success',
          });
        } else {
          setToast({
            text: res.error || 'Failed to upload image to Cloudinary',
            type: 'error',
          });
        }
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setUploadingImage(false);
      setToast({
        text: err.message || 'Error processing image file',
        type: 'error',
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!banner.title.trim()) {
      alert('Please enter a banner title');
      return;
    }

    setSaving(true);
    try {
      const updated = await updateHeroBannerApi(banner);
      setBanner(updated);
      setToast({
        text: 'Storefront hero banner updated and live on home page!',
        type: 'success',
      });
    } catch (err: any) {
      console.error('Error saving hero banner:', err);
      setToast({
        text: err.message || 'Failed to save banner',
        type: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefault = async () => {
    if (confirm('Reset storefront banner to the official brand perfume bottle image?')) {
      setBanner(DEFAULT_HERO_BANNER);
      try {
        await updateHeroBannerApi(DEFAULT_HERO_BANNER);
        setToast({
          text: 'Banner reset to default brand perfume bottle photography!',
          type: 'success',
        });
      } catch (err: any) {
        setToast({
          text: 'Banner reset to default specifications.',
          type: 'info',
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-charcoal-muted">
        <Loader2 className="w-6 h-6 animate-spin text-plum mb-3" />
        <p className="text-xs font-semibold">Loading Hero Banner Studio...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-serif font-bold text-charcoal tracking-tight">
              Storefront Hero Banner Studio
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-plum/10 text-plum border border-plum/20">
              Live Home Banner
            </span>
          </div>
          <p className="text-xs text-charcoal-muted mt-1">
            Customize the primary luxury banner, photography, headline, and call-to-action displayed at the top of the storefront.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetDefault}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold text-charcoal-muted hover:text-charcoal bg-white border border-border hover:bg-[#FAF7F5] transition-all flex items-center gap-1.5 shadow-2xs"
            title="Reset banner to default brand formulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-lg text-xs font-semibold text-charcoal hover:text-plum bg-white border border-border hover:border-plum/30 transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <ExternalLink className="w-3.5 h-3.5 text-plum" />
            <span>View Live Home</span>
          </a>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-white bg-plum hover:bg-plum-hover transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-gold" />
                <span>Save & Publish</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 1. REAL-TIME INTERACTIVE WYSIWYG PREVIEW CARD */}
      <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 py-3.5 bg-[#F8F5F2] border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-plum" />
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal">
              Live WYSIWYG Storefront Preview
            </span>
            <span className="text-[10px] text-charcoal-muted hidden sm:inline">
              (Updates instantly as you modify settings below)
            </span>
          </div>

          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-border">
            <button
              type="button"
              onClick={() => setActivePreviewMode('desktop')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded ${
                activePreviewMode === 'desktop'
                  ? 'bg-plum text-white shadow-2xs'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              Desktop
            </button>
            <button
              type="button"
              onClick={() => setActivePreviewMode('mobile')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded ${
                activePreviewMode === 'mobile'
                  ? 'bg-plum text-white shadow-2xs'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              Mobile View
            </button>
          </div>
        </div>

        {/* Live Banner Render Frame */}
        <div className="p-4 sm:p-6 bg-[#211B21]/5 flex justify-center">
          <div
            className={`w-full transition-all duration-300 rounded-xl overflow-hidden shadow-2xl relative bg-[#150A14] ${
              activePreviewMode === 'mobile' ? 'max-w-md' : 'max-w-full'
            }`}
          >
            <div className="relative w-full min-h-[380px] sm:min-h-[440px] flex items-center justify-center overflow-hidden">
              {/* Background Photography */}
              <div className="absolute inset-0 z-0">
                <img
                  src={banner.imageUrl || DEFAULT_HERO_BANNER.imageUrl}
                  alt={banner.title}
                  className="w-full h-full object-cover object-center filter brightness-[0.85] contrast-[1.08] transition-all duration-300"
                />
                {/* Dynamic Overlay Darkness */}
                <div
                  className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-300"
                  style={{ opacity: (banner.overlayDarkness ?? 40) / 100 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#150A14] via-transparent to-black/50 pointer-events-none" />
              </div>

              {/* Banner Content */}
              <div
                className={`relative z-10 w-full max-w-3xl mx-auto px-6 py-12 flex flex-col ${
                  banner.textAlign === 'left'
                    ? 'items-start text-left'
                    : banner.textAlign === 'right'
                    ? 'items-end text-right'
                    : 'items-center text-center'
                }`}
              >
                {banner.badge && (
                  <span className="inline-block text-[9px] sm:text-[10px] uppercase tracking-[0.25em] font-bold text-gold/90 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-gold/30 mb-3 drop-shadow-md">
                    {banner.badge}
                  </span>
                )}

                <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.14] text-white uppercase drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
                  {banner.title || 'SALON LUXURY RE-ENGINEERED'}
                </h1>

                <p className="mt-3 text-xs sm:text-sm text-white/90 font-light max-w-lg leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                  {banner.subtitle ||
                    'High-performance botanical formulas crafted with clean ingredients for Indian hair textures.'}
                </p>

                <div className="mt-6">
                  <span className="inline-flex items-center justify-center px-6 py-2.5 sm:px-8 sm:py-3 bg-[#5A3859] hover:bg-[#6D436C] text-white text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] rounded-sm transition-all duration-300 shadow-2xl">
                    {banner.ctaText || 'EXPLORE COLLECTION'}
                  </span>
                </div>
              </div>

              {/* Bottom Curved Arc Divider */}
              {banner.showArc !== false && (
                <div className="absolute -bottom-[1px] left-0 right-0 w-full overflow-hidden leading-none z-20 pointer-events-none">
                  <svg
                    viewBox="0 0 1440 60"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-4 sm:h-7 block"
                    preserveAspectRatio="none"
                  >
                    <path d="M0,0 Q720,55 1440,0 L1440,60 L0,60 Z" fill="#FAF7F5" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* BANNER CUSTOMIZATION FORM */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Copy & Messaging (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section: Typography & Text Content */}
          <div className="p-6 bg-white border border-border rounded-2xl space-y-5 shadow-xs">
            <div className="flex items-center gap-2 border-b border-border/80 pb-3">
              <Type className="w-4 h-4 text-plum" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal">
                Headline & Messaging Architecture
              </h3>
            </div>

            <div className="space-y-4">
              {/* Badge / Tagline */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                  Top Badge / Eyebrow Tagline
                </label>
                <input
                  type="text"
                  value={banner.badge || ''}
                  onChange={(e) => handleChange('badge', e.target.value)}
                  placeholder="e.g. OFFICIAL SENSEIN® PARIS or NEW RELEASE"
                  className="w-full px-3.5 py-2.5 bg-white border border-border focus:border-plum rounded-lg text-xs text-charcoal placeholder-charcoal-subtle focus:outline-none focus:ring-1 focus:ring-plum"
                />
                <span className="text-[10px] text-charcoal-muted mt-1 block">
                  Appears as an elegant golden pill above the main headline. Leave blank to hide.
                </span>
              </div>

              {/* Main Headline */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                  Main Headline / Title *
                </label>
                <input
                  type="text"
                  required
                  value={banner.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="e.g. SALON LUXURY RE-ENGINEERED"
                  className="w-full px-3.5 py-2.5 bg-white border border-border focus:border-plum rounded-lg text-xs font-semibold text-charcoal placeholder-charcoal-subtle focus:outline-none focus:ring-1 focus:ring-plum"
                />
              </div>

              {/* Subheading / Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                  Subheading / Formulation Philosophy *
                </label>
                <textarea
                  rows={3}
                  required
                  value={banner.subtitle}
                  onChange={(e) => handleChange('subtitle', e.target.value)}
                  placeholder="e.g. High-performance botanical formulas crafted with clean ingredients for Indian hair textures."
                  className="w-full px-3.5 py-2.5 bg-white border border-border focus:border-plum rounded-lg text-xs text-charcoal placeholder-charcoal-subtle focus:outline-none focus:ring-1 focus:ring-plum leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Section: Call-To-Action (CTA) Settings */}
          <div className="p-6 bg-white border border-border rounded-2xl space-y-5 shadow-xs">
            <div className="flex items-center gap-2 border-b border-border/80 pb-3">
              <Link2 className="w-4 h-4 text-plum" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal">
                Call-To-Action (CTA) Button Configuration
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                  Button Label *
                </label>
                <input
                  type="text"
                  required
                  value={banner.ctaText}
                  onChange={(e) => handleChange('ctaText', e.target.value)}
                  placeholder="e.g. EXPLORE COLLECTION"
                  className="w-full px-3.5 py-2.5 bg-white border border-border focus:border-plum rounded-lg text-xs font-semibold text-charcoal placeholder-charcoal-subtle focus:outline-none focus:ring-1 focus:ring-plum"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                  Destination URL / Route *
                </label>
                <input
                  type="text"
                  required
                  value={banner.ctaLink}
                  onChange={(e) => handleChange('ctaLink', e.target.value)}
                  placeholder="e.g. /shop or /shop?category=Combos"
                  className="w-full px-3.5 py-2.5 bg-white border border-border focus:border-plum rounded-lg text-xs font-mono text-charcoal placeholder-charcoal-subtle focus:outline-none focus:ring-1 focus:ring-plum"
                />
              </div>
            </div>

            {/* Quick Link Targets */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted block mb-1.5">
                Quick Destination Presets:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'All Formulations (/shop)', link: '/shop' },
                  { label: 'Combo & Value Packs', link: '/shop?category=Combos' },
                  { label: 'Bestsellers Featured', link: '/shop?collection=Bestsellers' },
                  { label: 'Hair Wax Collection', link: '/shop?category=Hair+Styling+Wax' },
                  { label: 'Shampoos', link: '/shop?category=Shampoo' },
                ].map((preset, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleChange('ctaLink', preset.link)}
                    className={`px-2.5 py-1 text-[11px] rounded border transition-colors ${
                      banner.ctaLink === preset.link
                        ? 'bg-plum text-white border-plum'
                        : 'bg-[#FAF7F5] text-charcoal hover:border-plum/40 border-border'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Media & Layout Settings (1 col) */}
        <div className="space-y-6">
          {/* Section: Background Photography & Cloudinary */}
          <div className="p-6 bg-white border border-border rounded-2xl space-y-5 shadow-xs">
            <div className="flex items-center gap-2 border-b border-border/80 pb-3">
              <ImageIcon className="w-4 h-4 text-plum" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal">
                Background Photography
              </h3>
            </div>

            {/* Current Image Thumbnail */}
            <div className="aspect-[16/9] w-full rounded-xl overflow-hidden border border-border relative bg-neutral-900 shadow-inner group">
              <img
                src={banner.imageUrl || DEFAULT_HERO_BANNER.imageUrl}
                alt="Banner preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] text-white font-mono uppercase bg-black/70 px-2 py-1 rounded">
                  Active Background Media
                </span>
              </div>
            </div>

            {/* Cloudinary File Upload */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-2">
                Upload New Image to Cloudinary
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploadingImage}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                />
                <div className="w-full py-3.5 px-4 rounded-xl border border-dashed border-plum/40 bg-plum/5 hover:bg-plum/10 text-center transition-colors flex flex-col items-center justify-center gap-1.5">
                  {uploadingImage ? (
                    <div className="flex items-center gap-2 text-plum text-xs font-bold">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Optimizing & Uploading to Cloudinary...</span>
                    </div>
                  ) : (
                    <>
                      <UploadCloud className="w-5 h-5 text-plum" />
                      <span className="text-xs font-bold text-plum">
                        Click or drag image file here
                      </span>
                      <span className="text-[10px] text-charcoal-muted">
                        High-res PNG, JPG or WEBP recommended (1920x1080)
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Direct Image URL */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                Or Direct Image URL
              </label>
              <input
                type="url"
                value={banner.imageUrl}
                onChange={(e) => handleChange('imageUrl', e.target.value)}
                placeholder="https://res.cloudinary.com/..."
                className="w-full px-3 py-2 bg-white border border-border focus:border-plum rounded-lg text-xs font-mono text-charcoal placeholder-charcoal-subtle focus:outline-none focus:ring-1 focus:ring-plum"
              />
            </div>
          </div>

          {/* Section: Visual Depth & Styling */}
          <div className="p-6 bg-white border border-border rounded-2xl space-y-5 shadow-xs">
            <div className="flex items-center gap-2 border-b border-border/80 pb-3">
              <Sliders className="w-4 h-4 text-plum" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal">
                Visual Depth & Layout
              </h3>
            </div>

            {/* Overlay Darkness Slider */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-charcoal">
                  Dark Overlay Opacity
                </label>
                <span className="text-xs font-mono font-bold text-plum">
                  {banner.overlayDarkness ?? 40}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="85"
                step="5"
                value={banner.overlayDarkness ?? 40}
                onChange={(e) => handleChange('overlayDarkness', Number(e.target.value))}
                className="w-full accent-plum cursor-pointer"
              />
              <span className="text-[10px] text-charcoal-muted mt-1 block">
                Higher darkness ensures pristine white text contrast on brighter images.
              </span>
            </div>

            {/* Text Alignment */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1.5">
                Text Alignment
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['left', 'center', 'right'] as const).map((align) => (
                  <button
                    key={align}
                    type="button"
                    onClick={() => handleChange('textAlign', align)}
                    className={`py-2 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all ${
                      banner.textAlign === align
                        ? 'bg-plum text-white border-plum shadow-2xs'
                        : 'bg-[#FAF7F5] text-charcoal-muted hover:text-charcoal border-border'
                    }`}
                  >
                    {align}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Curve Toggle */}
            <div className="pt-2">
              <label className="flex items-center justify-between cursor-pointer p-3 bg-[#FAF7F5] rounded-xl border border-border hover:border-plum/30 transition-all">
                <div>
                  <span className="text-xs font-bold text-charcoal block">
                    Curved Bottom Arc
                  </span>
                  <span className="text-[10px] text-charcoal-muted">
                    Bows downward into the page matching luxury bottle aesthetics
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={banner.showArc !== false}
                  onChange={(e) => handleChange('showArc', e.target.checked)}
                  className="w-4 h-4 accent-plum cursor-pointer rounded"
                />
              </label>
            </div>

            {/* Bottom Save Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-plum hover:bg-plum-hover transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Publishing to Storefront...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 text-gold" />
                    <span>Save & Publish Live Banner</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
