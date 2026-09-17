import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye, FileText, Mail, Phone, MapPin } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — SENSEIN PROFESSIONAL',
  description: 'Learn how SENSEIN PROFESSIONAL collects, protects, and handles your personal data across our luxury haircare rituals and concierge services.',
};

export default function PrivacyPolicyPage() {
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
            <Shield className="w-5 h-5 text-[#5A3859]" />
            <span className="text-xs uppercase tracking-widest font-bold">Legal & Security</span>
          </div>
          <h1 className="font-sans tracking-tight text-3xl sm:text-4xl font-bold text-neutral-900 mb-3">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500">
            Last Updated: September 2026 • Governed by the Information Technology Act, 2000 & Digital Personal Data Protection Act (DPDP)
          </p>
        </div>

        {/* Policy Body */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-10 shadow-xs space-y-8 text-neutral-700 text-sm leading-relaxed">
          
          <section>
            <h2 className="font-sans tracking-tight text-xl font-bold text-neutral-900 mb-3 flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#5A3859]" /> 1. Commitment to Your Privacy
            </h2>
            <p>
              At <strong>SENSEIN PROFESSIONAL</strong> (operated under Olive Enterprises / Sitaram Cosmetics), we hold your privacy and personal information in the highest esteem. This Privacy Policy details how we collect, process, safeguard, and disclose your personal details when you explore our digital boutique at{' '}
              <span className="text-[#5A3859] font-medium">sensein.in</span>, purchase our luxury hair elixirs, or interact with our private client concierge.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans tracking-tight text-xl font-bold text-neutral-900 flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#5A3859]" /> 2. Information We Collect
            </h2>
            <p>We collect only information essential to delivering bespoke haircare and seamless transactions:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-neutral-600">
              <li>
                <strong>Identity & Contact Details:</strong> Name, phone number, shipping address, and email address provided during checkout or OTP login.
              </li>
              <li>
                <strong>Transactional Records:</strong> Order history, tracking numbers (AWB), invoices, and payment confirmation tokens. We never store credit/debit card numbers or CVV; all financial processing is secured via Razorpay PCI-DSS certified gateways.
              </li>
              <li>
                <strong>Haircare Profile & Ritual Consultation:</strong> Hair texture, porosity concerns, scalp preferences, and ritual inquiries submitted to our concierge team.
              </li>
              <li>
                <strong>Technical & Device Data:</strong> IP address, browser type, geographic location, and session analytics collected via standard encrypted cookies.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans tracking-tight text-xl font-bold text-neutral-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#5A3859]" /> 3. How We Use Your Data
            </h2>
            <p>Your data enables us to curate an elevated experience:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-neutral-600">
              <li>Facilitating priority Pan-India express dispatch and real-time SMS/WhatsApp order tracking.</li>
              <li>Verifying client identification using secure One-Time Passcodes (OTP).</li>
              <li>Allocating tier-based VIP gifts, promotional privileges, and exclusive lookbook previews.</li>
              <li>Continuously refining formulation efficacy based on aggregated customer feedback.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans tracking-tight text-xl font-bold text-neutral-900 mb-3">
              4. Data Protection & 256-Bit Encryption
            </h2>
            <p>
              All customer sessions and communications are protected with industry-standard 256-bit SSL encryption. Data repositories are hosted on secure, firewall-shielded cloud infrastructure with strict role-based access control.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans tracking-tight text-xl font-bold text-neutral-900 mb-3">
              5. Third-Party Sharing & Logistics
            </h2>
            <p>
              We do not sell, rent, or trade your personal information. Data is shared solely with vetted partners critical to our operational excellence:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-neutral-600">
              <li><strong>Logistics Partners:</strong> Delhivery, BlueDart, and DTDC for door-to-door temperature-protected delivery.</li>
              <li><strong>Payment Gateway:</strong> Razorpay for RBI-compliant, 3D-secure payments.</li>
              <li><strong>Communication Channels:</strong> Transactional SMS and WhatsApp updates for delivery alerts.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans tracking-tight text-xl font-bold text-neutral-900 mb-3">
              6. Client Rights & Communications Opt-Out
            </h2>
            <p>
              You maintain full dominion over your data. You may request access to, amendment of, or deletion of your customer profile at any time. To opt out of non-transactional marketing messages, simply click &quot;Unsubscribe&quot; in any email or message our concierge.
            </p>
          </section>

          <section className="pt-6 border-t border-neutral-200">
            <h2 className="font-sans tracking-tight text-xl font-bold text-neutral-900 mb-4">
              7. Concierge & Grievance Contact
            </h2>
            <div className="bg-[#FAF7F5] p-5 rounded-xl space-y-2 text-xs sm:text-sm text-neutral-700">
              <p className="font-semibold text-neutral-900">SENSEIN PROFESSIONAL Grievance Cell</p>
              <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-[#5A3859]" /> Olive Enterprises / Sitaram Cosmetics, Surat, Gujarat, India</p>
              <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-[#5A3859]" /> concierge@sensein.in</p>
              <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-[#5A3859]" /> +91 98110 22334 (Mon – Sat, 10:00 AM – 7:00 PM IST)</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
