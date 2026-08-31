import React from 'react';
import { motion } from 'motion/react';

export const EtiquetteSection: React.FC = () => {
  return (
    <section
      id="etiquette"
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#2B2421] text-white py-24 sm:py-32"
    >
      {/* Background Image: 2.jpg */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/media/2.jpg"
          alt="Hasan and Zainab Wedding Notice"
          className="w-full h-full object-cover object-center contrast-[1.05] brightness-[0.75] saturate-[0.95]"
          loading="lazy"
        />
        {/* Soft dark vignette overlays for clear text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/75" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF7F2]/20 via-transparent to-[#FAF7F2]/10" />
        <div className="absolute inset-0 film-grain pointer-events-none opacity-35" />
      </div>

      {/* Subtle floating ambient particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[5]">
        <div className="absolute top-[22%] right-[16%] w-2.5 h-2.5 rounded-full bg-white/30 blur-[1px] animate-pulse" />
        <div className="absolute top-[40%] left-[15%] w-2 h-2 rounded-full bg-white/25 blur-[1px]" />
        <div className="absolute bottom-[30%] right-[20%] w-3 h-3 rounded-full bg-white/20 blur-[1px]" />
        <div className="absolute bottom-[18%] left-[22%] w-2.5 h-2.5 rounded-full bg-white/25 blur-[1px]" />
      </div>

      {/* Content directly overlaying 2.jpg */}
      <div
        className="relative z-10 max-w-xl mx-auto px-6 text-center flex flex-col items-center justify-center"
        dir="rtl"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex flex-col items-center text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]"
        >
          {/* Main Title: منعاً للإحراج */}
          <h2 className="font-arabic-calligraphy text-6xl sm:text-7xl md:text-8xl text-[#F7E7CE] font-normal mb-10 sm:mb-14 drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] tracking-wide">
            منعاً للإحراج
          </h2>

          {/* Requested Etiquette Phrases */}
          <div className="w-full flex flex-col items-center space-y-8 sm:space-y-10 font-arabic text-2xl sm:text-3xl md:text-4xl text-white font-medium leading-relaxed">
            {/* Sentence 1: جنة الأطفال منازلهم */}
            <p className="tracking-wide">
              جنة الأطفال منازلهم
            </p>

            {/* Sentence 2: الرجاء حضور المدعوين فقط */}
            <p className="tracking-wide text-white/95">
              الرجاء حضور المدعوين فقط
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
