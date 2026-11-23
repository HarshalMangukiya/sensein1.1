'use client';

import React, { useState, useEffect } from 'react';
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
  Plus,
  Trash2,
  Copy,
  ChevronLeft,
  ChevronRight,
  MoveLeft,
  MoveRight,
  SlidersHorizontal,
  Play,
  Pause,
  Gift,
  Palette,
} from 'lucide-react';
import {
  HeroBannerConfig,
  HeroBannerSlide,
  DEFAULT_HERO_BANNER,
  fetchHeroBanner,
  updateHeroBannerApi,
  uploadProductImageToCloudinary,
  PrivilegeBannerConfig,
  DEFAULT_PRIVILEGE_BANNER,
  fetchPrivilegeBanner,
  updatePrivilegeBannerApi,
} from '@/lib/api';

interface AdminBannerEditorProps {
  setToast: (toast: { text: string; type: 'success' | 'error' | 'info' }) => void;
}

export function AdminBannerEditor({ setToast }: AdminBannerEditorProps) {
  // Tab selector between Hero Banner Slideshow & Privilege Milestone Callout Banner
  const [activeStudioTab, setActiveStudioTab] = useState<'hero' | 'privilege'>('hero');

  // Hero banner state
  const [banner, setBanner] = useState<HeroBannerConfig>(DEFAULT_HERO_BANNER);
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  const [previewSlideIndex, setPreviewSlideIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [activePreviewMode, setActivePreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [previewAutoplay, setPreviewAutoplay] = useState(false);

  // Privilege milestone callout banner state
  const [privilegeBanner, setPrivilegeBanner] = useState<PrivilegeBannerConfig>(DEFAULT_PRIVILEGE_BANNER);
  const [savingPrivilege, setSavingPrivilege] = useState(false);

  // Load hero banner and privilege banner configuration
  useEffect(() => {
    async function loadAllContent() {
      try {
        setLoading(true);
        const [heroData, privData] = await Promise.all([
          fetchHeroBanner(),
          fetchPrivilegeBanner(),
        ]);

        if (heroData) {
          if (
            (heroData.imageUrl && heroData.imageUrl.includes('sensein-hair-wax-1.jpg')) ||
            (heroData.title && heroData.title.includes('HAUTE SALON')) ||
            (heroData.ctaText && heroData.ctaText.includes('STYLING WAX'))
          ) {
            setBanner(DEFAULT_HERO_BANNER);
          } else {
            const slides =
              heroData.slides && Array.isArray(heroData.slides) && heroData.slides.length > 0
                ? heroData.slides
                : [
                    {
                      id: 'slide-1',
                      badge: heroData.badge ?? DEFAULT_HERO_BANNER.badge,
                      title: heroData.title || DEFAULT_HERO_BANNER.title,
                      subtitle: heroData.subtitle || DEFAULT_HERO_BANNER.subtitle,
                      ctaText: heroData.ctaText || DEFAULT_HERO_BANNER.ctaText,
                      ctaLink: heroData.ctaLink || DEFAULT_HERO_BANNER.ctaLink,
                      imageUrl: heroData.imageUrl || DEFAULT_HERO_BANNER.imageUrl,
                      overlayDarkness: heroData.overlayDarkness ?? 40,
                      textAlign: heroData.textAlign || 'center',
                      isActive: true,
                    },
                  ];
            setBanner({
              ...heroData,
              slides,
              autoplay: heroData.autoplay !== undefined ? heroData.autoplay : true,
              autoplayIntervalSeconds: heroData.autoplayIntervalSeconds || 5,
            });
          }
        }

        if (privData && privData.title) {
          setPrivilegeBanner(privData);
        }
      } catch (err) {
        console.error('Failed to load banner configuration', err);
      } finally {
        setLoading(false);
      }
    }
    loadAllContent();
  }, []);

  const slides: HeroBannerSlide[] =
    banner.slides && banner.slides.length > 0
      ? banner.slides
      : DEFAULT_HERO_BANNER.slides || [];

  const currentSlide: HeroBannerSlide =
    slides[selectedSlideIndex] ||
    slides[0] || {
      id: 'slide-1',
      badge: '',
      title: 'SALON LUXURY RE-ENGINEERED',
      subtitle: 'High-performance botanical formulas crafted with clean ingredients for Indian hair textures.',
      ctaText: 'EXPLORE COLLECTION',
      ctaLink: '/shop',
      imageUrl: DEFAULT_HERO_BANNER.imageUrl,
      overlayDarkness: 40,
      textAlign: 'center',
      isActive: true,
    };

  // Preview slideshow autoplay simulation
  useEffect(() => {
    if (!previewAutoplay || slides.length <= 1) return;
    const timer = setInterval(() => {
      setPreviewSlideIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [previewAutoplay, slides.length]);

  // Sync preview slide when selected slide changes
  useEffect(() => {
    setPreviewSlideIndex(selectedSlideIndex);
  }, [selectedSlideIndex]);

  // Update a field on the currently selected slide
  const handleSlideChange = (field: keyof HeroBannerSlide, value: any) => {
    setBanner((prev) => {
      const list = [...(prev.slides && prev.slides.length > 0 ? prev.slides : [currentSlide])];
      if (!list[selectedSlideIndex]) return prev;

      list[selectedSlideIndex] = {
        ...list[selectedSlideIndex],
        [field]: value,
      };

      const nextBanner: HeroBannerConfig = {
        ...prev,
        slides: list,
      };
      if (selectedSlideIndex === 0) {
        if (field === 'title') nextBanner.title = value;
        if (field === 'subtitle') nextBanner.subtitle = value;
        if (field === 'imageUrl') nextBanner.imageUrl = value;
        if (field === 'badge') nextBanner.badge = value;
        if (field === 'ctaText') nextBanner.ctaText = value;
        if (field === 'ctaLink') nextBanner.ctaLink = value;
        if (field === 'overlayDarkness') nextBanner.overlayDarkness = value;
        if (field === 'textAlign') nextBanner.textAlign = value;
      }
      return nextBanner;
    });
  };

  const handleGlobalChange = (field: keyof HeroBannerConfig, value: any) => {
    setBanner((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddSlide = () => {
    const newSlideNumber = slides.length + 1;
    const newSlide: HeroBannerSlide = {
      id: `slide-${Date.now()}`,
      badge: 'NEW COLLECTION',
      title: `LUXURY BOTANICAL RITUAL 0${newSlideNumber}`,
      subtitle:
        'Engineered with micro-peptides and cold-pressed botanical complexes for radiant hair restoration.',
      ctaText: 'DISCOVER FORMULATION',
      ctaLink: '/shop',
      imageUrl: DEFAULT_HERO_BANNER.imageUrl,
      overlayDarkness: 40,
      textAlign: 'center',
      isActive: true,
    };

    const updatedSlides = [...slides, newSlide];
    setBanner((prev) => ({
      ...prev,
      slides: updatedSlides,
    }));
    setSelectedSlideIndex(updatedSlides.length - 1);
    setToast({
      text: `New banner slide added (#${newSlideNumber})! Customize title and photography below.`,
      type: 'success',
    });
  };

  const handleDuplicateSlide = (index: number) => {
    const target = slides[index];
    if (!target) return;
    const cloned: HeroBannerSlide = {
      ...target,
      id: `slide-${Date.now()}`,
      title: `${target.title} (Copy)`,
    };
    const updated = [...slides];
    updated.splice(index + 1, 0, cloned);
    setBanner((prev) => ({
      ...prev,
      slides: updated,
    }));
    setSelectedSlideIndex(index + 1);
    setToast({ text: `Slide #${index + 1} duplicated successfully.`, type: 'success' });
  };

  const handleDeleteSlide = (index: number) => {
    if (slides.length <= 1) {
      alert('A minimum of 1 hero banner slide is required.');
      return;
    }
    if (confirm(`Are you sure you want to delete Slide #${index + 1} ("${slides[index]?.title || 'Untitled'}")?`)) {
      const updated = slides.filter((_, i) => i !== index);
      setBanner((prev) => ({
        ...prev,
        slides: updated,
        ...(index === 0 && updated[0]
          ? {
              title: updated[0].title,
              subtitle: updated[0].subtitle,
              imageUrl: updated[0].imageUrl,
              badge: updated[0].badge,
              ctaText: updated[0].ctaText,
              ctaLink: updated[0].ctaLink,
            }
          : {}),
      }));
      setSelectedSlideIndex(Math.max(0, index - 1));
      setToast({ text: `Slide #${index + 1} removed from slideshow.`, type: 'info' });
    }
  };

  const handleMoveSlide = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    const list = [...slides];
    const [moved] = list.splice(index, 1);
    list.splice(targetIndex, 0, moved);

    setBanner((prev) => ({
      ...prev,
      slides: list,
      ...(list[0]
        ? {
            title: list[0].title,
            subtitle: list[0].subtitle,
            imageUrl: list[0].imageUrl,
            badge: list[0].badge,
            ctaText: list[0].ctaText,
            ctaLink: list[0].ctaLink,
          }
        : {}),
    }));
    setSelectedSlideIndex(targetIndex);
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
          handleSlideChange('imageUrl', res.url);
          setToast({
            text: `Slide #${selectedSlideIndex + 1} image uploaded to Cloudinary successfully!`,
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

  const handleSaveHero = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!slides || slides.length === 0) {
      alert('Please add at least one slide to publish.');
      return;
    }

    setSaving(true);
    try {
      const payload: HeroBannerConfig = {
        ...banner,
        slides,
        title: slides[0]?.title || banner.title,
        subtitle: slides[0]?.subtitle || banner.subtitle,
        imageUrl: slides[0]?.imageUrl || banner.imageUrl,
        badge: slides[0]?.badge || banner.badge,
        ctaText: slides[0]?.ctaText || banner.ctaText,
        ctaLink: slides[0]?.ctaLink || banner.ctaLink,
      };

      const updated = await updateHeroBannerApi(payload);
      setBanner(updated);
      setToast({
        text: `Storefront hero slideshow updated with ${slides.length} banners and published live!`,
        type: 'success',
      });
    } catch (err: any) {
      console.error('Error saving hero banner slideshow:', err);
      setToast({
        text: err.message || 'Failed to publish banner slideshow',
        type: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleResetHeroDefault = async () => {
    if (confirm('Reset storefront banner slideshow to default brand luxury photography?')) {
      setBanner(DEFAULT_HERO_BANNER);
      setSelectedSlideIndex(0);
      try {
        await updateHeroBannerApi(DEFAULT_HERO_BANNER);
        setToast({
          text: 'Slideshow reset to official brand luxury default presets!',
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

  // --- PRIVILEGE CALLOUT BANNER HANDLERS ---
  const handlePrivilegeChange = (field: keyof PrivilegeBannerConfig, value: any) => {
    setPrivilegeBanner((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSavePrivilege = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!privilegeBanner.title.trim()) {
      alert('Please enter a headline title for the banner.');
      return;
    }

    setSavingPrivilege(true);
    try {
      const updated = await updatePrivilegeBannerApi(privilegeBanner);
      setPrivilegeBanner(updated);
      setToast({
        text: 'Privilege Unlocks milestone callout banner updated and published live on home page!',
        type: 'success',
      });
    } catch (err: any) {
      console.error('Error saving privilege banner:', err);
      setToast({
        text: err.message || 'Failed to save privilege banner',
        type: 'error',
      });
    } finally {
      setSavingPrivilege(false);
    }
  };

  const handleResetPrivilegeDefault = async () => {
    if (confirm('Reset Privilege Unlocks banner text to default luxury tier formulations?')) {
      setPrivilegeBanner(DEFAULT_PRIVILEGE_BANNER);
      try {
        await updatePrivilegeBannerApi(DEFAULT_PRIVILEGE_BANNER);
        setToast({
          text: 'Privilege banner reset to official default text specifications!',
          type: 'success',
        });
      } catch (err: any) {
        setToast({
          text: 'Privilege banner reset to default settings.',
          type: 'info',
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-charcoal-muted">
        <Loader2 className="w-6 h-6 animate-spin text-plum mb-3" />
        <p className="text-xs font-semibold">Loading Storefront Banners Studio...</p>
      </div>
    );
  }

  const previewSlide = slides[previewSlideIndex] || currentSlide;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Studio Top Switcher Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-2 p-1.5 bg-white rounded-xl border border-border shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveStudioTab('hero')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeStudioTab === 'hero'
                ? 'bg-plum text-white shadow-xs'
                : 'text-charcoal-muted hover:text-charcoal hover:bg-[#FAF7F5]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Hero Banner Slideshow</span>
            <span
              className={`text-[9px] px-2 py-0.5 rounded-full font-mono ${
                activeStudioTab === 'hero'
                  ? 'bg-white/20 text-white'
                  : 'bg-plum/10 text-plum'
              }`}
            >
              {slides.length} SLIDES
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStudioTab('privilege')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeStudioTab === 'privilege'
                ? 'bg-plum text-white shadow-xs'
                : 'text-charcoal-muted hover:text-charcoal hover:bg-[#FAF7F5]'
            }`}
          >
            <Gift className={`w-3.5 h-3.5 ${activeStudioTab === 'privilege' ? 'text-gold' : 'text-plum'}`} />
            <span>Privilege Milestone Banner</span>
            <span
              className={`text-[9px] px-2 py-0.5 rounded-full font-mono ${
                activeStudioTab === 'privilege'
                  ? 'bg-white/20 text-white'
                  : 'bg-gold/20 text-gold'
              }`}
            >
              TIER GIFTS
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-lg text-xs font-semibold text-charcoal hover:text-plum bg-white border border-border hover:border-plum/30 transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <ExternalLink className="w-3.5 h-3.5 text-plum" />
            <span>View Live Home</span>
          </a>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: HERO SLIDESHOW STUDIO                                              */}
      {/* ========================================================================= */}
      {activeStudioTab === 'hero' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Header & Quick Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-serif font-bold text-charcoal tracking-tight">
                  Storefront Hero Banner Studio
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-plum/10 text-plum border border-plum/20 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-gold" />
                  <span>Slideshow Enabled • {slides.length} {slides.length === 1 ? 'Banner' : 'Banners'}</span>
                </span>
              </div>
              <p className="text-xs text-charcoal-muted mt-1">
                Add, configure, and reorder multiple banners to create a fully interactive luxury slideshow on your home page.
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={handleResetHeroDefault}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold text-charcoal-muted hover:text-charcoal bg-white border border-border hover:bg-[#FAF7F5] transition-all flex items-center gap-1.5 shadow-2xs"
                title="Reset banner to default brand formulation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Default</span>
              </button>

              <button
                type="button"
                onClick={() => handleSaveHero()}
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
                    <span>Save & Publish Slideshow</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* SLIDESHOW MULTI-BANNER MANAGEMENT STRIP */}
          <div className="p-5 bg-white border border-border rounded-2xl shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-plum" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal">
                  Slideshow Carousel Manager ({slides.length} Slides)
                </h3>
                <span className="text-[10px] text-charcoal-muted">
                  Click a slide to edit its headline, description, and image below
                </span>
              </div>

              <button
                type="button"
                onClick={handleAddSlide}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider text-white bg-[#5A3859] hover:bg-[#6D436C] transition-all flex items-center gap-1.5 shadow-sm hover:shadow active:scale-98 self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5 text-gold" />
                <span>Add New Banner Slide</span>
              </button>
            </div>

            {/* Slide Cards Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {slides.map((s, idx) => {
                const isSelected = idx === selectedSlideIndex;
                return (
                  <div
                    key={s.id || idx}
                    onClick={() => setSelectedSlideIndex(idx)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between group ${
                      isSelected
                        ? 'border-plum bg-plum/5 ring-2 ring-plum/20 shadow-md'
                        : 'border-border bg-[#FAF7F5] hover:border-plum/40 hover:bg-white'
                    }`}
                  >
                    <div>
                      {/* Thumbnail & Badges */}
                      <div className="aspect-[16/9] w-full rounded-lg overflow-hidden border border-border/80 relative bg-neutral-900 mb-2">
                        <img
                          src={s.imageUrl || DEFAULT_HERO_BANNER.imageUrl}
                          alt={s.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[9px] font-mono font-bold text-white">
                          #{idx + 1}
                        </div>
                        {s.isActive === false && (
                          <div className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded-full bg-red-600/90 text-[9px] font-bold text-white uppercase">
                            Hidden
                          </div>
                        )}
                      </div>

                      {/* Title & Badge Text */}
                      <div className="space-y-0.5">
                        {s.badge && (
                          <span className="text-[9px] font-bold uppercase tracking-wider text-plum block truncate">
                            {s.badge}
                          </span>
                        )}
                        <h4 className="text-xs font-bold text-charcoal truncate" title={s.title}>
                          {s.title || 'Untitled Banner'}
                        </h4>
                        <p className="text-[10px] text-charcoal-muted truncate" title={s.subtitle}>
                          {s.subtitle || 'No description entered'}
                        </p>
                      </div>
                    </div>

                    {/* Slide Card Actions */}
                    <div className="mt-3 pt-2.5 border-t border-border/80 flex items-center justify-between gap-1 text-charcoal-muted">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveSlide(idx, 'left');
                          }}
                          className="p-1 rounded hover:bg-white hover:text-charcoal disabled:opacity-30 disabled:cursor-not-allowed transition"
                          title="Move Left"
                        >
                          <MoveLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === slides.length - 1}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveSlide(idx, 'right');
                          }}
                          className="p-1 rounded hover:bg-white hover:text-charcoal disabled:opacity-30 disabled:cursor-not-allowed transition"
                          title="Move Right"
                        >
                          <MoveRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicateSlide(idx);
                          }}
                          className="p-1 rounded hover:bg-white hover:text-plum transition"
                          title="Duplicate Slide"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={slides.length <= 1}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSlide(idx);
                          }}
                          className="p-1 rounded hover:bg-red-50 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
                          title="Delete Slide"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SLIDESHOW GLOBAL CONTROLS */}
          <div className="p-5 bg-white border border-border rounded-2xl shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6 flex-wrap">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={banner.autoplay !== false}
                  onChange={(e) => handleGlobalChange('autoplay', e.target.checked)}
                  className="w-4 h-4 accent-plum cursor-pointer rounded"
                />
                <div>
                  <span className="text-xs font-bold text-charcoal block">
                    Automatic Slide Transition (Autoplay)
                  </span>
                  <span className="text-[10px] text-charcoal-muted">
                    Cycle through banners automatically on home page
                  </span>
                </div>
              </label>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-charcoal whitespace-nowrap">
                  Slide Duration:
                </span>
                <div className="flex items-center gap-1 bg-[#FAF7F5] p-1 rounded-lg border border-border">
                  {[3, 5, 7, 10].map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => handleGlobalChange('autoplayIntervalSeconds', sec)}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded transition ${
                        (banner.autoplayIntervalSeconds || 5) === sec
                          ? 'bg-plum text-white shadow-2xs'
                          : 'text-charcoal-muted hover:text-charcoal'
                      }`}
                    >
                      {sec}s
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={banner.showArc !== false}
                onChange={(e) => handleGlobalChange('showArc', e.target.checked)}
                className="w-4 h-4 accent-plum cursor-pointer rounded"
              />
              <span className="text-xs font-bold text-charcoal">
                Bottom Luxury Arc Curve
              </span>
            </label>
          </div>

          {/* REAL-TIME WYSIWYG PREVIEW */}
          <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 bg-[#F8F5F2] border-b border-border flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-plum" />
                <span className="text-xs font-bold uppercase tracking-wider text-charcoal">
                  Live Storefront Slideshow Preview
                </span>
                <span className="text-[10px] text-charcoal-muted hidden sm:inline">
                  (Viewing Slide {previewSlideIndex + 1} of {slides.length})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewAutoplay(!previewAutoplay)}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded bg-white border border-border text-charcoal hover:text-plum flex items-center gap-1"
                >
                  {previewAutoplay ? (
                    <>
                      <Pause className="w-3 h-3 text-gold" />
                      <span>Pause Carousel</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 text-plum" />
                      <span>Preview Carousel</span>
                    </>
                  )}
                </button>

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
                    Mobile
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 bg-[#211B21]/5 flex justify-center">
              <div
                className={`w-full transition-all duration-300 rounded-xl overflow-hidden shadow-2xl relative bg-[#150A14] ${
                  activePreviewMode === 'mobile' ? 'max-w-md' : 'max-w-full'
                }`}
              >
                <div className="relative w-full min-h-[380px] sm:min-h-[440px] flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 z-0">
                    <img
                      src={previewSlide.imageUrl || DEFAULT_HERO_BANNER.imageUrl}
                      alt={previewSlide.title}
                      className="w-full h-full object-cover object-center filter brightness-[0.85] contrast-[1.08] transition-all duration-500"
                    />
                    <div
                      className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-300"
                      style={{ opacity: (previewSlide.overlayDarkness ?? 40) / 100 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#150A14] via-transparent to-black/50 pointer-events-none" />
                  </div>

                  <div
                    className={`relative z-10 w-full max-w-3xl mx-auto px-6 py-12 flex flex-col ${
                      previewSlide.textAlign === 'left'
                        ? 'items-start text-left'
                        : previewSlide.textAlign === 'right'
                        ? 'items-end text-right'
                        : 'items-center text-center'
                    }`}
                  >
                    {previewSlide.badge && (
                      <span className="inline-block text-[9px] sm:text-[10px] uppercase tracking-[0.25em] font-bold text-gold/90 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-gold/30 mb-3 drop-shadow-md">
                        {previewSlide.badge}
                      </span>
                    )}

                    <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.14] text-white uppercase drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
                      {previewSlide.title || 'SALON LUXURY RE-ENGINEERED'}
                    </h1>

                    <p className="mt-3 text-xs sm:text-sm text-white/90 font-light max-w-lg leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                      {previewSlide.subtitle ||
                        'High-performance botanical formulas crafted with clean ingredients for Indian hair textures.'}
                    </p>

                    <div className="mt-6">
                      <span className="inline-flex items-center justify-center px-6 py-2.5 sm:px-8 sm:py-3 bg-[#5A3859] hover:bg-[#6D436C] text-white text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] rounded-sm transition-all duration-300 shadow-2xl">
                        {previewSlide.ctaText || 'EXPLORE COLLECTION'}
                      </span>
                    </div>
                  </div>

                  {slides.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewSlideIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
                        }
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm border border-white/20 transition"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewSlideIndex((prev) => (prev + 1) % slides.length)
                        }
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm border border-white/20 transition"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                        {slides.map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setPreviewSlideIndex(i)}
                            className={`transition-all rounded-full ${
                              i === previewSlideIndex
                                ? 'w-6 h-1.5 bg-gradient-to-r from-gold to-white'
                                : 'w-1.5 h-1.5 bg-white/40'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}

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

          {/* ACTIVE SLIDE CUSTOMIZATION FORM */}
          <form onSubmit={handleSaveHero} className="space-y-6">
            <div className="flex items-center justify-between bg-plum/5 p-4 rounded-xl border border-plum/20">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-plum text-white font-bold text-xs flex items-center justify-center">
                  #{selectedSlideIndex + 1}
                </span>
                <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal">
                  Editing Banner Slide #{selectedSlideIndex + 1}: &ldquo;{currentSlide.title}&rdquo;
                </h3>
              </div>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={currentSlide.isActive !== false}
                  onChange={(e) => handleSlideChange('isActive', e.target.checked)}
                  className="w-4 h-4 accent-plum cursor-pointer rounded"
                />
                <span className="text-xs font-bold text-charcoal">
                  Active on Storefront
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="p-6 bg-white border border-border rounded-2xl space-y-5 shadow-xs">
                  <div className="flex items-center gap-2 border-b border-border/80 pb-3">
                    <Type className="w-4 h-4 text-plum" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal">
                      Headline & Messaging Content
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                        Top Eyebrow Badge / Tagline
                      </label>
                      <input
                        type="text"
                        value={currentSlide.badge || ''}
                        onChange={(e) => handleSlideChange('badge', e.target.value)}
                        placeholder="e.g. INTRODUCING THE NEW PACKAGING or OFFICIAL SENSEIN® PARIS"
                        className="w-full px-3.5 py-2.5 bg-white border border-border focus:border-plum rounded-lg text-xs text-charcoal placeholder-charcoal-subtle focus:outline-none focus:ring-1 focus:ring-plum"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                        Main Headline / Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={currentSlide.title}
                        onChange={(e) => handleSlideChange('title', e.target.value)}
                        placeholder="e.g. REPAIR. RESTORE. REVEAL. or SALON LUXURY RE-ENGINEERED"
                        className="w-full px-3.5 py-2.5 bg-white border border-border focus:border-plum rounded-lg text-xs font-bold text-charcoal placeholder-charcoal-subtle focus:outline-none focus:ring-1 focus:ring-plum"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                        Subheading / Formulation Description *
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={currentSlide.subtitle}
                        onChange={(e) => handleSlideChange('subtitle', e.target.value)}
                        placeholder="e.g. Meet the refreshed Damage Hair Repair range for your hair-care routine."
                        className="w-full px-3.5 py-2.5 bg-white border border-border focus:border-plum rounded-lg text-xs text-charcoal placeholder-charcoal-subtle focus:outline-none focus:ring-1 focus:ring-plum leading-relaxed"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-white border border-border rounded-2xl space-y-5 shadow-xs">
                  <div className="flex items-center gap-2 border-b border-border/80 pb-3">
                    <Link2 className="w-4 h-4 text-plum" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal">
                      Call-To-Action (CTA) Button
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
                        value={currentSlide.ctaText || 'EXPLORE COLLECTION'}
                        onChange={(e) => handleSlideChange('ctaText', e.target.value)}
                        placeholder="e.g. MEET YOUR NEW HAIR CARE"
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
                        value={currentSlide.ctaLink || '/shop'}
                        onChange={(e) => handleSlideChange('ctaLink', e.target.value)}
                        placeholder="e.g. /shop"
                        className="w-full px-3.5 py-2.5 bg-white border border-border focus:border-plum rounded-lg text-xs font-mono text-charcoal placeholder-charcoal-subtle focus:outline-none focus:ring-1 focus:ring-plum"
                      />
                    </div>
                  </div>

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
                          onClick={() => handleSlideChange('ctaLink', preset.link)}
                          className={`px-2.5 py-1 text-[11px] rounded border transition-colors ${
                            currentSlide.ctaLink === preset.link
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

              <div className="space-y-6">
                <div className="p-6 bg-white border border-border rounded-2xl space-y-5 shadow-xs">
                  <div className="flex items-center gap-2 border-b border-border/80 pb-3">
                    <ImageIcon className="w-4 h-4 text-plum" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal">
                      Slide Photography
                    </h3>
                  </div>

                  <div className="aspect-[16/9] w-full rounded-xl overflow-hidden border border-border relative bg-neutral-900 shadow-inner group">
                    <img
                      src={currentSlide.imageUrl || DEFAULT_HERO_BANNER.imageUrl}
                      alt="Slide preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] text-white font-mono uppercase bg-black/70 px-2 py-1 rounded">
                        Active Slide Media
                      </span>
                    </div>
                  </div>

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
                              High-res PNG, JPG or WEBP (1920x1080 recommended)
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                      Or Direct Image URL
                    </label>
                    <input
                      type="url"
                      value={currentSlide.imageUrl}
                      onChange={(e) => handleSlideChange('imageUrl', e.target.value)}
                      placeholder="https://res.cloudinary.com/..."
                      className="w-full px-3 py-2 bg-white border border-border focus:border-plum rounded-lg text-xs font-mono text-charcoal placeholder-charcoal-subtle focus:outline-none focus:ring-1 focus:ring-plum"
                    />
                  </div>
                </div>

                <div className="p-6 bg-white border border-border rounded-2xl space-y-5 shadow-xs">
                  <div className="flex items-center gap-2 border-b border-border/80 pb-3">
                    <Sliders className="w-4 h-4 text-plum" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal">
                      Depth & Text Alignment
                    </h3>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-charcoal">
                        Dark Overlay Opacity
                      </label>
                      <span className="text-xs font-mono font-bold text-plum">
                        {currentSlide.overlayDarkness ?? 40}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="85"
                      step="5"
                      value={currentSlide.overlayDarkness ?? 40}
                      onChange={(e) => handleSlideChange('overlayDarkness', Number(e.target.value))}
                      className="w-full accent-plum cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1.5">
                      Text Alignment
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['left', 'center', 'right'] as const).map((align) => (
                        <button
                          key={align}
                          type="button"
                          onClick={() => handleSlideChange('textAlign', align)}
                          className={`py-2 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all ${
                            currentSlide.textAlign === align
                              ? 'bg-plum text-white border-plum shadow-2xs'
                              : 'bg-[#FAF7F5] text-charcoal-muted hover:text-charcoal border-border'
                          }`}
                        >
                          {align}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-plum hover:bg-plum-hover transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-60"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>Publishing Slideshow...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 text-gold" />
                          <span>Save & Publish Live Slideshow</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PRIVILEGE MILESTONE CALLOUT BANNER STUDIO                          */}
      {/* ========================================================================= */}
      {activeStudioTab === 'privilege' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Header & Quick Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-serif font-bold text-charcoal tracking-tight">
                  Privilege Milestone Callout Banner
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30 flex items-center gap-1">
                  <Gift className="w-3 h-3 text-gold" />
                  <span>Tier Gifts Callout</span>
                </span>
              </div>
              <p className="text-xs text-charcoal-muted mt-1">
                Customize the promotional callout banner promoting complimentary tier gifts and privileges displayed on the home page beneath the categories.
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={handleResetPrivilegeDefault}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold text-charcoal-muted hover:text-charcoal bg-white border border-border hover:bg-[#FAF7F5] transition-all flex items-center gap-1.5 shadow-2xs"
                title="Reset privilege banner to default wording"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Default</span>
              </button>

              <button
                type="button"
                onClick={() => handleSavePrivilege()}
                disabled={savingPrivilege}
                className="px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-white bg-plum hover:bg-plum-hover transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {savingPrivilege ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 text-gold" />
                    <span>Save & Publish Banner</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* LIVE WYSIWYG PREVIEW CARD (Matching the user's reference screenshot) */}
          <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 bg-[#F8F5F2] border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-plum" />
                <span className="text-xs font-bold uppercase tracking-wider text-charcoal">
                  Live Storefront Preview
                </span>
                <span className="text-[10px] text-charcoal-muted hidden sm:inline">
                  (Renders on storefront exactly as displayed here)
                </span>
              </div>

              {privilegeBanner.isActive === false && (
                <span className="px-2.5 py-0.5 rounded-full bg-red-600/90 text-white text-[10px] font-bold uppercase">
                  Hidden on Storefront
                </span>
              )}
            </div>

            <div className="p-4 sm:p-8 bg-[#211B21]/5 flex justify-center">
              <div
                className="w-full max-w-4xl text-white rounded-sm p-5 sm:p-8 shadow-luxury relative overflow-hidden border border-white/10 transition-colors duration-300"
                style={{ backgroundColor: privilegeBanner.backgroundColor || '#5A3859' }}
              >
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6">
                  <div className="space-y-1.5 sm:space-y-2 text-center md:text-left">
                    {privilegeBanner.badge && (
                      <div className="inline-flex items-center gap-1.5 text-[#E8D5C4] text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em]">
                        <Gift className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37]" /> {privilegeBanner.badge}
                      </div>
                    )}
                    <h3 className="font-sans text-xl sm:text-3xl font-bold leading-snug tracking-tight text-white">
                      {privilegeBanner.title || 'Luxury Tier Gifts with Every Order'}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/85 max-w-xl leading-relaxed font-light">
                      {privilegeBanner.subtitle || 'Unlock complimentary deluxe samples at ₹999...'}
                    </p>
                  </div>
                  <span className="w-full sm:w-auto text-center flex-shrink-0 px-7 py-3.5 bg-white text-[#5A3859] text-xs font-bold uppercase tracking-widest rounded-sm shadow-md pointer-events-none select-none">
                    {privilegeBanner.ctaText || 'Start Curating Your Bag'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* EDIT FORM */}
          <form onSubmit={handleSavePrivilege} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Copy & Messaging (2 cols) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="p-6 bg-white border border-border rounded-2xl space-y-5 shadow-xs">
                <div className="flex items-center gap-2 border-b border-border/80 pb-3">
                  <Type className="w-4 h-4 text-plum" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal">
                    Headline & Messaging Architecture
                  </h3>
                </div>

                <div className="space-y-4">
                  {/* Eyebrow Tagline */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                      Top Eyebrow Badge (With Gift Icon)
                    </label>
                    <input
                      type="text"
                      value={privilegeBanner.badge || ''}
                      onChange={(e) => handlePrivilegeChange('badge', e.target.value)}
                      placeholder="e.g. Privilege Unlocks"
                      className="w-full px-3.5 py-2.5 bg-white border border-border focus:border-plum rounded-lg text-xs text-charcoal placeholder-charcoal-subtle focus:outline-none focus:ring-1 focus:ring-plum"
                    />
                    <span className="text-[10px] text-charcoal-muted mt-1 block">
                      Displays with a gold gift icon above the title. Leave blank to hide.
                    </span>
                  </div>

                  {/* Headline Title */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                      Main Headline Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={privilegeBanner.title}
                      onChange={(e) => handlePrivilegeChange('title', e.target.value)}
                      placeholder="e.g. Luxury Tier Gifts with Every Order"
                      className="w-full px-3.5 py-2.5 bg-white border border-border focus:border-plum rounded-lg text-xs font-bold text-charcoal placeholder-charcoal-subtle focus:outline-none focus:ring-1 focus:ring-plum"
                    />
                  </div>

                  {/* Description Subtitle */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                      Privilege Details & Description *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={privilegeBanner.subtitle}
                      onChange={(e) => handlePrivilegeChange('subtitle', e.target.value)}
                      placeholder="e.g. Unlock complimentary deluxe samples at ₹999, our Rosewood & Velvet Travel Pouch at ₹1,999, and a Full-Size French Plum Elixir (₹1,499 value) at ₹2,999."
                      className="w-full px-3.5 py-2.5 bg-white border border-border focus:border-plum rounded-lg text-xs text-charcoal placeholder-charcoal-subtle focus:outline-none focus:ring-1 focus:ring-plum leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* Call-To-Action Button */}
              <div className="p-6 bg-white border border-border rounded-2xl space-y-5 shadow-xs">
                <div className="flex items-center gap-2 border-b border-border/80 pb-3">
                  <Link2 className="w-4 h-4 text-plum" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal">
                    Call-To-Action (CTA) Button
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                      Button Text *
                    </label>
                    <input
                      type="text"
                      required
                      value={privilegeBanner.ctaText || 'Start Curating Your Bag'}
                      onChange={(e) => handlePrivilegeChange('ctaText', e.target.value)}
                      placeholder="e.g. Start Curating Your Bag"
                      className="w-full px-3.5 py-2.5 bg-white border border-border focus:border-plum rounded-lg text-xs font-semibold text-charcoal placeholder-charcoal-subtle focus:outline-none focus:ring-1 focus:ring-plum"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                      Destination URL *
                    </label>
                    <input
                      type="text"
                      required
                      value={privilegeBanner.ctaLink || '/shop'}
                      onChange={(e) => handlePrivilegeChange('ctaLink', e.target.value)}
                      placeholder="e.g. /shop"
                      className="w-full px-3.5 py-2.5 bg-white border border-border focus:border-plum rounded-lg text-xs font-mono text-charcoal placeholder-charcoal-subtle focus:outline-none focus:ring-1 focus:ring-plum"
                    />
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted block mb-1.5">
                    Quick Link Presets:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: 'All Formulations (/shop)', link: '/shop' },
                      { label: 'Value Packs & Combos', link: '/shop?category=Combos' },
                      { label: 'Bestseller Featured', link: '/shop?collection=Bestsellers' },
                      { label: 'Hair Masks', link: '/shop?category=Hair+Mask' },
                    ].map((preset, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handlePrivilegeChange('ctaLink', preset.link)}
                        className={`px-2.5 py-1 text-[11px] rounded border transition-colors ${
                          privilegeBanner.ctaLink === preset.link
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

            {/* Styling & Color Palette (1 col) */}
            <div className="space-y-6">
              <div className="p-6 bg-white border border-border rounded-2xl space-y-5 shadow-xs">
                <div className="flex items-center gap-2 border-b border-border/80 pb-3">
                  <Palette className="w-4 h-4 text-plum" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal">
                    Banner Background Styling
                  </h3>
                </div>

                {/* Color preview */}
                <div
                  className="w-full h-16 rounded-xl border border-border shadow-inner flex items-center justify-center transition-colors"
                  style={{ backgroundColor: privilegeBanner.backgroundColor || '#5A3859' }}
                >
                  <span className="text-xs font-mono font-bold text-white uppercase drop-shadow">
                    {privilegeBanner.backgroundColor || '#5A3859'}
                  </span>
                </div>

                {/* Color Input */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                    Hex Color Code
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={privilegeBanner.backgroundColor || '#5A3859'}
                      onChange={(e) => handlePrivilegeChange('backgroundColor', e.target.value)}
                      className="w-10 h-10 p-0.5 border border-border rounded-lg cursor-pointer bg-white"
                    />
                    <input
                      type="text"
                      value={privilegeBanner.backgroundColor || '#5A3859'}
                      onChange={(e) => handlePrivilegeChange('backgroundColor', e.target.value)}
                      placeholder="#5A3859"
                      className="flex-1 px-3 py-2 bg-white border border-border focus:border-plum rounded-lg text-xs font-mono text-charcoal focus:outline-none focus:ring-1 focus:ring-plum uppercase"
                    />
                  </div>
                </div>

                {/* Luxury Preset Swatches */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted block mb-2">
                    Luxury Formulation Swatches:
                  </span>
                  <div className="space-y-1.5">
                    {[
                      { name: 'Sensein Brand Plum', color: '#5A3859' },
                      { name: 'Deep French Velvet', color: '#432542' },
                      { name: 'Midnight Onyx', color: '#150A14' },
                      { name: 'Rich Bordeaux Burgundy', color: '#431E28' },
                      { name: 'Royal Emerald Botanical', color: '#1A3026' },
                    ].map((swatch, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handlePrivilegeChange('backgroundColor', swatch.color)}
                        className={`w-full flex items-center justify-between p-2 rounded-lg border text-left transition ${
                          (privilegeBanner.backgroundColor || '#5A3859').toLowerCase() === swatch.color.toLowerCase()
                            ? 'border-plum bg-plum/5 font-bold'
                            : 'border-border hover:bg-[#FAF7F5]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-4 h-4 rounded-full border border-black/20 shadow-2xs"
                            style={{ backgroundColor: swatch.color }}
                          />
                          <span className="text-xs text-charcoal">{swatch.name}</span>
                        </div>
                        <span className="text-[10px] font-mono text-charcoal-muted">{swatch.color}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Active Toggle */}
                <div className="pt-2 border-t border-border">
                  <label className="flex items-center justify-between cursor-pointer p-3 bg-[#FAF7F5] rounded-xl border border-border hover:border-plum/30 transition-all select-none">
                    <div>
                      <span className="text-xs font-bold text-charcoal block">
                        Display on Storefront
                      </span>
                      <span className="text-[10px] text-charcoal-muted">
                        Enable or disable this callout banner
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={privilegeBanner.isActive !== false}
                      onChange={(e) => handlePrivilegeChange('isActive', e.target.checked)}
                      className="w-4 h-4 accent-plum cursor-pointer rounded"
                    />
                  </label>
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={savingPrivilege}
                    className="w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-plum hover:bg-plum-hover transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-60"
                  >
                    {savingPrivilege ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Publishing Banner...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 text-gold" />
                        <span>Save & Publish Privilege Banner</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
