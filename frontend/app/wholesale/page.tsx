'use client';

import React, { useState } from 'react';
import {
  Building2,
  Send,
  CheckCircle,
  FileText,
  Shield,
  Sparkles,
  Award,
  Download,
} from 'lucide-react';
import { submitWholesaleInquiry } from '@/lib/api';

export default function WholesalePage() {
  const [formData, setFormData] = useState({
    distributionType: 'Salon & Spa Chain',
    organizationName: '',
    gstin: '',
    contactPerson: '',
    email: '',
    phone: '',
    estimatedQuantity: '200-500 units',
    expectedDeliveryDate: '',
    productLines: ['Haircare', 'Scalp Therapy'],
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [submittedResponse, setSubmittedResponse] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const distributionOptions = [
    'Salon & Spa Chain',
    'Luxury Hotel / Resort Amenities',
    'Retail Beauty Distributor',
    'Corporate Luxury Gifting',
    'Medical Trichology Clinic',
  ];

  const quantityTiers = [
    '50 - 200 units (Salon Trial Tier)',
    '200 - 500 units (Standard Wholesale Tier)',
    '500 - 2,000 units (Regional Distributor)',
    '2,000+ units (National Partner / Backbar Bulk)',
  ];

  const productLineOptions = [
    'Keratin Repair Haircare',
    'Bio-Active Scalp Elixirs',
    'Fine Botanical Fragrances',
    'Hospitality Backbar Amenity Dispensers',
    'Styling & Texturizing Lab',
  ];

  const handleCheckboxChange = (line: string) => {
    setFormData((prev) => {
      const exists = prev.productLines.includes(line);
      return {
        ...prev,
        productLines: exists
          ? prev.productLines.filter((l) => l !== line)
          : [...prev.productLines, line],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.organizationName || !formData.contactPerson || !formData.email || !formData.phone) {
      setError('Please fill in all required corporate fields');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await submitWholesaleInquiry(formData);
      setSubmittedResponse(res);
    } catch (err: any) {
      setError(err.message || 'Failed to submit inquiry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 bg-plum/10 text-plum text-xs uppercase tracking-widest font-semibold px-4 py-1 rounded-full">
          <Building2 className="w-4 h-4" /> B2B Enterprise & Salon Distribution
        </div>
        <h1 className="font-sans text-4xl sm:text-5xl font-bold text-charcoal tracking-tight">
          Partner with SENSEIN PROFESSIONAL
        </h1>
        <p className="text-sm sm:text-base text-charcoal-muted leading-relaxed font-light">
          Bring authentic Parisian cellular hair architecture and bioactive botanicals to your salon chain, luxury hotel amenities, or boutique retail network.
        </p>
      </div>

      {/* Feature Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="p-6 bg-white border border-border rounded-sm space-y-2">
          <Award className="w-6 h-6 text-plum" />
          <h4 className="font-sans text-base font-bold text-charcoal tracking-tight">Direct Salon Tier Pricing</h4>
          <p className="text-xs text-charcoal-muted leading-relaxed">
            Tier discounts up to 45% off retail MRP with dedicated credit line arrangements for established salon networks.
          </p>
        </div>

        <div className="p-6 bg-white border border-border rounded-sm space-y-2">
          <Sparkles className="w-6 h-6 text-plum" />
          <h4 className="font-sans text-base font-bold text-charcoal tracking-tight">Stylist Masterclass Training</h4>
          <p className="text-xs text-charcoal-muted leading-relaxed">
            Complimentary in-salon formulation masterclasses and certified protocol training by senior French salon educators.
          </p>
        </div>

        <div className="p-6 bg-white border border-border rounded-sm space-y-2">
          <Shield className="w-6 h-6 text-plum" />
          <h4 className="font-sans text-base font-bold text-charcoal tracking-tight">Custom Amenity Formulations</h4>
          <p className="text-xs text-charcoal-muted leading-relaxed">
            Co-branded 300ml pump dispensers and zero-waste refill carboys for five-star hotel suites and wellness retreats.
          </p>
        </div>
      </div>

      {/* Submission Form / Success View */}
      <div className="max-w-3xl mx-auto bg-white border border-border rounded-sm p-8 sm:p-12 shadow-xs">
        {submittedResponse ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-light text-emerald flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-plum">
              Reference: {submittedResponse.referenceCode}
            </span>
            <h3 className="font-sans text-3xl font-bold text-charcoal tracking-tight">
              Partnership Inquiry Received
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-muted max-w-lg mx-auto leading-relaxed">
              {submittedResponse.message}
            </p>

            <div className="pt-6">
              <a
                href="#download"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Wholesale lookbook and rate card downloaded.');
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-charcoal hover:bg-plum text-white text-xs font-semibold uppercase tracking-wider rounded transition"
              >
                <Download className="w-4 h-4" /> Download 2026 Wholesale Lookbook (PDF)
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-b border-border pb-4">
              <h3 className="font-sans text-2xl font-bold text-charcoal tracking-tight">
                Corporate Wholesale Application
              </h3>
              <p className="text-xs text-charcoal-muted mt-1">
                Fill out the dossier below. Our Enterprise Concierge will reach out with customized wholesale quotes.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
                {error}
              </div>
            )}

            {/* Distribution type */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-charcoal mb-2">
                Type of Organization / Distribution Channel *
              </label>
              <select
                value={formData.distributionType}
                onChange={(e) => setFormData({ ...formData, distributionType: e.target.value })}
                className="w-full px-3.5 py-3 bg-[#FAF7F5] border border-border text-xs rounded-sm focus:outline-none focus:border-plum"
              >
                {distributionOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Organization Name & GSTIN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-charcoal mb-1">
                  Organization / Salon Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.organizationName}
                  onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                  placeholder="e.g. Atelier De Beaute Spa Group"
                  className="w-full px-3 py-2.5 bg-[#FAF7F5] border border-border rounded-sm focus:outline-none focus:border-plum"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-charcoal mb-1">
                  GSTIN / Business Registration (Optional)
                </label>
                <input
                  type="text"
                  value={formData.gstin}
                  onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                  placeholder="e.g. 07AAAAA0000A1Z5"
                  className="w-full px-3 py-2.5 bg-[#FAF7F5] border border-border rounded-sm focus:outline-none focus:border-plum"
                />
              </div>
            </div>

            {/* Contact Person, Email, Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-charcoal mb-1">
                  Contact Person *
                </label>
                <input
                  type="text"
                  required
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  placeholder="e.g. Aditi Singhal"
                  className="w-full px-3 py-2.5 bg-[#FAF7F5] border border-border rounded-sm focus:outline-none focus:border-plum"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-charcoal mb-1">
                  Business Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. director@atelierbeaute.in"
                  className="w-full px-3 py-2.5 bg-[#FAF7F5] border border-border rounded-sm focus:outline-none focus:border-plum"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-charcoal mb-1">
                  Phone / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. +91 98110 99887"
                  className="w-full px-3 py-2.5 bg-[#FAF7F5] border border-border rounded-sm focus:outline-none focus:border-plum"
                />
              </div>
            </div>

            {/* Estimated Quantity & Expected Delivery Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-charcoal mb-1">
                  Estimated Quantity Required *
                </label>
                <select
                  value={formData.estimatedQuantity}
                  onChange={(e) => setFormData({ ...formData, estimatedQuantity: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#FAF7F5] border border-border rounded-sm focus:outline-none focus:border-plum"
                >
                  {quantityTiers.map((q) => (
                    <option key={q} value={q}>
                      {q}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-charcoal mb-1">
                  Target Launch / Delivery Date
                </label>
                <input
                  type="date"
                  value={formData.expectedDeliveryDate}
                  onChange={(e) => setFormData({ ...formData, expectedDeliveryDate: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#FAF7F5] border border-border rounded-sm focus:outline-none focus:border-plum"
                />
              </div>
            </div>

            {/* Targeted Product Lines */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-charcoal mb-2">
                Targeted Product Lines of Interest
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {productLineOptions.map((line) => (
                  <label key={line} className="flex items-center gap-2 p-2 rounded bg-[#FAF7F5] border border-border cursor-pointer hover:border-plum/50">
                    <input
                      type="checkbox"
                      checked={formData.productLines.includes(line)}
                      onChange={() => handleCheckboxChange(line)}
                      className="text-plum focus:ring-plum"
                    />
                    <span className="text-charcoal">{line}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional notes */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-charcoal mb-1">
                Custom Formulation or Backbar Specifications
              </label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Share your salon station count, current brands stocked, or any specific logistics requirements..."
                className="w-full px-3 py-2.5 bg-[#FAF7F5] border border-border text-xs rounded-sm focus:outline-none focus:border-plum"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-plum hover:bg-plum-dark text-white text-xs font-bold uppercase tracking-[0.18em] rounded-sm transition shadow flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? 'Transmitting Dossier...' : 'Submit Wholesale Application'}
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
