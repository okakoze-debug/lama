import { useState } from 'react';
import { soundManager } from '../utils/soundEffects';
import { fireHeartsConfetti } from '../utils/confetti';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';

interface VirtualHugSceneProps {
  onComplete: () => void;
}

export function VirtualHugScene({ onComplete }: VirtualHugSceneProps) {
  const [hugCount, setHugCount] = useState(0);
  const [isHugging, setIsHugging] = useState(false);
  const [hugParticles, setHugParticles] = useState<{ id: number; emoji: string }[]>([]);

  const handleGiveHug = () => {
    soundManager.playHugSound();
    fireHeartsConfetti();
    setIsHugging(true);
    setHugCount((prev) => prev + 1);

    // Heart emojis bursting
    const emojis = ['💖', '💕', '💗', '💓', '🧸', '✨'];
    const newParticles = emojis.map((emoji, idx) => ({
      id: Date.now() + idx,
      emoji
    }));

    setHugParticles(newParticles);

    setTimeout(() => {
      setIsHugging(false);
    }, 1200);

    setTimeout(() => {
      setHugParticles([]);
    }, 2000);
  };

  return (
    <div className={`relative flex flex-col items-center justify-center min-h-[85vh] px-4 py-8 transition-colors duration-700 ${
      isHugging ? 'bg-gradient-to-b from-pink-200/50 via-rose-100/60 to-pink-200/50' : 'bg-transparent'
    }`}>
      {/* Background Soft Clouds & Flowers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-12 left-10 text-4xl opacity-50 animate-gentle-float">☁️</div>
        <div className="absolute top-24 right-12 text-3xl opacity-50 animate-gentle-float" style={{ animationDelay: '1.5s' }}>☁️</div>
        <div className="absolute bottom-20 left-16 text-2xl opacity-60">🌸</div>
        <div className="absolute bottom-24 right-20 text-2xl opacity-60">🌸</div>
      </div>

      {/* Floating Burst Particles on Hug */}
      {hugParticles.map((p, idx) => (
        <div
          key={p.id}
          className="absolute text-3xl sm:text-4xl pointer-events-none animate-bounce z-40"
          style={{
            top: `${30 + (idx % 3) * 12}%`,
            left: `${20 + idx * 11}%`,
            animationDuration: '1s'
          }}
        >
          {p.emoji}
        </div>
      ))}

      {/* Header */}
      <div className="text-center max-w-md mx-auto mb-6 z-10">
        <p className="font-cursive text-2xl sm:text-3xl text-rose-600 font-bold mb-1">
          OKAY, ENOUGH MAKING YOU EMOTIONAL.
        </p>
        <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-pink-950 tracking-tight">
          COME HERE, YOU DESERVE A HUG! 🤗
        </h2>
      </div>

      {/* THE TEDDY BEAR SVG / ILLUSTRATION WITH BIG HEART */}
      <div className="relative my-4 flex flex-col items-center z-10">
        {/* Soft Warm Glow */}
        <div className={`absolute inset-0 bg-pink-400/20 rounded-full blur-2xl transition-all duration-500 pointer-events-none ${
          isHugging ? 'scale-150 bg-rose-400/40' : 'scale-90'
        }`} />

        {/* The Bear + Heart Visual Container */}
        <div
          onClick={handleGiveHug}
          className={`relative cursor-pointer select-none transition-transform duration-500 ${
            isHugging ? 'scale-115 rotate-1' : 'hover:scale-105 animate-gentle-float'
          }`}
        >
          {/* Bear Character */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
            {/* Bear SVG */}
            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl" fill="none">
              {/* Ears */}
              <circle cx="55" cy="55" r="24" fill="#C89666" />
              <circle cx="55" cy="55" r="14" fill="#F8C8DC" />
              <circle cx="145" cy="55" r="24" fill="#C89666" />
              <circle cx="145" cy="55" r="14" fill="#F8C8DC" />

              {/* Head */}
              <circle cx="100" cy="90" r="48" fill="#D9A574" />

              {/* Snout */}
              <ellipse cx="100" cy="100" rx="20" ry="16" fill="#FFF3E8" />
              <ellipse cx="100" cy="94" rx="7" ry="5" fill="#4A333A" />
              <path d="M100 99 L100 106" stroke="#4A333A" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M94 105 Q100 110 106 105" stroke="#4A333A" strokeWidth="2" strokeLinecap="round" fill="none" />

              {/* Cheeks blush */}
              <circle cx="75" cy="102" r="7" fill="#F4AFC5" opacity="0.75" />
              <circle cx="125" cy="102" r="7" fill="#F4AFC5" opacity="0.75" />

              {/* Eyes */}
              <circle cx="80" cy="84" r="5" fill="#3E2723" />
              <circle cx="82" cy="82" r="1.8" fill="#FFF" />
              <circle cx="120" cy="84" r="5" fill="#3E2723" />
              <circle cx="122" cy="82" r="1.8" fill="#FFF" />

              {/* Body */}
              <ellipse cx="100" cy="150" rx="42" ry="36" fill="#C89666" />

              {/* GIANT HEART HELD IN BEAR'S ARMS */}
              <g className={`transition-transform duration-500 origin-center ${isHugging ? 'scale-110' : ''}`}>
                <path
                  d="M100 128 C85 105, 55 110, 55 136 C55 160, 100 185, 100 185 C100 185, 145 160, 145 136 C145 110, 115 105, 100 128 Z"
                  fill="url(#hugHeartGrad)"
                  filter="drop-shadow(0 4px 6px rgba(0,0,0,0.15))"
                />
              </g>

              {/* Bear Paws Hugging Heart */}
              {/* Left Arm / Paw */}
              <ellipse
                cx={isHugging ? "82" : "65"}
                cy={isHugging ? "142" : "138"}
                rx="14"
                ry="10"
                transform={isHugging ? "rotate(20 82 142)" : "rotate(-25 65 138)"}
                fill="#B88656"
                stroke="#A77546"
                strokeWidth="1.5"
              />
              {/* Right Arm / Paw */}
              <ellipse
                cx={isHugging ? "118" : "135"}
                cy={isHugging ? "142" : "138"}
                rx="14"
                ry="10"
                transform={isHugging ? "rotate(-20 118 142)" : "rotate(25 135 138)"}
                fill="#B88656"
                stroke="#A77546"
                strokeWidth="1.5"
              />

              <defs>
                <linearGradient id="hugHeartGrad" x1="55" y1="110" x2="145" y2="185" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FFDDE8" />
                  <stop offset="0.5" stopColor="#F4AFC5" />
                  <stop offset="1" stopColor="#E88EAD" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Hugs Counter */}
        {hugCount > 0 && (
          <div className="text-xs font-bold text-pink-700 bg-white/90 px-3 py-1 rounded-full border border-pink-200 shadow-2xs mt-1">
            Total sibling hugs squeezed: {hugCount} 💕
          </div>
        )}
      </div>

      {/* Hug Status Message */}
      {hugCount > 0 && (
        <div className="my-4 max-w-sm text-center p-4 bg-white/90 border-2 border-pink-200 rounded-3xl shadow-md animate-in fade-in zoom-in-95 duration-200 z-10">
          <p className="font-serif-display text-base sm:text-lg font-bold text-pink-900">
            VIRTUAL HUG DELIVERED SUCCESSFULLY! 🧸💖
          </p>
          <p className="text-xs sm:text-sm text-pink-800 font-medium mt-1">
            "No returns, no refunds, and unlimited hugs whenever you need them."
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mt-4 z-20">
        <button
          type="button"
          onClick={handleGiveHug}
          className="px-9 py-3.5 sm:px-10 sm:py-4 rounded-full bg-gradient-to-r from-[#F4AFC5] via-[#E88EAD] to-[#F4AFC5] text-pink-950 font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white"
        >
          <Heart className="w-5 h-5 inline mr-1 fill-pink-900 text-pink-900" />
          <span>{hugCount === 0 ? 'HUGGG!' : 'ANOTHER ONE! 💕'}</span>
        </button>

        {hugCount > 0 && (
          <button
            type="button"
            onClick={() => {
              soundManager.playChime();
              onComplete();
            }}
            className="px-7 py-3.5 rounded-full bg-white hover:bg-pink-50 text-pink-900 font-bold text-base shadow-md border-2 border-pink-300 hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
          >
            <span>SEE YOUR FINAL SURPRISE</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
