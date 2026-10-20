import { useState } from 'react';
import { soundManager } from '../utils/soundEffects';

interface FloatingDecorationsProps {
  onDiscoverHeart?: (id: number) => void;
  discoveredHearts?: number[];
  showSecretHearts?: boolean;
}

interface SparkleParticle {
  id: number;
  x: number;
  y: number;
}

const STAR_WISHES = [
  "You deserve all the happiness in the world.",
  "May this year bring you beautiful surprises.",
  "Never stop being your wonderful self.",
  "Today, we're celebrating the amazing person you are.",
  "May all your little wishes come true."
];

export function FloatingDecorations({ onDiscoverHeart, discoveredHearts = [], showSecretHearts = true }: FloatingDecorationsProps) {
  const [sparkles, setSparkles] = useState<SparkleParticle[]>([]);
  const [activeWish, setActiveWish] = useState<string | null>(null);

  const handleHeartClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    soundManager.playPop();

    const rect = e.currentTarget.getBoundingClientRect();
    const newSparkle = {
      id: Date.now() + Math.random(),
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };

    setSparkles((prev) => [...prev, newSparkle]);
    setTimeout(() => {
      setSparkles((prev) => prev.filter((p) => p.id !== newSparkle.id));
    }, 700);
  };

  const handleStarClick = (wishIndex: number) => {
    soundManager.playChime();
    setActiveWish(STAR_WISHES[wishIndex % STAR_WISHES.length]);
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {/* Soft Ambient Floating Petals and Hearts */}
      <div className="absolute inset-0">
        {/* Floating Petal 1 */}
        <div 
          className="absolute text-pink-300 opacity-60 text-lg animate-gentle-float pointer-events-auto"
          style={{ top: '8%', left: '7%', animationDuration: '6s' }}
        >
          🌸
        </div>

        {/* Floating Petal 2 */}
        <div 
          className="absolute text-pink-200 opacity-70 text-sm animate-gentle-float pointer-events-auto"
          style={{ top: '22%', right: '9%', animationDuration: '7.5s', animationDelay: '1s' }}
        >
          🌸
        </div>

        {/* Floating Petal 3 */}
        <div 
          className="absolute text-pink-300 opacity-50 text-xs animate-gentle-float pointer-events-auto"
          style={{ bottom: '18%', left: '12%', animationDuration: '8s', animationDelay: '2s' }}
        >
          🌸
        </div>

        {/* Floating Heart 1 (Interactive Clickable) */}
        <button
          type="button"
          onClick={handleHeartClick}
          aria-label="Interactive floating heart"
          className="absolute text-rose-300 hover:text-rose-400 opacity-75 text-base pointer-events-auto transition-transform hover:scale-125 focus:outline-none animate-gentle-float cursor-pointer"
          style={{ top: '35%', left: '5%', animationDuration: '5.5s', animationDelay: '0.5s' }}
        >
          💖
        </button>

        {/* Floating Heart 2 (Interactive Clickable) */}
        <button
          type="button"
          onClick={handleHeartClick}
          aria-label="Interactive floating heart"
          className="absolute text-pink-300 hover:text-pink-400 opacity-80 text-xl pointer-events-auto transition-transform hover:scale-125 focus:outline-none animate-gentle-float cursor-pointer"
          style={{ top: '65%', right: '7%', animationDuration: '6.8s', animationDelay: '1.2s' }}
        >
          💗
        </button>

        {/* Floating Heart 3 */}
        <button
          type="button"
          onClick={handleHeartClick}
          aria-label="Interactive floating heart"
          className="absolute text-pink-400 hover:text-pink-500 opacity-70 text-sm pointer-events-auto transition-transform hover:scale-125 focus:outline-none animate-gentle-float cursor-pointer"
          style={{ bottom: '12%', right: '14%', animationDuration: '7s', animationDelay: '2.5s' }}
        >
          💕
        </button>

        {/* Interactive Twinkling Star 1 */}
        <button
          type="button"
          onClick={() => handleStarClick(0)}
          title="Tap for a birthday wish"
          className="absolute text-amber-300 hover:text-amber-400 opacity-80 text-lg pointer-events-auto transition-transform hover:scale-130 focus:outline-none animate-sparkle cursor-pointer"
          style={{ top: '14%', left: '22%', animationDelay: '0.2s' }}
        >
          ✨
        </button>

        {/* Interactive Twinkling Star 2 */}
        <button
          type="button"
          onClick={() => handleStarClick(1)}
          title="Tap for a birthday wish"
          className="absolute text-amber-200 hover:text-amber-300 opacity-85 text-base pointer-events-auto transition-transform hover:scale-130 focus:outline-none animate-sparkle cursor-pointer"
          style={{ top: '16%', right: '24%', animationDelay: '1.4s' }}
        >
          ⭐
        </button>

        {/* Interactive Twinkling Star 3 */}
        <button
          type="button"
          onClick={() => handleStarClick(2)}
          title="Tap for a birthday wish"
          className="absolute text-amber-300 hover:text-amber-400 opacity-70 text-xs pointer-events-auto transition-transform hover:scale-130 focus:outline-none animate-sparkle cursor-pointer"
          style={{ bottom: '26%', left: '8%', animationDelay: '0.9s' }}
        >
          ✨
        </button>

        {/* Interactive Twinkling Star 4 */}
        <button
          type="button"
          onClick={() => handleStarClick(3)}
          title="Tap for a birthday wish"
          className="absolute text-amber-300 hover:text-amber-400 opacity-75 text-sm pointer-events-auto transition-transform hover:scale-130 focus:outline-none animate-sparkle cursor-pointer"
          style={{ bottom: '34%', right: '6%', animationDelay: '2.1s' }}
        >
          ⭐
        </button>
      </div>

      {/* Secret Hearts Hidden Spots (if not yet discovered) */}
      {showSecretHearts && (
        <>
          {/* Secret Heart 1 - Discreetly placed at top corner near the header edge */}
          {!discoveredHearts.includes(1) && onDiscoverHeart && (
            <button
              type="button"
              onClick={() => onDiscoverHeart(1)}
              aria-label="Secret hidden heart"
              title="A tiny hidden heart..."
              className="absolute top-4 left-4 p-2 pointer-events-auto opacity-45 hover:opacity-100 hover:scale-125 transition-all text-xs cursor-pointer animate-pulse"
            >
              <span className="text-pink-400 drop-shadow-sm">♡</span>
            </button>
          )}

          {/* Secret Heart 2 - Subtle bottom right edge */}
          {!discoveredHearts.includes(2) && onDiscoverHeart && (
            <button
              type="button"
              onClick={() => onDiscoverHeart(2)}
              aria-label="Secret hidden heart"
              title="A tiny hidden heart..."
              className="absolute bottom-4 right-4 p-2 pointer-events-auto opacity-45 hover:opacity-100 hover:scale-125 transition-all text-xs cursor-pointer animate-pulse"
            >
              <span className="text-pink-400 drop-shadow-sm">♡</span>
            </button>
          )}
        </>
      )}

      {/* Pop sparkles when heart is tapped */}
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute pointer-events-none text-base animate-ping"
          style={{
            left: sparkle.x - 12,
            top: sparkle.y - 12,
            animationDuration: '600ms'
          }}
        >
          ✨
        </div>
      ))}

      {/* Star Wish Modal Popup */}
      {activeWish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-xs pointer-events-auto">
          <div className="bg-[#FFF9F7] border border-[#F4AFC5]/60 rounded-2xl p-6 max-w-sm w-full shadow-xl text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="text-3xl mb-2">⭐</div>
            <p className="font-serif-display text-lg text-pink-900 mb-2 font-semibold italic">
              "A Little Birthday Wish"
            </p>
            <p className="text-pink-950/80 text-sm leading-relaxed mb-5 font-medium">
              {activeWish}
            </p>
            <button
              type="button"
              onClick={() => setActiveWish(null)}
              className="px-5 py-2 bg-[#F8C8DC] hover:bg-[#F4AFC5] text-pink-900 text-sm font-semibold rounded-full shadow-xs transition-colors cursor-pointer"
            >
              Thank you ♡
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
