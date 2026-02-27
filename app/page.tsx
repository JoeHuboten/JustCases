import HomePage from '@/components/HomePage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Just Cases - Премиум мобилни аксесоари | Защитни калъфи, безжично зареждане, слушалки",
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
    "адаптери",
    "онлайн магазин",
    "доставка"
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
    title: "Just Cases - Премиум мобилни аксесоари",
    description: "Открийте премиум мобилни аксесоари за всички устройства. Защитни калъфи, безжично зареждане, слушалки, power bank-ове и много повече.",
    url: "https://justcases.bg",
    siteName: "Just Cases",
    images: [
      {
        url: "/og-homepage.jpg",
        width: 1200,
        height: 630,
        alt: "Just Cases - Премиум мобилни аксесоари",
      },
    ],
    locale: "bg_BG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Just Cases - Премиум мобилни аксесоари",
    description: "Открийте премиум мобилни аксесоари за всички устройства. Защитни калъфи, безжично зареждане, слушалки, power bank-ове и много повече.",
    images: ["/og-homepage.jpg"],
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
};

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Just Cases",
    "description": "Премиум мобилни аксесоари за всички устройства",
    "url": "https://justcases.bg",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://justcases.bg/shop?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HomePage />
    </>
  );
}