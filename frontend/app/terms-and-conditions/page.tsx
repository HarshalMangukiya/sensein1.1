import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Scale, Award, Package, CreditCard, RotateCcw, AlertCircle, Phone, Mail, MapPin } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions — SENSEIN PROFESSIONAL',
  description: 'Terms and Conditions governing orders, luxury formulations, delivery, and concierge policies at SENSEIN PROFESSIONAL.',
};

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F5] py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-[#5A3859] transition uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
        </div>

        {/* Header Title Card */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-10 shadow-xs mb-8">
          <div className="flex items-center gap-3 text-[#5A3859] mb-3">
            <Scale className="w-5 h-5 text-[#5A3859]" />
            <span className="text-xs uppercase tracking-widest font-bold">Client Agreement</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 mb-3">
            Terms & Conditions
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500">
            Effective Date: September 2026 • Published by Olive Enterprises / Sitaram Cosmetics (SENSEIN®)
          </p>
        </div>

        {/* Terms Body */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-10 shadow-xs space-y-8 text-neutral-700 text-sm leading-relaxed">
          
          <section>
            <h2 className="font-serif text-xl font-bold text-neutral-900 mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-[#5A3859]" /> 1. Acceptance of Terms
            </h2>
            <p>
              Welcome to <strong>SENSEIN PROFESSIONAL</strong>. By browsing our boutique, subscribing to our private client circle, or placing an order for our professional hair alchemy rituals, you unconditionally accept and agree to abide by these Terms and Conditions. If you do not agree with any provision herein, please refrain from using our digital services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-neutral-900 flex items-center gap-2">
              <Package className="w-4 h-4 text-[#5A3859]" /> 2. Formulations & Authenticity
            </h2>
            <p>
              Every SENSEIN® formulation is engineered under rigorous dermatological standards, utilizing cold-pressed French Ente Plum oils, hydrolyzed micro-keratin peptides, and botanicals free of harmful sulfates and parabens.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-neutral-600">
              <li>All formulations sold on sensein.in are guaranteed 100% genuine and fresh from our clinical manufacturing lab.</li>
              <li>Patch testing is recommended prior to using any cosmetic formulation.</li>
              <li>Product imagery accurately depicts our laboratory packaging; slight natural variations in organic active color may occur between batches.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-neutral-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#5A3859]" /> 3. Pricing, Orders & Payments
            </h2>
            <p>
              All prices displayed on the website are in Indian Rupees (INR) and are inclusive of applicable Goods and Services Tax (GST).
            </p>
            <ul className="list-disc pl-5 space-y-1 text-neutral-600">
              <li>We accept payments via UPI, Credit/Debit Cards, Net Banking, and select digital wallets through Razorpay.</li>
              <li>Promotional coupon codes (e.g., LUXE10, SENSEIN200) are subject to specific minimum order criteria and cannot be combined unless explicitly stated.</li>
              <li>SENSEIN reserves the right to decline or cancel orders due to pricing errors or inventory constraints, with immediate full refund.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-neutral-900 mb-3">
              4. Pan-India Dispatch & Delivery
            </h2>
            <p>
              Orders are dispatched from our climate-controlled fulfillment hub within 24–48 hours of order confirmation.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-neutral-600">
              <li><strong>Complimentary Shipping:</strong> Automatically granted on all domestic orders of ₹499 and above.</li>
              <li><strong>Standard Delivery:</strong> 2 to 5 business days for major metropolitan areas; 4 to 7 business days for regional destinations.</li>
              <li><strong>Tracking:</strong> An Airway Bill (AWB) number with live real-time tracking will be transmitted to your registered phone number and email upon handover to logistics partners.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-neutral-900 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-[#5A3859]" /> 5. Replacement & Return Policy
            </h2>
            <p>
              Due to the personal nature of luxury cosmetics and hygiene regulations, opened or used bottles cannot be returned.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-neutral-600">
              <li><strong>Transit Damage or Defect:</strong> If your order arrives damaged or incorrect, notify our concierge at <span className="text-[#5A3859] font-medium">concierge@sensein.in</span> within 48 hours with photographic evidence. We will dispatch an expedited complimentary replacement without delay.</li>
              <li><strong>Cancellation:</strong> Orders may be cancelled prior to dispatch by contacting concierge support. Once handed to the courier, orders cannot be intercepted.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-neutral-900 mb-3">
              6. Intellectual Property & Trademarks
            </h2>
            <p>
              <strong>SENSEIN®</strong> is a registered trademark belonging to Sitaram Cosmetics / Olive Enterprises. All trademarks, typography, bottle visual designs, copywriting, and media on this website are protected under Indian and international intellectual property laws. Unauthorized duplication or resale is strictly prohibited.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-neutral-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#5A3859]" /> 7. Governing Law & Dispute Resolution
            </h2>
            <p>
              These Terms and Conditions shall be governed by and construed in accordance with the laws of the Republic of India. Any legal dispute or claim arising hereunder shall be subject to the exclusive jurisdiction of the competent courts in Surat, Gujarat, India.
            </p>
          </section>

          <section className="pt-6 border-t border-neutral-200">
            <h2 className="font-serif text-xl font-bold text-neutral-900 mb-4">
              8. Customer Concierge Support
            </h2>
            <div className="bg-[#FAF7F5] p-5 rounded-xl space-y-2 text-xs sm:text-sm text-neutral-700">
              <p className="font-semibold text-neutral-900">SENSEIN Client Relations</p>
              <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-[#5A3859]" /> Olive Enterprises, Surat, Gujarat, India</p>
              <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-[#5A3859]" /> concierge@sensein.in</p>
              <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-[#5A3859]" /> +91 98110 22334 (Mon – Sat, 10:00 AM – 7:00 PM IST)</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
