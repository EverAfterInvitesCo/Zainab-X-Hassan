import React from 'react';
import { Volume2, VolumeX, Play, Pause, Lock } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

interface AudioPlayerProps {
  onAdminClick?: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ onAdminClick }) => {
  const { isPlaying, isMuted, hasStarted, togglePlay, toggleMute } = useMusic();

  if (!hasStarted) return null;

  return (
    <div
      id="zh-audio-controller"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#FFFFFF]/90 backdrop-blur-md border border-[#EADBCE] px-3.5 py-2 rounded-full shadow-[0_8px_30px_rgba(180,140,110,0.18)] transition-all duration-300 hover:border-[#C5A059]"
    >
      {/* Audio Wave Visualizer in Gold */}
      <div className="flex items-end gap-[3px] h-4 px-1">
        <div
          className={`w-[2px] bg-[#C5A059] rounded-full transition-all duration-300 ${
            isPlaying && !isMuted ? 'animate-audio-bar-1 h-3' : 'h-1.5 opacity-40'
          }`}
        />
        <div
          className={`w-[2px] bg-[#C5A059] rounded-full transition-all duration-300 ${
            isPlaying && !isMuted ? 'animate-audio-bar-2 h-4' : 'h-2 opacity-40'
          }`}
        />
        <div
          className={`w-[2px] bg-[#C5A059] rounded-full transition-all duration-300 ${
            isPlaying && !isMuted ? 'animate-audio-bar-3 h-2.5' : 'h-1 opacity-40'
          }`}
        />
      </div>

      <span className="text-[10px] tracking-[0.2em] uppercase text-[#6B5E55] font-sans-luxury pl-1 pr-1 hidden sm:inline-block font-semibold">
        MUSIC
      </span>

      {/* Play / Pause Button */}
      <button
        id="zh-audio-play-pause-btn"
        onClick={togglePlay}
        title={isPlaying ? 'Pause music' : 'Play music'}
        className="w-7 h-7 flex items-center justify-center rounded-full text-[#2B2421] hover:text-[#A67C2E] hover:bg-[#FAF7F2] transition-colors focus:outline-none cursor-pointer"
        aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
      >
        {isPlaying ? <Pause size={13} /> : <Play size={13} className="translate-x-[1px]" />}
      </button>

      {/* Mute / Unmute Button */}
      <button
        id="zh-audio-mute-btn"
        onClick={toggleMute}
        title={isMuted ? 'Unmute music' : 'Mute music'}
        className="w-7 h-7 flex items-center justify-center rounded-full text-[#2B2421] hover:text-[#A67C2E] hover:bg-[#FAF7F2] transition-colors focus:outline-none cursor-pointer"
        aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
      >
        {isMuted ? <VolumeX size={13} className="text-red-400" /> : <Volume2 size={13} />}
      </button>

      {/* Divider */}
      <div className="w-[1px] h-3.5 bg-[#EADBCE] mx-0.5" />

      {/* Organizer Portal Lock Button */}
      <button
        id="zh-organizer-lock-btn"
        onClick={onAdminClick}
        title="Organizer Portal"
        className="w-7 h-7 flex items-center justify-center rounded-full text-[#8C7D70] hover:text-[#2B2421] hover:bg-[#FAF7F2] transition-all focus:outline-none cursor-pointer group"
        aria-label="Organizer Portal"
      >
        <Lock size={13} className="group-hover:scale-110 transition-transform" />
      </button>
    </div>
  );
};
