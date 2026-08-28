import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MapPin, Clock, Navigation as NavIcon, ExternalLink } from 'lucide-react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const DateAndVenueSection: React.FC = () => {
  const weddingDate = new Date('2027-01-08T18:00:00+04:00');

  const calculateTimeLeft = (): TimeLeft => {
    const difference = weddingDate.getTime() - new Date().getTime();
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const openGoogleMaps = () => {
    window.open('https://maps.google.com/?q=Movenpick+Hotel+Apartments+Bur+Dubai', '_blank');
  };

  return (
    <section
      id="details"
      className="relative w-full py-24 md:py-32 bg-[#F5EFE6] text-[#2B2421] overflow-hidden"
    >
      {/* Decorative luxury gradient background */}
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#C5A059_0.75px,transparent_0.75px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        {/* Section Title in English and Arabic ABOVE the card */}
        <div className="text-center mb-10">
          <h2 className="font-display-luxury text-3xl sm:text-4xl md:text-5xl font-light text-[#2B2421] uppercase tracking-[0.18em]">
            DATE &amp; VENUE
          </h2>
          <h3 className="font-arabic-calligraphy text-3xl sm:text-4xl text-[#A67C2E] mt-1">
            التاريخ وموقع الحفل
          </h3>
        </div>

        {/* Single Unified Box */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="bg-[#FFFFFF] border border-[#EADBCE] rounded-3xl p-8 sm:p-12 md:p-14 shadow-[0_20px_50px_rgba(180,140,110,0.1)] text-center relative"
        >
          {/* Date & Time Header */}
          <div className="mb-8">
            <h3 className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl text-[#2B2421] font-medium tracking-wide">
              Friday, 8 January 2027
            </h3>
            <p className="font-arabic-calligraphy text-2xl sm:text-3xl text-[#A67C2E] mt-1.5">
              الجمعة، ٨ يناير ٢٠٢٧
            </p>

            <div className="mt-4 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#FAF7F2] border border-[#EADBCE] text-xs sm:text-sm font-sans-luxury text-[#6B5E55]">
              <Clock size={14} className="text-[#A67C2E]" />
              <span>6:00 PM GST · ٦:٠٠ مساءً</span>
            </div>
          </div>

          {/* Real-time Countdown Timer Units */}
          <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-lg mx-auto mb-10">
            {[
              { value: timeLeft.days, labelEn: 'DAYS', labelAr: 'أيام' },
              { value: timeLeft.hours, labelEn: 'HOURS', labelAr: 'ساعات' },
              { value: timeLeft.minutes, labelEn: 'MINS', labelAr: 'دقائق' },
              { value: timeLeft.seconds, labelEn: 'SECS', labelAr: 'ثواني' },
            ].map((unit, index) => (
              <div
                key={index}
                className="bg-[#FAF7F2] border border-[#EADBCE] rounded-2xl p-3 sm:p-4 text-center flex flex-col items-center justify-center shadow-sm"
              >
                <span className="font-display-luxury text-2xl sm:text-3xl font-light text-[#2B2421]">
                  {String(unit.value).padStart(2, '0')}
                </span>
                <span className="text-[9px] font-sans-luxury tracking-[0.2em] uppercase text-[#A67C2E] font-semibold mt-1">
                  {unit.labelEn}
                </span>
                <span className="text-[9px] font-arabic text-[#8C7D70]">
                  {unit.labelAr}
                </span>
              </div>
            ))}
          </div>

          {/* Golden Divider */}
          <div className="flex items-center justify-center gap-3 w-32 mx-auto mb-10 opacity-70">
            <div className="h-[1px] flex-1 bg-[#C5A059]" />
            <div className="w-1.5 h-1.5 rotate-45 bg-[#C5A059]" />
            <div className="h-[1px] flex-1 bg-[#C5A059]" />
          </div>

          {/* Venue Location & Name */}
          <div className="space-y-3 mb-8">
            <div className="flex items-center justify-center gap-2 text-[#A67C2E]">
              <MapPin size={22} className="stroke-[1.5]" />
            </div>

            <h4 className="font-serif-luxury text-2xl sm:text-3xl font-normal text-[#2B2421] tracking-wide">
              Mövenpick Hotel &amp; Apartments Bur Dubai
            </h4>
            <p className="font-sans-luxury text-xs sm:text-sm tracking-[0.15em] text-[#6B5E55] uppercase font-medium">
              19th Street, Oud Metha, Dubai
            </p>
            <p className="font-arabic text-lg sm:text-xl text-[#A67C2E] pt-1 font-medium" dir="rtl">
              فندق موڤنمبيك، شارع ١٩، عود ميثاء، دبي
            </p>
          </div>

          {/* Bespoke Luxury Google Maps Button */}
          <div className="pt-6 border-t border-[#EADBCE]">
            <button
              onClick={openGoogleMaps}
              className="group w-full sm:w-auto px-10 py-4 bg-[#2B2421] hover:bg-[#3D332F] border border-[#C5A059] text-[#FAF7F2] rounded-full text-xs font-sans-luxury tracking-[0.22em] uppercase font-semibold transition-all duration-300 inline-flex items-center justify-center gap-3 shadow-[0_10px_25px_rgba(43,36,33,0.12)] hover:shadow-[0_15px_30px_rgba(197,160,89,0.2)] hover:scale-[1.01] cursor-pointer"
            >
              <NavIcon size={14} className="text-[#C5A059] group-hover:rotate-45 transition-transform duration-300" />
              <span>OPEN IN GOOGLE MAPS</span>
              <span className="w-1 h-1 rounded-full bg-[#C5A059]" />
              <span className="font-arabic font-normal text-sm text-[#EADBCE]">خرائط جوجل</span>
              <ExternalLink size={12} className="opacity-60 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
