import { useState } from 'react';
import { soundManager } from '../utils/soundEffects';
import { firePinkConfetti, fireGrandCelebration } from '../utils/confetti';
import { Heart, Sparkles } from 'lucide-react';

interface GiftBoxSceneProps {
  onOpenComplete: () => void;
  onDiscoverSecretHeart?: (id: number) => void;
  isSecretHeartFound?: boolean;
}

export function GiftBoxScene({
  onOpenComplete,
  onDiscoverSecretHeart,
  isSecretHeartFound
}: GiftBoxSceneProps) {
  // Animation phases:
  // 'idle' -> 'shaking' -> 'untying' -> 'lid-opening' -> 'cheesecake-rising' -> 'complete'
  const [phase, setPhase] = useState<'idle' | 'shaking' | 'untying' | 'lid-opening' | 'cheesecake-rising' | 'complete'>('idle');
  const [tapHearts, setTapHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  const handleBoxTap = (e: React.MouseEvent<HTMLDivElement>) => {
    if (phase !== 'idle') return;
    soundManager.playPop();

    const rect = e.currentTarget.getBoundingClientRect();
    const newHeart = {
      id: Date.now() + Math.random(),
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };

    setTapHearts((prev) => [...prev, newHeart]);
    setTimeout(() => {
      setTapHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 800);
  };

  const handleStartOpen = () => {
    if (phase !== 'idle') return;

    // Start background music on first interaction if not yet playing
    if (!soundManager.getIsMusicPlaying()) {
      soundManager.startMusic();
    }

    soundManager.playPop();
    setPhase('shaking');

    // 1 & 2: Shaking
    setTimeout(() => {
      setPhase('untying');
      soundManager.playCardFlip();
    }, 800);

    // 3 & 4: Bow untying & ribbon loose
    setTimeout(() => {
      setPhase('lid-opening');
      soundManager.playPaperRustle();
    }, 1700);

    // 5 & 6: Lid lifts & confetti burst
    setTimeout(() => {
      soundManager.playConfetti();
      firePinkConfetti({ originY: 0.5 });
      setPhase('cheesecake-rising');
    }, 2500);

    // 7 & 8: Cheesecake rising out of box & celebration
    setTimeout(() => {
      fireGrandCelebration();
      soundManager.playChime();
      setPhase('complete');
    }, 3900);

    // Transition to main cheesecake scene
    setTimeout(() => {
      onOpenComplete();
    }, 4900);
  };

  return (
    <div className={`relative flex flex-col items-center justify-center min-h-[82vh] px-4 transition-all duration-1000 ${
      phase !== 'idle' ? 'bg-gradient-to-b from-[#FFF0F5]/80 via-[#FFE4EE]/90 to-[#FFDDE8]' : ''
    }`}>
      {/* Background warm glow when opening */}
      {phase !== 'idle' && (
        <div className="absolute inset-0 pointer-events-none bg-radial from-pink-300/30 via-rose-200/10 to-transparent blur-3xl animate-pulse" />
      )}

      {/* Header text */}
      <div className={`text-center max-w-xl mx-auto mb-6 transition-all duration-700 ${
        phase === 'cheesecake-rising' || phase === 'complete' ? 'scale-105' : ''
      }`}>
        {phase === 'complete' ? (
          <div className="space-y-2 animate-in fade-in zoom-in-95 duration-500">
            <h1 className="font-serif-display text-4xl sm:text-5xl font-bold text-pink-900 tracking-tight">
              SURPRISE, LAMA! 🎉
            </h1>
            <p className="font-cursive text-2xl sm:text-3xl text-rose-700 font-semibold">
              Today, we're celebrating YOU! ♡
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="font-cursive text-2xl sm:text-3xl text-rose-600 font-bold">
              To my favorite big sister figure, Lama ♡
            </p>
            <h1 className="font-serif-display text-2xl sm:text-3xl md:text-4xl text-pink-950 font-bold tracking-tight">
              Someone as special as you deserves a little magic.
            </h1>
            <p className="text-pink-900/80 text-sm sm:text-base font-medium">
              There's a little surprise waiting just for you...
            </p>
          </div>
        )}
      </div>

      {/* 3D Gift Box Stage Container */}
      <div className="relative w-72 h-80 sm:w-84 sm:h-92 flex items-center justify-center perspective-1000">
        {/* Floating sparkles around box */}
        <div className="absolute -top-6 -left-6 text-pink-400 text-xl animate-sparkle">✨</div>
        <div className="absolute top-8 -right-4 text-pink-300 text-lg animate-sparkle" style={{ animationDelay: '1s' }}>💖</div>
        <div className="absolute -bottom-2 -left-4 text-pink-400 text-lg animate-sparkle" style={{ animationDelay: '1.8s' }}>🌸</div>
        <div className="absolute -bottom-4 right-6 text-rose-400 text-xl animate-sparkle" style={{ animationDelay: '0.6s' }}>✨</div>

        {/* Secret Heart #1 (Hidden discreetly on the decorative gift corner tag) */}
        {!isSecretHeartFound && onDiscoverSecretHeart && phase === 'idle' && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDiscoverSecretHeart(1);
            }}
            title="A curious tiny heart..."
            className="absolute -top-3 right-8 z-30 p-1.5 text-pink-400/80 hover:text-pink-600 hover:scale-130 transition-transform cursor-pointer"
          >
            <Heart className="w-4 h-4 fill-pink-300/60" />
          </button>
        )}

        {/* Tap heart particles */}
        {tapHearts.map((h) => (
          <div
            key={h.id}
            className="absolute z-40 text-rose-500 font-bold text-lg pointer-events-none animate-bounce"
            style={{ left: h.x, top: h.y }}
          >
            ♡
          </div>
        ))}

        {/* Shadow underneath */}
        <div className={`absolute bottom-6 w-52 sm:w-60 h-8 bg-pink-950/15 rounded-[100%] blur-md transition-all duration-700 ${
          phase === 'idle' ? 'scale-100' : 'scale-90 opacity-60'
        }`} />

        {/* The Gift Box Assembly */}
        <div
          onClick={handleBoxTap}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`relative w-56 h-56 sm:w-64 sm:h-64 cursor-pointer select-none transition-transform duration-500 ${
            phase === 'idle' ? (isHovered ? 'scale-105' : 'animate-gentle-float') : ''
          } ${phase === 'shaking' ? 'animate-bounce' : ''}`}
        >
          {/* THE CHEESECAKE RISING FROM INSIDE */}
          <div
            className={`absolute left-1/2 -translate-x-1/2 w-48 sm:w-54 transition-all duration-1000 z-15 ${
              phase === 'cheesecake-rising' || phase === 'complete'
                ? '-top-32 scale-105 opacity-100'
                : 'top-10 scale-50 opacity-0 pointer-events-none'
            }`}
          >
            {/* Mini preview of the cheesecake rising out */}
            <div className="relative flex flex-col items-center">
              {/* Sparkle burst */}
              <div className="text-3xl animate-bounce">✨🍓✨</div>
              {/* Cake illustration plate */}
              <div className="w-44 h-24 bg-gradient-to-b from-[#FFF9F7] via-[#FFF3E8] to-[#E2A76F] rounded-2xl shadow-xl border-2 border-pink-200 relative overflow-hidden flex items-center justify-center">
                {/* Strawberry glaze */}
                <div className="absolute top-0 inset-x-0 h-6 bg-gradient-to-r from-rose-400 via-pink-500 to-rose-400 rounded-b-xl" />
                <div className="relative text-2xl z-10">🎂🍓</div>
                <div className="absolute bottom-1 text-[10px] font-bold text-amber-900">Sweet Strawberry Cheesecake</div>
              </div>
              <div className="text-xs font-bold text-pink-700 mt-1">Rising for Lama! ♡</div>
            </div>
          </div>

          {/* GIFT BOX LID */}
          <div
            className={`absolute -top-3 -left-2 -right-2 h-14 sm:h-16 rounded-2xl z-20 transition-all duration-700 bg-gradient-to-b from-[#F4AFC5] via-[#E88EAD] to-[#D87899] shadow-md border-b-2 border-pink-400 ${
              phase === 'lid-opening' || phase === 'cheesecake-rising' || phase === 'complete'
                ? '-translate-y-28 -rotate-12 opacity-85 scale-95 shadow-xl'
                : ''
            }`}
          >
            {/* Lid rim bevel */}
            <div className="absolute inset-x-2 top-1 h-2 bg-pink-100/40 rounded-full" />

            {/* Vertical Ribbon on Lid */}
            <div className={`absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 sm:w-9 bg-gradient-to-r from-[#FFDDE8] via-[#FFF9F7] to-[#FFDDE8] shadow-sm transition-opacity ${
              phase === 'untying' || phase === 'lid-opening' || phase === 'cheesecake-rising' || phase === 'complete' ? 'opacity-40' : 'opacity-100'
            }`} />

            {/* THE BIG SATIN BOW ON TOP */}
            <div
              className={`absolute -top-9 left-1/2 -translate-x-1/2 transition-all duration-700 z-30 ${
                phase === 'untying' || phase === 'lid-opening' || phase === 'cheesecake-rising' || phase === 'complete'
                  ? '-translate-y-16 scale-125 opacity-20 rotate-45'
                  : 'hover:scale-110'
              }`}
            >
              {/* Bow Left Loop */}
              <div className="relative flex items-center justify-center">
                <div className="w-10 h-9 bg-gradient-to-br from-[#FFE4EE] via-[#F8C8DC] to-[#F4AFC5] rounded-l-full rotate-[-25deg] shadow-md border border-pink-200" />
                {/* Bow Center Knot */}
                <div className="w-7 h-7 bg-gradient-to-b from-[#FFF0F5] to-[#E88EAD] rounded-full z-10 shadow-sm border border-pink-200 flex items-center justify-center">
                  <span className="text-[10px] text-pink-700">🎀</span>
                </div>
                {/* Bow Right Loop */}
                <div className="w-10 h-9 bg-gradient-to-bl from-[#FFE4EE] via-[#F8C8DC] to-[#F4AFC5] rounded-r-full rotate-[25deg] shadow-md border border-pink-200" />
              </div>
              {/* Bow Tails */}
              <div className="flex justify-between w-12 mx-auto -mt-1">
                <div className="w-3.5 h-6 bg-[#F8C8DC] rounded-b-md rotate-[-20deg] shadow-xs" />
                <div className="w-3.5 h-6 bg-[#F8C8DC] rounded-b-md rotate-[20deg] shadow-xs" />
              </div>
            </div>
          </div>

          {/* GIFT BOX MAIN BODY */}
          <div className="w-full h-full bg-gradient-to-b from-[#FFDDE8] via-[#F8C8DC] to-[#F4AFC5] rounded-3xl shadow-2xl border border-pink-200 relative overflow-hidden">
            {/* Satin Sheen effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />

            {/* Horizontal Ribbon */}
            <div
              className={`absolute top-1/2 -translate-y-1/2 inset-x-0 h-9 sm:h-10 bg-gradient-to-b from-[#FFF9F7] via-[#FFE4EE] to-[#FFDDE8] shadow-inner transition-all duration-700 ${
                phase === 'untying' || phase === 'lid-opening' || phase === 'cheesecake-rising' || phase === 'complete'
                  ? 'scale-x-0 opacity-0'
                  : 'opacity-100'
              }`}
            >
              {/* Ribbon gold/pink stitch line */}
              <div className="absolute top-1 inset-x-0 border-t border-dashed border-pink-300/70" />
              <div className="absolute bottom-1 inset-x-0 border-b border-dashed border-pink-300/70" />
            </div>

            {/* Vertical Ribbon */}
            <div
              className={`absolute inset-y-0 left-1/2 -translate-x-1/2 w-9 sm:w-10 bg-gradient-to-r from-[#FFF9F7] via-[#FFE4EE] to-[#FFDDE8] shadow-inner transition-all duration-700 ${
                phase === 'untying' || phase === 'lid-opening' || phase === 'cheesecake-rising' || phase === 'complete'
                  ? 'scale-y-0 opacity-0'
                  : 'opacity-100'
              }`}
            >
              <div className="absolute left-1 inset-y-0 border-l border-dashed border-pink-300/70" />
              <div className="absolute right-1 inset-y-0 border-r border-dashed border-pink-300/70" />
            </div>

            {/* Subtle box corner badge / tag */}
            <div className="absolute bottom-3 right-3 text-xs text-pink-700/80 font-bold bg-white/70 px-2 py-0.5 rounded-lg border border-pink-200/60 shadow-2xs">
              For Lama ♡
            </div>
          </div>
        </div>
      </div>

      {/* Button to Open Gift */}
      <div className="mt-8 z-20">
        {phase === 'idle' ? (
          <button
            type="button"
            onClick={handleStartOpen}
            className="group relative inline-flex items-center gap-2.5 px-8 py-3.5 sm:px-10 sm:py-4 rounded-full bg-gradient-to-r from-[#F4AFC5] via-[#E88EAD] to-[#F4AFC5] text-pink-950 font-bold text-lg sm:text-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-white/80"
          >
            <Sparkles className="w-5 h-5 text-pink-900 group-hover:rotate-12 transition-transform" />
            <span>OPEN YOUR GIFT!</span>
            <span className="text-xl">🎁</span>
          </button>
        ) : (
          <div className="text-center font-cursive text-2xl text-rose-700 font-bold animate-pulse">
            {phase === 'shaking' && 'Untying the ribbon with love... 🎀'}
            {phase === 'untying' && 'Opening your surprise... ✨'}
            {phase === 'lid-opening' && 'Look what is inside! 🎉'}
            {(phase === 'cheesecake-rising' || phase === 'complete') && 'Delicious strawberry cheesecake for Lama! 🍰♡'}
          </div>
        )}
      </div>

      {/* Helpful hint for user */}
      <div className="mt-4 text-xs text-pink-800/70 font-medium">
        {phase === 'idle' && '(Tap or hover the gift box, then press open!)'}
      </div>
    </div>
  );
}
