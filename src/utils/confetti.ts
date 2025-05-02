import confetti from 'canvas-confetti';

export const fireConfettiAtElement = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 1.22;
  const centerY = rect.top + rect.height / 2;

  const origin = {
    x: centerX / window.innerWidth,
    y: centerY / window.innerHeight,
  };

  const duration = 181;
  const interval = 140;
  const end = Date.now() + duration;

  const intervalId = setInterval(() => {
    if (Date.now() > end) {
      clearInterval(intervalId);
      return;
    }

    confetti({
      particleCount: 30,
      angle: 90,                  // upward burst
      spread: 80,                // full-circle burst
      startVelocity: 5,
      gravity: 0.4,
      scalar: Math.random() * 0.3 + 0.6,
      shapes: ['circle'],
      ticks: 90,
      origin,
      zIndex: 9999,
    });
  }, interval);
};
