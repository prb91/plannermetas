import confetti from 'canvas-confetti';

export function dispararConfetes() {
  // Disparo centralizado e festivo
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#ff6b35', '#ff7f50', '#0d1b2a', '#10b981', '#f59e0b'],
  });

  // Disparo duplo lateral
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#ff6b35', '#10b981', '#ffffff'],
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#ff6b35', '#10b981', '#ffffff'],
    });
  }, 200);
}
