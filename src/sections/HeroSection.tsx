import React from 'react';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section
      id="hero"
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#FAF7F2]"
    >
      {/* Background Image with warm champagne & rose-tinted cinematic grading */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/media/1.jpg"
          alt="Hasan and Zainab"
          className="w-full h-full object-cover object-center contrast-[1.03] brightness-[0.9] saturate-[0.9] animate-cinematic-zoom"
          loading="eager"
        />
        {/* Soft luxury champagne & beige overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/30 to-[#FAF7F2]/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF7F2]/60 via-transparent to-[#FAF7F2]" />
        <div className="absolute inset-0 film-grain pointer-events-none" />
      </div>

      {/* Hero Content - Names Only, Floating Without Box */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-28 text-center flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          {/* Groom & Bride Name - ENGLISH */}
          <h1 className="font-display-luxury text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-[#2B2421] uppercase tracking-[0.2em] leading-none mb-3 drop-shadow-sm">
            HASAN &amp; ZAINAB
          </h1>

          {/* Groom & Bride Name - ARABIC */}
          <h2 className="font-arabic-calligraphy text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-[#A67C2E] leading-tight drop-shadow-sm">
            حسن و زينب
          </h2>
        </motion.div>
      </div>

      {/* Floating Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-[#8C7D70] pointer-events-none"
      >
        <span className="text-[9px] font-sans-luxury tracking-[0.3em] uppercase">SCROLL</span>
        <ChevronDown size={14} className="text-[#A67C2E]" />
      </motion.div>
    </section>
  );
};
