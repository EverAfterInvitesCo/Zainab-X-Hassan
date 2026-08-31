import React from 'react';
import { motion } from 'motion/react';
import etiquetteBg from '../assets/images/wedding_etiquette_mobile_bg_1788183532159.jpg';

export const EtiquetteSection: React.FC = () => {
  return (
    <section
      id="etiquette"
      className="relative w-full min-h-screen flex flex-col items-center justify-start overflow-hidden bg-[#FAF7F2] text-[#6A1B29]"
    >
      {/* Illustrated wedding etiquette background with 9:16 mobile-optimized vertical framing */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={etiquetteBg}
          alt="Wedding Etiquette Notice"
          className="w-full h-full object-cover object-bottom brightness-[1.0] contrast-[1.02]"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        {/* Soft luminous gradient to ensure crisp contrast for text on all mobile screens */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF7F2]/60 via-[#FAF7F2]/20 to-transparent" />
        <div className="absolute inset-0 film-grain pointer-events-none opacity-20" />
      </div>

      {/* Content positioned securely in the upper cream/floral headroom */}
      <div
        className="relative z-10 w-full max-w-lg mx-auto px-6 pt-28 sm:pt-36 pb-64 sm:pb-56 text-center flex flex-col items-center justify-start"
        dir="rtl"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex flex-col items-center"
        >
          {/* Main Title: منعاً للإحراج in rich deep Burgundy Calligraphy */}
          <h2 className="font-arabic-calligraphy text-6xl sm:text-7xl md:text-8xl text-[#6A1B29] font-normal mb-8 sm:mb-10 drop-shadow-[0_2px_8px_rgba(255,255,255,0.9)] tracking-wide">
            منعاً للإحراج
          </h2>

          {/* Requested Etiquette Phrases in Deep Burgundy with crystal-clear visibility */}
          <div className="w-full flex flex-col items-center space-y-6 sm:space-y-8 font-arabic text-2xl sm:text-3xl md:text-4xl text-[#7A1C2E] font-semibold leading-relaxed drop-shadow-[0_1px_4px_rgba(255,255,255,0.8)]">
            {/* Sentence 1: جنة الأطفال منازلهم */}
            <p className="tracking-wide">
              جنة الأطفال منازلهم
            </p>

            {/* Sentence 2: الرجاء حضور المدعوين فقط */}
            <p className="tracking-wide">
              الرجاء حضور المدعوين فقط
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
