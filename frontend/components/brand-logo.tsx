'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface BrandLogoProps {
  /**
   * 'dark' for light backgrounds (e.g. Header, Auth Modal, Checkout)
   * 'light' for dark backgrounds (e.g. Footer)
   */
  variant?: 'dark' | 'light';
  src?: string;
  className?: string;
  imgClassName?: string;
  href?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  unoptimized?: boolean;
  quality?: number;
}

export function BrandLogo({
  variant = 'dark',
  src,
  className = '',
  imgClassName = '',
  href = '/',
  width = 170,
  height = 52,
  priority = false,
  unoptimized = true,
  quality = 100,
}: BrandLogoProps) {
  const logoSrc =
    src ||
    (variant === 'light'
      ? '/images/sensein-logo-white.png'
      : '/images/sensein-logo-dark.png');

  const logoImage = (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <Image
        src={logoSrc}
        alt="SENSEIN®"
        width={width}
        height={height}
        priority={priority}
        unoptimized={unoptimized}
        quality={quality}
        className={`object-contain transition-opacity duration-300 ${imgClassName}`}
      />
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="inline-flex items-center justify-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-plum rounded-sm"
        aria-label="SENSEIN PROFESSIONAL Home"
      >
        <span className="group-hover:opacity-85 transition-opacity">
          {logoImage}
        </span>
      </Link>
    );
  }

  return logoImage;
}
