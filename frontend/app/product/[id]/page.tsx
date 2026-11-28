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
  ChevronDown,
  ChevronUp,
  Check,
  HelpCircle,
  FileText,
  Layers,
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
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Accordion state: only one section open at a time
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    howToUse: true,
    productDetails: false,
    benefits: false,
    ingredients: false,
    faqs: false,
    additionalInfo: false,
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => {
      const isCurrentlyOpen = !!prev[key];
      return {
        howToUse: false,
        productDetails: false,
        benefits: false,
        ingredients: false,
        faqs: false,
        additionalInfo: false,
        [key]: !isCurrentlyOpen,
      };
    });
  };

  // Pincode state
  const [pincode, setPincode] = useState('110001');
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [shippingResult, setShippingResult] = useState<any | null>(null);
  const [pincodeError, setPincodeError] = useState<string | null>(null);

  const { addItem, openCart } = useCartStore();
  const { flyToCart } = useFlyToCart();

  useEffect(() => {
    async function load(showSpinner = true) {
      if (showSpinner) setLoading(true);
      try {
        const data = await fetchProduct(params.id);
        setProduct(data);
      } catch (err) {
        console.error(err);
        setProduct(null);
      } finally {
        if (showSpinner) setLoading(false);
      }
    }
    load(true);

    const handleSync = () => load(false);
    const handleVisibility = () => {
      if (typeof document === 'undefined' || document.visibilityState === 'visible') {
        load(false);
      }
    };
    window.addEventListener('sensein-products-updated', handleSync);
    window.addEventListener('focus', handleVisibility);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.removeEventListener('sensein-products-updated', handleSync);
      window.removeEventListener('focus', handleVisibility);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
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
    const activeImage = product.images[selectedImageIndex] || product.images[0] || 'https://res.cloudinary.com/dqddawu42/image/upload/v1792479863/sensein/products/sensein-hair-wax-1.jpg';
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
          {/* LEFT: MULTI-IMAGE GALLERY WITH THUMBNAILS & TRUST BADGES BELOW */}
          <div className="space-y-4 w-full">
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 items-start w-full">
              {/* Thumbnail Selector (Left Column) */}
              {product.images.length > 1 && (
                <div className="flex sm:flex-col gap-2.5 sm:gap-3 overflow-x-auto sm:overflow-y-auto w-full sm:w-20 md:w-24 shrink-0 sm:max-h-[560px] pb-2 sm:pb-0 scrollbar-thin">
                  {product.images.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      onMouseEnter={() => setSelectedImageIndex(idx)}
                      className={`aspect-square w-16 sm:w-full bg-white rounded-sm border p-1 shrink-0 transition-all cursor-pointer ${selectedImageIndex === idx
                        ? 'border-plum ring-2 ring-plum shadow-xs'
                        : 'border-border/80 opacity-70 hover:opacity-100 hover:border-plum/40'
                        }`}
                    >
                      <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}

              {/* Primary Main Image Frame (Right of Thumbnails) */}
              <div className="relative aspect-square flex-1 w-full bg-white rounded-sm border border-border p-6 overflow-hidden flex items-center justify-center shadow-xs">
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
            </div>

            {/* Trust Badges Row (Directly below product image box) */}
            <div className="grid grid-cols-3 gap-3 pt-1">
              <div className="text-center p-3 bg-white border border-border rounded-sm shadow-2xs hover:border-plum/40 transition-colors">
                <ShieldCheck className="w-5 h-5 text-gold mx-auto mb-1" />
                <span className="block text-[10px] font-bold uppercase tracking-wider text-charcoal">
                  100% Authentic
                </span>
                <span className="text-[9px] text-charcoal-muted">Direct Lab Formulation</span>
              </div>

              <div className="text-center p-3 bg-white border border-border rounded-sm shadow-2xs hover:border-plum/40 transition-colors">
                <RotateCcw className="w-5 h-5 text-gold mx-auto mb-1" />
                <span className="block text-[10px] font-bold uppercase tracking-wider text-charcoal">
                  30 Days Return
                </span>
                <span className="text-[9px] text-charcoal-muted">Complimentary Pickups</span>
              </div>

              <div className="text-center p-3 bg-white border border-border rounded-sm shadow-2xs hover:border-plum/40 transition-colors">
                <Sparkles className="w-5 h-5 text-gold mx-auto mb-1" />
                <span className="block text-[10px] font-bold uppercase tracking-wider text-charcoal">
                  Cruelty Free
                </span>
                <span className="text-[9px] text-charcoal-muted">Clean Laboratory Standard</span>
              </div>
            </div>
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
                      className={`px-4 py-2.5 rounded-sm border text-xs font-semibold tracking-wide transition flex items-center gap-2 ${selectedVariantIndex === idx
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
                    ✓ 100% Secure Prepaid Payment • Free Express Dispatch
                  </p>
                </div>
              )}
            </div>

            {/* Combo Kit Contents Breakdown (If Combo Product) */}
            {(product.productType === 'combo' || product.category === 'Combos' || (product.comboItems && product.comboItems.length > 0)) && (
              <div className="p-4 sm:p-5 bg-[#FAF7F5] border border-plum/25 rounded-md space-y-3 shadow-2xs">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-plum" />
                    <span className="text-xs uppercase tracking-wider font-bold text-plum">
                      What's Included in this Combo Pack
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 bg-plum text-white rounded-full">
                    {product.comboItems?.length || 3} Formulations Included
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  {(product.comboItems && product.comboItems.length > 0
                    ? product.comboItems
                    : [
                      { name: 'Argan + Keratin Shampoo', quantity: '50 ml', description: 'Gentle clarifying & hair fiber repair' },
                      { name: 'Leave-In Moisture Cream', quantity: '50 ml', description: 'Deep moisture care & cellular elasticity' },
                      { name: '5 IN 1 Cleanup Facewash', quantity: '50 ml', description: 'Total face cleanup with walnut scrub' },
                    ]
                  ).map((item: any, i: number) => (
                    <div key={i} className="p-3.5 bg-white rounded border border-border shadow-2xs space-y-1.5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="w-5 h-5 rounded-full bg-plum/10 text-plum text-[10px] font-bold flex items-center justify-center">
                            {i + 1}
                          </span>
                          {item.quantity && (
                            <span className="text-[10px] font-semibold text-charcoal bg-[#FAF7F5] px-2 py-0.5 rounded border border-border/70">
                              {item.quantity}
                            </span>
                          )}
                        </div>
                        <h6 className="font-sans text-xs font-bold text-charcoal">{item.name}</h6>
                      </div>
                      {item.description && (
                        <p className="text-[11px] text-charcoal-muted leading-relaxed font-light">{item.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* WEBSITE ACCORDION SECTIONS (Matching requested spec) */}
        <div className="mt-16 sm:mt-24 space-y-4">
          <div className="border-b border-border pb-4 mb-6">
            <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-plum block">
              Complete Formulation & Grooming Guide
            </span>
            <h3 className="font-sans text-2xl sm:text-3xl font-bold text-charcoal tracking-tight mt-1">
              Product Information & Rituals
            </h3>
          </div>

          <div className="space-y-3">
            {/* 1. HOW TO USE ACCORDION */}
            <div className="border border-border/80 rounded bg-white overflow-hidden shadow-xs transition-all">
              <button
                type="button"
                onClick={() => toggleAccordion('howToUse')}
                className="w-full py-4 px-5 sm:px-6 flex items-center justify-between text-left bg-white hover:bg-[#FAF7F5] transition-colors cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-plum" />
                  <span className="font-sans text-base sm:text-lg font-bold text-charcoal tracking-tight">
                    How To Use
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#FAF7F5] border border-border flex items-center justify-center text-charcoal transition-transform duration-200">
                  {openAccordions.howToUse ? (
                    <ChevronUp className="w-4 h-4 text-plum" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-charcoal-muted" />
                  )}
                </div>
              </button>

              {openAccordions.howToUse && (
                <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-[#F0ECE7] bg-[#FCFBF9]/40 animate-in fade-in-50 duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-3">
                    {(product.howToUse && product.howToUse.length > 0 ? product.howToUse : [
                      { step: 1, title: 'Take Scoop of Wax', instruction: 'Take an appropriate amount of SENSEIN Hair Wax according to your hair length.' },
                      { step: 2, title: 'Warm & Spread', instruction: 'Rub the wax between your hands to warm and spread it evenly.' },
                      { step: 3, title: 'Apply to Hair', instruction: 'Apply evenly to your hair, including the areas you want to style.' },
                      { step: 4, title: 'Shape & Style', instruction: 'Shape your hair into your desired look and adjust as needed.' }
                    ]).map((stepItem: any, idx: number) => (
                      <div key={idx} className="p-4 bg-white rounded border border-border shadow-xs space-y-2">
                        <div className="w-8 h-8 rounded-full bg-plum text-white text-xs font-bold flex items-center justify-center">
                          {stepItem.step || idx + 1}
                        </div>
                        <h5 className="font-sans text-sm font-bold text-charcoal tracking-tight">
                          {stepItem.title || `Step ${idx + 1}`}
                        </h5>
                        <p className="text-xs text-charcoal-muted leading-relaxed font-light">
                          {stepItem.instruction}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3.5 bg-alabaster rounded border border-border flex items-start gap-3">
                    <Info className="w-4 h-4 text-plum flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-charcoal-muted leading-relaxed">
                      <strong>Application Advice:</strong>{' '}
                      {(product as any).usageAdvice ||
                        (product.additionalInfo && ((product.additionalInfo as any).usageAdvice || (product.additionalInfo as any).caution)) ||
                        'Warm thoroughly between fingertips for seamless spreadability. Suitable for daily restyling without washing out between touch-ups.'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 2. PRODUCT DETAILS ACCORDION */}
            <div className="border border-border/80 rounded bg-white overflow-hidden shadow-xs transition-all">
              <button
                type="button"
                onClick={() => toggleAccordion('productDetails')}
                className="w-full py-4 px-5 sm:px-6 flex items-center justify-between text-left bg-white hover:bg-[#FAF7F5] transition-colors cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-plum" />
                  <span className="font-sans text-base sm:text-lg font-bold text-charcoal tracking-tight">
                    Product Details
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#FAF7F5] border border-border flex items-center justify-center text-charcoal transition-transform duration-200">
                  {openAccordions.productDetails ? (
                    <ChevronUp className="w-4 h-4 text-plum" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-charcoal-muted" />
                  )}
                </div>
              </button>

              {openAccordions.productDetails && (
                <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-[#F0ECE7] bg-[#FCFBF9]/40 animate-in fade-in-50 duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                    {product.productDetails ? (
                      Object.entries(product.productDetails).map(([key, val]) => (
                        <div
                          key={key}
                          className={`flex justify-between py-2.5 px-3.5 bg-white rounded border border-border text-xs ${String(val).length > 35 ? 'md:col-span-2' : ''
                            }`}
                        >
                          <span className="font-semibold text-charcoal-muted uppercase tracking-wider text-[11px] capitalize">
                            {key.replace(/([A-Z])/g, ' $1')}:
                          </span>
                          <span className="font-bold text-charcoal text-right pl-4">{String(val)}</span>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="flex justify-between py-2.5 px-3.5 bg-white rounded border border-border text-xs">
                          <span className="font-semibold text-charcoal-muted uppercase tracking-wider text-[11px]">Brand:</span>
                          <span className="font-bold text-charcoal">{product.name}</span>
                        </div>
                        <div className="flex justify-between py-2.5 px-3.5 bg-white rounded border border-border text-xs">
                          <span className="font-semibold text-charcoal-muted uppercase tracking-wider text-[11px]">Net Quantity:</span>
                          <span className="font-bold text-charcoal">{product.netVolume}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 3. BENEFITS ACCORDION */}
            <div className="border border-border/80 rounded bg-white overflow-hidden shadow-xs transition-all">
              <button
                type="button"
                onClick={() => toggleAccordion('benefits')}
                className="w-full py-4 px-5 sm:px-6 flex items-center justify-between text-left bg-white hover:bg-[#FAF7F5] transition-colors cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-plum" />
                  <span className="font-sans text-base sm:text-lg font-bold text-charcoal tracking-tight">
                    Benefits
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#FAF7F5] border border-border flex items-center justify-center text-charcoal transition-transform duration-200">
                  {openAccordions.benefits ? (
                    <ChevronUp className="w-4 h-4 text-plum" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-charcoal-muted" />
                  )}
                </div>
              </button>

              {openAccordions.benefits && (
                <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-[#F0ECE7] bg-[#FCFBF9]/40 animate-in fade-in-50 duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    {(product.benefits && product.benefits.length > 0
                      ? product.benefits
                      : [
                        'Provides professional salon-grade hair care.',
                        'Enhances shine, smoothness, and texture.',
                        'Formulated with high-potency bio-active ingredients.',
                        'Suitable for regular grooming and hair wellness.'
                      ]
                    ).map((benefit: string, idx: number) => (
                      <div key={idx} className="p-3.5 bg-white rounded border border-border flex items-start gap-3 shadow-2xs">
                        <Check className="w-4 h-4 text-plum flex-shrink-0 mt-0.5 stroke-[2.5]" />
                        <span className="text-xs sm:text-sm font-medium text-charcoal leading-relaxed">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 4. INGREDIENTS ACCORDION */}
            <div className="border border-border/80 rounded bg-white overflow-hidden shadow-xs transition-all">
              <button
                type="button"
                onClick={() => toggleAccordion('ingredients')}
                className="w-full py-4 px-5 sm:px-6 flex items-center justify-between text-left bg-white hover:bg-[#FAF7F5] transition-colors cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-plum" />
                  <span className="font-sans text-base sm:text-lg font-bold text-charcoal tracking-tight">
                    Ingredients
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#FAF7F5] border border-border flex items-center justify-center text-charcoal transition-transform duration-200">
                  {openAccordions.ingredients ? (
                    <ChevronUp className="w-4 h-4 text-plum" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-charcoal-muted" />
                  )}
                </div>
              </button>

              {openAccordions.ingredients && (
                <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-[#F0ECE7] bg-[#FCFBF9]/40 animate-in fade-in-50 duration-200 space-y-4">
                  <p className="text-xs sm:text-sm text-charcoal font-medium mt-2">
                    The ingredients listed on the supplied packaging are:
                  </p>

                  {/* Active Components Breakdown */}
                  {product.ingredients?.keyActives && product.ingredients.keyActives.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {product.ingredients.keyActives.map((item: any, idx: number) => {
                        const name = typeof item === 'string' ? item.split('(')[0].trim() : item.name;
                        const role = typeof item === 'string' ? (item.includes('(') ? item.split('(')[1].replace(')', '').trim() : '') : item.role;
                        return (
                          <div key={idx} className="p-3 bg-white rounded border border-border shadow-xs">
                            <div className="flex items-center gap-2 mb-1">
                              <Sparkles className="w-3.5 h-3.5 text-plum flex-shrink-0" />
                              <span className="font-sans text-xs font-bold text-charcoal tracking-tight">
                                {name}
                              </span>
                            </div>
                            {role && (
                              <p className="text-[11px] text-charcoal-muted leading-relaxed font-light">
                                {role}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Full List Container */}
                  {product.ingredients?.fullList && (
                    <div className="p-4 bg-white rounded border border-border">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-charcoal-muted mb-1.5">
                        Full Packaging Ingredients Declaration:
                      </span>
                      <p className="font-mono text-xs text-charcoal leading-relaxed bg-[#FAF7F5] p-3 rounded border border-border/80">
                        {product.ingredients.fullList}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 5. FAQS ACCORDION */}
            <div className="border border-border/80 rounded bg-white overflow-hidden shadow-xs transition-all">
              <button
                type="button"
                onClick={() => toggleAccordion('faqs')}
                className="w-full py-4 px-5 sm:px-6 flex items-center justify-between text-left bg-white hover:bg-[#FAF7F5] transition-colors cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-plum" />
                  <span className="font-sans text-base sm:text-lg font-bold text-charcoal tracking-tight">
                    FAQs
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#FAF7F5] border border-border flex items-center justify-center text-charcoal transition-transform duration-200">
                  {openAccordions.faqs ? (
                    <ChevronUp className="w-4 h-4 text-plum" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-charcoal-muted" />
                  )}
                </div>
              </button>

              {openAccordions.faqs && (
                <div className="px-5 sm:px-6 pb-6 pt-3 border-t border-[#F0ECE7] bg-[#FCFBF9]/40 animate-in fade-in-50 duration-200">
                  <div className="space-y-3.5 mt-2">
                    {(product.faqs && product.faqs.length > 0
                      ? product.faqs
                      : [
                        {
                          question: 'How often should I use this SENSEIN formulation?',
                          answer:
                            'Use as part of your regular grooming and salon care ritual according to your hair and skin type recommendations.',
                        },
                        {
                          question: 'Is this formulation suitable for all hair and skin textures?',
                          answer:
                            'Yes, SENSEIN formulations are engineered with biomimetic clean botanicals suitable for Indian hair textures, chemically treated hair, and diverse skin types.',
                        },
                        {
                          question: 'What is the shelf life and storage advice?',
                          answer:
                            'Shelf life is 36 months from manufacturing date. Store in a cool, dry place away from direct sunlight.',
                        },
                      ]
                    ).map((faq: any, idx: number) => (
                      <div key={idx} className="p-4 sm:p-5 bg-white rounded-lg border border-border shadow-2xs space-y-2">
                        <h5 className="font-sans text-sm sm:text-base font-bold text-charcoal tracking-tight flex items-start gap-2.5">
                          <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-plum flex-shrink-0 mt-0.5" />
                          <span>{faq.question || faq.q}</span>
                        </h5>
                        <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed pl-6 sm:pl-7 font-normal">
                          {faq.answer || faq.a}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 6. ADDITIONAL INFORMATION ACCORDION */}
            <div className="border border-border/80 rounded bg-white overflow-hidden shadow-xs transition-all">
              <button
                type="button"
                onClick={() => toggleAccordion('additionalInfo')}
                className="w-full py-4 px-5 sm:px-6 flex items-center justify-between text-left bg-white hover:bg-[#FAF7F5] transition-colors cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-plum" />
                  <span className="font-sans text-base sm:text-lg font-bold text-charcoal tracking-tight">
                    Additional Information
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#FAF7F5] border border-border flex items-center justify-center text-charcoal transition-transform duration-200">
                  {openAccordions.additionalInfo ? (
                    <ChevronUp className="w-4 h-4 text-plum" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-charcoal-muted" />
                  )}
                </div>
              </button>

              {openAccordions.additionalInfo && (
                <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-[#F0ECE7] bg-[#FCFBF9]/40 animate-in fade-in-50 duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    {product.additionalInfo ? (
                      Object.entries(product.additionalInfo).map(([key, val]) => (
                        <div
                          key={key}
                          className={`p-3.5 bg-white rounded border border-border ${String(val).length > 40 ? 'sm:col-span-2' : ''
                            }`}
                        >
                          <span className="block text-[10px] font-bold uppercase tracking-wider text-charcoal-muted mb-1 capitalize">
                            {key.replace(/([A-Z])/g, ' $1')}
                          </span>
                          <span className="text-xs font-semibold text-charcoal">
                            {String(val)}
                          </span>
                        </div>
                      ))
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* VERIFIED CUSTOMER REVIEWS BLOCK */}
          <div className="mt-12 bg-white p-6 sm:p-8 rounded border border-border shadow-xs">
            <div className="flex flex-col sm:flex-row items-center gap-8 pb-8 border-b border-border/80">
              <div className="text-center sm:text-left">
                <div className="font-mono text-5xl font-black text-charcoal tracking-tight">{product.rating || 4.9}</div>
                <div className="flex items-center text-gold my-1 justify-center sm:justify-start">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>
                <span className="text-xs text-charcoal-muted">Based on {product.reviewCount || 48} verified patron reviews</span>
              </div>

              <div className="flex-1 w-full space-y-1.5 text-xs text-charcoal-muted">
                <div className="flex items-center gap-2">
                  <span className="w-8">5★</span>
                  <div className="flex-1 bg-border h-2 rounded-full overflow-hidden">
                    <div className="bg-gold h-full rounded-full" style={{ width: '92%' }} />
                  </div>
                  <span className="w-8 text-right">92%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-8">4★</span>
                  <div className="flex-1 bg-border h-2 rounded-full overflow-hidden">
                    <div className="bg-gold h-full rounded-full" style={{ width: '8%' }} />
                  </div>
                  <span className="w-8 text-right">8%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-8">3★</span>
                  <div className="flex-1 bg-border h-2 rounded-full overflow-hidden">
                    <div className="bg-gold h-full rounded-full" style={{ width: '0%' }} />
                  </div>
                  <span className="w-8 text-right">0%</span>
                </div>
              </div>
            </div>

            {/* Individual Reviews */}
            <div className="space-y-4 pt-6">
              {(product.reviews && product.reviews.length > 0 ? product.reviews : [
                {
                  id: 'rev-01',
                  author: 'Rohit Sharma',
                  rating: 5,
                  title: 'Amazing hold and non-sticky shine!',
                  content: 'Hands down the best hair wax I have used. Gives great shine without making my hair feel greasy or stiff. Lasts throughout the entire day.',
                  date: '14 Mar 2026',
                  verifiedBuyer: true
                },
                {
                  id: 'rev-02',
                  author: 'Aakash Verma',
                  rating: 5,
                  title: 'Super easy to restyle and wash out',
                  content: 'Washes out cleanly with regular water. The fragrance is very pleasant and luxury. Gives a solid 4/5 hold that allows easy restyling.',
                  date: '28 Mar 2026',
                  verifiedBuyer: true
                },
                {
                  id: 'rev-03',
                  author: 'Vikram Mehta',
                  rating: 5,
                  title: 'Worth every rupee!',
                  content: '100g jar at ₹249 is unbelievable value for this level of quality. The texture and spreadability is top notch.',
                  date: '05 Apr 2026',
                  verifiedBuyer: true
                }
              ]).map((rev: any) => (
                <div key={rev.id} className="p-4 bg-alabaster/40 rounded border border-border/70 space-y-1.5">
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
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />
                    ))}
                  </div>
                  <h5 className="font-sans text-sm font-bold text-charcoal tracking-tight">{rev.title}</h5>
                  <p className="text-xs text-charcoal-muted leading-relaxed">{rev.content}</p>
                </div>
              ))}
            </div>
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
