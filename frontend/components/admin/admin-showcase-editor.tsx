'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Save,
  RotateCcw,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Trash2,
  UploadCloud,
  Loader2,
  Type,
  MoveUp,
  MoveDown,
  Eye,
  Video,
  Image as ImageIcon,
  Play,
  Film,
  Plus,
  Link as LinkIcon,
  Check,
  CheckCircle,
  X,
  Zap,
} from 'lucide-react';
import {
  ShowcaseConfig,
  ShowcaseCard,
  DEFAULT_SHOWCASE_CONFIG,
  fetchShowcaseConfig,
  updateShowcaseConfigApi,
  uploadShowcaseMediaToCloudinary,
} from '@/lib/api';

interface AdminShowcaseEditorProps {
  setToast: (toast: { text: string; type: 'success' | 'error' | 'info' }) => void;
}

// Media detection helper
function isVideoMedia(card: ShowcaseCard): boolean {
  if (card.mediaType === 'video') return true;
  const target = (card.videoUrl || card.mediaUrl || card.image || '').toLowerCase();
  return (
    target.endsWith('.mp4') ||
    target.endsWith('.webm') ||
    target.endsWith('.mov') ||
    target.endsWith('.m4v') ||
    target.includes('/video/upload/') ||
    target.includes('resource_type=video')
  );
}

// Default photography samples
const DEFAULT_PRESET_CARDS: ShowcaseCard[] = [
  {
    id: 'media-card-1',
    mediaType: 'image',
    image: 'https://res.cloudinary.com/dqddawu42/image/upload/v1792479863/sensein/products/sensein-hair-wax-1.jpg',
    mediaUrl: 'https://res.cloudinary.com/dqddawu42/image/upload/v1792479863/sensein/products/sensein-hair-wax-1.jpg',
  },
  {
    id: 'media-card-2',
    mediaType: 'image',
    image: 'https://res.cloudinary.com/dqddawu42/image/upload/v1792479865/sensein/products/sensein-hair-wax-2.jpg',
    mediaUrl: 'https://res.cloudinary.com/dqddawu42/image/upload/v1792479865/sensein/products/sensein-hair-wax-2.jpg',
  },
  {
    id: 'media-card-3',
    mediaType: 'image',
    image: 'https://res.cloudinary.com/dqddawu42/image/upload/v1792479866/sensein/products/sensein-hair-wax-3.jpg',
    mediaUrl: 'https://res.cloudinary.com/dqddawu42/image/upload/v1792479866/sensein/products/sensein-hair-wax-3.jpg',
  },
  {
    id: 'media-card-4',
    mediaType: 'image',
    image: 'https://res.cloudinary.com/dqddawu42/image/upload/v1792479867/sensein/products/sensein-hair-wax-4.jpg',
    mediaUrl: 'https://res.cloudinary.com/dqddawu42/image/upload/v1792479867/sensein/products/sensein-hair-wax-4.jpg',
  },
  {
    id: 'media-card-5',
    mediaType: 'image',
    image: 'https://res.cloudinary.com/dqddawu42/image/upload/v1792479863/sensein/products/sensein-hair-wax-1.jpg',
    mediaUrl: 'https://res.cloudinary.com/dqddawu42/image/upload/v1792479863/sensein/products/sensein-hair-wax-1.jpg',
  },
];

export function AdminShowcaseEditor({ setToast }: AdminShowcaseEditorProps) {
  const [config, setConfig] = useState<ShowcaseConfig>(DEFAULT_SHOWCASE_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingCardId, setUploadingCardId] = useState<string | null>(null);
  const [uploadingNew, setUploadingNew] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, { percent: number; message: string; stage: string }>>({});
  const [urlInputCardIdx, setUrlInputCardIdx] = useState<number | null>(null);
  const [customUrlInput, setCustomUrlInput] = useState<string>('');

  // 3D Deck Preview Carousel State
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobilePreview, setIsMobilePreview] = useState(false);

  const newPhotoInputRef = useRef<HTMLInputElement | null>(null);
  const newVideoInputRef = useRef<HTMLInputElement | null>(null);

  // Load existing showcase configuration
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const showcaseData = await fetchShowcaseConfig();

        if (showcaseData && Array.isArray(showcaseData.cards) && showcaseData.cards.length > 0) {
          if (showcaseData.cards.length === 4) {
            const fifthCard: ShowcaseCard = {
              id: 'media-card-5',
              mediaType: 'image',
              image: 'https://res.cloudinary.com/dqddawu42/image/upload/v1792479863/sensein/products/sensein-hair-wax-1.jpg',
              mediaUrl: 'https://res.cloudinary.com/dqddawu42/image/upload/v1792479863/sensein/products/sensein-hair-wax-1.jpg',
            };
            const updated = {
              ...showcaseData,
              cards: [...showcaseData.cards, fifthCard],
            };
            setConfig(updated);
            updateShowcaseConfigApi(updated);
          } else {
            setConfig(showcaseData);
          }
        }
      } catch (err) {
        console.error('Failed to load showcase studio data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Auto rotate preview
  useEffect(() => {
    if (isPaused || config.autoRotate === false || !config.cards || config.cards.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % config.cards.length);
    }, config.rotationIntervalMs || 2500);
    return () => clearInterval(interval);
  }, [isPaused, config.autoRotate, config.rotationIntervalMs, config.cards?.length]);

  const handlePrev = () => {
    if (!config.cards || config.cards.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + config.cards.length) % config.cards.length);
  };

  const handleNext = () => {
    if (!config.cards || config.cards.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % config.cards.length);
  };

  // Upload handler for replacing media on an existing card
  const handleCardMediaUpload = async (index: number, file: File) => {
    const cardId = config.cards[index]?.id || `${index}`;
    setUploadingCardId(cardId);
    setUploadProgress((prev) => ({
      ...prev,
      [cardId]: { percent: 0, message: 'Starting upload...', stage: 'uploading' },
    }));

    try {
      const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|mov|m4v|ogv)$/i.test(file.name);
      const res = await uploadShowcaseMediaToCloudinary(
        file,
        ['showcase', isVideo ? 'video' : 'photo'],
        (prog) => {
          setUploadProgress((prev) => ({
            ...prev,
            [cardId]: prog,
          }));
        }
      );
      if (res.success && res.url) {
        const finalUrl = res.url;
        const isActuallyVideo = isVideo || res.resourceType === 'video';
        setConfig((prev) => {
          const updated = [...prev.cards];
          updated[index] = {
            ...updated[index],
            mediaType: isActuallyVideo ? 'video' : 'image',
            image: finalUrl,
            mediaUrl: finalUrl,
            videoUrl: isActuallyVideo ? finalUrl : undefined,
          };
          return { ...prev, cards: updated };
        });
        setToast({
          text: `${isActuallyVideo ? '🎬 Video Reel' : '📸 Photo'} uploaded to Cloudinary successfully!`,
          type: 'success',
        });
      } else {
        const errorText = res.error || 'Media upload failed. Please try again or paste direct video URL.';
        setToast({ text: errorText, type: 'error' });
      }
    } catch (e: any) {
      setToast({ text: e.message || 'Media upload error', type: 'error' });
    } finally {
      // Allow user to see 100% complete state briefly before clearing
      await new Promise((r) => setTimeout(r, 650));
      setUploadingCardId(null);
      setUploadProgress((prev) => {
        const next = { ...prev };
        delete next[cardId];
        return next;
      });
    }
  };

  // Upload handler for adding a new card directly from file picker
  const handleAddNewMediaFile = async (file: File) => {
    setUploadingNew(true);
    setUploadProgress((prev) => ({
      ...prev,
      'new-slot': { percent: 0, message: 'Starting upload...', stage: 'uploading' },
    }));

    try {
      const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|mov|m4v|ogv)$/i.test(file.name);
      const res = await uploadShowcaseMediaToCloudinary(
        file,
        ['showcase', isVideo ? 'video' : 'photo'],
        (prog) => {
          setUploadProgress((prev) => ({
            ...prev,
            'new-slot': prog,
          }));
        }
      );
      if (res.success && res.url) {
        const finalUrl = res.url;
        const isActuallyVideo = isVideo || res.resourceType === 'video';
        const newCard: ShowcaseCard = {
          id: `media-${Date.now().toString().slice(-5)}`,
          mediaType: isActuallyVideo ? 'video' : 'image',
          image: finalUrl,
          mediaUrl: finalUrl,
          videoUrl: isActuallyVideo ? finalUrl : undefined,
        };
        setConfig((prev) => ({
          ...prev,
          cards: [...prev.cards, newCard],
        }));
        setActiveIndex(config.cards.length);
        setToast({
          text: `Added new ${isActuallyVideo ? '🎬 Video Reel' : '📸 Photo'} card!`,
          type: 'success',
        });
      } else {
        const errorText = res.error || 'Media upload failed. Please try again or paste direct video URL.';
        setToast({ text: errorText, type: 'error' });
      }
    } catch (e: any) {
      setToast({ text: e.message || 'Upload failed', type: 'error' });
    } finally {
      // Allow user to see 100% complete state briefly before clearing
      await new Promise((r) => setTimeout(r, 650));
      setUploadingNew(false);
      setUploadProgress((prev) => {
        const next = { ...prev };
        delete next['new-slot'];
        return next;
      });
    }
  };

  const handleSetCustomUrl = (index: number) => {
    const raw = customUrlInput.trim();
    if (!raw) return;

    const lower = raw.toLowerCase();
    const isVideo =
      lower.endsWith('.mp4') ||
      lower.endsWith('.webm') ||
      lower.endsWith('.mov') ||
      lower.endsWith('.m4v') ||
      lower.includes('/video/') ||
      lower.includes('resource_type=video');

    setConfig((prev) => {
      const updated = [...prev.cards];
      updated[index] = {
        ...updated[index],
        mediaType: isVideo ? 'video' : updated[index].mediaType || 'image',
        image: raw,
        mediaUrl: raw,
        videoUrl: isVideo ? raw : undefined,
      };
      return { ...prev, cards: updated };
    });

    setUrlInputCardIdx(null);
    setCustomUrlInput('');
    setToast({ text: `Card #${index + 1} media URL updated!`, type: 'success' });
  };

  const handleAddCardSlot = () => {
    const newCard: ShowcaseCard = {
      id: `media-${Date.now().toString().slice(-5)}`,
      mediaType: 'image',
      image:
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792479863/sensein/products/sensein-hair-wax-1.jpg',
      mediaUrl:
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792479863/sensein/products/sensein-hair-wax-1.jpg',
    };
    setConfig((prev) => ({
      ...prev,
      cards: [...prev.cards, newCard],
    }));
    setActiveIndex(config.cards.length);
    setToast({ text: `Card #${config.cards.length + 1} added to showcase deck!`, type: 'success' });
  };

  const handleMediaTypeToggle = (index: number, type: 'image' | 'video') => {
    setConfig((prev) => {
      const updated = [...prev.cards];
      const current = updated[index];
      const url = current.mediaUrl || current.videoUrl || current.image;
      updated[index] = {
        ...current,
        mediaType: type,
        videoUrl: type === 'video' ? url : undefined,
      };
      return { ...prev, cards: updated };
    });
  };

  const handleRemoveCard = (index: number) => {
    if (config.cards.length <= 2) {
      alert('The 3D showcase deck requires at least 2 cards to display the curved carousel.');
      return;
    }
    setConfig((prev) => {
      const updated = prev.cards.filter((_, i) => i !== index);
      return { ...prev, cards: updated };
    });
    if (activeIndex >= config.cards.length - 1) {
      setActiveIndex(0);
    }
  };

  const handleMoveCard = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= config.cards.length) return;

    setConfig((prev) => {
      const updated = [...prev.cards];
      const temp = updated[index];
      updated[index] = updated[targetIdx];
      updated[targetIdx] = temp;
      return { ...prev, cards: updated };
    });
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!config.cards || config.cards.length === 0) {
      alert('Please add at least one media card.');
      return;
    }

    setSaving(true);
    try {
      const updated = await updateShowcaseConfigApi(config);
      setConfig(updated);
      setToast({
        text: '3D Video & Photo Showcase Deck published live to storefront!',
        type: 'success',
      });
    } catch (err: any) {
      console.error('Error saving showcase deck:', err);
      setToast({ text: err.message || 'Failed to save showcase', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefault = async () => {
    if (confirm('Reset 3D showcase deck back to clean photography routine?')) {
      const resetConfig: ShowcaseConfig = {
        ...DEFAULT_SHOWCASE_CONFIG,
        cards: DEFAULT_PRESET_CARDS,
      };
      setConfig(resetConfig);
      setActiveIndex(0);
      try {
        await updateShowcaseConfigApi(resetConfig);
        setToast({
          text: 'Showcase deck reset to clean photography specification!',
          type: 'success',
        });
      } catch (err: any) {
        setToast({ text: 'Reset completed.', type: 'info' });
      }
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-charcoal-muted">
        <Loader2 className="w-6 h-6 animate-spin text-plum mb-3" />
        <p className="text-xs font-semibold">Loading 3D Showcase Media Studio...</p>
      </div>
    );
  }

  const cards = config.cards && config.cards.length > 0 ? config.cards : DEFAULT_PRESET_CARDS;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Studio Header & Top Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-serif font-bold text-charcoal tracking-tight">
              3D Product Reels &amp; Photos Showcase
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-plum/10 text-plum border border-plum/20 flex items-center gap-1">
              <Film className="w-3 h-3 text-gold" />
              Reels &amp; Media Deck
            </span>
          </div>
          <p className="text-xs text-charcoal-muted mt-1">
            Upload videos and photos directly from your device to display in the curved 3D phone carousel.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetDefault}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold text-charcoal-muted hover:text-charcoal bg-white border border-border hover:bg-[#FAF7F5] transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
            title="Reset to default photography deck"
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
            onClick={() => handleSave()}
            disabled={saving}
            className="px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-white bg-plum hover:bg-plum-hover transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-gold" />
                <span>Save &amp; Publish Deck</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 1. REAL-TIME 3D WYSIWYG PREVIEW DECK (PURE VIDEOS & PHOTOS - NO TEXT OVERLAYS) */}
      <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 py-3.5 bg-[#F8F5F2] border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-plum" />
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal">
              Live 3D Fanned-Out Deck Preview
            </span>
            <span className="text-[10px] text-charcoal-muted hidden sm:inline">
              (Pure product reels &amp; photography exactly as rendered on storefront)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-border">
              <button
                type="button"
                onClick={() => setIsMobilePreview(false)}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded cursor-pointer ${
                  !isMobilePreview ? 'bg-plum text-white shadow-2xs' : 'text-charcoal-muted'
                }`}
              >
                Desktop
              </button>
              <button
                type="button"
                onClick={() => setIsMobilePreview(true)}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded cursor-pointer ${
                  isMobilePreview ? 'bg-plum text-white shadow-2xs' : 'text-charcoal-muted'
                }`}
              >
                Mobile
              </button>
            </div>
          </div>
        </div>

        {/* 3D Stage Container */}
        <div className="py-8 sm:py-12 bg-[#FAF7F5] overflow-hidden select-none relative">
          <div className="text-center mb-4">
            {config.badge && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-plum/20 bg-plum/5 text-plum text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
                <Sparkles className="w-3 h-3 text-gold fill-gold" />
                {config.badge}
              </span>
            )}
            <h3 className="font-sans text-xl sm:text-2xl font-black text-charcoal uppercase tracking-tight">
              {config.title || 'REAL PEOPLE. REAL RESULTS.'}
            </h3>
            <p className="text-xs text-charcoal-muted max-w-md mx-auto mt-1">
              {config.subtitle}
            </p>
          </div>

          {/* Interactive 3D Deck */}
          <div
            className="relative h-[380px] sm:h-[430px] flex items-center justify-center"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            style={{ perspective: '1200px' }}
          >
            {/* Left Nav */}
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 sm:left-10 z-40 w-10 h-10 rounded-full bg-white shadow-luxury border border-border flex items-center justify-center text-charcoal hover:text-plum hover:scale-110 active:scale-95 transition cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Right Nav */}
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 sm:right-10 z-40 w-10 h-10 rounded-full bg-white shadow-luxury border border-border flex items-center justify-center text-charcoal hover:text-plum hover:scale-110 active:scale-95 transition cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Fanned 3D Cards */}
            <div className="relative w-full h-full flex items-center justify-center">
              {cards.map((card, idx) => {
                const total = cards.length;
                let offset = (idx - activeIndex) % total;
                if (offset > total / 2) offset -= total;
                if (offset < -total / 2) offset += total;

                const isCenter = offset === 0;
                const spacing = isMobilePreview ? 75 : 155;
                const farSpacing = isMobilePreview ? 135 : 290;

                let translateX = 0;
                let rotate = 0;
                let scale = 1;
                let zIndex = 10;
                let opacity = 1;
                let filter = 'brightness(100%)';

                if (offset === 0) {
                  translateX = 0;
                  rotate = 0;
                  scale = isMobilePreview ? 1.0 : 1.05;
                  zIndex = 30;
                  opacity = 1;
                  filter = 'brightness(100%)';
                } else if (offset === -1) {
                  translateX = -spacing;
                  rotate = isMobilePreview ? -6 : -8;
                  scale = 0.88;
                  zIndex = 20;
                  opacity = 0.75;
                  filter = 'brightness(68%)';
                } else if (offset === 1) {
                  translateX = spacing;
                  rotate = isMobilePreview ? 6 : 8;
                  scale = 0.88;
                  zIndex = 20;
                  opacity = 0.75;
                  filter = 'brightness(68%)';
                } else if (offset === -2) {
                  translateX = -farSpacing;
                  rotate = isMobilePreview ? -12 : -15;
                  scale = 0.75;
                  zIndex = 10;
                  opacity = 0.45;
                  filter = 'brightness(45%)';
                } else if (offset === 2) {
                  translateX = farSpacing;
                  rotate = isMobilePreview ? 12 : 15;
                  scale = 0.75;
                  zIndex = 10;
                  opacity = 0.45;
                  filter = 'brightness(45%)';
                } else {
                  translateX = offset > 0 ? farSpacing + 100 : -farSpacing - 100;
                  rotate = offset > 0 ? 20 : -20;
                  scale = 0.6;
                  zIndex = 0;
                  opacity = 0;
                }

                const isVideo = isVideoMedia(card);

                return (
                  <div
                    key={card.id || idx}
                    onClick={() => !isCenter && setActiveIndex(idx)}
                    className={`absolute top-1/2 -translate-y-1/2 w-[200px] sm:w-[240px] h-[330px] sm:h-[390px] rounded-3xl overflow-hidden shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                      isCenter ? 'cursor-default ring-2 ring-plum/20' : 'cursor-pointer hover:opacity-90'
                    }`}
                    style={{
                      transform: `translate3d(calc(-50% + ${translateX}px), -50%, 0) rotate(${rotate}deg) scale(${scale})`,
                      left: '50%',
                      zIndex,
                      opacity,
                      filter,
                      boxShadow: isCenter
                        ? '0 25px 50px -12px rgba(36, 10, 20, 0.4)'
                        : '0 15px 30px -10px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    {/* Bezel frame */}
                    <div className="absolute inset-0 rounded-3xl border-[3px] border-black/80 z-20 pointer-events-none" />

                    {/* Pure Media: Video or Photo without any text overlays */}
                    {isVideo ? (
                      <video
                        src={card.videoUrl || card.mediaUrl || card.image}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover object-center"
                      />
                    ) : (
                      <img
                        src={card.mediaUrl || card.image}
                        alt="SENSEIN Showcase"
                        className="w-full h-full object-cover object-center"
                      />
                    )}

                    {/* Reel badge for video */}
                    {isVideo && (
                      <div className="absolute top-3 right-3 z-30 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20 flex items-center gap-1 text-[8px] text-white font-semibold shadow-sm pointer-events-none">
                        <Play className="w-2 h-2 fill-white text-white" />
                        <span>REEL</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {cards.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === activeIndex ? 'w-5 bg-plum' : 'w-1.5 bg-charcoal/20'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 2. DIRECT VIDEO & PHOTO CARDS (NO URL INPUTS, PURE UPLOAD WORKFLOW) */}
      <div className="p-6 bg-white border border-border rounded-2xl space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/80">
          <div>
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-plum" />
              <h4 className="text-sm font-bold uppercase tracking-wider text-charcoal">
                Showcase Reels &amp; Photos ({config.cards.length} Cards)
              </h4>
            </div>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Click below to upload videos or photos directly. No URLs or text fields needed.
            </p>
          </div>

          {/* Quick Add Media Buttons */}
          <div className="flex items-center gap-2">
            {/* Hidden file inputs */}
            <input
              ref={newVideoInputRef}
              type="file"
              accept="video/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleAddNewMediaFile(file);
                if (newVideoInputRef.current) newVideoInputRef.current.value = '';
              }}
              className="hidden"
            />
            <input
              ref={newPhotoInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleAddNewMediaFile(file);
                if (newPhotoInputRef.current) newPhotoInputRef.current.value = '';
              }}
              className="hidden"
            />

            <button
              type="button"
              onClick={handleAddCardSlot}
              className="px-4 py-2 bg-stone-900 text-white hover:bg-black rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-gold" />
              <span>+ Add Card Slot</span>
            </button>

            <button
              type="button"
              onClick={() => newVideoInputRef.current?.click()}
              disabled={uploadingNew}
              className="px-4 py-2 bg-plum text-white hover:bg-plum-hover rounded-lg text-xs font-bold flex items-center gap-2 transition shadow-sm cursor-pointer disabled:opacity-50"
            >
              {uploadingNew ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
              ) : (
                <Video className="w-3.5 h-3.5 text-gold" />
              )}
              <span>+ Upload Video Reel</span>
            </button>

            <button
              type="button"
              onClick={() => newPhotoInputRef.current?.click()}
              disabled={uploadingNew}
              className="px-4 py-2 bg-[#FAF7F5] hover:bg-plum/10 text-charcoal hover:text-plum border border-border hover:border-plum/30 rounded-lg text-xs font-bold flex items-center gap-2 transition shadow-2xs cursor-pointer disabled:opacity-50"
            >
              {uploadingNew ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-charcoal" />
              ) : (
                <ImageIcon className="w-3.5 h-3.5 text-plum" />
              )}
              <span>+ Upload Photo</span>
            </button>
          </div>
          {uploadProgress['new-slot'] && (
            <div className="w-full mt-2 p-2.5 bg-white rounded-lg border border-plum/30 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-plum">
                <span className="flex items-center gap-1.5 truncate">
                  {uploadProgress['new-slot'].percent === 100 ? (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <UploadCloud className="w-3.5 h-3.5 animate-bounce text-plum shrink-0" />
                  )}
                  <span>{uploadProgress['new-slot'].message}</span>
                </span>
                <span className="font-mono text-xs font-bold shrink-0 ml-2">{uploadProgress['new-slot'].percent}%</span>
              </div>
              <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden shadow-inner">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    uploadProgress['new-slot'].percent === 100 ? 'bg-emerald-600' : 'bg-gradient-to-r from-plum to-purple-600'
                  }`}
                  style={{ width: `${uploadProgress['new-slot'].percent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Cards List */}
        <div className="space-y-3">
          {config.cards.map((card, idx) => {
            const isVideo = isVideoMedia(card);
            const cardId = card.id || `${idx}`;
            const isUploading = uploadingCardId === cardId;

            return (
              <div
                key={card.id || idx}
                className="p-4 rounded-xl border border-border bg-[#FAF7F5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-plum/30 hover:shadow-2xs"
              >
                {/* Media Preview Thumbnail */}
                <div className="flex items-center gap-3.5">
                  <div className="relative w-20 h-28 rounded-xl overflow-hidden border border-border bg-neutral-900 flex-shrink-0 group shadow-2xs">
                    {isVideo ? (
                      <video
                        src={card.videoUrl || card.mediaUrl || card.image}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={card.mediaUrl || card.image}
                        alt="Showcase Media"
                        className="w-full h-full object-cover"
                      />
                    )}

                    {/* Reel / Photo Overlay Tag */}
                    <div className="absolute top-1.5 left-1.5 z-10">
                      {isVideo ? (
                        <span className="bg-black/80 text-white text-[8px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-sm">
                          <Video className="w-2.5 h-2.5 text-gold" />
                          REEL
                        </span>
                      ) : (
                        <span className="bg-black/80 text-white text-[8px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-sm">
                          <ImageIcon className="w-2.5 h-2.5 text-gold" />
                          PHOTO
                        </span>
                      )}
                    </div>

                    {/* Quick Replace File On Click */}
                    <label
                      title="Click to replace media file"
                      className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition text-white text-[9px] font-bold gap-1 text-center p-1"
                    >
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleCardMediaUpload(idx, file);
                        }}
                        className="hidden"
                        disabled={isUploading}
                      />
                      {isUploading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin text-white" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-5 h-5 text-gold" />
                          <span>Replace</span>
                        </>
                      )}
                    </label>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-xs font-mono font-bold text-plum bg-plum/10 px-2 py-0.5 rounded inline-block">
                      Card #{idx + 1}
                    </span>

                    {/* Media Type Switcher */}
                    <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-border">
                      <button
                        type="button"
                        onClick={() => handleMediaTypeToggle(idx, 'image')}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded flex items-center gap-1 cursor-pointer transition ${
                          !isVideo ? 'bg-plum text-white shadow-2xs' : 'text-charcoal-muted hover:text-charcoal'
                        }`}
                      >
                        <ImageIcon className="w-3 h-3" />
                        <span>Photo</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMediaTypeToggle(idx, 'video')}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded flex items-center gap-1 cursor-pointer transition ${
                          isVideo ? 'bg-plum text-white shadow-2xs' : 'text-charcoal-muted hover:text-charcoal'
                        }`}
                      >
                        <Video className="w-3 h-3" />
                        <span>Video Reel</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Clean Media Status & Direct Replace File Button */}
                <div className="flex-1 w-full bg-white p-3.5 rounded-xl border border-border flex flex-col justify-between gap-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-charcoal">
                          {isVideo ? '🎬 Product Video Reel' : '📸 High-Res Studio Photo'}
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Cloudinary CDN Active
                        </span>
                      </div>
                      <p className="text-[11px] text-charcoal-muted">
                        {isVideo
                          ? 'Plays as an autoplaying loop video reel in the 3D deck.'
                          : 'Displays as a crisp high-definition photography slide in the 3D deck.'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Paste Direct Video Link Button */}
                      <button
                        type="button"
                        onClick={() => {
                          if (urlInputCardIdx === idx) {
                            setUrlInputCardIdx(null);
                          } else {
                            setUrlInputCardIdx(idx);
                            setCustomUrlInput(card.videoUrl || card.mediaUrl || card.image || '');
                          }
                        }}
                        className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition border cursor-pointer ${
                          urlInputCardIdx === idx
                            ? 'bg-plum text-white border-plum shadow-2xs'
                            : 'bg-white hover:bg-neutral-50 text-charcoal-muted hover:text-charcoal border-border'
                        }`}
                        title="Paste direct video URL or Cloudinary link"
                      >
                        <LinkIcon className="w-3.5 h-3.5" />
                        <span>{urlInputCardIdx === idx ? 'Close Link' : 'Paste Link'}</span>
                      </button>

                      {/* Direct File Replace Button */}
                      <label
                        className="px-3.5 py-2 bg-[#FAF7F5] hover:bg-plum/10 text-charcoal hover:text-plum border border-border hover:border-plum/30 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs flex-shrink-0"
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-plum" />
                            <span>
                              {uploadProgress[cardId]?.percent !== undefined
                                ? uploadProgress[cardId].percent === 100
                                  ? '100%'
                                  : `${uploadProgress[cardId].percent}%`
                                : 'Uploading...'}
                            </span>
                          </>
                        ) : (
                          <>
                            <UploadCloud className="w-3.5 h-3.5 text-plum" />
                            <span>Replace {isVideo ? 'Video' : 'Photo'}</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*,video/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleCardMediaUpload(idx, file);
                          }}
                          className="hidden"
                          disabled={isUploading}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Real-time Upload Progress Bar for Large Videos */}
                  {uploadProgress[cardId] && (
                    <div className="w-full pt-1 pb-1 space-y-1.5 bg-[#FAF7F5] p-2.5 rounded-lg border border-plum/20">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-plum">
                        <span className="flex items-center gap-1.5 truncate">
                          {uploadProgress[cardId].percent === 100 ? (
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          ) : uploadProgress[cardId].stage === 'compressing' ? (
                            <Zap className="w-3.5 h-3.5 text-amber-500 animate-pulse shrink-0" />
                          ) : (
                            <UploadCloud className="w-3.5 h-3.5 text-plum animate-bounce shrink-0" />
                          )}
                          <span className="truncate">{uploadProgress[cardId].message}</span>
                        </span>
                        <span className="font-mono text-xs ml-2 shrink-0 font-bold">{uploadProgress[cardId].percent}%</span>
                      </div>
                      <div className="w-full h-2 bg-neutral-200/80 rounded-full overflow-hidden shadow-inner">
                        <div
                          className={`h-full transition-all duration-300 rounded-full ${
                            uploadProgress[cardId].percent === 100
                              ? 'bg-emerald-600'
                              : 'bg-gradient-to-r from-plum to-purple-600'
                          }`}
                          style={{ width: `${uploadProgress[cardId].percent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Expandable Direct URL Input */}
                  {urlInputCardIdx === idx && (
                    <div className="w-full pt-2 border-t border-dashed border-border/80 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="url"
                          placeholder="Paste direct video URL (e.g., https://.../video.mp4 or Cloudinary link)"
                          value={customUrlInput}
                          onChange={(e) => setCustomUrlInput(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-[#FAF7F5] border border-border rounded-lg text-charcoal focus:outline-none focus:border-plum focus:ring-1 focus:ring-plum font-mono"
                        />
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleSetCustomUrl(idx)}
                          className="px-3 py-2 bg-plum text-white text-xs font-bold rounded-lg hover:bg-plum-hover transition shadow-2xs flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Set URL</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setUrlInputCardIdx(null)}
                          className="px-2.5 py-2 text-xs text-charcoal-muted hover:text-charcoal bg-white border border-border rounded-lg"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Move & Delete Actions */}
                <div className="flex items-center gap-1 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleMoveCard(idx, 'up')}
                    disabled={idx === 0}
                    className="p-2 text-charcoal-muted hover:text-charcoal bg-white border border-border rounded-lg disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition shadow-2xs"
                    title="Move Card Left / Earlier"
                  >
                    <MoveUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveCard(idx, 'down')}
                    disabled={idx === config.cards.length - 1}
                    className="p-2 text-charcoal-muted hover:text-charcoal bg-white border border-border rounded-lg disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition shadow-2xs"
                    title="Move Card Right / Later"
                  >
                    <MoveDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveCard(idx)}
                    className="p-2 text-charcoal-muted hover:text-red-600 bg-white border border-border rounded-lg hover:bg-red-50 cursor-pointer transition shadow-2xs"
                    title="Remove Card from Deck"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Add Another Card Slot */}
          <button
            type="button"
            onClick={handleAddCardSlot}
            className="w-full py-3.5 border-2 border-dashed border-border hover:border-plum/40 hover:bg-plum/5 rounded-xl text-xs font-bold text-charcoal hover:text-plum flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Plus className="w-4 h-4 text-plum" />
            <span>+ Add Another Showcase Card (Slot #{config.cards.length + 1})</span>
          </button>
        </div>
      </div>

      {/* 3. SECTION HEADINGS & ROTATION CONTROLS */}
      <div className="p-6 bg-white border border-border rounded-2xl space-y-4 shadow-xs">
        <div className="flex items-center gap-2 border-b border-border/80 pb-3">
          <Type className="w-4 h-4 text-plum" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal">
            Section Headings &amp; Carousel Timing
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
              Top Badge Text
            </label>
            <input
              type="text"
              value={config.badge}
              onChange={(e) => setConfig((prev) => ({ ...prev, badge: e.target.value }))}
              placeholder="e.g. REAL PEOPLE REAL RESULTS"
              className="w-full px-3 py-2 bg-white border border-border rounded-lg text-xs text-charcoal focus:outline-none focus:border-plum"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
              Section Title
            </label>
            <input
              type="text"
              value={config.title}
              onChange={(e) => setConfig((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. REAL PEOPLE. REAL RESULTS."
              className="w-full px-3 py-2 bg-white border border-border rounded-lg text-xs font-semibold text-charcoal focus:outline-none focus:border-plum"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
              Section Subtitle
            </label>
            <input
              type="text"
              value={config.subtitle}
              onChange={(e) => setConfig((prev) => ({ ...prev, subtitle: e.target.value }))}
              placeholder="e.g. Experience salon-grade transformations..."
              className="w-full px-3 py-2 bg-white border border-border rounded-lg text-xs text-charcoal focus:outline-none focus:border-plum"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-charcoal">
            <input
              type="checkbox"
              checked={config.autoRotate !== false}
              onChange={(e) => setConfig((prev) => ({ ...prev, autoRotate: e.target.checked }))}
              className="w-4 h-4 accent-plum rounded"
            />
            <span>Auto-rotate cards every {(config.rotationIntervalMs || 2500) / 1000} seconds</span>
          </label>

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving}
            className="px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-white bg-plum hover:bg-plum-hover transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Saving to Storefront...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-gold" />
                <span>Save &amp; Publish Deck</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
