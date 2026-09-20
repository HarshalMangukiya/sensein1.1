'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Star,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Heart,
  Truck,
  CheckCircle,
  Plus,
  Minus,
  ShoppingBag,
  Zap,
  Info,
  ChevronRight,
} from 'lucide-react';
import { fetchProduct, checkPincodeServiceability } from '@/lib/api';
import { useCartStore } from '@/store/cart-store';
import { useFlyToCart } from '@/components/fly-to-cart';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'ingredients' | 'howToUse' | 'reviews'>('overview');
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Pincode state
  const [pincode, setPincode] = useState('110001');
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [shippingResult, setShippingResult] = useState<any | null>(null);
  const [pincodeError, setPincodeError] = useState<string | null>(null);

  const { addItem, openCart } = useCartStore();
  const { flyToCart } = useFlyToCart();

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchProduct(params.id);
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  // Handle scroll for bottom sticky bar
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initial pincode lookup for New Delhi default
  useEffect(() => {
    handleCheckPincode('110001');
  }, []);

  const handleCheckPincode = async (codeToTest?: string) => {
    const code = (codeToTest || pincode).trim();
    if (!/^\d{6}$/.test(code)) {
      setPincodeError('Please enter a valid 6-digit Indian PIN code');
      return;
    }
    setPincodeLoading(true);
    setPincodeError(null);
    try {
      const res = await checkPincodeServiceability(code);
      setShippingResult(res);
    } catch (err: any) {
      setPincodeError(err.message || 'Pincode not serviceable');
      setShippingResult(null);
    } finally {
      setPincodeLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-plum border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="font-sans text-lg font-bold text-charcoal tracking-tight">Loading luxury formulation...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="font-sans text-2xl font-bold text-charcoal tracking-tight">Formulation Not Found</h2>
        <Link href="/shop" className="mt-4 inline-block px-6 py-2 bg-plum text-white text-xs font-semibold rounded">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const selectedVariant = product.variants && product.variants[selectedVariantIndex]
    ? product.variants[selectedVariantIndex]
    : { size: product.netVolume, price: product.price, mrp: product.mrp };

  const currentPrice = selectedVariant.price;
  const currentMrp = selectedVariant.mrp;
  const savings = currentMrp - currentPrice;
  const discountPercent = Math.round((savings / currentMrp) * 100);

  const handleAddToBag = (e?: React.MouseEvent) => {
    const activeImage = product.images[selectedImageIndex] || product.images[0] || 'https://res.cloudinary.com/dqddawu42/image/upload/v1789820271/sensein/products/mask-1.jpg';
    if (e) {
      flyToCart(e, activeImage);
    } else {
      const img = document.querySelector('[data-main-product-image]') as HTMLElement;
      if (img) {
        flyToCart(img, activeImage);
      } else {
        flyToCart({ x: window.innerWidth / 2, y: window.innerHeight / 2 }, activeImage);
      }
    }

    addItem(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: currentPrice,
        mrp: currentMrp,
        size: selectedVariant.size,
        image: activeImage,
        category: product.category,
      },
      quantity
    );
  };

  const handleBuyNow = () => {
    addItem(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: currentPrice,
        mrp: currentMrp,
        size: selectedVariant.size,
        image: product.images[0],
        category: product.category,
      },
      quantity
    );
    router.push('/checkout');
  };

  return (
    <div className="relative pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumbs */}
        <div className="text-xs text-charcoal-muted uppercase tracking-widest mb-6 flex items-center gap-1.5">
          <Link href="/" className="hover:text-plum">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/shop" className="hover:text-plum">Formulations</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/shop?category=${product.category}`} className="hover:text-plum">{product.category}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-plum font-semibold truncate max-w-[200px] sm:max-w-xs">{product.name}</span>
        </div>

        {/* Top Product Section: Gallery & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* LEFT: MULTI-IMAGE GALLERY WITH THUMBNAILS */}
          <div className="space-y-4">
            {/* Primary Main Image Frame */}
            <div className="relative aspect-square w-full bg-white rounded-sm border border-border p-6 overflow-hidden flex items-center justify-center shadow-xs">
              <img
                data-main-product-image
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-contain hover:scale-110 transition-transform duration-500 cursor-zoom-in"
              />
              {discountPercent > 0 && (
                <span className="absolute top-4 left-4 bg-plum text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-[1px]">
                  -{discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail Selector Strip */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-20 h-20 bg-white rounded-sm border p-1.5 flex-shrink-0 transition-all ${
                      selectedImageIndex === idx
                        ? 'border-plum ring-1 ring-plum'
                        : 'border-border opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: DETAILS, VARIANTS, CTAS & PINCODE */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-plum">
                  {product.category} • {product.curatedCollection}
                </span>
                <span className="text-emerald text-xs font-medium bg-emerald-light/60 px-2.5 py-0.5 rounded-full">
                  ● In Stock • Ready to Dispatch
                </span>
              </div>

              <h1 className="font-sans text-3xl sm:text-4xl font-bold text-charcoal leading-tight mt-1 tracking-tight">
                {product.name}
              </h1>

              {product.subtitle && (
                <p className="text-sm text-charcoal-muted mt-1.5 font-light">
                  {product.subtitle}
                </p>
              )}

              {/* Star Ratings */}
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center text-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                  <span className="ml-2 font-bold text-charcoal text-sm">{product.rating}</span>
                </div>
                <span className="text-charcoal-muted text-xs">
                  • Based on <strong>{product.reviewCount}</strong> Verified Client Reviews
                </span>
              </div>
            </div>

            {/* Price Block */}
            <div className="p-4 bg-white border border-border rounded-sm">
              <div className="flex items-baseline gap-3">
                <span className="font-sans text-3xl font-extrabold text-charcoal tracking-tight">
                  ₹{currentPrice.toLocaleString('en-IN')}
                </span>
                {currentMrp > currentPrice && (
                  <span className="text-base text-charcoal-muted line-through">
                    ₹{currentMrp.toLocaleString('en-IN')}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-xs bg-plum text-white font-bold px-2 py-0.5 rounded uppercase">
                    Save ₹{savings.toLocaleString('en-IN')} ({discountPercent}%)
                  </span>
                )}
              </div>
              <p className="text-[11px] text-charcoal-muted mt-1">
                Inclusive of all taxes. Free Pan-India Express Delivery included.
              </p>
            </div>

            {/* Net Volume / Variant Selector Chips */}
            {product.variants && product.variants.length > 0 && (
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-charcoal mb-2">
                  Select Formulation Volume:
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((v: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedVariantIndex(idx)}
                      className={`px-4 py-2.5 rounded-sm border text-xs font-semibold tracking-wide transition flex items-center gap-2 ${
                        selectedVariantIndex === idx
                          ? 'border-plum bg-plum text-white shadow-sm'
                          : 'border-border bg-white text-charcoal hover:border-plum/50'
                      }`}
                    >
                      <span>{v.size}</span>
                      <span className={`text-[11px] ${selectedVariantIndex === idx ? 'text-gold-light' : 'text-charcoal-muted'}`}>
                        (₹{v.price.toLocaleString('en-IN')})
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper & Dual CTAs */}
            <div className="space-y-3 pt-2">
              <div className="flex gap-4">
                {/* Stepper */}
                <div className="flex items-center border border-border rounded-sm bg-white px-3 py-2 space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 flex items-center justify-center text-charcoal hover:text-plum font-bold"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-bold text-charcoal w-6 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-7 h-7 flex items-center justify-center text-charcoal hover:text-plum font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Bag Button */}
                <button
                  onClick={(e) => handleAddToBag(e)}
                  className="flex-1 py-3.5 px-6 bg-plum hover:bg-plum-dark text-white text-xs font-bold uppercase tracking-[0.16em] rounded-sm transition flex items-center justify-center gap-2 shadow"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Bag
                </button>
              </div>

              {/* BUY NOW Button */}
              <button
                onClick={handleBuyNow}
                className="w-full py-3.5 px-6 bg-charcoal hover:bg-black text-white text-xs font-bold uppercase tracking-[0.18em] rounded-sm transition flex items-center justify-center gap-2 shadow"
              >
                <Zap className="w-4 h-4 text-gold" />
                Buy Now — Instant Checkout
              </button>
            </div>

            {/* Pincode Serviceability & Delivery Time Widget */}
            <div className="p-4 bg-white border border-border rounded-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-bold text-charcoal flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-plum" />
                  Check Delivery SLA & Pincode
                </span>
                <span className="text-[11px] text-emerald font-semibold">
                  Pan-India Express Service
                </span>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter 6-digit PIN code"
                  className="flex-1 px-3 py-2 bg-[#FAF7F5] border border-border text-xs rounded-sm uppercase tracking-wider focus:outline-none focus:border-plum"
                />
                <button
                  onClick={() => handleCheckPincode()}
                  disabled={pincodeLoading}
                  className="px-4 py-2 bg-plum text-white text-xs font-semibold rounded-sm uppercase tracking-wider hover:bg-plum-dark transition disabled:opacity-60"
                >
                  {pincodeLoading ? 'Checking...' : 'Check'}
                </button>
              </div>

              {pincodeError && (
                <p className="text-[11px] text-red-600 font-medium">{pincodeError}</p>
              )}

              {shippingResult && (
                <div className="pt-2 border-t border-border/50 text-xs space-y-1 text-charcoal">
                  <div className="flex items-center gap-1.5 text-emerald font-semibold">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Delivering to {shippingResult.city}, {shippingResult.state}
                  </div>
                  <p className="text-charcoal-muted text-[11px]">
                    Expected Delivery by <strong>{shippingResult.estimatedDeliveryDate}</strong> via{' '}
                    <span className="font-semibold text-charcoal">{shippingResult.courierPartner}</span>.
                  </p>
                  <p className="text-[11px] text-charcoal-muted">
                    ✓ Cash on Delivery (COD) Available • Free Express Dispatch
                  </p>
                </div>
              )}
            </div>

            {/* Trust Badges Grid */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="text-center p-3 bg-white border border-border rounded-sm">
                <ShieldCheck className="w-5 h-5 text-gold mx-auto mb-1" />
                <span className="block text-[10px] font-bold uppercase tracking-wider text-charcoal">
                  100% Authentic
                </span>
                <span className="text-[9px] text-charcoal-muted">Direct Lab Formulation</span>
              </div>

              <div className="text-center p-3 bg-white border border-border rounded-sm">
                <RotateCcw className="w-5 h-5 text-gold mx-auto mb-1" />
                <span className="block text-[10px] font-bold uppercase tracking-wider text-charcoal">
                  30 Days Return
                </span>
                <span className="text-[9px] text-charcoal-muted">Complimentary Pickups</span>
              </div>

              <div className="text-center p-3 bg-white border border-border rounded-sm">
                <Sparkles className="w-5 h-5 text-gold mx-auto mb-1" />
                <span className="block text-[10px] font-bold uppercase tracking-wider text-charcoal">
                  Cruelty Free
                </span>
                <span className="text-[9px] text-charcoal-muted">Clean Laboratory Standard</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SEGMENTED EDITORIAL TABS */}
        <div className="mt-16 sm:mt-24">
          {/* Tab Navigation */}
          <div className="flex border-b border-border text-xs sm:text-sm font-semibold uppercase tracking-widest justify-center sm:justify-start gap-4 sm:gap-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3.5 transition-all relative whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'text-plum font-bold after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-plum'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              Overview & Clinicals
            </button>
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`pb-3.5 transition-all relative whitespace-nowrap ${
                activeTab === 'ingredients'
                  ? 'text-plum font-bold after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-plum'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              Bio-Active Ingredients
            </button>
            <button
              onClick={() => setActiveTab('howToUse')}
              className={`pb-3.5 transition-all relative whitespace-nowrap ${
                activeTab === 'howToUse'
                  ? 'text-plum font-bold after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-plum'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              How To Use
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3.5 transition-all relative whitespace-nowrap ${
                activeTab === 'reviews'
                  ? 'text-plum font-bold after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-plum'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              Reviews ({product.reviewCount})
            </button>
          </div>

          {/* Tab Contents */}
          <div className="py-8 bg-white p-6 sm:p-8 rounded-b-sm border-x border-b border-border shadow-xs">
            {activeTab === 'overview' && (
              <div className="max-w-3xl space-y-6">
                <h3 className="font-sans text-2xl font-bold text-charcoal tracking-tight">Formulation Overview</h3>
                <p className="text-sm text-charcoal leading-relaxed font-light">
                  {product.description}
                </p>
                <div className="p-4 bg-alabaster rounded border border-border">
                  <h4 className="font-sans text-base font-semibold text-charcoal mb-1 tracking-tight">Clinical Trial Observations</h4>
                  <p className="text-xs text-charcoal-muted leading-relaxed">
                    {product.overview}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div className="max-w-3xl space-y-6">
                <h3 className="font-sans text-2xl font-bold text-charcoal tracking-tight">Botanical & Bio-Active Actives</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {product.ingredients?.keyActives?.map((active: string, idx: number) => (
                    <div key={idx} className="p-3 bg-alabaster rounded border border-border flex items-center gap-3">
                      <Sparkles className="w-4 h-4 text-plum flex-shrink-0" />
                      <span className="text-xs font-semibold text-charcoal">{active}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-charcoal mb-2">Full INCI Disclosure:</h4>
                  <p className="text-xs text-charcoal-muted leading-relaxed font-mono bg-[#FAF7F5] p-4 rounded border border-border">
                    {product.ingredients?.fullList}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'howToUse' && (
              <div className="max-w-3xl space-y-6">
                <h3 className="font-sans text-2xl font-bold text-charcoal tracking-tight">3-Step Salon Ritual</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {product.howToUse?.map((step: any) => (
                    <div key={step.step} className="p-4 bg-alabaster rounded border border-border space-y-2">
                      <div className="w-7 h-7 rounded-full bg-plum text-white text-xs font-bold flex items-center justify-center">
                        {step.step}
                      </div>
                      <h4 className="font-sans text-base font-bold text-charcoal tracking-tight">{step.title}</h4>
                      <p className="text-xs text-charcoal-muted leading-relaxed">{step.instruction}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-8">
                {/* Rating summary bar graphs */}
                <div className="flex flex-col sm:flex-row items-center gap-8 p-6 bg-alabaster rounded border border-border">
                  <div className="text-center sm:text-left">
                    <div className="font-mono text-5xl font-black text-charcoal tracking-tight">{product.rating}</div>
                    <div className="flex items-center text-gold my-1 justify-center sm:justify-start">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                      ))}
                    </div>
                    <span className="text-xs text-charcoal-muted">Based on {product.reviewCount} reviews</span>
                  </div>

                  {/* Rating bars */}
                  <div className="flex-1 w-full space-y-1.5 text-xs text-charcoal-muted">
                    <div className="flex items-center gap-2">
                      <span className="w-8">5★</span>
                      <div className="flex-1 bg-border h-2 rounded-full overflow-hidden">
                        <div className="bg-gold h-full rounded-full" style={{ width: '85%' }} />
                      </div>
                      <span className="w-8 text-right">85%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-8">4★</span>
                      <div className="flex-1 bg-border h-2 rounded-full overflow-hidden">
                        <div className="bg-gold h-full rounded-full" style={{ width: '12%' }} />
                      </div>
                      <span className="w-8 text-right">12%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-8">3★</span>
                      <div className="flex-1 bg-border h-2 rounded-full overflow-hidden">
                        <div className="bg-gold h-full rounded-full" style={{ width: '3%' }} />
                      </div>
                      <span className="w-8 text-right">3%</span>
                    </div>
                  </div>
                </div>

                {/* Individual reviews */}
                <div className="space-y-4">
                  {product.reviews?.map((rev: any) => (
                    <div key={rev.id} className="p-4 border-b border-border/70 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-charcoal">{rev.author}</span>
                          {rev.verifiedBuyer && (
                            <span className="text-[10px] text-emerald bg-emerald-light/60 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> Verified Buyer
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-charcoal-muted">{rev.date}</span>
                      </div>
                      <div className="flex items-center text-gold">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />
                        ))}
                      </div>
                      <h5 className="font-sans text-sm font-bold text-charcoal tracking-tight">{rev.title}</h5>
                      <p className="text-xs text-charcoal-muted leading-relaxed">{rev.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM STICKY CART BAR (Appears on scroll) */}
      {showStickyBar && (
        <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-border shadow-2xl py-3 px-4 z-40 animate-in slide-in-from-bottom duration-300">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-12 h-12 object-contain bg-alabaster rounded p-1 border border-border flex-shrink-0"
              />
              <div className="min-w-0">
                <h4 className="font-sans text-sm font-bold text-charcoal truncate tracking-tight">
                  {product.name}
                </h4>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-plum">₹{currentPrice.toLocaleString('en-IN')}</span>
                  <span className="text-charcoal-muted text-[11px]">• {selectedVariant.size}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={(e) => handleAddToBag(e)}
                className="px-6 py-2.5 bg-plum hover:bg-plum-dark text-white text-xs font-bold uppercase tracking-widest rounded-sm transition shadow"
              >
                Add to Bag
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
