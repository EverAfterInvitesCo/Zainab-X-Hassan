import React from 'react';
import { motion } from 'motion/react';

export const FinalSection: React.FC = () => {
  return (
    <section
      id="final"
      className="relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden bg-[#FAF7F2]"
    >
      {/* Background: 9.jpg with warm champagne grading */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/media/9.jpg"
          alt="Zainab and Hasan Grand Finale"
          className="w-full h-full object-cover object-center contrast-[1.05] brightness-[0.88] saturate-[0.9] animate-cinematic-zoom"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/65 to-[#FAF7F2]/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF7F2]/80 via-transparent to-[#FAF7F2]" />
        <div className="absolute inset-0 film-grain pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-28 text-center flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          {/* SEE YOU THERE (English) */}
          <h2 className="font-serif-luxury italic text-4xl sm:text-6xl md:text-7xl text-[#2B2421] tracking-[0.2em] uppercase font-light mb-6 drop-shadow-sm">
            SEE YOU THERE
          </h2>

          {/* Delicate Divider */}
          <div className="flex items-center justify-center gap-4 w-40 mb-8 opacity-80">
            <div className="h-[1.5px] flex-1 bg-[#C5A059]" />
            <div className="w-2 h-2 rotate-45 bg-[#C5A059]" />
            <div className="h-[1.5px] flex-1 bg-[#C5A059]" />
          </div>

          {/* Arabic Closing Line */}
          <p className="font-arabic text-3xl sm:text-4xl md:text-5xl text-[#A67C2E] font-medium leading-relaxed drop-shadow-sm" dir="rtl">
            نتشرف بحضوركم ومشاركتنا فرحتنا
          </p>
        </motion.div>
      </div>
    </section>
  );
};
