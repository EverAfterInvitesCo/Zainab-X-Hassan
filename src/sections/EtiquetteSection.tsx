import React from 'react';
import { motion } from 'motion/react';
import etiquetteBg from '../assets/images/wedding_etiquette_bg_1788182872002.jpg';

export const EtiquetteSection: React.FC = () => {
  return (
    <section
      id="etiquette"
      className="relative w-full min-h-[90vh] sm:min-h-screen flex items-center justify-center overflow-hidden bg-[#FAF7F2] text-[#2B2421]"
    >
      {/* Illustrated wedding etiquette background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={etiquetteBg}
          alt="Wedding Etiquette Notice"
          className="w-full h-full object-cover object-center brightness-[0.98] contrast-[1.02]"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        {/* Soft subtle vignettes for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2]/40 via-transparent to-[#FAF7F2]/30" />
        <div className="absolute inset-0 film-grain pointer-events-none opacity-25" />
      </div>

      {/* Content positioned in the upper/middle open space */}
      <div className="relative z-10 max-w-xl mx-auto px-6 py-20 sm:py-28 text-center flex flex-col items-center justify-start sm:justify-center" dir="rtl">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex flex-col items-center"
        >
          {/* Main Title: منعاً للإحراج */}
          <h2 className="font-arabic-calligraphy text-5xl sm:text-6xl md:text-7xl text-[#2B2421] font-normal mb-10 sm:mb-12 drop-shadow-sm tracking-wide">
            منعاً للإحراج
          </h2>

          {/* Requested Etiquette Phrases */}
          <div className="w-full flex flex-col items-center space-y-6 sm:space-y-8 font-arabic text-xl sm:text-2xl md:text-3xl text-[#2B2421] font-medium leading-relaxed drop-shadow-sm">
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
