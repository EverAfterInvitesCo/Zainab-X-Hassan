import React from 'react';
import { motion } from 'motion/react';

export const InvitationSection: React.FC = () => {
  return (
    <section
      id="invitation"
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#2B2421] text-white"
    >
      {/* Background Image: 2.jpg with romantic cinematic backdrop */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/media/2.jpg"
          alt="Hasan and Zainab Invitation"
          className="w-full h-full object-cover object-center contrast-[1.05] brightness-[0.75] saturate-[0.95]"
          loading="eager"
        />
        {/* Soft vignette and smooth blend gradients top & bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF7F2]/20 via-transparent to-[#FAF7F2]/10" />
        <div className="absolute inset-0 film-grain pointer-events-none opacity-40" />
      </div>

      {/* Floating subtle dandelion particles/seeds aesthetic */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[5]">
        <div className="absolute top-[20%] right-[15%] w-2.5 h-2.5 rounded-full bg-white/30 blur-[1px] animate-pulse" />
        <div className="absolute top-[35%] left-[18%] w-2 h-2 rounded-full bg-white/25 blur-[1px]" />
        <div className="absolute bottom-[30%] right-[22%] w-3 h-3 rounded-full bg-white/20 blur-[1px]" />
        <div className="absolute bottom-[18%] left-[25%] w-2.5 h-2.5 rounded-full bg-white/25 blur-[1px]" />
      </div>

      {/* Content directly overlaying 2.jpg without any enclosing box */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 sm:py-32 text-center flex flex-col items-center justify-center" dir="rtl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex flex-col items-center text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
        >
          {/* Top Invitation Word: تتشرف */}
          <h3 className="font-arabic-calligraphy text-4xl sm:text-5xl md:text-6xl text-white font-normal mb-8 sm:mb-10 tracking-wide">
            تتشرف
          </h3>

          {/* Families Side-by-Side in 2 Balanced Columns */}
          <div className="w-full max-w-2xl grid grid-cols-2 gap-4 sm:gap-10 mb-8 sm:mb-10 text-center font-arabic">
            {/* Right Family (Groom's family) */}
            <div className="flex flex-col items-center">
              <span className="text-base sm:text-xl text-white/90 font-light mb-1">
                عائلة
              </span>
              <span className="text-lg sm:text-2xl md:text-3xl text-white font-medium leading-relaxed">
                السيد بسام الحاج سليمان
              </span>
            </div>

            {/* Left Family (Bride's family) */}
            <div className="flex flex-col items-center">
              <span className="text-base sm:text-xl text-white/90 font-light mb-1">
                عائلة
              </span>
              <span className="text-lg sm:text-2xl md:text-3xl text-white font-medium leading-relaxed">
                السيد مروان الحمدني
              </span>
            </div>
          </div>

          {/* Invitation Line: بدعوتكم لحضور حفل / زفاف نجليهما */}
          <div className="space-y-1 mb-8 sm:mb-10 font-arabic text-xl sm:text-2xl md:text-3xl text-white/95 font-light leading-relaxed">
            <p>بدعوتكم لحضور حفل</p>
            <p>زفاف نجليهما</p>
          </div>

          {/* Couple's Names in Prominent Arabic Calligraphy */}
          <div className="my-2 sm:my-4">
            <h2 className="font-arabic-calligraphy text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-[#F7E7CE] leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              حسن و زينب
            </h2>
          </div>

          {/* Wedding Date */}
          <div className="mt-8 sm:mt-10 font-arabic space-y-1 text-white/95">
            <p className="text-xl sm:text-2xl md:text-3xl font-light">
              يوم السبت الموافق
            </p>
            <p className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-wide text-[#F7E7CE]">
              9 يناير 2027
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
