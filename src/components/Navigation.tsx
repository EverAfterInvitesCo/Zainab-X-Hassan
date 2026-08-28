import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

interface NavigationProps {
  onAdminClick?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onAdminClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#invitation', labelEn: 'INVITATION', labelAr: 'الدعوة' },
    { href: '#details', labelEn: 'DATE & VENUE', labelAr: 'الحفل والموقع' },
    { href: '#rsvp', labelEn: 'RSVP', labelAr: 'تأكيد الحضور' },
    { href: '#memories', labelEn: 'MEMORIES', labelAr: 'ذكرياتنا' },
  ];

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="zh-main-header"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#FAF7F2]/92 backdrop-blur-md border-b border-[#EADBCE] py-3.5 shadow-[0_4px_20px_rgba(180,140,110,0.06)]'
          : 'bg-gradient-to-b from-[#FAF7F2]/90 via-[#FAF7F2]/60 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand Monogram in Warm Luxury Typography */}
        <a
          id="zh-nav-brand"
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="group flex items-center gap-2.5 cursor-pointer focus:outline-none"
        >
          <span className="font-display-luxury text-base sm:text-lg tracking-[0.22em] text-[#2B2421] uppercase font-medium">
            ZAINAB &amp; HASAN
          </span>
          <span className="text-[#C5A059] font-arabic-calligraphy text-lg">
            زينب و حسن
          </span>
        </a>

        {/* Desktop Nav Links - Clean & Bilingual */}
        <nav id="zh-desktop-nav" className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(link.href);
              }}
              className="group flex flex-col items-center py-1 text-center transition-all"
            >
              <span className="text-[11px] font-sans-luxury tracking-[0.2em] text-[#2B2421]/80 group-hover:text-[#A67C2E] uppercase font-semibold transition-colors">
                {link.labelEn}
              </span>
              <span className="text-[10px] font-arabic text-[#8C7D70] group-hover:text-[#A67C2E] transition-colors leading-tight">
                {link.labelAr}
              </span>
              <div className="h-[1.5px] w-0 group-hover:w-full bg-[#C5A059] transition-all duration-300 mt-0.5" />
            </a>
          ))}
        </nav>

        {/* Right Controls: RSVP Quick Button & Mobile Menu */}
        <div className="flex items-center gap-3 sm:gap-4">
          <a
            href="#rsvp"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('#rsvp');
            }}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-[#C5A059] hover:bg-[#B8934A] text-white rounded-full text-[11px] font-sans-luxury tracking-[0.2em] uppercase font-semibold shadow-sm hover:shadow-md transition-all"
          >
            <span>RSVP</span>
            <span className="opacity-70">·</span>
            <span className="font-arabic font-normal">تأكيد الحضور</span>
          </a>

          {/* Mobile Hamburger Toggle */}
          <button
            id="zh-mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#2B2421] hover:text-[#A67C2E] focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu in Warm Luxury Theme */}
      {mobileMenuOpen && (
        <div
          id="zh-mobile-menu-drawer"
          className="lg:hidden fixed inset-0 top-[65px] bg-[#FAF7F2]/98 backdrop-blur-xl z-40 flex flex-col justify-between p-8 border-t border-[#EADBCE] animate-fadeIn"
        >
          <nav className="flex flex-col gap-6 pt-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
                className="flex items-center justify-between py-3 border-b border-[#EADBCE]/70 text-[#2B2421] hover:text-[#A67C2E] transition-colors"
              >
                <span className="font-serif-luxury text-xl tracking-[0.15em] uppercase font-medium">
                  {link.labelEn}
                </span>
                <span className="font-arabic-calligraphy text-2xl text-[#A67C2E]">
                  {link.labelAr}
                </span>
              </a>
            ))}
          </nav>

          <div className="pt-6 border-t border-[#EADBCE] flex flex-col gap-4">
            <div className="flex items-center justify-between text-xs text-[#8C7D70] font-sans-luxury tracking-widest">
              <span>DUBAI, UAE</span>
              <span>08 · 01 · 2027</span>
            </div>

            {onAdminClick && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onAdminClick();
                }}
                className="text-[10px] tracking-[0.25em] text-[#8C7D70] hover:text-[#2B2421] uppercase text-center py-2"
              >
                Organizer Access
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
