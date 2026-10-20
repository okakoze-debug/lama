import { useState } from 'react';
import { FloatingDecorations } from './components/FloatingDecorations';
import { MusicPlayer } from './components/MusicPlayer';
import { SecretHeartHunt } from './components/SecretHeartHunt';
import { GiftBoxScene } from './components/GiftBoxScene';
import { CheesecakeScene } from './components/CheesecakeScene';
import { CakeMiniGame } from './components/CakeMiniGame';
import { AppreciationCards } from './components/AppreciationCards';
import { BirthdayEnvelope } from './components/BirthdayEnvelope';
import { VirtualHugScene } from './components/VirtualHugScene';
import { FinalBirthdayScene } from './components/FinalBirthdayScene';
import { soundManager } from './utils/soundEffects';

export type SceneId = 'gift' | 'cheesecake' | 'cake_game' | 'cards' | 'envelope' | 'virtual_hug' | 'final';

const SCENE_NAMES: { id: SceneId; title: string }[] = [
  { id: 'gift', title: 'Gift' },
  { id: 'cheesecake', title: 'Cheesecake' },
  { id: 'cake_game', title: 'More Cake' },
  { id: 'cards', title: 'Appreciation' },
  { id: 'envelope', title: 'Card' },
  { id: 'virtual_hug', title: 'Hug' },
  { id: 'final', title: 'Celebration' }
];

export default function App() {
  const [currentScene, setCurrentScene] = useState<SceneId>('gift');
  const [maxVisitedIndex, setMaxVisitedIndex] = useState<number>(0);
  const [discoveredHearts, setDiscoveredHearts] = useState<number[]>([]);
  const [activeHeartModal, setActiveHeartModal] = useState<number | null>(null);

  // Helper to transition scenes
  const goToScene = (scene: SceneId) => {
    setCurrentScene(scene);
    const sceneIndex = SCENE_NAMES.findIndex((s) => s.id === scene);
    if (sceneIndex > maxVisitedIndex) {
      setMaxVisitedIndex(sceneIndex);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Discover a hidden secret heart
  const handleDiscoverHeart = (heartId: number) => {
    soundManager.playChime();
    if (!discoveredHearts.includes(heartId)) {
      setDiscoveredHearts((prev) => [...prev, heartId]);
    }
    setActiveHeartModal(heartId);
  };

  // Reset entire experience for Replay
  const handleReplay = () => {
    setCurrentScene('gift');
    setMaxVisitedIndex(0);
    // Keep discovered hearts as a fun keepsake or reset
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentIndex = SCENE_NAMES.findIndex((s) => s.id === currentScene);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF9F7] via-[#FFF0F5] to-[#FFDDE8] text-[#4A333A] relative flex flex-col justify-between selection:bg-[#F8C8DC] selection:text-pink-900">
      {/* Interactive Floating Petals, Sparkles, Clickable Hearts, and Star Wishes */}
      <FloatingDecorations
        onDiscoverHeart={handleDiscoverHeart}
        discoveredHearts={discoveredHearts}
        showSecretHearts={true}
      />

      {/* Persistent Top Navigation & Atmosphere Header */}
      <header className="sticky top-0 z-40 w-full bg-[#FFF9F7]/85 backdrop-blur-md border-b border-pink-200/60 px-3 sm:px-6 py-2.5 shadow-2xs">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Brand & Sibling Title */}
          <div className="flex items-center gap-2">
            <span className="text-xl">🎀</span>
            <div className="leading-tight">
              <span className="font-serif-display font-bold text-pink-950 text-sm sm:text-base">
                Lama's Birthday Surprise
              </span>
              <span className="text-[10px] text-pink-600 font-semibold block">
                For my favorite big sister ♡
              </span>
            </div>
          </div>

          {/* Secret Hearts Counter Status */}
          <div className="hidden md:flex items-center">
            <SecretHeartHunt
              discoveredHearts={discoveredHearts}
              activeDiscoveredHeart={activeHeartModal}
              onCloseHeartModal={() => setActiveHeartModal(null)}
            />
          </div>

          {/* Music Player & Surprise shower */}
          <div className="flex items-center gap-3">
            <MusicPlayer />
          </div>
        </div>

        {/* Story Chapter Progress Indicator (pill-free, clean typography with subtle dot separators) */}
        <nav aria-label="Story chapters" className="max-w-6xl mx-auto mt-2 pt-1 border-t border-pink-100 flex items-center justify-center gap-1 sm:gap-2 overflow-x-auto py-1 text-[11px] sm:text-xs">
          {SCENE_NAMES.map((s, idx) => {
            const isCurrent = s.id === currentScene;
            const isUnlocked = idx <= maxVisitedIndex;

            return (
              <div key={s.id} className="flex items-center shrink-0">
                <button
                  type="button"
                  disabled={!isUnlocked}
                  onClick={() => {
                    if (isUnlocked) {
                      soundManager.playPop();
                      goToScene(s.id);
                    }
                  }}
                  className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                    isCurrent
                      ? 'text-pink-950 font-bold bg-[#F8C8DC]/60'
                      : isUnlocked
                      ? 'text-pink-700/80 hover:text-pink-950 hover:underline cursor-pointer'
                      : 'text-pink-300 cursor-not-allowed'
                  }`}
                >
                  {s.title}
                </button>
                {idx < SCENE_NAMES.length - 1 && (
                  <span className="text-pink-300 text-[10px] select-none mx-0.5" aria-hidden="true">·</span>
                )}
              </div>
            );
          })}
        </nav>
      </header>

      {/* Main Experience Viewport */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-4 sm:py-6 flex flex-col justify-center relative z-20">
        {/* SCENE 1: Gift Box */}
        {currentScene === 'gift' && (
          <GiftBoxScene
            onOpenComplete={() => goToScene('cheesecake')}
            onDiscoverSecretHeart={handleDiscoverHeart}
            isSecretHeartFound={discoveredHearts.includes(1)}
          />
        )}

        {/* SCENE 2: Cheesecake & Interactive Candles */}
        {currentScene === 'cheesecake' && (
          <CheesecakeScene
            onComplete={() => goToScene('cake_game')}
            onDiscoverSecretHeart={handleDiscoverHeart}
            isSecretHeartFound={discoveredHearts.includes(2)}
          />
        )}

        {/* SCENE 3: Cake Mini-Game */}
        {currentScene === 'cake_game' && (
          <CakeMiniGame onComplete={() => goToScene('cards')} />
        )}

        {/* SCENE 4: Appreciation Cards */}
        {currentScene === 'cards' && (
          <AppreciationCards
            onComplete={() => goToScene('envelope')}
            onDiscoverSecretHeart={handleDiscoverHeart}
            isSecretHeartFound={discoveredHearts.includes(3)}
          />
        )}

        {/* SCENE 5: Birthday Envelope & Letter */}
        {currentScene === 'envelope' && (
          <BirthdayEnvelope onComplete={() => goToScene('virtual_hug')} />
        )}

        {/* SCENE 6: Virtual Hug */}
        {currentScene === 'virtual_hug' && (
          <VirtualHugScene onComplete={() => goToScene('final')} />
        )}

        {/* SCENE 7: Final Birthday Celebration */}
        {currentScene === 'final' && (
          <FinalBirthdayScene onReplay={handleReplay} />
        )}
      </main>

      {/* Secret Hearts Dialog Modal */}
      <SecretHeartHunt
        discoveredHearts={discoveredHearts}
        activeDiscoveredHeart={activeHeartModal}
        onCloseHeartModal={() => setActiveHeartModal(null)}
      />

      {/* Footer */}
      <footer className="w-full text-center py-4 px-4 text-xs text-pink-700/70 relative z-20">
        <div className="flex items-center justify-center gap-2">
          <span>Made with lots of love for Lama</span>
          <span>♡</span>
          <span>Chapter {currentIndex + 1} of {SCENE_NAMES.length}</span>
        </div>
      </footer>
    </div>
  );
}
