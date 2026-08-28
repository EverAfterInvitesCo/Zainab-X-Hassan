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
          alt="Zainab and Hasan"
          className="w-full h-full object-cover object-center contrast-[1.03] brightness-[0.9] saturate-[0.9] animate-cinematic-zoom"
          loading="eager"
        />
        {/* Soft luxury champagne & beige overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/45 to-[#FAF7F2]/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF7F2]/75 via-transparent to-[#FAF7F2]" />
        <div className="absolute inset-0 film-grain pointer-events-none" />
      </div>

      {/* Hero Content in Luxury Layout */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-28 text-center flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-3xl flex flex-col items-center bg-[#FAF7F2]/80 backdrop-blur-sm p-8 sm:p-14 md:p-16 rounded-3xl border border-[#EADBCE]/80 shadow-[0_20px_50px_rgba(180,140,110,0.12)]"
        >
          {/* Bride & Groom Name - ENGLISH FIRST */}
          <h1 className="font-display-luxury text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-[#2B2421] uppercase tracking-[0.2em] leading-none mb-2">
            ZAINAB &amp; HASAN
          </h1>

          {/* Bride & Groom Name - ARABIC (PROMINENT & LARGE CALLIGRAPHY) */}
          <h2 className="font-arabic-calligraphy text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-[#A67C2E] leading-tight mb-8">
            زينب و حسن
          </h2>

          {/* Delicate Ornamental Divider */}
          <div className="flex items-center justify-center gap-4 w-48 mb-8 opacity-70">
            <div className="h-[1px] flex-1 bg-[#C5A059]" />
            <div className="w-2 h-2 rotate-45 border border-[#C5A059] bg-[#FAF7F2]" />
            <div className="h-[1px] flex-1 bg-[#C5A059]" />
          </div>

          {/* Date Only (No Dubai / Emirates) */}
          <p className="font-serif-luxury text-lg sm:text-2xl tracking-[0.25em] text-[#2B2421] uppercase font-medium mb-1">
            FRIDAY, 8 JANUARY 2027
          </p>

          <p className="font-arabic text-lg sm:text-2xl tracking-wider text-[#8C7D70] mb-8">
            الجمعة، ٨ يناير ٢٠٢٧
          </p>

          {/* Action CTA to RSVP - Bespoke Luxury Stationery Styling */}
          <a
            href="#rsvp"
            className="group relative inline-flex items-center gap-3 px-10 py-3.5 rounded-full border border-[#C5A059] bg-[#2B2421] hover:bg-[#3D332F] text-[#FAF7F2] text-xs font-sans-luxury tracking-[0.25em] uppercase font-semibold transition-all duration-300 shadow-[0_10px_25px_rgba(43,36,33,0.15)] hover:shadow-[0_12px_30px_rgba(197,160,89,0.25)] hover:scale-[1.02]"
          >
            <span className="relative z-10">RSVP NOW</span>
            <span className="w-1 h-1 rounded-full bg-[#C5A059]" />
            <span className="relative z-10 font-arabic font-normal text-sm text-[#EADBCE] group-hover:text-[#FAF7F2]">تأكيد الحضور</span>
          </a>
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
