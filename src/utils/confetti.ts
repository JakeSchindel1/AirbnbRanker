import confetti from 'canvas-confetti';

export const fireConfettiAtElement = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();

  const duration = 5000;
  const interval = 700;
  const end = Date.now() + duration;

  const intervalId = setInterval(() => {
    if (Date.now() > end) {
      clearInterval(intervalId);
      return;
    }

    for (let i = 0; i < 3; i++) {
      const randomX = rect.left + Math.random() * rect.width;
      const randomY = rect.top + Math.random() * rect.height;

      confetti({
        particleCount: 12,
        angle: 90,                                 // 💥 toward viewer
        spread: 60,                                // 🌐 moderate dispersion
        startVelocity: 6,                         // ⛽ slower speed
        scalar: Math.random() * 0.3 + 0.5,         // 👁️ depth illusion
        gravity: 0.05,                             // 🪶 float longer
        ticks: 90,
        shapes: ['circle'],
        origin: {
          x: randomX / window.innerWidth,
          y: randomY / window.innerHeight,
        },
        zIndex: 9999,
      });
    }
  }, interval);
};
