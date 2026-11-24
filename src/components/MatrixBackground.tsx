import React, { useEffect, useRef } from 'react';

const CHARACTERS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzλμσπ∑∏∂∫∆∇≈≠≤≥P(w)softmaxexp(L)loss';
const RECOGNIZABLE_WORDS = [
  'TOKEN',
  'PREDICT',
  'CYBERPUNK',
  'PERPLEXITY',
  'UNCERTAINTY',
  'DISTILGPT-2',
  'PROBABILITY',
  'LOGITS',
  'ATTENTION',
  'CROSS-ENTROPY',
  'CAUSAL',
];

interface StreamColumn {
  x: number;
  y: number;
  speed: number;
  length: number;
  chars: string[];
  opacity: number;
  fontSize: number;
  colorScheme: 'pink' | 'magenta' | 'purple' | 'violet';
  word?: {
    text: string;
    startIndex: number;
    lifespan: number;
  };
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  pulseSpeed: number;
  color: string;
}

export const MatrixBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStreams();
    };

    window.addEventListener('resize', handleResize);

    const fontSize = 13;
    let columns: StreamColumn[] = [];
    const particles: Particle[] = [];

    // Initialize glowing particles in pink/purple tones
    const particleCount = Math.min(45, Math.floor(width / 35));
    const particleColors = ['#FF3CAC', '#F000FF', '#B44AFF', '#7C3AED'];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -0.2 - Math.random() * 0.4,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.1,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
      });
    }

    const initStreams = () => {
      columns = [];
      const colWidth = 26;
      const count = Math.ceil(width / colWidth);

      for (let i = 0; i < count; i++) {
        const streamLength = Math.floor(Math.random() * 18) + 12;
        const chars: string[] = [];
        for (let j = 0; j < streamLength; j++) {
          chars.push(CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]);
        }

        // Randomly assign cyber color variations
        const rand = Math.random();
        let colorScheme: 'pink' | 'magenta' | 'purple' | 'violet' = 'pink';
        if (rand < 0.35) colorScheme = 'pink';
        else if (rand < 0.65) colorScheme = 'magenta';
        else if (rand < 0.85) colorScheme = 'purple';
        else colorScheme = 'violet';

        const col: StreamColumn = {
          x: i * colWidth + Math.random() * 4,
          y: Math.random() * -height * 1.5,
          speed: Math.random() * 1.8 + 1.2,
          length: streamLength,
          chars,
          opacity: Math.random() * 0.40 + 0.15,
          fontSize: Math.random() > 0.85 ? 12 : 11,
          colorScheme,
        };

        if (Math.random() < 0.25) {
          const word = RECOGNIZABLE_WORDS[Math.floor(Math.random() * RECOGNIZABLE_WORDS.length)];
          col.word = {
            text: word,
            startIndex: Math.floor(Math.random() * Math.max(1, streamLength - word.length)),
            lifespan: Math.floor(Math.random() * 200) + 100,
          };
        }

        columns.push(col);
      }
    };

    initStreams();

    let frame = 0;
    const render = () => {
      frame++;

      // Atmospheric fade with deep dark purple wash
      ctx.fillStyle = 'rgba(11, 6, 16, 0.18)';
      ctx.fillRect(0, 0, width, height);

      // Faint cyber grid in background in subtle pink/purple
      ctx.strokeStyle = 'rgba(255, 60, 172, 0.022)';
      ctx.lineWidth = 1;
      const gridSize = 60;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Horizontal subtle data streams
      if (frame % 3 === 0) {
        const streamY = ((frame * 1.5) % height);
        ctx.strokeStyle = 'rgba(240, 0, 255, 0.03)';
        ctx.beginPath();
        ctx.moveTo(0, streamY);
        ctx.lineTo(width, streamY);
        ctx.stroke();
      }

      // Render Matrix Stream columns
      columns.forEach((col) => {
        ctx.font = `${col.fontSize}px "JetBrains Mono", monospace`;

        col.y += col.speed;
        if (col.y - col.length * fontSize > height) {
          col.y = -Math.random() * 200;
          col.speed = Math.random() * 1.8 + 1.2;
          col.opacity = Math.random() * 0.40 + 0.15;

          if (Math.random() < 0.2) {
            const word = RECOGNIZABLE_WORDS[Math.floor(Math.random() * RECOGNIZABLE_WORDS.length)];
            col.word = {
              text: word,
              startIndex: Math.floor(Math.random() * Math.max(1, col.length - word.length)),
              lifespan: 150,
            };
          } else {
            col.word = undefined;
          }
        }

        if (frame % 4 === 0 && Math.random() > 0.6) {
          const mutateIdx = Math.floor(Math.random() * col.chars.length);
          col.chars[mutateIdx] = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
        }

        for (let j = 0; j < col.chars.length; j++) {
          const charY = col.y + j * (fontSize + 3);
          if (charY < -20 || charY > height + 20) continue;

          let charToDraw = col.chars[j];
          let isWordChar = false;

          if (col.word) {
            const wordIdx = j - col.word.startIndex;
            if (wordIdx >= 0 && wordIdx < col.word.text.length) {
              charToDraw = col.word.text[wordIdx];
              isWordChar = true;
            }
          }

          const isHead = j === col.chars.length - 1;
          const alphaFade = (j / col.chars.length) * col.opacity;

          if (isHead) {
            // Bright white-pink tip of stream
            ctx.fillStyle = `rgba(255, 241, 250, ${Math.min(0.95, col.opacity * 2.2)})`;
            ctx.shadowColor = '#FF3CAC';
            ctx.shadowBlur = 10;
          } else if (isWordChar) {
            // Highlighted recognizable word characters
            ctx.fillStyle = `rgba(255, 60, 172, ${Math.min(0.9, col.opacity * 2.0)})`;
            ctx.shadowColor = '#F000FF';
            ctx.shadowBlur = 8;
          } else {
            // Color based on column palette
            if (col.colorScheme === 'pink') {
              ctx.fillStyle = `rgba(255, 60, 172, ${alphaFade})`;
            } else if (col.colorScheme === 'magenta') {
              ctx.fillStyle = `rgba(240, 0, 255, ${alphaFade})`;
            } else if (col.colorScheme === 'purple') {
              ctx.fillStyle = `rgba(180, 74, 255, ${alphaFade})`;
            } else {
              ctx.fillStyle = `rgba(124, 58, 237, ${alphaFade})`;
            }
            ctx.shadowBlur = 0;
          }

          ctx.fillText(charToDraw, col.x, charY);
        }
        ctx.shadowBlur = 0;
      });

      // Render floating particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += Math.sin(frame * p.pulseSpeed) * 0.008;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.globalAlpha = Math.max(0.08, Math.min(0.5, p.alpha));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
      {/* Subtle vignette and radial depth gradient with pink-purple ambient undertone */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,60,172,0.06)_0%,rgba(16,9,22,0.85)_75%,rgba(11,6,16,0.98)_100%)] pointer-events-none" />
      {/* Scanline CRT overlay */}
      <div className="absolute inset-0 scanlines-overlay opacity-30 pointer-events-none" />
    </div>
  );
};
