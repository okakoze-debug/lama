import { useState } from 'react';
import { soundManager } from '../utils/soundEffects';
import { firePinkConfetti } from '../utils/confetti';
import { Sparkles, Heart, CheckCircle2 } from 'lucide-react';

export const SECRET_MESSAGES: Record<number, { title: string; message: string }> = {
  1: {
    title: 'Secret Heart #1 Found! ✨',
    message: "You're more appreciated than you know. ♡"
  },
  2: {
    title: 'Secret Heart #2 Found! 🌸',
    message: "Just a reminder that you deserve all the happiness in the world."
  },
  3: {
    title: 'Secret Heart #3 Found! 🎀',
    message: "Psst, Lama... I'm really glad you're in my life. Never forget how special you are, okay? ♡"
  }
};

interface SecretHeartHuntProps {
  discoveredHearts: number[];
  onDismissModal?: () => void;
  activeDiscoveredHeart: number | null;
  onCloseHeartModal: () => void;
}

export function SecretHeartHunt({
  discoveredHearts,
  activeDiscoveredHeart,
  onCloseHeartModal
}: SecretHeartHuntProps) {
  const [showBonusCelebration, setShowBonusCelebration] = useState(false);
  const allFound = discoveredHearts.length >= 3;

  const handleOpenSummary = () => {
    soundManager.playChime();
    if (allFound) {
      firePinkConfetti();
      setShowBonusCelebration(true);
    }
  };

  return (
    <>
      {/* Discreet pill-free counter status in corner or bar */}
      <div className="flex items-center gap-2 text-xs text-pink-900/70 font-medium">
        <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-400" />
        <span>Secret hearts discovered:</span>
        <span className="font-bold text-pink-700">{discoveredHearts.length}/3</span>
        {allFound && (
          <button
            type="button"
            onClick={handleOpenSummary}
            className="ml-1 text-[11px] underline text-pink-600 hover:text-pink-800 font-semibold cursor-pointer"
          >
            Bonus Unlocked!
          </button>
        )}
      </div>

      {/* Pop-up modal when a secret heart is tapped */}
      {activeDiscoveredHeart && SECRET_MESSAGES[activeDiscoveredHeart] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs">
          <div className="bg-[#FFF9F7] border-2 border-[#F4AFC5] rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl text-center relative animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-[#FFDDE8] flex items-center justify-center text-2xl shadow-inner">
              💖
            </div>
            <h3 className="font-serif-display text-lg text-pink-900 font-bold mb-1">
              {SECRET_MESSAGES[activeDiscoveredHeart].title}
            </h3>
            <p className="text-pink-950 text-base leading-relaxed my-4 font-medium italic bg-[#FFF3E8]/80 p-4 rounded-2xl border border-pink-100">
              "{SECRET_MESSAGES[activeDiscoveredHeart].message}"
            </p>
            <p className="text-xs text-pink-700/80 mb-5">
              Secret hearts discovered: <strong className="text-pink-900">{discoveredHearts.length}/3</strong>
            </p>
            <button
              type="button"
              onClick={onCloseHeartModal}
              className="w-full py-2.5 px-4 bg-[#F4AFC5] hover:bg-[#E88EAD] text-pink-950 font-bold rounded-2xl shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
            >
              Keep tucked in heart ♡
            </button>
          </div>
        </div>
      )}

      {/* Bonus Celebration Modal when all 3 found */}
      {showBonusCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/35 backdrop-blur-xs">
          <div className="bg-[#FFF9F7] border-2 border-[#E88EAD] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center relative animate-in fade-in zoom-in-95 duration-200">
            <div className="inline-flex items-center justify-center p-3 bg-pink-100 rounded-full mb-3 text-pink-600">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="font-serif-display text-2xl text-pink-900 font-bold mb-2">
              YOU FOUND ALL THE LITTLE HEARTS! 🎉
            </h3>
            <p className="text-pink-950 text-base leading-relaxed my-4 font-medium bg-[#FFF3E8] p-5 rounded-2xl border border-pink-200">
              "Here's one more: <strong>Thank you for being YOU. ♡</strong>"
            </p>
            <div className="space-y-2 text-left mb-6 text-xs text-pink-900/90 bg-pink-50/70 p-3.5 rounded-xl">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-pink-500 shrink-0" />
                <span>Heart 1: You're more appreciated than you know. ♡</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-pink-500 shrink-0" />
                <span>Heart 2: You deserve all the happiness in the world.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-pink-500 shrink-0" />
                <span>Heart 3: I'm really glad you're in my life, big sis.</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowBonusCelebration(false)}
              className="w-full py-2.5 px-4 bg-[#F8C8DC] hover:bg-[#F4AFC5] text-pink-900 font-bold rounded-2xl shadow-sm transition-all cursor-pointer"
            >
              Yay! ♡
            </button>
          </div>
        </div>
      )}
    </>
  );
}
