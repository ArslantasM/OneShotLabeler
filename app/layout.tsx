import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'OneShotLabeler - AI Veri Etiketleme Platformu',
  description: 'Hızlı ve verimli görsel veri etiketleme ve augmentation platformu. YOLO, COCO ve Pascal VOC formatlarında veri seti oluşturun.',
  keywords: ['AI', 'veri etiketleme', 'object detection', 'YOLO', 'COCO', 'augmentation', 'machine learning'],
  authors: [{ name: 'OneShotLabeler Team' }],
  creator: 'OneShotLabeler',
  publisher: 'OneShotLabeler',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'OneShotLabeler - AI Veri Etiketleme Platformu',
    description: 'Hızlı ve verimli görsel veri etiketleme ve augmentation platformu.',
    url: 'http://localhost:3000',
    siteName: 'OneShotLabeler',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'OneShotLabeler - AI Veri Etiketleme Platformu',
      },
    ],
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OneShotLabeler - AI Veri Etiketleme Platformu',
    description: 'Hızlı ve verimli görsel veri etiketleme ve augmentation platformu.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="h-full">
      <head>
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="OneShotLabeler" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#3b82f6" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} h-full`}>
        <div id="root" className="h-full">
          {children}
        </div>
      </body>
    </html>
  );
}
