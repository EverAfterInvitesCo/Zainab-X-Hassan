import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useMusic } from '../context/MusicContext';

interface EntryScreenProps {
  onEnter: () => void;
  isEntered: boolean;
}

export const EntryScreen: React.FC<EntryScreenProps> = ({ onEnter, isEntered }) => {
  const { startMusic } = useMusic();
  const [isPlayingVideo, setIsPlayingVideo] = useState<boolean>(false);
  const [isVideoEnded, setIsVideoEnded] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Preload video
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, []);

  const handleTapToOpen = async () => {
    if (isPlayingVideo) return;
    setIsPlayingVideo(true);

    // Start background music
    startMusic().catch((e) => console.warn('Music playback notice:', e));

    // Play video
    if (videoRef.current) {
      try {
        videoRef.current.currentTime = 0;
        await videoRef.current.play();
      } catch (err) {
        console.warn('Video playback notice:', err);
        // Fallback: if video fails to play, proceed directly to site
        setTimeout(() => {
          handleComplete();
        }, 1500);
      }
    } else {
      setTimeout(() => {
        handleComplete();
      }, 1500);
    }
  };

  const handleVideoEnded = () => {
    setIsVideoEnded(true);
    setTimeout(() => {
      handleComplete();
    }, 400);
  };

  const handleComplete = () => {
    onEnter();
  };

  return (
    <AnimatePresence>
      {!isEntered && (
        <motion.div
          id="zh-entry-curtain"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } }}
          className="fixed inset-0 z-50 bg-[#FAF7F2] flex flex-col items-center justify-center select-none overflow-hidden cursor-pointer"
          onClick={!isPlayingVideo ? handleTapToOpen : undefined}
        >
          {/* Static Closed Envelope Image Screen */}
          <div
            className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${
              isPlayingVideo ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          >
            {/* Full frame static image */}
            <img
              src="/media/static.jpeg"
              alt="Wedding Invitation Envelope"
              className="w-full h-full object-cover object-center"
              loading="eager"
            />

            {/* Burgundy "Tap to open" floating prompt - Pure Text, No Box */}
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-14 sm:pb-20 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="flex flex-col items-center gap-1.5 text-center drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]"
              >
                <span className="font-serif-luxury italic text-xl sm:text-2xl md:text-3xl tracking-[0.25em] uppercase font-bold text-[#5C1D24] drop-shadow-md animate-pulse">
                  Tap to open
                </span>
                <span className="font-arabic text-base sm:text-lg text-[#5C1D24] font-medium tracking-widest drop-shadow-md">
                  انقر للفتح
                </span>
              </motion.div>
            </div>
          </div>

          {/* Opening Envelope Video Player - Full Frame */}
          <div
            className={`absolute inset-0 w-full h-full bg-[#FAF7F2] transition-opacity duration-500 ${
              isPlayingVideo && !isVideoEnded ? 'opacity-100 z-20' : 'opacity-0 pointer-events-none z-0'
            }`}
          >
            <video
              ref={videoRef}
              src="/media/envelopes.mp4"
              playsInline
              muted
              preload="auto"
              onEnded={handleVideoEnded}
              className="w-full h-full object-cover object-center"
            />

            {/* Subtle skip button if user wishes to skip opening animation */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleComplete();
              }}
              className="absolute top-6 right-6 px-4 py-2 bg-white/75 hover:bg-white text-[#5C1D24] text-[10px] font-sans-luxury tracking-[0.2em] uppercase font-bold rounded-full backdrop-blur-md border border-white/80 shadow-md transition-all cursor-pointer z-30"
            >
              SKIP · تخطي
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
