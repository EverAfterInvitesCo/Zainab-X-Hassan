import React from 'react';
import { motion } from 'motion/react';
import { Clock, MapPin } from 'lucide-react';

export const DateAndVenueSection: React.FC = () => {
  const openGoogleMaps = () => {
    window.open('https://maps.google.com/?q=Movenpick+Hotel+Apartments+Bur+Dubai', '_blank');
  };

  return (
    <section
      id="details"
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#2B2421] text-white"
    >
      {/* Background Image: 3.jpg with romantic cinematic backdrop */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/media/3.jpg"
          alt="Hasan and Zainab Wedding Venue & Time"
          className="w-full h-full object-cover object-center contrast-[1.05] brightness-[0.75] saturate-[0.95]"
          loading="eager"
        />
        {/* Soft vignette and smooth blend gradients top & bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF7F2]/20 via-transparent to-[#FAF7F2]/10" />
        <div className="absolute inset-0 film-grain pointer-events-none opacity-40" />
      </div>

      {/* Floating subtle dandelion particles/seeds aesthetic matching reference */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[5]">
        <div className="absolute top-[22%] right-[16%] w-2.5 h-2.5 rounded-full bg-white/30 blur-[1px] animate-pulse" />
        <div className="absolute top-[40%] left-[15%] w-2 h-2 rounded-full bg-white/25 blur-[1px]" />
        <div className="absolute bottom-[35%] right-[20%] w-3 h-3 rounded-full bg-white/20 blur-[1px]" />
        <div className="absolute bottom-[20%] left-[22%] w-2.5 h-2.5 rounded-full bg-white/25 blur-[1px]" />
      </div>

      {/* Content directly overlaying 3.jpg without any enclosing box */}
      <div className="relative z-10 max-w-xl mx-auto px-6 py-24 sm:py-32 text-center flex flex-col items-center justify-center" dir="rtl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex flex-col items-center text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]"
        >
          {/* Header Calligraphy: الحفل */}
          <h2 className="font-arabic-calligraphy text-5xl sm:text-6xl md:text-7xl text-white font-normal mb-8 sm:mb-10 tracking-wide">
            الحفل
          </h2>

          {/* Time Section with Clock Icon */}
          <div className="flex flex-col items-center mb-10 sm:mb-12">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-[#2B2421] flex items-center justify-center mb-3 shadow-md">
              <Clock size={22} className="stroke-[2.2]" />
            </div>
            <p className="font-arabic text-2xl sm:text-3xl text-white font-medium tracking-wide">
              6:00 مساءً
            </p>
          </div>

          {/* Location Section with Map Pin Icon */}
          <div className="flex flex-col items-center mb-10 sm:mb-12" dir="ltr">
            <div className="text-white mb-3 drop-shadow-md">
              <MapPin size={38} className="fill-white stroke-none text-white" />
            </div>

            <h3 className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl text-white font-normal tracking-wide text-center leading-snug">
              Mövenpick Hotel, Bur Dubai
            </h3>

            <p className="font-serif-luxury text-lg sm:text-xl text-white/90 font-light mt-1.5 text-center">
              19th Street, Oud Metha, Dubai
            </p>
          </div>

          {/* Location Button: خريطة الموقع in clean framed outline button */}
          <button
            onClick={openGoogleMaps}
            className="w-56 sm:w-64 py-3 sm:py-3.5 border-2 border-white/90 hover:border-white bg-white/10 hover:bg-white/20 backdrop-blur-[2px] text-white text-lg sm:text-xl font-arabic rounded-none transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:scale-[1.02] cursor-pointer"
            dir="rtl"
          >
            خريطة الموقع
          </button>
        </motion.div>
      </div>
    </section>
  );
};
