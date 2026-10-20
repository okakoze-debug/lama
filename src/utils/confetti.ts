import confetti from 'canvas-confetti';

export function firePinkConfetti(options?: { originY?: number }) {
  const count = 70;
  const defaults = {
    origin: { y: options?.originY ?? 0.65 },
    colors: ['#F8C8DC', '#FFDDE8', '#F4AFC5', '#E88EAD', '#FFF9F7', '#FFB7B2', '#E8DDF8'],
    disableForReducedMotion: true
  };

  confetti({
    ...defaults,
    particleCount: Math.floor(count * 0.4),
    spread: 60,
    startVelocity: 45
  });

  confetti({
    ...defaults,
    particleCount: Math.floor(count * 0.3),
    spread: 100,
    decay: 0.91,
    scalar: 1.1
  });

  confetti({
    ...defaults,
    particleCount: Math.floor(count * 0.3),
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2
  });
}

export function fireGrandCelebration() {
  const end = Date.now() + 2500;
  const colors = ['#F8C8DC', '#FFDDE8', '#F4AFC5', '#E88EAD', '#FFF3E8', '#FFB6C1'];

  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

export function fireHeartsConfetti() {
  confetti({
    particleCount: 40,
    spread: 80,
    origin: { y: 0.6 },
    colors: ['#F4AFC5', '#E88EAD', '#FF69B4', '#F8C8DC', '#FFF0F5'],
    shapes: ['star', 'circle'],
    scalar: 1.3
  });
}
