'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Filter,
  SlidersHorizontal,
  Grid,
  List,
  ChevronDown,
  ChevronUp,
  X,
  RotateCcw,
  Star,
} from 'lucide-react';
import { ProductCard } from '@/components/product-card';
import { fetchProducts } from '@/lib/api';

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Filter states from URL query or local state
  const initialCategory = searchParams.get('category') || 'All';
  const initialCollection = searchParams.get('collection') || 'All';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCollection, setSelectedCollection] = useState(initialCollection);
  const [priceRange, setPriceRange] = useState<string>('all');
  const [minRating, setMinRating] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState<string>('featured');
  const [viewLayout, setViewLayout] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Accordion toggle states
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    categories: true,
    collections: true,
    price: true,
    ratings: true,
  });

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { label: 'All Formulations', value: 'All' },
    { label: 'Hair Masks', value: 'Mask' },
    { label: 'Shampoos', value: 'Shampoo' },
    { label: 'Serums & Oils', value: 'Serum' },
    { label: 'Scalp Elixirs', value: 'Elixir' },
    { label: 'Styling Creams', value: 'Cream' },
    { label: 'Texturizing Waxes', value: 'Wax' },
    { label: 'Fine Fragrances', value: 'Perfume' },
    { label: 'Facewash', value: 'Facewash' },
    { label: '₹1 Live Payment Test', value: 'Testing & Samples' },
  ];

  const collections = [
    { label: 'All Collections', value: 'All' },
    { label: 'Awarded Bestsellers', value: 'Bestsellers' },
    { label: 'Salon Exclusive Backbar', value: 'Salon Exclusive' },
    { label: 'Clean Formulation Lab', value: 'Clean Formulation' },
  ];

  const priceRanges = [
    { label: 'All Prices', value: 'all', min: undefined, max: undefined },
    { label: 'Under ₹1,000', value: 'under-1000', min: 0, max: 1000 },
    { label: '₹1,000 to ₹1,499', value: '1000-1500', min: 1000, max: 1500 },
    { label: '₹1,500 to ₹2,499', value: '1500-2500', min: 1500, max: 2500 },
    { label: '₹2,500 & Above', value: '2500-above', min: 2500, max: 10000 },
  ];

  const ratingOptions = [
    { label: '4.5★ & Above', value: 4.5 },
    { label: '4.0★ & Above', value: 4.0 },
    { label: '3.5★ & Above', value: 3.5 },
  ];

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedCollection('All');
    setPriceRange('all');
    setMinRating(null);
    setSortOption('featured');
    router.push('/shop');
  };

  useEffect(() => {
    async function loadFilteredProducts() {
      setLoading(true);
      try {
        const currentRange = priceRanges.find((p) => p.value === priceRange);
        const data = await fetchProducts({
          category: selectedCategory === 'All' ? undefined : selectedCategory,
          collection: selectedCollection === 'All' ? undefined : selectedCollection,
          minPrice: currentRange?.min,
          maxPrice: currentRange?.max,
          minRating: minRating || undefined,
          sort: sortOption,
        });
        setProducts(data.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadFilteredProducts();
  }, [selectedCategory, selectedCollection, priceRange, minRating, sortOption]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header & Breadcrumb */}
      <div className="mb-8">
        <div className="text-xs text-charcoal-muted uppercase tracking-widest mb-2">
          Home / Catalog / <span className="text-plum font-semibold">{selectedCategory}</span>
        </div>
        <h1 className="font-sans text-3xl sm:text-4xl font-bold text-charcoal tracking-tight">
          Formulation Archives
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-muted max-w-2xl mt-1.5 font-light">
          Discover clinical salon-grade rituals, molecular peptide masks, and bioactive botanical elixirs engineered in Paris.
        </p>
      </div>

      {/* Live Payment Gateway Verification Banner */}
      <div className="mb-8 p-4 bg-plum/5 border border-plum/20 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-plum text-white flex items-center justify-center text-xs font-bold shrink-0">
            ₹1
          </span>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-plum">
              Live Gateway Verification Mode Active
            </h4>
            <p className="text-[11px] text-charcoal-muted">
              Add the official ₹1 Test Item to verify live Razorpay checkout, UPI / Card capture, and Delhivery AWB generation.
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setSelectedCategory('Testing & Samples');
          }}
          className="self-start sm:self-auto px-4 py-2 bg-plum hover:bg-plum-dark text-white text-[11px] font-bold uppercase tracking-widest rounded-sm transition shrink-0"
        >
          View ₹1 Test Item
        </button>
      </div>

      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-4 px-5 bg-white border border-border rounded-sm mb-8 shadow-xs">
        {/* Left: Mobile filter button & product count */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-3.5 py-2 bg-plum text-white text-xs font-semibold uppercase tracking-wider rounded-sm"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
          </button>
          <span className="text-xs font-semibold text-charcoal uppercase tracking-wider">
            Showing {products.length} Formulations
          </span>
        </div>

        {/* Right: Sort & Layout toggles */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-charcoal-muted hidden sm:inline">Sort By:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-[#FAF7F5] border border-border text-xs text-charcoal font-medium py-1.5 px-3 rounded-sm focus:outline-none focus:border-plum"
            >
              <option value="featured">Featured & Bestsellers</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="discount">Biggest Discount</option>
            </select>
          </div>

          <div className="hidden sm:flex items-center border border-border rounded-sm overflow-hidden">
            <button
              onClick={() => setViewLayout('grid')}
              className={`p-1.5 transition ${viewLayout === 'grid' ? 'bg-plum text-white' : 'bg-white text-charcoal hover:text-plum'}`}
              aria-label="Grid view"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewLayout('list')}
              className={`p-1.5 transition ${viewLayout === 'list' ? 'bg-plum text-white' : 'bg-white text-charcoal hover:text-plum'}`}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid & Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* DESKTOP FILTER SIDEBAR */}
        <aside className="hidden lg:block space-y-6 bg-white p-6 rounded-sm border border-border">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <h3 className="font-sans text-base font-bold text-charcoal tracking-tight flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-plum" />
              Refine Catalog
            </h3>
            {(selectedCategory !== 'All' || selectedCollection !== 'All' || priceRange !== 'all' || minRating !== null) && (
              <button
                onClick={handleResetFilters}
                className="text-[11px] text-plum hover:underline font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            )}
          </div>

          {/* 1. Category Accordion */}
          <div className="border-b border-border/70 pb-5">
            <button
              onClick={() => toggleSection('categories')}
              className="w-full flex items-center justify-between text-xs uppercase tracking-widest font-bold text-charcoal mb-3"
            >
              <span>Category</span>
              {openSections.categories ? <ChevronUp className="w-3.5 h-3.5 text-charcoal-muted" /> : <ChevronDown className="w-3.5 h-3.5 text-charcoal-muted" />}
            </button>
            {openSections.categories && (
              <div className="space-y-2 text-xs">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`w-full text-left py-1 px-2 rounded transition flex items-center justify-between ${
                      selectedCategory === cat.value
                        ? 'bg-plum text-white font-semibold'
                        : 'text-charcoal hover:text-plum hover:bg-alabaster'
                    }`}
                  >
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Curated Collections Accordion */}
          <div className="border-b border-border/70 pb-5">
            <button
              onClick={() => toggleSection('collections')}
              className="w-full flex items-center justify-between text-xs uppercase tracking-widest font-bold text-charcoal mb-3"
            >
              <span>Collections</span>
              {openSections.collections ? <ChevronUp className="w-3.5 h-3.5 text-charcoal-muted" /> : <ChevronDown className="w-3.5 h-3.5 text-charcoal-muted" />}
            </button>
            {openSections.collections && (
              <div className="space-y-2 text-xs">
                {collections.map((col) => (
                  <button
                    key={col.value}
                    onClick={() => setSelectedCollection(col.value)}
                    className={`w-full text-left py-1 px-2 rounded transition flex items-center justify-between ${
                      selectedCollection === col.value
                        ? 'bg-plum text-white font-semibold'
                        : 'text-charcoal hover:text-plum hover:bg-alabaster'
                    }`}
                  >
                    <span>{col.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 3. Price Range Accordion */}
          <div className="border-b border-border/70 pb-5">
            <button
              onClick={() => toggleSection('price')}
              className="w-full flex items-center justify-between text-xs uppercase tracking-widest font-bold text-charcoal mb-3"
            >
              <span>Price Range</span>
              {openSections.price ? <ChevronUp className="w-3.5 h-3.5 text-charcoal-muted" /> : <ChevronDown className="w-3.5 h-3.5 text-charcoal-muted" />}
            </button>
            {openSections.price && (
              <div className="space-y-2 text-xs">
                {priceRanges.map((range) => (
                  <label
                    key={range.value}
                    className="flex items-center gap-2.5 text-charcoal cursor-pointer hover:text-plum py-0.5"
                  >
                    <input
                      type="radio"
                      name="priceRange"
                      checked={priceRange === range.value}
                      onChange={() => setPriceRange(range.value)}
                      className="text-plum focus:ring-plum"
                    />
                    <span>{range.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* 4. Customer Rating Accordion */}
          <div>
            <button
              onClick={() => toggleSection('ratings')}
              className="w-full flex items-center justify-between text-xs uppercase tracking-widest font-bold text-charcoal mb-3"
            >
              <span>Customer Rating</span>
              {openSections.ratings ? <ChevronUp className="w-3.5 h-3.5 text-charcoal-muted" /> : <ChevronDown className="w-3.5 h-3.5 text-charcoal-muted" />}
            </button>
            {openSections.ratings && (
              <div className="space-y-2 text-xs">
                {ratingOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setMinRating(minRating === opt.value ? null : opt.value)}
                    className={`w-full text-left py-1 px-2 rounded transition flex items-center justify-between ${
                      minRating === opt.value
                        ? 'bg-plum text-white font-semibold'
                        : 'text-charcoal hover:text-plum hover:bg-alabaster'
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-gold text-gold" />
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* PRODUCT GRID CONTAINER */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white p-4 h-80 sm:h-96 animate-pulse rounded-md border border-border" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white border border-border p-12 text-center rounded-sm">
              <p className="font-sans text-xl font-bold text-charcoal mb-2 tracking-tight">
                No Formulations Found
              </p>
              <p className="text-xs text-charcoal-muted max-w-sm mx-auto mb-6">
                Try widening your price range or clearing filters to view available salon rituals.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 bg-plum text-white text-xs uppercase tracking-widest font-semibold rounded hover:bg-plum-dark transition"
              >
                Clear All Filters
              </button>
            </div>
          ) : viewLayout === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} layout="grid" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} layout="list" />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MOBILE FILTER MODAL / DRAWER */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl p-6 flex flex-col justify-between z-10 animate-in slide-in-from-right duration-300">
            <div className="overflow-y-auto pr-1">
              <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
                <h3 className="font-sans text-lg font-bold text-charcoal tracking-tight">Filter Catalog</h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 text-charcoal hover:text-plum"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category options */}
              <div className="mb-6">
                <h4 className="text-xs uppercase tracking-widest font-bold text-charcoal mb-2">Category</h4>
                <div className="space-y-1 text-xs">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setSelectedCategory(cat.value)}
                      className={`w-full text-left py-1.5 px-2 rounded ${
                        selectedCategory === cat.value ? 'bg-plum text-white font-semibold' : 'text-charcoal'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price options */}
              <div className="mb-6">
                <h4 className="text-xs uppercase tracking-widest font-bold text-charcoal mb-2">Price Range</h4>
                <div className="space-y-1 text-xs">
                  {priceRanges.map((range) => (
                    <label key={range.value} className="flex items-center gap-2 py-1 text-charcoal">
                      <input
                        type="radio"
                        name="mobilePrice"
                        checked={priceRange === range.value}
                        onChange={() => setPriceRange(range.value)}
                        className="text-plum"
                      />
                      <span>{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex gap-3">
              <button
                onClick={handleResetFilters}
                className="flex-1 py-2.5 border border-border text-charcoal text-xs uppercase font-semibold rounded"
              >
                Reset
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-2.5 bg-plum text-white text-xs uppercase font-semibold rounded"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-12 text-center text-xs">Loading luxury archives...</div>}>
      <ShopContent />
    </Suspense>
  );
}
