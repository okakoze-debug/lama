import { useState, useRef } from 'react';
import { soundManager } from '../utils/soundEffects';
import { toPng } from 'html-to-image';
import { Download, ArrowRight, Sparkles, Printer, Heart } from 'lucide-react';

interface BirthdayLetterProps {
  onComplete: () => void;
}

export function BirthdayLetter({ onComplete }: BirthdayLetterProps) {
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportMessage, setExportMessage] = useState<string | null>(null);
  const [clickedSticker, setClickedSticker] = useState<string | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);

  const handleStickerTap = (emoji: string) => {
    soundManager.playPop();
    setClickedSticker(emoji);
    setTimeout(() => setClickedSticker(null), 800);
  };

  // Export card as PNG
  const handleSaveCard = async () => {
    if (!cardRef.current) return;
    soundManager.playChime();
    setIsExporting(true);
    setExportMessage('Saving your birthday card keepsake...');

    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        backgroundColor: '#FFF9F7',
        pixelRatio: 2
      });

      const link = document.createElement('a');
      link.download = `Happy-Birthday-Lama-Card.png`;
      link.href = dataUrl;
      link.click();

      setExportMessage('Saved to your downloads! 💌');
      setTimeout(() => setExportMessage(null), 3000);
    } catch (err: unknown) {
      console.warn('Export error:', err);
      setExportMessage('Saved preview! You can also take a quick screenshot.');
      setTimeout(() => setExportMessage(null), 3500);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    soundManager.playPaperRustle();
    window.print();
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[80vh] px-4 py-6 max-w-xl mx-auto">
      {/* Top Controls Bar */}
      <div className="w-full flex items-center justify-between gap-2 mb-3 z-20">
        <div className="text-xs font-bold text-pink-700 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-rose-500 animate-spin" style={{ animationDuration: '4s' }} />
          <span>Little sister VIP card</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            title="Print card"
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/90 hover:bg-pink-100 text-pink-900 border border-pink-300 text-xs font-semibold shadow-2xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-pink-700" />
            <span className="hidden sm:inline">Print</span>
          </button>

          <button
            type="button"
            onClick={handleSaveCard}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#F8C8DC] to-[#F4AFC5] hover:bg-[#E88EAD] text-pink-950 border border-pink-200 text-xs font-bold shadow-2xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-pink-900" />
            <span>{isExporting ? 'SAVING...' : 'SAVE THIS CARD'}</span>
          </button>
        </div>
      </div>

      {exportMessage && (
        <div className="mb-3 text-xs font-semibold text-rose-700 bg-pink-100/90 border border-pink-300 px-4 py-1.5 rounded-2xl shadow-2xs animate-in fade-in">
          {exportMessage}
        </div>
      )}

      {/* COMPACT & SILLY BIRTHDAY CARD */}
      <div
        ref={cardRef}
        className="relative w-full bg-[#FFF9F7] border-4 border-[#F4AFC5] rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden my-1 z-10"
        style={{
          boxShadow: '0 16px 36px -10px rgba(244, 175, 197, 0.4), 0 0 0 1px rgba(232, 142, 173, 0.25)'
        }}
      >
        {/* Decorative corner ribbons & stickers */}
        <div className="absolute top-0 right-7 w-7 h-10 bg-gradient-to-b from-[#F4AFC5] to-[#E88EAD] shadow-xs rounded-b-md flex items-end justify-center pb-1 text-white text-[10px]">
          🎀
        </div>

        <button
          type="button"
          onClick={() => handleStickerTap('🍓')}
          className="absolute top-3 left-4 text-2xl hover:scale-125 transition-transform cursor-pointer"
          title="Poke the strawberry!"
        >
          🍓
        </button>

        <button
          type="button"
          onClick={() => handleStickerTap('✨')}
          className="absolute bottom-3 left-4 text-xl hover:scale-125 transition-transform cursor-pointer"
          title="Sparkle!"
        >
          ✨
        </button>

        <button
          type="button"
          onClick={() => handleStickerTap('🎂')}
          className="absolute bottom-3 right-4 text-2xl hover:scale-125 transition-transform cursor-pointer"
          title="Birthday cake!"
        >
          🍰
        </button>

        {clickedSticker && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            <span className="text-4xl animate-ping">{clickedSticker}</span>
          </div>
        )}

        {/* Big Bold ALL CAPS Title */}
        <div className="text-center pt-2 pb-4 border-b-2 border-dashed border-pink-200">
          <p className="font-cursive text-lg text-rose-600 font-bold -mb-1">
            Hey Big Sis...
          </p>
          <h2 className="font-serif-display text-3xl sm:text-4xl font-extrabold text-pink-950 tracking-tight leading-none mt-1">
            HAPPY BIRTHDAY LAMA!!! 🎉
          </h2>
          <span className="inline-block mt-2 px-3 py-0.5 rounded-full bg-pink-100 text-pink-800 text-[11px] font-bold uppercase tracking-wider border border-pink-200">
            Official Sibling Birthday Card 📜
          </span>
        </div>

        {/* Silly & Fun Card Content */}
        <div className="my-5 space-y-3.5 text-center sm:text-left text-pink-950 text-sm sm:text-base leading-relaxed">
          {/* Silly Rule 1 */}
          <div className="flex items-start gap-2.5 bg-[#FFF3E8]/80 p-3 rounded-2xl border border-pink-100">
            <span className="text-xl shrink-0">⚠️</span>
            <p className="font-medium text-xs sm:text-sm text-pink-950">
              <strong>OFFICIAL RULE #1:</strong> You are legally required to eat at least 80% of the strawberry cheesecake today. Calories do not exist on your birthday. It is scientifically proven.
            </p>
          </div>

          {/* Silly Rule 2 */}
          <div className="flex items-start gap-2.5 bg-[#FFDDE8]/50 p-3 rounded-2xl border border-pink-100">
            <span className="text-xl shrink-0">👑</span>
            <p className="font-medium text-xs sm:text-sm text-pink-950">
              <strong>SIBLING PERK:</strong> You get 24 hours of zero adult stress, infinite princess treatment, and laughing at bad sibling jokes without rolling your eyes.
            </p>
          </div>

          {/* Wholesome Sibling Note */}
          <div className="py-2 text-center">
            <p className="font-serif-display text-base sm:text-lg font-bold text-pink-900">
              You are genuinely the coolest, kindest big sister figure ever.
            </p>
            <p className="text-xs sm:text-sm text-pink-800/90 font-medium mt-1">
              Thank you for being so amazing to me. Don't ever forget how loved and appreciated you are! ♡
            </p>
          </div>

          {/* Big Sister Sign-off in ALL CAPS */}
          <div className="pt-2 border-t border-pink-200 text-center">
            <p className="font-serif-display text-xl sm:text-2xl font-black text-rose-600 tracking-wide">
              LOVE YOU TONS, BIG SIS! 💕
            </p>
            <p className="font-cursive text-lg text-pink-800 font-bold mt-0.5">
              — From your favorite (and most adorable) little sibling 🧸
            </p>
          </div>
        </div>
      </div>

      {/* Button to proceed to Virtual Hug */}
      <div className="mt-5 text-center z-20">
        <button
          type="button"
          onClick={() => {
            soundManager.playHugSound();
            onComplete();
          }}
          className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#F4AFC5] via-[#E88EAD] to-[#F4AFC5] text-pink-950 font-bold text-base shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white"
        >
          <span>CONTINUE TO VIRTUAL HUG</span>
          <span className="text-xl">🧸💕</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
}
