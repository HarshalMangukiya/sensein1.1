'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Heart, Plus, Minus, Check, ShoppingBag, Sparkles } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { useFlyToCart } from '@/components/fly-to-cart';

export interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    subtitle?: string;
    category: string;
    curatedCollection?: string;
    price: number;
    mrp: number;
    discountPercentage?: number;
    netVolume?: string;
    rating: number;
    reviewCount: number;
    images: string[];
    badges?: string[];
  };
  layout?: 'grid' | 'list';
}

export function ProductCard({ product, layout = 'grid' }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { items, addItem, updateQuantity, openCart } = useCartStore();
  const { flyToCart } = useFlyToCart();

  const cartItem = items.find((item) => item.id === product.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const productImage = product.images[0] || 'https://res.cloudinary.com/dqddawu42/image/upload/v1789820271/sensein/products/mask-1.jpg';
    flyToCart(e, productImage);
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      mrp: product.mrp,
      size: product.netVolume || '250ml',
      image: productImage,
      category: product.category,
    });
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(product.id, 1, product.netVolume || '250ml');
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(product.id, -1, product.netVolume || '250ml');
  };

  const discountPercent =
    product.discountPercentage ||
    Math.round(((product.mrp - product.price) / product.mrp) * 100);

  if (layout === 'list') {
    return (
      <div data-product-card className="bg-white rounded-sm border border-border hover:border-plum/40 transition-all duration-300 p-4 flex flex-col sm:flex-row gap-6 items-center group">
        <Link
          href={`/product/${product.slug}`}
          className="relative w-full sm:w-48 h-48 bg-[#F8F5F2] flex-shrink-0 overflow-hidden flex items-center justify-center"
        >
          {product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="object-contain w-full h-full p-2 group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-charcoal-muted">SENSEIN</div>
          )}
          {discountPercent > 0 && (
            <span className="absolute top-2 left-2 bg-plum text-white text-[10px] font-bold px-2 py-0.5 tracking-wider uppercase">
              -{discountPercent}% OFF
            </span>
          )}
        </Link>

        <div className="flex-1 flex flex-col justify-between w-full">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] uppercase tracking-widest text-charcoal-muted font-medium">
                {product.category}
              </span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIsWishlisted(!isWishlisted);
                }}
                className={`p-1.5 transition ${isWishlisted ? 'text-plum' : 'text-charcoal-muted hover:text-plum'}`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-plum' : ''}`} />
              </button>
            </div>

            <Link href={`/product/${product.slug}`}>
              <h3 className="font-sans text-lg font-bold text-charcoal group-hover:text-plum transition-colors line-clamp-1 tracking-tight">
                {product.name}
              </h3>
            </Link>

            {product.subtitle && (
              <p className="text-xs text-charcoal-muted line-clamp-1 mt-0.5 font-light">
                {product.subtitle}
              </p>
            )}

            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center text-gold text-xs">
                <Star className="w-3.5 h-3.5 fill-gold" />
                <span className="ml-1 font-semibold text-charcoal text-xs">{product.rating}</span>
              </div>
              <span className="text-charcoal-muted text-[11px]">({product.reviewCount} reviews)</span>
              {product.netVolume && (
                <span className="text-[11px] bg-alabaster px-2 py-0.5 rounded text-charcoal-muted border border-border">
                  {product.netVolume}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-semibold text-charcoal">₹{product.price.toLocaleString('en-IN')}</span>
              {product.mrp > product.price && (
                <span className="text-xs text-charcoal-muted line-through">₹{product.mrp.toLocaleString('en-IN')}</span>
              )}
            </div>

            {quantityInCart > 0 ? (
              <div className="flex items-center border border-plum rounded bg-plum/5 px-2 py-1 space-x-3">
                <button
                  onClick={handleDecrement}
                  className="w-6 h-6 rounded flex items-center justify-center text-plum hover:bg-plum hover:text-white transition"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-xs font-bold text-plum">{quantityInCart}</span>
                <button
                  onClick={handleIncrement}
                  className="w-6 h-6 rounded flex items-center justify-center text-plum hover:bg-plum hover:text-white transition"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                className="px-4 py-2 bg-plum hover:bg-plum-dark text-white text-xs font-semibold uppercase tracking-wider transition rounded-sm flex items-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Add to Bag
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      data-product-card
      className="bg-white rounded-md border border-border hover:border-plum/40 hover:shadow-luxury transition-all duration-300 flex flex-col group relative overflow-hidden h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Stage */}
      <Link
        href={`/product/${product.slug}`}
        className="relative aspect-square w-full bg-[#FAF7F5] overflow-hidden flex items-center justify-center p-2.5 sm:p-4 block"
      >
        <img
          src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
          alt={product.name}
          className="object-contain w-full h-full transform group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Top Left Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {discountPercent > 0 && (
            <span className="bg-plum text-white text-[9px] sm:text-[10px] font-bold tracking-wider uppercase px-1.5 sm:px-2 py-0.5 rounded-[2px] shadow-sm">
              -{discountPercent}% OFF
            </span>
          )}
          {product.curatedCollection === 'Bestsellers' && (
            <span className="bg-charcoal text-white text-[8px] sm:text-[9px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded-[2px]">
              BESTSELLER
            </span>
          )}
        </div>

        {/* Top Right Badges / Wishlist */}
        <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
          <span className="inline-flex items-center gap-0.5 bg-plum/10 text-plum border border-plum/20 text-[8px] sm:text-[9px] font-bold px-1.5 sm:px-2 py-0.5 rounded-[2px] uppercase tracking-wider backdrop-blur-xs">
            <Sparkles className="w-2.5 h-2.5" />
            {product.curatedCollection === 'Bestsellers' ? 'MOST RE-ORDERED' : 'SALON CARE'}
          </span>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsWishlisted(!isWishlisted);
            }}
            className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/90 backdrop-blur-sm border border-border/70 flex items-center justify-center transition-all duration-200 ${
              isWishlisted
                ? 'text-plum bg-white shadow-sm'
                : 'text-charcoal hover:text-plum hover:bg-white'
            }`}
            aria-label="Wishlist toggle"
          >
            <Heart className={`w-3 h-3 ${isWishlisted ? 'fill-plum text-plum' : ''}`} />
          </button>
        </div>

        {/* Net Volume Tag overlay bottom right */}
        {product.netVolume && (
          <span className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-xs text-[9px] sm:text-[10px] text-charcoal font-medium px-1.5 py-0.5 rounded-[2px] border border-border/80">
            {product.netVolume}
          </span>
        )}
      </Link>

      {/* Card Content Details */}
      <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category Tag */}
          <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.16em] text-charcoal-muted font-semibold mb-0.5 sm:mb-1">
            {product.category}
          </div>

          {/* Product Title */}
          <Link href={`/product/${product.slug}`} className="block group-hover:text-plum transition-colors">
            <h3 className="font-sans text-xs sm:text-sm md:text-[15px] font-bold text-charcoal leading-snug line-clamp-2 min-h-[32px] sm:min-h-[40px] tracking-tight">
              {product.name}
            </h3>
          </Link>

          {/* Ratings & Volume & Reviews */}
          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            <div className="flex items-center text-gold">
              <Star className="w-3 h-3 fill-gold text-gold" />
              <span className="text-[11px] sm:text-xs font-bold text-charcoal ml-0.5">{product.rating}</span>
            </div>
            {product.netVolume && (
              <span className="text-[9px] sm:text-[10px] bg-neutral-100 text-charcoal-muted px-1.5 py-0.2 rounded border border-neutral-200">
                {product.netVolume}
              </span>
            )}
            <span className="text-charcoal-subtle text-[10px] sm:text-[11px]">({product.reviewCount})</span>
          </div>
        </div>

        {/* Pricing & Interactive Add to Cart / Counter */}
        <div className="mt-2.5 sm:mt-3 pt-2 sm:pt-2.5 border-t border-border/60">
          <div className="flex items-baseline justify-between mb-2 sm:mb-2.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm sm:text-base font-bold text-charcoal tracking-tight">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.mrp > product.price && (
                <span className="text-[10px] sm:text-xs text-charcoal-muted line-through">
                  ₹{product.mrp.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {discountPercent > 0 && (
              <span className="text-[9px] sm:text-[10px] text-emerald-accent font-semibold hidden xs:inline">
                Save ₹{(product.mrp - product.price).toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Interactive Stepper or Button */}
          {quantityInCart > 0 ? (
            <div className="w-full flex items-center justify-between bg-plum text-white rounded-sm py-1.5 px-2.5 shadow-sm">
              <button
                onClick={handleDecrement}
                className="w-6 h-6 flex items-center justify-center text-white/90 hover:text-white hover:bg-white/20 rounded transition active:scale-90 font-bold"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-bold text-white tracking-wider">
                {quantityInCart}
              </span>
              <button
                onClick={handleIncrement}
                className="w-6 h-6 flex items-center justify-center text-white/90 hover:text-white hover:bg-white/20 rounded transition active:scale-90 font-bold"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              className="w-full py-2 px-3 bg-plum hover:bg-plum-dark text-white text-[10px] sm:text-xs font-semibold uppercase tracking-[0.12em] transition-all duration-200 rounded-sm flex items-center justify-center gap-1.5 shadow-sm hover:shadow active:scale-[0.99]"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Add to Bag
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
