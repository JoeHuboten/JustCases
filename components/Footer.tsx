'use client';

import Link from 'next/link';
import { memo } from 'react';
import { FiTwitter, FiFacebook, FiInstagram, FiGithub } from 'react-icons/fi';
import { SiVisa, SiMastercard, SiPaypal, SiApplepay, SiGooglepay } from 'react-icons/si';
import NewsletterForm from './NewsletterForm';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = memo(function Footer() {
  const { t } = useLanguage();
  
  return (
    <footer className="relative mt-20 overflow-hidden bg-[#0a0a0f]">
      {/* Decorative gradient background */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f] to-transparent pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      {/* Newsletter Section */}
      <div className="relative container-custom py-8 sm:py-12">
        <div className="bg-gradient-to-br from-teal-500/10 via-purple-500/5 to-cyan-500/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 border border-white/5 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-white mb-2">{t('footer.newsletter.title')}</h3>
              <p className="text-white/50 text-sm sm:text-base font-body">{t('footer.newsletter.description')}</p>
            </div>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="relative container-custom py-10 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 md:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-4 sm:mb-6 group">
              <svg viewBox="0 0 200 40" fill="none" className="h-8">
                <g transform="translate(18, 20)">
                  <path d="M0,-14 L16,-6 L0,2 L-16,-6 Z" fill="#4eeadb" />
                  <path d="M-16,-6 L0,2 L0,18 L-16,10 Z" fill="#1a9e8f" />
                  <path d="M16,-6 L0,2 L0,18 L16,10 Z" fill="#2bc4b0" />
                  <path d="M-12.5,-3.5 L-4.5,1 L-4.5,6 L-8,4.2 L-8,0.5 L-12.5,-1.5 Z" fill="#0d2d2a" opacity="0.85" />
                  <path d="M-8,4.2 L-4.5,6 L-4.5,8.5 Q-4.5,11 -7,10 L-9.5,8.6 L-8,7.5 L-6.2,8.6 Q-5.2,9 -5.5,8 L-5.5,6 L-8,4.2 Z" fill="#0d2d2a" opacity="0.85" />
                  <path d="M12.5,-3.5 L7,-0.5 Q5,1 5,5 Q5,9 7,10.5 L12.5,7 L12.5,9 L8,12 Q3.5,9.5 3.5,5 Q3.5,0.5 8,-2 L12.5,-4.5 Z" fill="#0d2d2a" opacity="0.85" />
                </g>
                <text x="40" y="26" fontFamily="system-ui, -apple-system, sans-serif" fontSize="19" fontWeight="500" fill="white" letterSpacing="-0.3">Just</text>
                <text x="77" y="26" fontFamily="system-ui, -apple-system, sans-serif" fontSize="19" fontWeight="500" fill="#2bc4b0" letterSpacing="-0.3">Cases</text>
              </svg>
            </Link>
            <p className="text-white/40 text-sm mb-6 sm:mb-8 leading-relaxed font-body">
              {t('footer.brand.description')}
            </p>
            <div className="flex space-x-2 sm:space-x-3">
              <a href="#" aria-label={t('footer.followTwitter')} className="w-11 h-11 sm:w-10 sm:h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-white/40 hover:text-teal-400 hover:bg-teal-500/10 hover:border-teal-500/30 transition-all duration-300">
                <FiTwitter size={18} />
              </a>
              <a href="#" aria-label={t('footer.followFacebook')} className="w-11 h-11 sm:w-10 sm:h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-white/40 hover:text-teal-400 hover:bg-teal-500/10 hover:border-teal-500/30 transition-all duration-300">
                <FiFacebook size={18} />
              </a>
              <a href="#" aria-label={t('footer.followInstagram')} className="w-11 h-11 sm:w-10 sm:h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-white/40 hover:text-teal-400 hover:bg-teal-500/10 hover:border-teal-500/30 transition-all duration-300">
                <FiInstagram size={18} />
              </a>
              <a href="#" aria-label={t('footer.viewGithub')} className="w-11 h-11 sm:w-10 sm:h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-white/40 hover:text-teal-400 hover:bg-teal-500/10 hover:border-teal-500/30 transition-all duration-300">
                <FiGithub size={18} />
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-heading font-semibold mb-6 text-sm tracking-wider uppercase">{t('footer.company')}</h3>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-white/40 hover:text-white transition-colors duration-300 text-sm font-body flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-px bg-teal-400 transition-all duration-300"></span>{t('footer.about')}</Link></li>
              <li><Link href="/features" className="text-white/40 hover:text-white transition-colors duration-300 text-sm font-body flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-px bg-teal-400 transition-all duration-300"></span>{t('footer.features')}</Link></li>
              <li><Link href="/works" className="text-white/40 hover:text-white transition-colors duration-300 text-sm font-body flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-px bg-teal-400 transition-all duration-300"></span>{t('footer.howItWorks')}</Link></li>
              <li><Link href="/career" className="text-white/40 hover:text-white transition-colors duration-300 text-sm font-body flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-px bg-teal-400 transition-all duration-300"></span>{t('footer.career')}</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-white font-heading font-semibold mb-6 text-sm tracking-wider uppercase">{t('footer.help')}</h3>
            <ul className="space-y-4">
              <li><Link href="/support" className="text-white/40 hover:text-white transition-colors duration-300 text-sm font-body flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-px bg-teal-400 transition-all duration-300"></span>{t('footer.customerSupport')}</Link></li>
              <li><Link href="/delivery" className="text-white/40 hover:text-white transition-colors duration-300 text-sm font-body flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-px bg-teal-400 transition-all duration-300"></span>{t('footer.deliveryDetails')}</Link></li>
              <li><Link href="/terms" className="text-white/40 hover:text-white transition-colors duration-300 text-sm font-body flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-px bg-teal-400 transition-all duration-300"></span>{t('footer.terms')}</Link></li>
              <li><Link href="/privacy" className="text-white/40 hover:text-white transition-colors duration-300 text-sm font-body flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-px bg-teal-400 transition-all duration-300"></span>{t('footer.privacyPolicy')}</Link></li>
            </ul>
          </div>

          {/* FAQ */}
          <div>
            <h3 className="text-white font-heading font-semibold mb-6 text-sm tracking-wider uppercase">{t('footer.faq')}</h3>
            <ul className="space-y-4">
              <li><Link href="/account" className="text-white/40 hover:text-white transition-colors duration-300 text-sm font-body flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-px bg-teal-400 transition-all duration-300"></span>{t('footer.account')}</Link></li>
              <li><Link href="/deliveries" className="text-white/40 hover:text-white transition-colors duration-300 text-sm font-body flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-px bg-teal-400 transition-all duration-300"></span>{t('footer.manageDeliveries')}</Link></li>
              <li><Link href="/orders" className="text-white/40 hover:text-white transition-colors duration-300 text-sm font-body flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-px bg-teal-400 transition-all duration-300"></span>{t('footer.orders')}</Link></li>
              <li><Link href="/payments" className="text-white/40 hover:text-white transition-colors duration-300 text-sm font-body flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-px bg-teal-400 transition-all duration-300"></span>{t('footer.payments')}</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 mt-10 sm:mt-16 pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
          <p className="text-white/30 text-xs sm:text-sm text-center sm:text-left font-body">
            {t('footer.copyright')}
          </p>
          <div className="flex items-center gap-3 sm:gap-4">
            <SiVisa className="text-white/20 hover:text-white/60 transition-colors duration-300 text-xl sm:text-2xl" />
            <SiMastercard className="text-white/20 hover:text-white/60 transition-colors duration-300 text-xl sm:text-2xl" />
            <SiPaypal className="text-white/20 hover:text-white/60 transition-colors duration-300 text-xl sm:text-2xl" />
            <SiApplepay className="text-white/20 hover:text-white/60 transition-colors duration-300 text-xl sm:text-2xl" />
            <SiGooglepay className="text-white/20 hover:text-white/60 transition-colors duration-300 text-xl sm:text-2xl" />
          </div>
        </div>
      </div>
    </footer>
  );
});

export default Footer;