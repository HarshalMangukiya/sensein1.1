'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, X, Star, ArrowRight } from 'lucide-react';
import { fetchProducts } from '@/lib/api';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await fetchProducts({ search: query });
        setResults(data.products || []);
      } catch (err) {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const popularSearches = ['Keratin Mask', 'Caviar Shampoo', 'French Plum Serum', 'Scalp Elixir', 'Hair Mist'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative mx-auto max-w-2xl bg-white rounded-sm border border-border shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-border px-4 py-3 bg-[#FAF7F5]">
          <Search className="w-5 h-5 text-plum" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search luxury formulations, actives, or concerns..."
            className="w-full bg-transparent px-3 py-2 text-sm text-charcoal placeholder-charcoal-muted focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-charcoal-muted hover:text-charcoal mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs uppercase tracking-wider font-semibold text-charcoal-muted hover:text-plum"
          >
            ESC
          </button>
        </div>

        {/* Suggestions / Results */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {!query ? (
            <div>
              <p className="text-[11px] uppercase tracking-widest font-semibold text-charcoal-muted mb-3">
                Trending Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-3 py-1.5 rounded-full bg-alabaster border border-border text-xs text-charcoal hover:border-plum hover:text-plum transition"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : loading ? (
            <div className="py-8 text-center text-xs text-charcoal-muted">
              Searching SENSEIN archives...
            </div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center text-xs text-charcoal-muted">
              No matching formulation found for "{query}".
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-widest font-semibold text-charcoal-muted mb-2">
                Found {results.length} Formulations
              </p>
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-4 p-2.5 rounded hover:bg-alabaster transition group border border-transparent hover:border-border"
                >
                  <div className="w-12 h-12 bg-white rounded flex-shrink-0 p-1 border border-border">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] uppercase tracking-widest text-plum font-semibold block">
                      {product.category}
                    </span>
                    <h4 className="font-serif text-sm font-semibold text-charcoal group-hover:text-plum transition-colors truncate">
                      {product.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-bold text-charcoal">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      <div className="flex items-center text-gold text-[11px]">
                        <Star className="w-3 h-3 fill-gold" />
                        <span className="ml-0.5 text-charcoal font-medium">{product.rating}</span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-charcoal-muted group-hover:text-plum group-hover:translate-x-1 transition-transform" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
