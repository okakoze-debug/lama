import { useState, useEffect } from 'react';
import { soundManager } from '../utils/soundEffects';
import { fireGrandCelebration, fireHeartsConfetti } from '../utils/confetti';
import { Heart, RotateCcw } from 'lucide-react';

interface FinalBirthdaySceneProps {
  onReplay: () => void;
}

export function FinalBirthdayScene({ onReplay }: FinalBirthdaySceneProps) {
  const [lastHugTriggered, setLastHugTriggered] = useState(false);
  const [sectionStage, setSectionStage] = useState(1);

  // Progressive reveal of message sections
  useEffect(() => {
    fireGrandCelebration();
    soundManager.playConfetti();

    const t1 = setTimeout(() => setSectionStage(2), 600);
    const t2 = setTimeout(() => setSectionStage(3), 1400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const handleLastHug = () => {
    soundManager.playHugSound();
    fireHeartsConfetti();
    setLastHugTriggered(true);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[90vh] px-4 py-12 text-center overflow-hidden">
      {/* Floating Heart Balloons in background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-4 left-10 text-4xl animate-gentle-float opacity-70" style={{ animationDuration: '7s' }}>
          🎈
        </div>
        <div className="absolute top-1/4 right-8 text-5xl animate-gentle-float opacity-70" style={{ animationDuration: '8s', animationDelay: '1s' }}>
          🎈
        </div>
        <div className="absolute bottom-20 left-12 text-3xl animate-gentle-float opacity-60" style={{ animationDuration: '6.5s', animationDelay: '2s' }}>
          🎈
        </div>
        <div className="absolute top-1/3 left-6 text-2xl animate-sparkle">✨</div>
        <div className="absolute top-16 right-1/4 text-2xl animate-sparkle" style={{ animationDelay: '1.2s' }}>⭐</div>
      </div>

      {/* Center glowing heart aura */}
      <div className="absolute w-96 h-96 bg-gradient-to-tr from-pink-300/30 via-rose-200/20 to-pink-100/30 rounded-full blur-3xl pointer-events-none" />

      {/* Main Birthday Header Block */}
      <div className="max-w-2xl mx-auto space-y-4 z-10">
        {/* Section 1 */}
        {sectionStage >= 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="font-cursive text-3xl sm:text-4xl text-rose-600 font-bold block mb-1">
              Dearest Big Sister
            </span>
            <h1 className="font-serif-display text-4xl sm:text-5xl md:text-6xl font-bold text-pink-950 tracking-tight">
              HAPPY BIRTHDAY, LAMA! 🎀
            </h1>
          </div>
        )}

        {/* Section 2 */}
        {sectionStage >= 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <p className="font-serif-display text-lg sm:text-xl md:text-2xl font-semibold text-rose-900 leading-snug">
              To an amazing person, a wonderful big-sister figure, and someone I'm genuinely lucky to know.
            </p>
          </div>
        )}

        {/* Section 3 */}
        {sectionStage >= 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pt-2">
            <p className="text-sm sm:text-base md:text-lg text-pink-950/80 font-medium leading-relaxed max-w-xl mx-auto bg-white/70 backdrop-blur-xs p-5 rounded-3xl border border-pink-200 shadow-sm">
              I hope this new chapter brings you happiness, peace, beautiful memories, and everything your heart has been wishing for. ♡
            </p>
          </div>
        )}
      </div>

      {/* Teddy Bear with Birthday Present Illustration */}
      <div className="relative my-8 z-10 flex flex-col items-center">
        <div className={`relative transition-all duration-700 ${lastHugTriggered ? 'scale-115' : 'hover:scale-105'}`}>
          <div className="text-8xl sm:text-9xl filter drop-shadow-xl select-none animate-gentle-float">
            🧸
          </div>
          {/* Present resting near bear */}
          <div className="absolute -bottom-2 -right-2 text-5xl animate-bounce">
            🎁
          </div>
          {/* Animated Glowing Heart */}
          <div className="absolute -top-4 -left-3 text-4xl animate-pulse">
            💖
          </div>
        </div>
      </div>

      {/* FINAL HUG REVEAL BLOCK */}
      {lastHugTriggered ? (
        <div className="max-w-lg mx-auto p-6 bg-gradient-to-br from-[#FFF9F7] via-[#FFE4EE] to-[#FFDDE8] border-2 border-pink-300 rounded-3xl shadow-xl space-y-3 z-10 animate-in fade-in zoom-in-95 duration-500 mb-8">
          <div className="text-3xl">💖🧸💖</div>
          <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-pink-950">
            LOVE YOU LOTS, BIG SIS! ♡
          </h2>
          <p className="text-sm sm:text-base text-pink-900 font-semibold leading-relaxed">
            Take care of yourself, keep smiling, and never forget how special you are.
          </p>
          <p className="text-xs sm:text-sm text-rose-600/90 font-medium italic pt-2 border-t border-pink-200">
            Your little sibling at heart, always cheering you on. ♡
          </p>
        </div>
      ) : (
        <div className="my-4 z-10">
          <button
            type="button"
            onClick={handleLastHug}
            className="group inline-flex items-center gap-2 px-8 py-4 sm:px-10 sm:py-4.5 rounded-full bg-gradient-to-r from-[#F4AFC5] via-[#E88EAD] to-[#F4AFC5] text-pink-950 font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-white"
          >
            <Heart className="w-5 h-5 fill-pink-950 text-pink-950 group-hover:scale-125 transition-transform" />
            <span>ONE LAST HUG BEFORE YOU GO</span>
          </button>
        </div>
      )}

      {/* REPLAY SURPRISE BUTTON */}
      <div className="mt-6 z-10">
        <button
          type="button"
          onClick={() => {
            soundManager.playPop();
            onReplay();
          }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/90 hover:bg-pink-100 text-pink-900 font-bold text-sm shadow-md border border-pink-300 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-pink-700" />
          <span>REPLAY MY SURPRISE</span>
        </button>
      </div>

      <div className="mt-8 text-[11px] text-pink-800/60 font-semibold">
        Handcrafted with love for Lama 🎀✨
      </div>
    </div>
  );
}
