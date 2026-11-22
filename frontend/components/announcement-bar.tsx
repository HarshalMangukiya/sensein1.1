'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  AnnouncementBarConfig,
  DEFAULT_ANNOUNCEMENT_CONFIG,
  fetchAnnouncementBarConfig,
  getAnnouncementBarFromStorage,
} from '@/lib/api';

export function AnnouncementBar() {
  const [config, setConfig] = useState<AnnouncementBarConfig>(DEFAULT_ANNOUNCEMENT_CONFIG);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const cached = getAnnouncementBarFromStorage();
    if (cached) setConfig(cached);

    fetchAnnouncementBarConfig().then((fresh) => {
      if (fresh) setConfig(fresh);
    });

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<AnnouncementBarConfig>;
      if (customEvent.detail) {
        setConfig(customEvent.detail);
      }
    };

    window.addEventListener('sensein-announcements-updated', handleUpdate);
    return () => {
      window.removeEventListener('sensein-announcements-updated', handleUpdate);
    };
  }, []);

  if (mounted && config.isActive === false) {
    return null;
  }

  const items = config.items && config.items.length > 0 ? config.items : DEFAULT_ANNOUNCEMENT_CONFIG.items;
  const separator = config.separator || '✦';
  const duration = config.speedSeconds ? `${config.speedSeconds}s` : '30s';
  const bgColor = config.backgroundColor || '#432542';
  const textColor = config.textColor || '#FFFFFF';

  // Render a repetition chunk for infinite seamless ticker loop
  const renderChunk = (prefix: string) => (
    <div className="flex items-center flex-shrink-0">
      {items.map((item, idx) => (
        <React.Fragment key={`${prefix}-${item.id || idx}`}>
          {item.link ? (
            <Link
              href={item.link}
              className="hover:underline transition-opacity hover:opacity-90 flex items-center"
            >
              <span
                className={`text-[11px] uppercase tracking-[0.16em] font-medium whitespace-nowrap px-4 ${
                  item.isTag
                    ? 'border border-gold/40 bg-gold/15 text-gold-light rounded px-2 py-0.5 mx-1 font-semibold'
                    : ''
                }`}
                style={{ color: item.isTag ? undefined : textColor }}
              >
                {item.text}
              </span>
            </Link>
          ) : (
            <span
              className={`text-[11px] uppercase tracking-[0.16em] font-medium whitespace-nowrap px-4 ${
                item.isTag
                  ? 'border border-gold/40 bg-gold/15 text-gold-light rounded px-2 py-0.5 mx-1 font-semibold'
                  : ''
              }`}
              style={{ color: item.isTag ? undefined : textColor }}
            >
              {item.text}
            </span>
          )}
          <span className="text-gold text-[11px] font-bold select-none px-1" aria-hidden="true">
            {separator}
          </span>
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div
      className="text-white py-2.5 overflow-hidden border-b border-[#311730] select-none relative z-50 transition-colors"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className="flex w-max animate-ticker-right hover:[animation-play-state:paused]"
        style={{ animationDuration: duration }}
      >
        {renderChunk('rep1')}
        {renderChunk('rep2')}
        {renderChunk('rep3')}
      </div>
    </div>
  );
}
