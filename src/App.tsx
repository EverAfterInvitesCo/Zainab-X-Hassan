import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { MusicProvider } from './context/MusicContext';
import { AudioPlayer } from './components/AudioPlayer';
import { Navigation } from './components/Navigation';
import { EntryScreen } from './sections/EntryScreen';
import { HeroSection } from './sections/HeroSection';
import { InvitationSection } from './sections/InvitationSection';
import { DateAndVenueSection } from './sections/DateAndVenueSection';
import { RsvpSection } from './sections/RsvpSection';
import { EtiquetteSection } from './sections/EtiquetteSection';
import { FinalSection } from './sections/FinalSection';
import { AdminPortal } from './pages/AdminPortal';
import { Lock, Instagram, Facebook, Music2, Mail } from 'lucide-react';

const MainWeddingApp: React.FC = () => {
  const [isEntered, setIsEntered] = useState<boolean>(false);
  const [isAdminView, setIsAdminView] = useState<boolean>(false);

  // Listen for hash navigation e.g. #admin
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin') {
        setIsAdminView(true);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleAdminToggle = () => {
    setIsAdminView(true);
    window.location.hash = 'admin';
  };

  const handleReturnToSite = () => {
    setIsAdminView(false);
    window.location.hash = '';
  };

  if (isAdminView) {
    return <AdminPortal onBack={handleReturnToSite} />;
  }

  return (
    <div className="relative min-h-screen bg-[#FAF7F2] text-[#2B2421] selection:bg-[#E8C5C8] selection:text-[#2B2421] notranslate" translate="no">
      {/* Entry Screen Curtain */}
      <EntryScreen onEnter={() => setIsEntered(true)} isEntered={isEntered} />

      {/* Floating Header Navigation */}
      <Navigation onAdminClick={handleAdminToggle} />

      {/* Discreet Corner Audio Player with Organizer Lock */}
      <AudioPlayer onAdminClick={handleAdminToggle} />

      {/* Main Content Sections */}
      <main id="zh-main-content">
        <HeroSection />
        <InvitationSection />
        <DateAndVenueSection />
        <RsvpSection />
        <EtiquetteSection />
        <FinalSection />
      </main>

      {/* Luxury Theme Footer */}
      <footer className="w-full bg-[#F5EFE6] border-t border-[#EADBCE] py-12 px-6 text-center text-[#2B2421]">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-5">
          {/* Made with love notice (No heart icon) */}
          <div className="flex items-center gap-2 text-xs sm:text-sm font-serif-luxury tracking-[0.2em] text-[#6B5E55]">
            <span>Made with love by</span>
            <a
              href="https://www.instagram.com/_everafterinvites_/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#2B2421] tracking-[0.22em] uppercase hover:text-[#A67C2E] transition-colors underline-offset-4 hover:underline"
            >
              Everafterinvites
            </a>
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-1">
            {/* Instagram */}
            <a
              href="https://www.instagram.com/_everafterinvites_/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-[#6B5E55] hover:text-[#A67C2E] transition-colors group"
              aria-label="Instagram"
            >
              <Instagram size={14} className="group-hover:scale-110 transition-transform" />
              <span className="font-sans-luxury text-[11px] tracking-wider uppercase font-semibold">Instagram</span>
            </a>

            <span className="text-[#EADBCE]">·</span>

            {/* TikTok */}
            <a
              href="https://www.tiktok.com/@_everafterinvites_"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-[#6B5E55] hover:text-[#A67C2E] transition-colors group"
              aria-label="TikTok"
            >
              <Music2 size={14} className="group-hover:scale-110 transition-transform" />
              <span className="font-sans-luxury text-[11px] tracking-wider uppercase font-semibold">TikTok</span>
            </a>

            <span className="text-[#EADBCE]">·</span>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/profile.php?id=61591562833010"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-[#6B5E55] hover:text-[#A67C2E] transition-colors group"
              aria-label="Facebook"
            >
              <Facebook size={14} className="group-hover:scale-110 transition-transform" />
              <span className="font-sans-luxury text-[11px] tracking-wider uppercase font-semibold">Facebook</span>
            </a>

            <span className="text-[#EADBCE]">·</span>

            {/* Email Contact */}
            <a
              href="mailto:contact.everafterinvites@gmail.com"
              className="flex items-center gap-1.5 text-xs text-[#6B5E55] hover:text-[#A67C2E] transition-colors group"
              aria-label="Email Everafterinvites"
            >
              <Mail size={14} className="group-hover:scale-110 transition-transform" />
              <span className="font-sans-luxury text-[11px] tracking-wider uppercase font-semibold">Contact</span>
            </a>
          </div>

          {/* Hashtag & Organizer Portal */}
          <div className="flex items-center gap-4 pt-2 text-[10px] font-sans-luxury tracking-[0.25em] text-[#8C7D70] uppercase">
            <span>#HASANANDZAINAB</span>
            <span>·</span>
            <button
              onClick={handleAdminToggle}
              className="hover:text-[#2B2421] transition-colors flex items-center gap-1 cursor-pointer focus:outline-none"
            >
              <Lock size={10} />
              <span>Organizer Portal</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <LanguageProvider>
      <MusicProvider>
        <MainWeddingApp />
      </MusicProvider>
    </LanguageProvider>
  );
}

export default App;
