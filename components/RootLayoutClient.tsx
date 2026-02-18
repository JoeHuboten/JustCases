'use client';

import { usePathname } from 'next/navigation';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import { AuthProvider } from "@/contexts/AuthContext";
import AccessibilityPanel from "@/components/AccessibilityPanel";
import KeyboardShortcuts from "@/components/KeyboardShortcuts";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import CartSync from "@/components/CartSync";
import { ToastProvider } from "@/components/Toast";
import BackToTop from "@/components/BackToTop";

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <AccessibilityProvider>
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
    </AccessibilityProvider>
  );
}
