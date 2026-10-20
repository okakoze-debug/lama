import { useState } from 'react';
import { soundManager } from '../utils/soundEffects';
import { fireHeartsConfetti } from '../utils/confetti';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';

interface AppreciationCardsProps {
  onComplete: () => void;
  onDiscoverSecretHeart?: (id: number) => void;
  isSecretHeartFound?: boolean;
}

interface CardData {
  id: number;
  title: string;
  frontIcon: string;
  subtitle: string;
  message: string;
}

const CARDS: CardData[] = [
  {
    id: 1,
    title: "Your Heart",
    frontIcon: "💖",
    subtitle: "Kind & Caring",
    message: "Thank you for being the kind of person who makes others feel cared for. You have a special place in my heart, and I'm genuinely grateful to know you."
  },
  {
    id: 2,
    title: "Someone I Look Up To",
    frontIcon: "⭐",
    subtitle: "My Inspiration",
    message: "You remind me that there are people who can make life brighter simply by being themselves. I'm lucky to have someone like you in my life."
  },
  {
    id: 3,
    title: "Your Advice",
    frontIcon: "🌸",
    subtitle: "Wisdom & Laughs",
    message: "Whether it's serious advice or just a few words that make me laugh, I appreciate the things you share with me more than you probably realize."
  },
  {
    id: 4,
    title: "Your Smile",
    frontIcon: "🍓",
    subtitle: "Warm & Bright",
    message: "I hope this year gives you as many reasons to smile as you give to the people around you. You deserve that happiness and so much more."
  },
  {
    id: 5,
    title: "Our Little Moments",
    frontIcon: "💕",
    subtitle: "Precious Memories",
    message: "Even the smallest conversations and silliest moments can become special memories. I'm grateful for every little moment we've shared."
  },
  {
    id: 6,
    title: "Always Appreciated",
    frontIcon: "🎁",
    subtitle: "Valued Forever",
    message: "On your birthday and every other day, I hope you remember that you matter, that you're appreciated, and that someone out there is genuinely glad you're in their life."
  }
];

export function AppreciationCards({
  onComplete,
  onDiscoverSecretHeart,
  isSecretHeartFound
}: AppreciationCardsProps) {
  // Array of flipped card IDs
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [activeFlippedParticles, setActiveFlippedParticles] = useState<number | null>(null);

  const toggleFlip = (id: number) => {
    soundManager.playCardFlip();
    setFlippedCards((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );

    // Trigger tiny heart burst
    setActiveFlippedParticles(id);
    setTimeout(() => {
      setActiveFlippedParticles(null);
    }, 900);
  };

  const handleNextSurprise = () => {
    soundManager.playConfetti();
    fireHeartsConfetti();
    onComplete();
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[85vh] px-4 py-8 max-w-5xl mx-auto">
      {/* Secret Heart #3 subtle placement on decorative header floral icon */}
      {!isSecretHeartFound && onDiscoverSecretHeart && (
        <button
          type="button"
          onClick={() => onDiscoverSecretHeart(3)}
          title="A tiny hidden secret..."
          className="absolute top-2 right-4 p-2 text-pink-300 hover:text-pink-600 hover:scale-130 transition-transform cursor-pointer z-30"
        >
          <Heart className="w-4 h-4 fill-pink-200" />
        </button>
      )}

      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 z-10">
        <div className="inline-flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider mb-2 bg-pink-100/70 px-3 py-1 rounded-full">
          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
          <span>Little Sister Thoughts</span>
          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
        </div>
        <h2 className="font-serif-display text-2xl sm:text-3xl md:text-4xl font-bold text-pink-950 tracking-tight mb-2">
          A LITTLE REMINDER OF HOW SPECIAL YOU ARE ♡
        </h2>
        <p className="text-sm sm:text-base text-pink-900/80 font-medium leading-relaxed">
          Because birthdays aren't just about celebrating another year. They're also about celebrating the wonderful person you've become.
        </p>
        <p className="text-xs text-rose-500 font-semibold mt-2">
          (Tap each card to flip and read its little secret note!)
        </p>
      </div>

      {/* 6 Interactive Cards Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full mb-10 perspective-1000 z-10">
        {CARDS.map((card) => {
          const isFlipped = flippedCards.includes(card.id);

          return (
            <div
              key={card.id}
              onClick={() => toggleFlip(card.id)}
              className="relative h-64 sm:h-72 w-full cursor-pointer select-none group perspective-1000"
            >
              {/* Particle hearts when flipped */}
              {activeFlippedParticles === card.id && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-40 text-rose-500 text-lg font-bold pointer-events-none animate-bounce">
                  💖✨💖
                </div>
              )}

              {/* 3D Card Inner Container */}
              <div
                className={`relative w-full h-full rounded-3xl transition-transform duration-700 preserve-3d shadow-md hover:shadow-xl group-hover:-translate-y-1.5 ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
              >
                {/* FRONT FACE */}
                <div className="absolute inset-0 w-full h-full rounded-3xl p-6 bg-gradient-to-br from-[#FFF9F7] via-[#FFDDE8] to-[#F8C8DC] border-2 border-pink-200/90 flex flex-col items-center justify-between backface-hidden shadow-inner">
                  {/* Subtle corner floral decorations */}
                  <div className="w-full flex justify-between text-xs text-pink-300">
                    <span>🌸</span>
                    <span>🌸</span>
                  </div>

                  {/* Center Icon and Title */}
                  <div className="flex flex-col items-center text-center my-auto">
                    <div className="w-16 h-16 rounded-full bg-white/90 shadow-sm flex items-center justify-center text-3xl mb-3 border border-pink-100 group-hover:scale-110 transition-transform">
                      {card.frontIcon}
                    </div>
                    <h3 className="font-serif-display text-xl sm:text-2xl font-bold text-pink-950 mb-1">
                      {card.title}
                    </h3>
                    <p className="text-xs font-semibold text-rose-600">
                      {card.subtitle}
                    </p>
                  </div>

                  {/* Flip Prompt */}
                  <div className="text-[11px] font-bold text-pink-700/70 bg-white/70 px-3 py-1 rounded-full border border-pink-200/50">
                    Tap to open ♡
                  </div>
                </div>

                {/* BACK FACE (Heartfelt Note) */}
                <div className="absolute inset-0 w-full h-full rounded-3xl p-6 bg-gradient-to-br from-[#FFFDFB] via-[#FFF3E8] to-[#FFE4EE] border-2 border-pink-300 flex flex-col items-center justify-between backface-hidden rotate-y-180 shadow-md">
                  {/* Top Header on Back */}
                  <div className="w-full flex items-center justify-between text-xs text-pink-600 font-bold border-b border-pink-200 pb-2">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
                      {card.title}
                    </span>
                    <span className="text-[10px] text-pink-400">Card #{card.id}</span>
                  </div>

                  {/* Back message text */}
                  <div className="flex-1 flex items-center justify-center my-2 text-center">
                    <p className="text-xs sm:text-sm text-pink-950 font-medium leading-relaxed italic px-1">
                      "{card.message}"
                    </p>
                  </div>

                  {/* Back Footer */}
                  <div className="w-full flex justify-between items-center text-[10px] text-pink-500 font-medium border-t border-pink-200 pt-2">
                    <span>From little sibling ♡</span>
                    <span className="text-rose-400">Tap to flip back</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Button to proceed to Birthday Envelope */}
      <div className="text-center z-10">
        <button
          type="button"
          onClick={handleNextSurprise}
          className="group inline-flex items-center gap-2.5 px-8 py-3.5 sm:px-9 sm:py-4 rounded-full bg-gradient-to-r from-[#F4AFC5] via-[#E88EAD] to-[#F4AFC5] text-pink-950 font-bold text-base sm:text-lg shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white"
        >
          <Sparkles className="w-5 h-5 text-pink-900 group-hover:rotate-12 transition-transform" />
          <span>ONE MORE SURPRISE, PLEASE!</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
}
