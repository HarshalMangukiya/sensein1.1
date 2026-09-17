import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Outfit, Cinzel, Playfair_Display } from 'next/font/google';
import './globals.css';
import { AnnouncementBar } from '@/components/announcement-bar';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CartDrawer } from '@/components/cart-drawer';
import { AuthModal } from '@/components/auth-modal';
import { FlyToCartProvider } from '@/components/fly-to-cart';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-luxury',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SENSEIN PROFESSIONAL — Luxury Cosmetics & Bio-Active Haircare',
  description: 'Pioneering cellular trichology, restorative keratin complexes, and pure French plum formulations. Salon grade luxury hair and skincare engineered for radiant perfection.',
  keywords: ['luxury haircare', 'SENSEIN PROFESSIONAL', 'keratin mask', 'hair serum', 'sulfate free shampoo', 'caviar scalp treatment'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${outfit.variable} ${cinzel.variable} ${playfair.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-[#FAF7F5] text-charcoal antialiased">
        <FlyToCartProvider>
          <AnnouncementBar />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <AuthModal />
        </FlyToCartProvider>
      </body>
    </html>
  );
}
