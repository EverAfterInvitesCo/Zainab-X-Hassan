import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X, Maximize2, Pause, Play } from 'lucide-react';
import { PolaroidPhoto } from '../types';

const galleryPhotos: PolaroidPhoto[] = [
  {
    id: '1',
    src: '/media/1.jpg',
    titleEn: 'Vol. 01',
    titleAr: 'المجلد ٠١',
    captionEn: 'Vol. 01',
    captionAr: 'المجلد ٠١',
    rotation: -2,
    offsetY: 0,
  },
  {
    id: '2',
    src: '/media/2.jpg',
    titleEn: 'Vol. 02',
    titleAr: 'المجلد ٠٢',
    captionEn: 'Vol. 02',
    captionAr: 'المجلد ٠٢',
    rotation: 2.5,
    offsetY: 6,
  },
  {
    id: '3',
    src: '/media/3.jpg',
    titleEn: 'Vol. 03',
    titleAr: 'المجلد ٠٣',
    captionEn: 'Vol. 03',
    captionAr: 'المجلد ٠٣',
    rotation: -1.5,
    offsetY: -4,
  },
  {
    id: '4',
    src: '/media/4.jpg',
    titleEn: 'Vol. 04',
    titleAr: 'المجلد ٠٤',
    captionEn: 'Vol. 04',
    captionAr: 'المجلد ٠٤',
    rotation: 3,
    offsetY: 8,
  },
  {
    id: '5',
    src: '/media/5.jpg',
    titleEn: 'Vol. 05',
    titleAr: 'المجلد ٠٥',
    captionEn: 'Vol. 05',
    captionAr: 'المجلد ٠٥',
    rotation: -2.5,
    offsetY: -6,
  },
  {
    id: '6',
    src: '/media/6.jpg',
    titleEn: 'Vol. 06',
    titleAr: 'المجلد ٠٦',
    captionEn: 'Vol. 06',
    captionAr: 'المجلد ٠٦',
    rotation: 1.5,
    offsetY: 4,
  },
];

// Duplicated list for seamless infinite horizontal scroll
const infiniteGallery = [...galleryPhotos, ...galleryPhotos];

export const PolaroidMemoriesSection: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activePhoto, setActivePhoto] = useState<PolaroidPhoto | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="memories"
      className="relative w-full py-24 sm:py-32 md:py-36 bg-[#FAF7F2] text-[#2B2421] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-8 sm:mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#EADBCE] pb-8">
          <div>
            <h2 className="font-display-luxury text-3xl sm:text-4xl md:text-5xl font-light text-[#2B2421] uppercase tracking-[0.18em]">
              OUR MEMORIES
            </h2>
            <h3 className="font-arabic-calligraphy text-3xl sm:text-4xl text-[#A67C2E] mt-1">
              ذكرياتنا الجميلة
            </h3>
          </div>

          {/* Scroll navigation controls & Auto-play toggle */}
          <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 w-full md:w-auto">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#C5A059]/40 hover:border-[#C5A059] text-xs font-sans-luxury tracking-[0.15em] uppercase text-[#2B2421] hover:text-[#A67C2E] transition-all bg-[#FFFFFF] shadow-sm cursor-pointer"
              title={isPaused ? 'Resume auto-scroll' : 'Pause auto-scroll'}
            >
              {isPaused ? <Play size={12} className="text-[#A67C2E] fill-[#A67C2E]" /> : <Pause size={12} />}
              <span>{isPaused ? 'AUTO-SCROLL' : 'SCROLLING'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                id="zh-polaroid-scroll-left"
                onClick={scrollLeft}
                className="w-10 h-10 rounded-full border border-[#EADBCE] hover:border-[#C5A059] bg-[#FFFFFF] text-[#2B2421] hover:text-[#A67C2E] flex items-center justify-center transition-all shadow-sm focus:outline-none cursor-pointer"
                aria-label="Scroll gallery left"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                id="zh-polaroid-scroll-right"
                onClick={scrollRight}
                className="w-10 h-10 rounded-full border border-[#EADBCE] hover:border-[#C5A059] bg-[#FFFFFF] text-[#2B2421] hover:text-[#A67C2E] flex items-center justify-center transition-all shadow-sm focus:outline-none cursor-pointer"
                aria-label="Scroll gallery right"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* HORIZONTAL AUTO-SCROLL RUNWAY */}
      <div
        ref={scrollContainerRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="w-full overflow-x-auto no-scrollbar py-6 sm:py-8 px-4 sm:px-8 touch-pan-x cursor-grab active:cursor-grabbing"
      >
        <div
          className={`animate-marquee-ltr ${isPaused ? 'marquee-paused' : ''} flex items-center gap-6 sm:gap-8 md:gap-10 pb-6`}
        >
          {infiniteGallery.map((photo, index) => (
            <div
              key={`${photo.id}-${index}`}
              onClick={() => setActivePhoto(photo)}
              style={{
                transform: `rotate(${photo.rotation}deg) translateY(${photo.offsetY}px)`,
              }}
              className="group relative bg-[#FFFDF9] text-[#2B2421] p-3.5 pb-6 sm:p-4 sm:pb-7 rounded-lg border border-[#EADBCE] shadow-[0_15px_35px_rgba(180,140,110,0.12)] hover:shadow-[0_20px_45px_rgba(180,140,110,0.22)] cursor-pointer transition-all duration-300 w-[230px] sm:w-[280px] md:w-[310px] shrink-0 select-none hover:-translate-y-2 hover:border-[#C5A059]"
            >
              {/* Photo Area */}
              <div className="relative aspect-[4/5] bg-[#FAF7F2] overflow-hidden rounded">
                <img
                  src={photo.src}
                  alt={`Memory ${photo.id}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out contrast-[1.02] brightness-[0.95]"
                  loading="lazy"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-[#C5A059]/5 group-hover:bg-transparent transition-colors" />
                <div className="absolute top-2 right-2 p-1.5 bg-[#2B2421]/70 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 size={12} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Touch Instruction */}
      <div className="text-center mt-2 sm:mt-4 md:hidden">
        <p className="text-[10px] font-sans-luxury tracking-[0.25em] text-[#8C7D70] uppercase">
          TAP ANY PHOTO TO ENLARGE · انقر على الصورة للتكبير
        </p>
      </div>

      {/* Full-screen Lightbox Modal */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePhoto(null)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          >
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-6 right-6 p-3 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
              aria-label="Close photo preview"
            >
              <X size={24} />
            </button>

            <div
              onClick={(e) => e.stopPropagation()}
              className="max-w-2xl max-h-[85vh] flex flex-col items-center bg-[#FFFDF9] text-[#2B2421] p-3 sm:p-4 rounded-2xl shadow-2xl overflow-hidden border border-[#EADBCE]"
            >
              <div className="relative w-full max-h-[75vh] overflow-hidden rounded-lg bg-black/5">
                <img
                  src={activePhoto.src}
                  alt={`Memory ${activePhoto.id}`}
                  className="w-full h-full max-h-[75vh] object-contain"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
