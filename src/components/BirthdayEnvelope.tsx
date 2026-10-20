import { useState } from 'react';
import { soundManager } from '../utils/soundEffects';
import { firePinkConfetti } from '../utils/confetti';
import { BirthdayLetter } from './BirthdayLetter';
import { Heart, Sparkles } from 'lucide-react';

interface BirthdayEnvelopeProps {
  onComplete: () => void;
}

export function BirthdayEnvelope({ onComplete }: BirthdayEnvelopeProps) {
  // States: 'sealed' -> 'wiggling' -> 'seal-burst' -> 'flap-open' -> 'letter-sliding' -> 'opened'
  const [envelopeState, setEnvelopeState] = useState<'sealed' | 'wiggling' | 'seal-burst' | 'flap-open' | 'letter-sliding' | 'opened'>('sealed');

  const handleOpenEnvelope = () => {
    if (envelopeState !== 'sealed') return;

    soundManager.playPop();
    setEnvelopeState('wiggling');

    // 1: Wiggle
    setTimeout(() => {
      setEnvelopeState('seal-burst');
      soundManager.playPaperRustle();
    }, 700);

    // 2: Seal bursts with sparkles & flap opens
    setTimeout(() => {
      setEnvelopeState('flap-open');
      soundManager.playCardFlip();
    }, 1400);

    // 3: Letter slides out
    setTimeout(() => {
      setEnvelopeState('letter-sliding');
      soundManager.playChime();
      firePinkConfetti({ originY: 0.5 });
    }, 2200);

    // 4: Opened view
    setTimeout(() => {
      setEnvelopeState('opened');
    }, 3200);
  };

  // If already opened, display full letter scene directly
  if (envelopeState === 'opened') {
    return <BirthdayLetter onComplete={onComplete} />;
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[85vh] px-4 py-8">
      {/* Header */}
      <div className="text-center max-w-lg mx-auto mb-8 z-10">
        <h2 className="font-serif-display text-2xl sm:text-3xl md:text-4xl font-bold text-pink-950 mb-2">
          WAIT, LAMA... THERE'S ONE MORE THING FOR YOU. 💌
        </h2>
        <p className="font-cursive text-2xl sm:text-3xl text-rose-600 font-bold">
          A little something from the heart. ♡
        </p>
      </div>

      {/* THE ENVELOPE STAGE */}
      <div className="relative w-80 sm:w-96 h-64 sm:h-72 flex items-center justify-center perspective-1000 z-10">
        {/* Soft shadow underneath */}
        <div className="absolute -bottom-2 w-64 sm:w-76 h-8 bg-pink-950/15 rounded-[100%] blur-md" />

        {/* The Envelope Box Container */}
        <div
          onClick={handleOpenEnvelope}
          className={`relative w-72 sm:w-84 h-48 sm:h-56 cursor-pointer select-none transition-transform duration-500 ${
            envelopeState === 'sealed' ? 'hover:scale-105 animate-gentle-float' : ''
          } ${envelopeState === 'wiggling' ? 'animate-bounce' : ''}`}
        >
          {/* THE LETTER SLIDING OUT FROM INSIDE */}
          <div
            className={`absolute inset-x-4 bg-[#FFF9F7] border-2 border-pink-300 rounded-2xl shadow-xl transition-all duration-1000 p-4 z-15 flex flex-col items-center justify-center ${
              envelopeState === 'letter-sliding'
                ? '-top-36 opacity-100 scale-105'
                : 'top-2 opacity-0 pointer-events-none'
            }`}
          >
            <div className="text-2xl animate-bounce">💌✨</div>
            <div className="font-serif-display text-base font-bold text-pink-900 mt-1">
              "A Fun Birthday Card for You"
            </div>
            <div className="text-xs text-rose-600 font-cursive text-center">Unfolding for big sister Lama...</div>
          </div>

          {/* ENVELOPE BACK BASE */}
          <div className="w-full h-full rounded-2xl bg-gradient-to-br from-[#FFDDE8] via-[#F8C8DC] to-[#F4AFC5] border-2 border-pink-300 shadow-xl relative overflow-hidden flex items-center justify-center">
            {/* Triangular side folds simulation */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%),linear-gradient(-45deg,rgba(255,255,255,0.15)_25%,transparent_25%)]" />

            {/* ENVELOPE TOP TRIANGULAR FLAP */}
            <div
              className={`absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-[#F4AFC5] to-[#E88EAD] border-b-2 border-pink-300/80 transition-all duration-700 origin-top z-20 ${
                envelopeState === 'flap-open' || envelopeState === 'letter-sliding'
                  ? '-scale-y-100 opacity-90'
                  : ''
              }`}
              style={{
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)'
              }}
            />

            {/* HEART WAX SEAL ON CENTER */}
            <div
              className={`absolute top-20 left-1/2 -translate-x-1/2 z-30 transition-all duration-500 ${
                envelopeState === 'seal-burst' || envelopeState === 'flap-open' || envelopeState === 'letter-sliding'
                  ? 'scale-150 opacity-0'
                  : 'hover:scale-110'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-rose-700 shadow-md border-2 border-rose-300 flex items-center justify-center text-white text-lg">
                <Heart className="w-6 h-6 fill-white text-white drop-shadow-xs" />
              </div>
            </div>

            {/* Tiny ribbon under seal */}
            <div
              className={`absolute top-28 left-1/2 -translate-x-1/2 flex gap-1 z-25 transition-opacity ${
                envelopeState !== 'sealed' ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <div className="w-2.5 h-6 bg-[#F4AFC5] rotate-[-20deg] rounded-b-sm shadow-xs" />
              <div className="w-2.5 h-6 bg-[#F4AFC5] rotate-[20deg] rounded-b-sm shadow-xs" />
            </div>

            {/* Front label on envelope bottom */}
            <div className="absolute bottom-4 text-center z-10">
              <span className="font-cursive text-xl font-bold text-pink-900 bg-white/60 px-4 py-1 rounded-full border border-pink-200 shadow-2xs">
                To: Lama ♡
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Button to Open */}
      <div className="mt-8 z-20">
        {envelopeState === 'sealed' ? (
          <button
            type="button"
            onClick={handleOpenEnvelope}
            className="group inline-flex items-center gap-2 px-8 py-3.5 sm:px-9 sm:py-4 rounded-full bg-gradient-to-r from-[#F4AFC5] via-[#E88EAD] to-[#F4AFC5] text-pink-950 font-bold text-base sm:text-lg shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white"
          >
            <Sparkles className="w-5 h-5 text-pink-900 group-hover:rotate-12 transition-transform" />
            <span>OPEN YOUR BIRTHDAY CARD 💌</span>
          </button>
        ) : (
          <div className="text-center font-cursive text-2xl text-rose-700 font-bold animate-pulse">
            Breaking the wax seal with love... 💖
          </div>
        )}
      </div>

      <p className="mt-3 text-xs text-pink-800/70 font-medium">
        (Tap the envelope or button to open!)
      </p>
    </div>
  );
}
