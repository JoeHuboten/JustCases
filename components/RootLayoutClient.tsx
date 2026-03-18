'use client';

import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import { AuthProvider } from "@/contexts/AuthContext";
import CartSync from "@/components/CartSync";
import { ToastProvider } from "@/components/Toast";

// Lazy-load utilities that are not needed for first paint.
// These components register listeners or show UI only on interaction/scroll.
const AccessibilityPanel = dynamic(() => import("@/components/AccessibilityPanel"), { ssr: false });
const KeyboardShortcuts = dynamic(() => import("@/components/KeyboardShortcuts"), { ssr: false });
const PWAInstallPrompt = dynamic(() => import("@/components/PWAInstallPrompt"), { ssr: false });
const ServiceWorkerRegistration = dynamic(() => import("@/components/ServiceWorkerRegistration"), { ssr: false });
const BackToTop = dynamic(() => import("@/components/BackToTop"), { ssr: false });

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <AccessibilityProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" themes={['dark', 'bright']} enableSystem={false}>
        <LanguageProvider>
        <AuthProvider>
          <ToastProvider>
            {!isAdminPage && (
              <>
                <a href="#main-content" className="skip-to-main">Skip to main content</a>
                <Header />
              </>
            )}
            <main id="main-content">
              {children}
            </main>
            {!isAdminPage && (
              <>
                <Footer />
                <BackToTop />
                <AccessibilityPanel />
                <KeyboardShortcuts />
              </>
            )}
            <PWAInstallPrompt />
            <ServiceWorkerRegistration />
            <CartSync />
          </ToastProvider>
        </AuthProvider>
      </LanguageProvider>
      </ThemeProvider>
    </AccessibilityProvider>
  );
}
