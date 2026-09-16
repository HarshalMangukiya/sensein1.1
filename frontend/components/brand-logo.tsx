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
  className?: string;
  imgClassName?: string;
  href?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function BrandLogo({
  variant = 'dark',
  className = '',
  imgClassName = '',
  href = '/',
  width = 170,
  height = 52,
  priority = false,
}: BrandLogoProps) {
  const src =
    variant === 'light'
      ? '/images/sensein-logo-white.png'
      : '/images/sensein-logo-dark.png';

  const logoImage = (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <Image
        src={src}
        alt="SENSEIN® PROFESSIONAL"
        width={width}
        height={height}
        priority={priority}
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
