import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { GlobalErrorHandler } from '@/components/common/GlobalErrorHandler';
import { SITE_CONFIG } from '@/lib/seo/metadata';
import { generateSiteJsonLd } from '@/lib/seo/jsonld';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.domain),
  title: {
    default: `${SITE_CONFIG.name} — High-Precision Geographic & Cartographic Tools`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  applicationName: SITE_CONFIG.name,
  authors: [{ name: SITE_CONFIG.author, url: SITE_CONFIG.domain }],
  generator: 'Next.js',
  keywords: [
    'geographic tools',
    'map radius tool',
    'map area calculator',
    'distance between places',
    'gps coordinate converter',
    'blank map library',
    'us county map',
    'geodesic distance',
    'isochrone map',
  ],
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_CONFIG.domain,
    title: `${SITE_CONFIG.name} — High-Precision Geographic Tools`,
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_CONFIG.name} — High-Precision Geographic Tools`,
    description: SITE_CONFIG.description,
    creator: SITE_CONFIG.twitterHandle,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteSchema = generateSiteJsonLd();

  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
        />
      </head>
      <body className="flex min-h-screen flex-col bg-[#fcfbf9] text-[#1a1a18] antialiased selection:bg-[#7c6a4f] selection:text-white">
        <GlobalErrorHandler />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
