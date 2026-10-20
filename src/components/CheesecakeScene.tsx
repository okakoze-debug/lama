import { useState, useEffect } from 'react';
import { soundManager } from '../utils/soundEffects';
import { firePinkConfetti, fireGrandCelebration } from '../utils/confetti';
import { useMicBlow } from '../utils/useMicBlow';
import { Sparkles, Mic, MicOff, Heart, CheckCircle2 } from 'lucide-react';

interface CheesecakeSceneProps {
  onComplete: () => void;
  onDiscoverSecretHeart?: (id: number) => void;
  isSecretHeartFound?: boolean;
}

interface SmokePuff {
  id: number;
  candleIndex: number;
}

export function CheesecakeScene({
  onComplete,
  onDiscoverSecretHeart,
  isSecretHeartFound
}: CheesecakeSceneProps) {
  // 5 candles state: true = lit, false = extinguished
  const [candles, setCandles] = useState<boolean[]>([true, true, true, true, true]);
  const [smokePuffs, setSmokePuffs] = useState<SmokePuff[]>([]);
  const [bouncingStrawberry, setBouncingStrawberry] = useState<number | null>(null);
  const [plateSparkles, setPlateSparkles] = useState<{ id: number; x: number; y: number }[]>([]);
  
  // Wish states: 'blowing' -> 'all-blown' -> 'wishing' -> 'wish-made'
  const [wishState, setWishState] = useState<'blowing' | 'all-blown' | 'wishing' | 'wish-made'>('blowing');
  const [strawberryQuote, setStrawberryQuote] = useState<string>("Tap my friends or the candles! 🍓");

  // Mic blow detection
  const handleMicBlow = () => {
    // Extinguish next lit candle
    setCandles((prev) => {
      const litIndex = prev.findIndex((lit) => lit);
      if (litIndex !== -1) {
        extinguishCandle(litIndex);
        return prev.map((lit, idx) => (idx === litIndex ? false : lit));
      }
      return prev;
    });
  };

  const { isMicActive, micError, startListening, stopListening } = useMicBlow(handleMicBlow);

  // Extinguish individual candle
  const extinguishCandle = (index: number) => {
    if (!candles[index]) return;

    soundManager.playCandleExtinguish();

    // Add smoke puff
    const newPuff = { id: Date.now() + Math.random(), candleIndex: index };
    setSmokePuffs((prev) => [...prev, newPuff]);
    setTimeout(() => {
      setSmokePuffs((prev) => prev.filter((p) => p.id !== newPuff.id));
    }, 1200);

    setCandles((prev) => {
      const next = [...prev];
      next[index] = false;
      return next;
    });
  };

  // Check if all candles are blown out
  const extinguishedCount = candles.filter((lit) => !lit).length;
  const allExtinguished = extinguishedCount === 5;

  useEffect(() => {
    if (allExtinguished && wishState === 'blowing') {
      setWishState('all-blown');
      soundManager.playChime();
      firePinkConfetti({ originY: 0.5 });
      setStrawberryQuote("You did it! Now make the biggest wish! ✨");
    }
  }, [allExtinguished, wishState]);

  // Clean up mic on unmount
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  // Tap strawberry interaction
  const handleStrawberryTap = (index: number) => {
    soundManager.playPop();
    setBouncingStrawberry(index);
    const quotes = [
      "Yum! Super sweet and fresh! 🍓",
      "Extra strawberry sauce for big sister Lama! 🍰",
      "Made with 100% sisterly love! ♡",
      "Cheesecake calories are zero today! ✨",
      "You deserve the whole cake, Lama! 🎀"
    ];
    setStrawberryQuote(quotes[index % quotes.length]);
    setTimeout(() => setBouncingStrawberry(null), 600);
  };

  // Tap plate interaction
  const handlePlateTap = (e: React.MouseEvent<HTMLDivElement>) => {
    soundManager.playPop();
    const rect = e.currentTarget.getBoundingClientRect();
    const newSparkle = {
      id: Date.now() + Math.random(),
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    setPlateSparkles((prev) => [...prev, newSparkle]);
    setTimeout(() => {
      setPlateSparkles((prev) => prev.filter((s) => s.id !== newSparkle.id));
    }, 800);
  };

  // Handle Make a Wish button
  const handleStartWish = () => {
    soundManager.playChime();
    setWishState('wishing');
  };

  // Handle My Wish is Made button
  const handleFinishWish = () => {
    soundManager.playChime();
    fireGrandCelebration();
    setWishState('wish-made');
  };

  return (
    <div className={`relative flex flex-col items-center justify-center min-h-[85vh] px-4 py-8 transition-colors duration-1000 ${
      wishState === 'wishing' ? 'bg-[#3A2234]/90 text-pink-100' : 'bg-transparent text-slate-800'
    }`}>
      {/* Wishing mode backdrop twinkle stars */}
      {wishState === 'wishing' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-10 left-10 text-amber-200 text-2xl animate-sparkle">✨</div>
          <div className="absolute top-20 right-16 text-amber-100 text-xl animate-sparkle" style={{ animationDelay: '0.8s' }}>⭐</div>
          <div className="absolute bottom-24 left-1/4 text-pink-200 text-2xl animate-sparkle" style={{ animationDelay: '1.4s' }}>✨</div>
          <div className="absolute top-1/3 right-1/4 text-amber-200 text-lg animate-sparkle" style={{ animationDelay: '2s' }}>⭐</div>
        </div>
      )}

      {/* Header messages */}
      <div className="text-center max-w-xl mx-auto mb-4 z-10">
        <h1 className={`font-serif-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-2 ${
          wishState === 'wishing' ? 'text-pink-100' : 'text-pink-950'
        }`}>
          HAPPY BIRTHDAY, LAMA! 🎂
        </h1>
        <p className={`font-cursive text-2xl sm:text-3xl font-bold mb-2 ${
          wishState === 'wishing' ? 'text-pink-200' : 'text-rose-600'
        }`}>
          To the sweetest big sister ever ♡
        </p>
        <p className={`text-xs sm:text-sm font-medium max-w-md mx-auto ${
          wishState === 'wishing' ? 'text-pink-200/90' : 'text-pink-900/80'
        }`}>
          Your only responsibility today is to smile, eat cake, and let yourself be spoiled.
        </p>
      </div>

      {/* Cute Animated Strawberry Character ("Berry") Dialogue Bubble */}
      <div className="flex items-center gap-3 mb-6 bg-white/90 border border-pink-200 px-4 py-2 rounded-2xl shadow-sm z-10 animate-gentle-float">
        <div className="text-3xl animate-bounce">🍓</div>
        <div className="text-left">
          <div className="text-[11px] font-bold text-pink-600 uppercase tracking-wider">Little Berry says:</div>
          <div className="text-xs sm:text-sm text-pink-950 font-medium">"{strawberryQuote}"</div>
        </div>
      </div>

      {/* THE CHEESECAKE STAGE */}
      <div className="relative w-80 sm:w-96 flex flex-col items-center justify-center my-2 z-10 perspective-1000">
        {/* Soft cake glow */}
        <div className={`absolute inset-0 bg-pink-300/30 rounded-full blur-2xl transition-all duration-700 pointer-events-none ${
          allExtinguished ? 'scale-125 bg-amber-200/40' : 'scale-90'
        }`} />

        {/* CANDLES ROW OVER THE CAKE */}
        <div className="relative z-20 flex justify-center items-end gap-5 sm:gap-6 w-full -mb-5 px-6">
          {candles.map((isLit, idx) => (
            <div
              key={idx}
              className="relative flex flex-col items-center cursor-pointer group"
              onClick={() => extinguishCandle(idx)}
              title={isLit ? `Tap candle #${idx + 1} to extinguish!` : 'Extinguished candle'}
            >
              {/* Flame and Glow */}
              {isLit ? (
                <div className="relative -mb-1 flex flex-col items-center flame-flicker">
                  {/* Outer flame glow aura */}
                  <div className="absolute -inset-2 bg-amber-400/30 rounded-full blur-xs pointer-events-none" />
                  {/* SVG Flame */}
                  <svg className="w-5 h-7 drop-shadow-md" viewBox="0 0 20 28" fill="none">
                    <path
                      d="M10 0C10 0 16 7 16 16C16 22 13 28 10 28C7 28 4 22 4 16C4 7 10 0 10 0Z"
                      fill="url(#flameGrad)"
                    />
                    <path
                      d="M10 8C10 8 13 13 13 19C13 23 11.5 26 10 26C8.5 26 7 23 7 19C7 13 10 8 10 8Z"
                      fill="#FFF5C0"
                    />
                    <defs>
                      <linearGradient id="flameGrad" x1="10" y1="0" x2="10" y2="28" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#FF4500" />
                        <stop offset="0.4" stopColor="#FFA500" />
                        <stop offset="0.8" stopColor="#FFD700" />
                        <stop offset="1" stopColor="#FFFFE0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              ) : (
                <div className="h-6 flex items-end justify-center">
                  {/* Burned wick tip */}
                  <div className="w-0.5 h-2.5 bg-neutral-700 rounded-t-sm" />
                </div>
              )}

              {/* Smoke Puff effect if recently extinguished */}
              {smokePuffs.some((p) => p.candleIndex === idx) && (
                <div className="absolute -top-10 text-neutral-400 font-bold text-xs animate-bounce pointer-events-none opacity-80">
                  ☁️💨
                </div>
              )}

              {/* Candle Body */}
              <div className="w-3.5 h-12 sm:h-14 bg-gradient-to-r from-pink-200 via-pink-100 to-pink-300 rounded-t-sm shadow-sm border border-pink-300 relative overflow-hidden">
                {/* Candle spiral stripes */}
                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(244,175,197,0.7)_4px,rgba(244,175,197,0.7)_8px)]" />
              </div>
            </div>
          ))}
        </div>

        {/* THE CHEESECAKE BODY ON THE PLATE */}
        <div
          onClick={handlePlateTap}
          className="relative w-72 sm:w-84 h-48 sm:h-52 cursor-pointer select-none group transition-transform duration-300 hover:scale-[1.02]"
        >
          {/* Secret Heart #2 on plate scalloped trim */}
          {!isSecretHeartFound && onDiscoverSecretHeart && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDiscoverSecretHeart(2);
              }}
              title="A tiny hidden heart..."
              className="absolute -bottom-2 -left-3 z-30 p-1.5 text-pink-400 hover:text-pink-600 hover:scale-130 transition-transform cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-pink-300/60" />
            </button>
          )}

          {/* Sparkles on plate tap */}
          {plateSparkles.map((s) => (
            <div
              key={s.id}
              className="absolute z-40 text-amber-300 text-sm animate-ping pointer-events-none"
              style={{ left: s.x, top: s.y }}
            >
              ✨
            </div>
          ))}

          {/* Scalloped Pastel-Pink Cake Stand Plate */}
          <div className="absolute -bottom-4 inset-x-0 h-14 bg-gradient-to-b from-[#FFF0F5] via-[#FFDDE8] to-[#F4AFC5] rounded-[100%] shadow-2xl border-4 border-[#FFF9F7] flex items-center justify-center">
            {/* Scallop gold trim */}
            <div className="w-[92%] h-[65%] border-2 border-dashed border-pink-300/80 rounded-[100%]" />
            <div className="absolute -bottom-2 w-32 h-4 bg-pink-300/40 rounded-full blur-xs" />
          </div>

          {/* CHEESECAKE SLICE / CAKE CYLINDER */}
          <div className="absolute inset-x-4 top-4 bottom-3 rounded-3xl bg-[#FFF9F7] shadow-xl overflow-hidden border border-amber-100 flex flex-col justify-between">
            {/* Glossy Strawberry Sauce Glaze on Top */}
            <div className="h-16 bg-gradient-to-b from-[#F4AFC5] via-[#E88EAD] to-[#D87899] relative overflow-hidden shadow-inner">
              {/* Dripping sauce effect */}
              <div className="absolute -bottom-3 inset-x-0 flex justify-around">
                <span className="w-5 h-5 bg-[#D87899] rounded-full -mt-2" />
                <span className="w-7 h-7 bg-[#D87899] rounded-full -mt-1" />
                <span className="w-6 h-6 bg-[#D87899] rounded-full -mt-2" />
                <span className="w-8 h-8 bg-[#D87899] rounded-full -mt-1" />
                <span className="w-5 h-5 bg-[#D87899] rounded-full -mt-2" />
              </div>

              {/* Glossy highlight streak */}
              <div className="absolute top-2 left-6 right-6 h-2 bg-white/40 rounded-full blur-[1px]" />

              {/* TOPPING: Fresh Strawberries & Cream Rosettes */}
              <div className="relative z-10 flex items-center justify-around px-3 pt-2">
                {[0, 1, 2, 3, 4].map((sIdx) => (
                  <button
                    key={sIdx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStrawberryTap(sIdx);
                    }}
                    title="Tap me to bounce!"
                    className={`text-2xl sm:text-3xl transition-transform cursor-pointer hover:scale-125 ${
                      bouncingStrawberry === sIdx ? 'scale-140 animate-bounce' : ''
                    }`}
                  >
                    🍓
                  </button>
                ))}
              </div>

              {/* Whipped Cream Rosettes & Sugar Hearts */}
              <div className="absolute bottom-1 inset-x-4 flex justify-between px-2 text-xs text-white/90 pointer-events-none">
                <span>🤍</span>
                <span>🧁</span>
                <span>💖</span>
                <span>🧁</span>
                <span>🤍</span>
              </div>
            </div>

            {/* Middle: Creamy Rich White Cheesecake Filling */}
            <div className="flex-1 bg-gradient-to-b from-[#FFFDF9] via-[#FFF8EE] to-[#FFF3E8] relative flex items-center justify-center px-4">
              <span className="font-cursive text-xl sm:text-2xl text-pink-700/80 font-bold select-none drop-shadow-xs">
                Sweet Birthday Cheesecake ♡
              </span>
            </div>

            {/* Bottom: Golden Graham Cracker Biscuit Crust */}
            <div className="h-7 bg-gradient-to-r from-[#C68B59] via-[#DE9F67] to-[#B37947] border-t border-[#A86E3E] relative">
              {/* Crumb texture */}
              <div className="absolute inset-0 bg-[radial-gradient(#795548_1px,transparent_1px)] [background-size:6px_6px] opacity-35" />
            </div>
          </div>
        </div>

        {/* Candles Extinguished Status Counter */}
        <div className="mt-6 flex flex-col items-center gap-2 z-10">
          <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-pink-900 bg-white/80 px-4 py-1.5 rounded-full border border-pink-200 shadow-2xs">
            <span>Birthday candles:</span>
            <span className="text-rose-600 font-extrabold">{extinguishedCount}/5</span>
            {allExtinguished && <CheckCircle2 className="w-4 h-4 text-emerald-500 inline" />}
          </div>

          {/* Microphone Blow Toggle (Optional Feature) */}
          {!allExtinguished && (
            <div className="flex flex-col items-center mt-1">
              <button
                type="button"
                onClick={isMicActive ? stopListening : startListening}
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                  isMicActive
                    ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
                    : 'bg-white/70 text-pink-800 border-pink-200 hover:bg-pink-50'
                }`}
              >
                {isMicActive ? (
                  <>
                    <Mic className="w-3.5 h-3.5 text-rose-600 animate-bounce" />
                    <span>Mic on: Blow into your phone! 💨</span>
                  </>
                ) : (
                  <>
                    <MicOff className="w-3.5 h-3.5 text-pink-500" />
                    <span>Or enable mic to blow candles 🎤</span>
                  </>
                )}
              </button>
              {micError && <p className="text-[11px] text-rose-600 mt-1 max-w-xs text-center">{micError}</p>}
            </div>
          )}
        </div>
      </div>

      {/* POST-CANDLE CELEBRATION & MAKE A WISH FLOW */}
      <div className="mt-6 max-w-md w-full text-center z-10">
        {wishState === 'all-blown' && (
          <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="p-4 bg-white/90 border-2 border-pink-200 rounded-3xl shadow-md">
              <h3 className="font-serif-display text-2xl font-bold text-pink-900 mb-1">
                YOU DID IT, LAMA! 🎉
              </h3>
              <p className="text-pink-950 text-sm font-semibold mb-3">
                Now your birthday wishes are officially in the universe. ♡
              </p>
              <button
                type="button"
                onClick={handleStartWish}
                className="w-full py-3 px-6 rounded-full bg-gradient-to-r from-amber-300 via-pink-300 to-rose-300 text-pink-950 font-bold text-base shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-98 transition-all cursor-pointer border border-white"
              >
                <Sparkles className="w-4 h-4 inline mr-1 text-pink-800" />
                MAKE A WISH ✨
              </button>
            </div>
          </div>
        )}

        {wishState === 'wishing' && (
          <div className="p-6 bg-pink-950/80 border-2 border-pink-300/40 rounded-3xl shadow-2xl backdrop-blur-md text-pink-50 space-y-4 animate-in fade-in zoom-in-95 duration-500">
            <div className="text-3xl animate-bounce">✨🙏✨</div>
            <p className="font-serif-display text-lg sm:text-xl font-semibold italic text-amber-200 leading-relaxed">
              "Close your eyes, make a wish, and remember that you deserve all the beautiful things this world has to offer."
            </p>
            <button
              type="button"
              onClick={handleFinishWish}
              className="w-full py-3 px-6 rounded-full bg-gradient-to-r from-pink-400 via-rose-300 to-pink-400 text-pink-950 font-bold text-base shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-white"
            >
              MY WISH IS MADE ✨
            </button>
          </div>
        )}

        {wishState === 'wish-made' && (
          <div className="p-5 bg-white/95 border-2 border-pink-200 rounded-3xl shadow-lg space-y-4 animate-in fade-in zoom-in-95 duration-400">
            <h3 className="font-serif-display text-xl font-bold text-pink-900">
              I hope every beautiful wish finds its way to you this year, Lama. ♡
            </h3>
            <p className="text-xs text-pink-800/80 font-medium">
              Ready for the next surprise?
            </p>
            <button
              type="button"
              onClick={onComplete}
              className="w-full py-3 px-6 rounded-full bg-[#F4AFC5] hover:bg-[#E88EAD] text-pink-950 font-bold text-base shadow-md hover:scale-102 transition-all cursor-pointer"
            >
              LET'S CELEBRATE MORE 🍰
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
