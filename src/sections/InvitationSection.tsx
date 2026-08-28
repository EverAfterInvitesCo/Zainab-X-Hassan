import React from 'react';
import { motion } from 'motion/react';

export const InvitationSection: React.FC = () => {
  return (
    <section
      id="invitation"
      className="relative w-full py-28 md:py-36 bg-[#FDFBF7] text-[#2B2421] overflow-hidden"
    >
      {/* Background decorative warm ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#F5E5E2]/40 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#F5ECE1]/60 rounded-full blur-3xl" />
      </div>

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#FFFFFF] border border-[#EADBCE] p-8 sm:p-14 md:p-18 rounded-3xl shadow-[0_20px_60px_rgba(180,140,110,0.09)] text-center relative"
        >
          {/* Subtle Corner Gold Flourishes */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#C5A059]/40 rounded-tl-lg pointer-events-none" />
          <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#C5A059]/40 rounded-tr-lg pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#C5A059]/40 rounded-bl-lg pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#C5A059]/40 rounded-br-lg pointer-events-none" />

          {/* Poetic & Invitation Announcement in Arabic */}
          <div className="space-y-6" dir="rtl">
            <h3 className="font-arabic-calligraphy text-3xl sm:text-4xl md:text-5xl text-[#2B2421] leading-relaxed">
              وهكذا تبدأ حكايتنا الأبدية
            </h3>

            <p className="font-arabic text-xl sm:text-2xl md:text-3xl text-[#6B5E55] max-w-2xl mx-auto leading-relaxed pt-2">
              ببالغ الفرح والسرور، نتشرف عائلة الحمدني و الحاج بدعوتكم للاحتفال بزفاف
            </p>

            {/* Delicate Divider */}
            <div className="flex items-center justify-center gap-4 w-36 mx-auto my-8 opacity-70">
              <div className="h-[1px] flex-1 bg-[#C5A059]" />
              <div className="w-2 h-2 rotate-45 bg-[#C5A059]" />
              <div className="h-[1px] flex-1 bg-[#C5A059]" />
            </div>

            {/* Couple's Names in Gold at the Bottom */}
            <h2 className="font-arabic-calligraphy text-5xl sm:text-6xl md:text-7xl text-[#A67C2E] leading-normal font-bold">
              زينب و حسن
            </h2>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
