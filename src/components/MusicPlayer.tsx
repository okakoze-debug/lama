import { useState, useEffect } from 'react';
import { soundManager } from '../utils/soundEffects';
import { Volume2, VolumeX, Music, Sparkles } from 'lucide-react';
import { firePinkConfetti } from '../utils/confetti';

interface MusicPlayerProps {
  onSurpriseClick?: () => void;
}

export function MusicPlayer({ onSurpriseClick }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(soundManager.getIsMusicPlaying());
  const [isMuted, setIsMuted] = useState(soundManager.getIsMuted());

  useEffect(() => {
    soundManager.setMusicCallback((playing) => {
      setIsPlaying(playing);
    });
  }, []);

  const handleToggleMusic = () => {
    soundManager.toggleMusic();
    setIsPlaying(soundManager.getIsMusicPlaying());
  };

  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const handleConfettiShower = () => {
    soundManager.playConfetti();
    firePinkConfetti({ originY: 0.4 });
    if (onSurpriseClick) onSurpriseClick();
  };

  return (
    <div className="flex items-center gap-2">
      {/* Surprise button */}
      <button
        type="button"
        onClick={handleConfettiShower}
        title="Shower of pastel confetti"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#FFDDE8]/80 hover:bg-[#F8C8DC] text-pink-900 border border-pink-200 shadow-2xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
      >
        <Sparkles className="w-3.5 h-3.5 text-pink-600 animate-spin" style={{ animationDuration: '6s' }} />
        <span>One more surprise?</span>
      </button>

      {/* Music Toggle */}
      <button
        type="button"
        onClick={handleToggleMusic}
        title={isPlaying ? "Pause music-box melody" : "Play music-box melody"}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
          isPlaying
            ? 'bg-[#F4AFC5] text-pink-950 border-pink-300 shadow-xs'
            : 'bg-white/80 text-pink-800 border-pink-200 hover:bg-pink-50'
        }`}
      >
        <Music className={`w-3.5 h-3.5 ${isPlaying ? 'animate-bounce text-pink-900' : 'text-pink-600'}`} />
        <span className="hidden sm:inline">{isPlaying ? 'Music: Playing' : 'Music: Off'}</span>
        {isPlaying && (
          <span className="flex items-end gap-0.5 h-3">
            <span className="w-0.5 h-2 bg-pink-800 rounded-full animate-pulse" />
            <span className="w-0.5 h-3 bg-pink-800 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
            <span className="w-0.5 h-1.5 bg-pink-800 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
          </span>
        )}
      </button>

      {/* Sound Mute/Unmute */}
      <button
        type="button"
        onClick={handleToggleMute}
        title={isMuted ? "Unmute sounds" : "Mute all sounds"}
        className="p-1.5 rounded-full bg-white/80 hover:bg-pink-100 text-pink-800 border border-pink-200 transition-colors cursor-pointer"
      >
        {isMuted ? (
          <VolumeX className="w-4 h-4 text-pink-400" />
        ) : (
          <Volume2 className="w-4 h-4 text-pink-700" />
        )}
      </button>
    </div>
  );
}
