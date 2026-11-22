'use client';

import React, { useState, useEffect } from 'react';
import {
  Megaphone,
  Save,
  RotateCcw,
  ExternalLink,
  Trash2,
  MoveUp,
  MoveDown,
  Plus,
  Loader2,
  CheckCircle2,
  Sliders,
  Sparkles,
  Palette,
  Eye,
  Link as LinkIcon,
  Tag,
  AlertCircle,
} from 'lucide-react';
import {
  AnnouncementBarConfig,
  AnnouncementItem,
  DEFAULT_ANNOUNCEMENT_CONFIG,
  fetchAnnouncementBarConfig,
  updateAnnouncementBarConfigApi,
} from '@/lib/api';

interface AdminAnnouncementEditorProps {
  setToast: (toast: { text: string; type: 'success' | 'error' | 'info' }) => void;
}

const PRESET_MESSAGES = [
  { text: 'FIRST ORDER', isTag: true, link: '' },
  { text: 'COMPLIMENTARY LUXURY TRAVEL SERUM ON ORDERS ABOVE ₹1,999', isTag: false, link: '' },
  { text: '🌿 100% CLEAN FORMULATION DERMATOLOGICALLY TESTED FREE PAN-INDIA SHIPPING', isTag: false, link: '' },
  { text: '⚡ USE CODE: LUXE10 FOR EXTRA PRIVILEGE DISCOUNT', isTag: false, link: '' },
  { text: '🧪 LIVE PAYMENT VERIFICATION: ₹1 TEST ITEM AVAILABLE IN CATALOG', isTag: false, link: '/shop' },
  { text: 'PARISIAN BOTANICAL CELLULAR HAIR ARCHITECTURE', isTag: false, link: '' },
  { text: '✨ PAN-INDIA EXPRESS DISPATCH ON ORDERS ABOVE ₹499', isTag: false, link: '' },
  { text: '💎 EXCLUSIVE SALON PRO FORMULAS CRAFTED IN PARIS', isTag: false, link: '' },
];

const PRESET_COLORS = [
  { name: 'Sensein Plum', bg: '#432542', text: '#FFFFFF' },
  { name: 'Deep Charcoal', bg: '#1F1A24', text: '#FFFFFF' },
  { name: 'Midnight Onyx', bg: '#111111', text: '#FAF7F5' },
  { name: 'Rich Burgundy', bg: '#4A1525', text: '#FFFFFF' },
  { name: 'Gold Noir', bg: '#2B231A', text: '#F4DFC8' },
  { name: 'Emerald Velvet', bg: '#143324', text: '#FFFFFF' },
];

const SEPARATOR_PRESETS = ['✦', '•', '★', '❖', '|', '◈', '—'];

export function AdminAnnouncementEditor({ setToast }: AdminAnnouncementEditorProps) {
  const [config, setConfig] = useState<AnnouncementBarConfig>(DEFAULT_ANNOUNCEMENT_CONFIG);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchAnnouncementBarConfig()
      .then((data) => {
        if (data) {
          setConfig(data);
        }
      })
      .catch((err) => {
        console.warn('Error fetching announcement bar config:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleUpdateField = <K extends keyof AnnouncementBarConfig>(
    field: K,
    value: AnnouncementBarConfig[K]
  ) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
    setHasChanges(true);
  };

  const handleUpdateItem = (index: number, updates: Partial<AnnouncementItem>) => {
    setConfig((prev) => {
      const nextItems = [...prev.items];
      nextItems[index] = { ...nextItems[index], ...updates };
      return { ...prev, items: nextItems };
    });
    setHasChanges(true);
  };

  const handleAddItem = (preset?: { text: string; isTag?: boolean; link?: string }) => {
    const newItem: AnnouncementItem = {
      id: `ticker-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      text: preset ? preset.text : 'NEW ANNOUNCEMENT MESSAGE',
      isTag: preset ? !!preset.isTag : false,
      link: preset ? preset.link || '' : '',
    };
    setConfig((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
    setHasChanges(true);
  };

  const handleRemoveItem = (index: number) => {
    if (config.items.length <= 1) {
      setToast({
        text: 'At least one announcement message is required.',
        type: 'error',
      });
      return;
    }
    setConfig((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
    setHasChanges(true);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setConfig((prev) => {
      const nextItems = [...prev.items];
      const temp = nextItems[index];
      nextItems[index] = nextItems[index - 1];
      nextItems[index - 1] = temp;
      return { ...prev, items: nextItems };
    });
    setHasChanges(true);
  };

  const handleMoveDown = (index: number) => {
    if (index === config.items.length - 1) return;
    setConfig((prev) => {
      const nextItems = [...prev.items];
      const temp = nextItems[index];
      nextItems[index] = nextItems[index + 1];
      nextItems[index + 1] = temp;
      return { ...prev, items: nextItems };
    });
    setHasChanges(true);
  };

  const handleResetToDefaults = () => {
    if (confirm('Reset Announcement Ticker Bar to brand default messages and styling?')) {
      setConfig({ ...DEFAULT_ANNOUNCEMENT_CONFIG });
      setHasChanges(true);
      setToast({
        text: 'Reset to brand default announcement bar configuration.',
        type: 'info',
      });
    }
  };

  const handleSave = async () => {
    // Validate
    if (!config.items || config.items.length === 0) {
      setToast({
        text: 'Please add at least one announcement message before saving.',
        type: 'error',
      });
      return;
    }

    const emptyItem = config.items.find((item) => !item.text.trim());
    if (emptyItem) {
      setToast({
        text: 'Announcement text cannot be empty. Please fill in all message fields.',
        type: 'error',
      });
      return;
    }

    setIsSaving(true);
    try {
      const saved = await updateAnnouncementBarConfigApi(config);
      setConfig(saved);
      setHasChanges(false);
      setToast({
        text: 'Announcement bar updated & published live across your storefront!',
        type: 'success',
      });
    } catch (err: any) {
      setToast({
        text: `Failed to save announcement bar: ${err.message || 'Network error'}`,
        type: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-border">
        <Loader2 className="w-8 h-8 text-plum animate-spin mb-3" />
        <p className="text-sm font-medium text-charcoal-muted">Loading Announcement Bar studio...</p>
      </div>
    );
  }

  const items = config.items || [];
  const separator = config.separator || '✦';
  const bgColor = config.backgroundColor || '#432542';
  const textColor = config.textColor || '#FFFFFF';
  const speedSeconds = config.speedSeconds || 30;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-border shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-plum/10 text-plum">
              <Megaphone className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold tracking-widest text-plum uppercase">
              STOREFRONT HEADER STUDIO
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Synced
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-charcoal">
            Announcement Ticker Bar
          </h2>
          <p className="text-sm text-charcoal-muted mt-0.5">
            Customize the scrolling announcement messages displayed at the very top of your storefront.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetToDefaults}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-stone-50 hover:bg-stone-100 text-charcoal font-medium text-sm transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-charcoal-muted" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-white hover:bg-stone-50 text-charcoal font-medium text-sm transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-charcoal-muted" />
            <span className="hidden sm:inline">View Store</span>
          </a>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white shadow-sm transition-all ${
              hasChanges
                ? 'bg-plum hover:bg-plum-light shadow-plum/20 ring-2 ring-plum/20'
                : 'bg-plum hover:bg-plum-light'
            } disabled:opacity-50`}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save &amp; Publish</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* REAL-TIME STOREFRONT LIVE PREVIEW */}
      <div className="bg-white p-6 rounded-3xl border border-border shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border mb-4 gap-2">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-plum" />
            <h3 className="font-bold text-sm tracking-wide uppercase text-charcoal">
              Live Storefront Ticker Preview
            </h3>
            <span className="text-[11px] text-charcoal-muted font-normal">
              (Interactive live rendering of what visitors see)
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span
              className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                config.isActive
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              {config.isActive ? 'Active on Storefront' : 'Currently Hidden'}
            </span>
            <span className="text-charcoal-muted font-mono text-[11px]">
              {items.length} Messages • {speedSeconds}s cycle
            </span>
          </div>
        </div>

        {/* Live Simulation Box */}
        <div className="rounded-2xl overflow-hidden border border-border shadow-inner bg-stone-100">
          <div className="bg-stone-200/60 px-4 py-2 border-b border-stone-200 flex items-center justify-between text-xs text-stone-500 font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
              <span className="ml-2 text-[11px] text-stone-600 font-sans font-medium">
                Storefront Header • Ticker Bar
              </span>
            </div>
            <span className="text-[10px] hidden sm:inline">
              Hover over ticker to pause
            </span>
          </div>

          {/* Actual Ticker Component inside Simulation */}
          <div
            className="py-2.5 overflow-hidden select-none transition-colors border-b border-black/10"
            style={{ backgroundColor: bgColor }}
          >
            <div
              className="flex w-max animate-ticker-right hover:[animation-play-state:paused]"
              style={{ animationDuration: `${speedSeconds}s` }}
            >
              {[1, 2, 3].map((rep) => (
                <div key={`preview-rep-${rep}`} className="flex items-center flex-shrink-0">
                  {items.map((item, idx) => (
                    <React.Fragment key={`prev-${rep}-${item.id || idx}`}>
                      <span
                        className={`text-[11px] uppercase tracking-[0.16em] font-medium whitespace-nowrap px-4 ${
                          item.isTag
                            ? 'border border-gold/40 bg-gold/15 text-gold-light rounded px-2 py-0.5 mx-1 font-semibold'
                            : ''
                        }`}
                        style={{ color: item.isTag ? undefined : textColor }}
                      >
                        {item.text || 'Untitled Message'}
                      </span>
                      <span
                        className="text-gold text-[11px] font-bold select-none px-1"
                        aria-hidden="true"
                      >
                        {separator}
                      </span>
                    </React.Fragment>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-white text-xs text-charcoal-muted flex items-center justify-between">
            <span>
              Store Navigation Bar renders immediately beneath this ticker.
            </span>
            <span className="font-mono text-[11px] text-plum font-semibold">
              Background: {bgColor}
            </span>
          </div>
        </div>
      </div>

      {/* SETTINGS GRID: CONTROLS & APPEARANCE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CARD 1: VISIBILITY & SPEED */}
        <div className="bg-white p-6 rounded-3xl border border-border shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <Sliders className="w-4 h-4 text-plum" />
            <h3 className="font-bold text-sm tracking-wide uppercase text-charcoal">
              Display &amp; Speed
            </h3>
          </div>

          {/* Active Switch */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 border border-border">
            <div>
              <p className="text-sm font-semibold text-charcoal">Enable Ticker Bar</p>
              <p className="text-xs text-charcoal-muted">
                Display the announcement bar at top of website
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.isActive}
                onChange={(e) => handleUpdateField('isActive', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-plum"></div>
            </label>
          </div>

          {/* Speed Presets */}
          <div>
            <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-2">
              Scrolling Speed: {speedSeconds}s
            </label>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {[
                { label: 'Fast', sec: 18 },
                { label: 'Normal', sec: 30 },
                { label: 'Relaxed', sec: 45 },
                { label: 'Slow', sec: 60 },
              ].map((p) => (
                <button
                  key={p.sec}
                  type="button"
                  onClick={() => handleUpdateField('speedSeconds', p.sec)}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-semibold transition-all border ${
                    speedSeconds === p.sec
                      ? 'bg-plum text-white border-plum shadow-sm'
                      : 'bg-stone-50 hover:bg-stone-100 text-charcoal border-border'
                  }`}
                >
                  <div>{p.label}</div>
                  <div className="text-[10px] font-mono opacity-80">{p.sec}s</div>
                </button>
              ))}
            </div>
            <input
              type="range"
              min={12}
              max={90}
              step={2}
              value={speedSeconds}
              onChange={(e) => handleUpdateField('speedSeconds', parseInt(e.target.value) || 30)}
              className="w-full accent-plum cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-charcoal-muted mt-1">
              <span>Faster (12s)</span>
              <span>Default (30s)</span>
              <span>Slower (90s)</span>
            </div>
          </div>
        </div>

        {/* CARD 2: COLORS & SEPARATOR */}
        <div className="bg-white p-6 rounded-3xl border border-border shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <Palette className="w-4 h-4 text-plum" />
            <h3 className="font-bold text-sm tracking-wide uppercase text-charcoal">
              Color &amp; Separator
            </h3>
          </div>

          {/* Color Presets */}
          <div>
            <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-2">
              Background Color
            </label>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {PRESET_COLORS.map((col) => (
                <button
                  key={col.bg}
                  type="button"
                  onClick={() => {
                    handleUpdateField('backgroundColor', col.bg);
                    handleUpdateField('textColor', col.text);
                  }}
                  className={`p-2 rounded-xl text-left border flex items-center gap-2 transition-all ${
                    bgColor.toLowerCase() === col.bg.toLowerCase()
                      ? 'ring-2 ring-plum border-transparent shadow-sm'
                      : 'border-border hover:border-plum/40'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-black/20 flex-shrink-0"
                    style={{ backgroundColor: col.bg }}
                  ></span>
                  <span className="text-[11px] font-medium text-charcoal truncate">
                    {col.name}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => handleUpdateField('backgroundColor', e.target.value)}
                className="w-9 h-9 rounded-xl border border-border cursor-pointer p-0.5 bg-white"
              />
              <input
                type="text"
                value={bgColor}
                onChange={(e) => handleUpdateField('backgroundColor', e.target.value)}
                placeholder="#432542"
                className="flex-1 px-3 py-2 rounded-xl border border-border text-xs font-mono text-charcoal uppercase"
              />
            </div>
          </div>

          {/* Separator Symbol */}
          <div>
            <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-2">
              Divider / Separator Symbol
            </label>
            <div className="flex items-center gap-2">
              {SEPARATOR_PRESETS.map((sym) => (
                <button
                  key={sym}
                  type="button"
                  onClick={() => handleUpdateField('separator', sym)}
                  className={`w-8 h-8 rounded-xl font-bold text-sm flex items-center justify-center transition-all border ${
                    separator === sym
                      ? 'bg-plum text-gold border-plum shadow-sm'
                      : 'bg-stone-50 hover:bg-stone-100 text-charcoal border-border'
                  }`}
                >
                  {sym}
                </button>
              ))}
              <input
                type="text"
                maxLength={4}
                value={separator}
                onChange={(e) => handleUpdateField('separator', e.target.value)}
                className="w-12 h-8 text-center rounded-xl border border-border text-xs font-mono font-bold text-plum"
              />
            </div>
          </div>
        </div>

        {/* CARD 3: QUICK INSPIRATIONS & PRESETS */}
        <div className="bg-white p-6 rounded-3xl border border-border shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <Sparkles className="w-4 h-4 text-gold" />
            <h3 className="font-bold text-sm tracking-wide uppercase text-charcoal">
              Quick Add Presets
            </h3>
          </div>

          <p className="text-xs text-charcoal-muted leading-relaxed">
            Click any luxury marketing preset below to instantly add it to your announcement bar:
          </p>

          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {PRESET_MESSAGES.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAddItem(preset)}
                className="w-full text-left p-2.5 rounded-xl border border-border/80 bg-stone-50/70 hover:bg-plum/5 hover:border-plum/30 transition-all text-xs text-charcoal flex items-center justify-between group"
              >
                <span className="truncate pr-2 font-medium">
                  {preset.isTag && (
                    <span className="mr-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-gold/20 text-gold-dark border border-gold/40">
                      TAG
                    </span>
                  )}
                  {preset.text}
                </span>
                <Plus className="w-3.5 h-3.5 text-charcoal-muted group-hover:text-plum flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ANNOUNCEMENT ITEMS MANAGER CARD */}
      <div className="bg-white p-6 rounded-3xl border border-border shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
          <div>
            <h3 className="font-bold text-base text-charcoal flex items-center gap-2">
              <span>Announcement Messages</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-plum/10 text-plum">
                {items.length} items
              </span>
            </h3>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Edit the exact text, reorder, or add highlighted tags. These texts loop seamlessly.
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleAddItem()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-plum hover:bg-plum-light text-white text-xs font-bold shadow-sm transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Message</span>
          </button>
        </div>

        {/* Message Items List */}
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={item.id || index}
              className="p-4 rounded-2xl border border-border bg-[#FAF7F5] hover:border-plum/30 transition-all space-y-3"
            >
              {/* Row Header */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-white border border-border font-mono font-bold text-charcoal flex items-center justify-center text-[11px]">
                    {index + 1}
                  </span>
                  <span className="font-semibold text-charcoal">
                    Message #{index + 1}
                  </span>
                  {item.isTag && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gold/20 text-gold-dark border border-gold/40">
                      Highlighted Tag
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className="p-1.5 rounded-lg border border-border bg-white hover:bg-stone-100 disabled:opacity-30 text-charcoal transition-colors"
                    title="Move Up"
                  >
                    <MoveUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === items.length - 1}
                    className="p-1.5 rounded-lg border border-border bg-white hover:bg-stone-100 disabled:opacity-30 text-charcoal transition-colors"
                    title="Move Down"
                  >
                    <MoveDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    disabled={items.length <= 1}
                    className="p-1.5 rounded-lg border border-red-200 bg-white hover:bg-red-50 text-red-600 disabled:opacity-30 transition-colors ml-1"
                    title="Delete Message"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Main Text Input */}
              <div>
                <label className="block text-[11px] font-bold text-charcoal uppercase tracking-wider mb-1">
                  Announcement Text
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) => handleUpdateItem(index, { text: e.target.value })}
                    placeholder="e.g. ⚡ USE CODE: LUXE10 FOR EXTRA PRIVILEGE DISCOUNT"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-white text-sm font-medium text-charcoal focus:outline-none focus:ring-2 focus:ring-plum/20 focus:border-plum transition-all"
                  />
                </div>
              </div>

              {/* Options: Highlight Tag & Link */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {/* Highlight Tag Checkbox */}
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-border">
                  <input
                    type="checkbox"
                    id={`tag-${item.id || index}`}
                    checked={!!item.isTag}
                    onChange={(e) => handleUpdateItem(index, { isTag: e.target.checked })}
                    className="w-4 h-4 rounded text-plum focus:ring-plum accent-plum cursor-pointer"
                  />
                  <label
                    htmlFor={`tag-${item.id || index}`}
                    className="text-xs text-charcoal cursor-pointer select-none flex items-center gap-1.5 font-medium"
                  >
                    <Tag className="w-3.5 h-3.5 text-gold" />
                    <span>Display as Highlight Badge (Gold Border)</span>
                  </label>
                </div>

                {/* Optional Link */}
                <div className="flex items-center gap-2 p-1.5 px-3 rounded-xl bg-white border border-border">
                  <LinkIcon className="w-3.5 h-3.5 text-charcoal-muted flex-shrink-0" />
                  <input
                    type="text"
                    value={item.link || ''}
                    onChange={(e) => handleUpdateItem(index, { link: e.target.value })}
                    placeholder="Optional Link (e.g. /shop or /collections)"
                    className="w-full bg-transparent text-xs text-charcoal focus:outline-none placeholder:text-stone-400"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Add & Save Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
          <button
            type="button"
            onClick={() => handleAddItem()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-dashed border-plum/40 hover:border-plum bg-plum/5 hover:bg-plum/10 text-plum font-semibold text-xs transition-colors w-full sm:w-auto justify-center"
          >
            <Plus className="w-4 h-4" />
            <span>Add Another Announcement</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm text-white bg-plum hover:bg-plum-light shadow-md shadow-plum/20 disabled:opacity-50 transition-all w-full sm:w-auto justify-center"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Publishing to Storefront...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Save &amp; Publish Announcement Bar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
