import type { Metadata } from "next";
import { Space_Grotesk, Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import { AuthProvider } from "@/contexts/AuthContext";
import AccessibilityPanel from "@/components/AccessibilityPanel";
import KeyboardShortcuts from "@/components/KeyboardShortcuts";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import { ToastProvider } from "@/components/Toast";
import BackToTop from "@/components/BackToTop";

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: '--font-heading',
  display: 'swap',
});

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "Just Cases - Премиум мобилни аксесоари | Защитни калъфи, безжично зареждане, слушалки",
    template: "%s | Just Cases"
  },
  description: "Открийте премиум мобилни аксесоари за всички устройства. Защитни калъфи, безжично зареждане, слушалки, power bank-ове и много повече. Безплатна доставка над 50 €.",
  keywords: [
    "мобилни аксесоари",
    "защитни калъфи",
    "безжично зареждане",
    "слушалки",
    "power bank",
    "iPhone аксесоари",
    "Samsung аксесоари",
    "премиум качество",
    "Just Cases",
    "мобилни калъфи",
    "защитни стъкла",
    "безжични слушалки",
    "зарядни устройства",
    "USB кабели",
    "адаптери"
  ],
  authors: [{ name: "Just Cases" }],
  creator: "Just Cases",
  publisher: "Just Cases",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://justcases.bg'),
  alternates: {
    canonical: '/',
    languages: {
      'bg-BG': '/',
      'en-US': '/en',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'bg_BG',
    url: 'https://justcases.bg',
    siteName: 'Just Cases',
    title: 'Just Cases - Премиум мобилни аксесоари',
    description: 'Открийте премиум мобилни аксесоари за всички устройства. Защитни калъфи, безжично зареждане, слушалки, power bank-ове и много повече.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Just Cases - Премиум мобилни аксесоари',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@justcases',
    creator: '@justcases',
    title: 'Just Cases - Премиум мобилни аксесоари',
    description: 'Открийте премиум мобилни аксесоари за всички устройства. Защитни калъфи, безжично зареждане, слушалки, power bank-ове и много повече.',
    images: ['/og-image.jpg'],
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
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  category: 'technology',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.svg', sizes: '16x16', type: 'image/svg+xml' },
      { url: '/favicon-32x32.svg', sizes: '32x32', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.svg', sizes: '180x180', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
  },
  manifest: '/site.webmanifest',
};

export const viewport = {
  themeColor: '#1f2937',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

import RootLayoutClient from '@/components/RootLayoutClient';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bg" className={`dark ${spaceGrotesk.variable} ${outfit.variable}`}>
      <body className={outfit.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "AURACASE",
              "description": "Премиум мобилни аксесоари за всички устройства",
              "url": "https://auracase.bg",
              "logo": "https://auracase.bg/logo.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+359888123456",
                "contactType": "customer service",
                "email": "support@auracase.bg",
                "availableLanguage": "Bulgarian"
              },
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "BG",
                "addressLocality": "София"
              },
              "sameAs": [
                "https://facebook.com/auracase",
                "https://instagram.com/auracase",
                "https://twitter.com/auracase"
              ],
              "foundingDate": "2020",
              "founder": {
                "@type": "Person",
                "name": "AURACASE Team"
              }
            })
          }}
        />
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}

