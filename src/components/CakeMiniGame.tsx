import { useState } from 'react';
import { soundManager } from '../utils/soundEffects';
import { firePinkConfetti } from '../utils/confetti';
import { Sparkles, ArrowRight } from 'lucide-react';

interface CakeMiniGameProps {
  onComplete: () => void;
}

interface MiniBouncer {
  id: number;
  emoji: string;
  left: number;
  delay: number;
}

export function CakeMiniGame({ onComplete }: CakeMiniGameProps) {
  const [bouncers, setBouncers] = useState<MiniBouncer[]>([]);
  const [clickCount, setClickCount] = useState(0);
  const [isCakeEnlarged, setIsCakeEnlarged] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const handleMoreCake = () => {
    soundManager.playPop();
    firePinkConfetti({ originY: 0.6 });
    setClickCount((prev) => prev + 1);
    setIsCakeEnlarged(true);
    setShowMessage(true);

    setTimeout(() => {
      setIsCakeEnlarged(false);
    }, 450);

    // Spawn mini items: strawberries, mini cakes, hearts, sprinkles
    const newItems: MiniBouncer[] = [
      { id: Date.now() + 1, emoji: '🍓', left: Math.random() * 80 + 10, delay: 0 },
      { id: Date.now() + 2, emoji: '🍰', left: Math.random() * 80 + 10, delay: 0.1 },
      { id: Date.now() + 3, emoji: '💖', left: Math.random() * 80 + 10, delay: 0.2 },
      { id: Date.now() + 4, emoji: '✨', left: Math.random() * 80 + 10, delay: 0.05 },
      { id: Date.now() + 5, emoji: '🧁', left: Math.random() * 80 + 10, delay: 0.15 }
    ];

    setBouncers((prev) => [...prev, ...newItems]);

    setTimeout(() => {
      setBouncers((prev) => prev.filter((item) => !newItems.some((n) => n.id === item.id)));
    }, 1800);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[80vh] px-4 py-8 overflow-hidden">
      {/* Falling sprinkles / bouncing items */}
      {bouncers.map((item) => (
        <div
          key={item.id}
          className="absolute text-3xl sm:text-4xl pointer-events-none animate-bounce z-30"
          style={{
            left: `${item.left}%`,
            top: '25%',
            animationDuration: '1.2s'
          }}
        >
          {item.emoji}
        </div>
      ))}

      {/* Header */}
      <div className="text-center max-w-md mx-auto mb-6 z-10">
        <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-pink-950 mb-2">
          WAIT... MORE CAKE, PLEASE! 🍰
        </h2>
        <p className="font-cursive text-xl sm:text-2xl text-rose-600 font-bold">
          Because one slice is never enough for the big sister!
        </p>
      </div>

      {/* Center Animated Cake Avatar */}
      <div className="relative my-6 z-10 flex flex-col items-center">
        <div
          className={`text-8xl sm:text-9xl transition-transform duration-300 select-none cursor-pointer filter drop-shadow-xl ${
            isCakeEnlarged ? 'scale-135 rotate-3' : 'hover:scale-110 animate-gentle-float'
          }`}
          onClick={handleMoreCake}
          title="Click me for more cake!"
        >
          🎂
        </div>

        {/* Cake bounce count */}
        <div className="mt-3 text-xs font-bold text-pink-700 bg-white/80 px-3 py-1 rounded-full border border-pink-200">
          Cakes summoned: {clickCount} 🍓
        </div>
      </div>

      {/* Funny Birthday Message */}
      {showMessage && (
        <div className="my-4 max-w-sm text-center p-4 bg-gradient-to-r from-pink-100 via-rose-50 to-pink-100 border-2 border-pink-300 rounded-3xl shadow-md animate-in fade-in zoom-in-95 duration-200 z-10">
          <p className="font-serif-display text-lg text-pink-950 font-bold">
            "Birthday calories don't count today. It's official!" ✨
          </p>
          <p className="text-xs text-rose-600 font-medium mt-1">
            Certified by sibling birthday law! 📜
          </p>
        </div>
      )}

      {/* Interactive Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mt-6 z-10">
        <button
          type="button"
          onClick={handleMoreCake}
          className="px-6 py-3.5 rounded-full bg-gradient-to-r from-[#F8C8DC] via-[#F4AFC5] to-[#F8C8DC] text-pink-950 font-bold text-base shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white"
        >
          <Sparkles className="w-4 h-4 inline mr-1 text-pink-700" />
          MORE CAKE, PLEASE! 🍰
        </button>

        <button
          type="button"
          onClick={() => {
            soundManager.playPop();
            onComplete();
          }}
          className="px-7 py-3.5 rounded-full bg-[#E88EAD] hover:bg-[#D87899] text-white font-bold text-base shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
        >
          <span>OKAY, I'M READY!</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
