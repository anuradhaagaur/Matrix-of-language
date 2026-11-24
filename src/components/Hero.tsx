import React, { useEffect, useRef } from 'react';
import { ArrowDown, Cpu, Sparkles, Terminal, BookOpen, ChevronRight } from 'lucide-react';

interface HeroProps {
  onInitialize: () => void;
  onExploreScience: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onInitialize, onExploreScience }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const onResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', onResize);

    const wordPool = ['PREDICT', 'TOKENIZE', 'SOFTMAX', 'PERPLEXITY', 'DISTILGPT2', 'CONTEXT', 'PROBABILITY'];
    const colors = ['#FF3CAC', '#F000FF', '#B44AFF', '#7C3AED'];
    
    interface MorphToken {
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      char: string;
      targetChar: string;
      color: string;
      glow: number;
      isBoxed: boolean;
    }

    const tokens: MorphToken[] = [];
    const count = Math.min(60, Math.floor(width / 15));
    for (let i = 0; i < count; i++) {
      tokens.push({
        x: Math.random() * width,
        y: Math.random() * height,
        targetX: Math.random() * width,
        targetY: Math.random() * height,
        char: String.fromCharCode(33 + Math.floor(Math.random() * 90)),
        targetChar: String.fromCharCode(33 + Math.floor(Math.random() * 90)),
        color: colors[Math.floor(Math.random() * colors.length)],
        glow: 4,
        isBoxed: false,
      });
    }

    let cycle = 0;
    let stage = 0;

    const renderHero = () => {
      cycle++;
      if (cycle % 180 === 0) {
        stage = (stage + 1) % 4;
        const currentWord = wordPool[Math.floor(Math.random() * wordPool.length)];

        tokens.forEach((t, i) => {
          if (stage === 1) {
            // Form words in center
            if (i < currentWord.length) {
              t.targetX = width / 2 - (currentWord.length * 18) / 2 + i * 22;
              t.targetY = height / 2;
              t.targetChar = currentWord[i];
              t.color = '#FF3CAC';
              t.glow = 14;
              t.isBoxed = false;
            } else {
              t.targetX = Math.random() * width;
              t.targetY = Math.random() * height;
              t.targetChar = String.fromCharCode(33 + Math.floor(Math.random() * 90));
              t.color = '#7C3AED';
              t.glow = 2;
              t.isBoxed = false;
            }
          } else if (stage === 2) {
            // Token blocks
            t.targetX = Math.random() * (width - 60) + 30;
            t.targetY = Math.random() * (height - 60) + 30;
            t.color = '#F000FF';
            t.isBoxed = Math.random() > 0.6;
            t.glow = 8;
          } else if (stage === 3) {
            // Burst into particles outward
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * (width / 2);
            t.targetX = width / 2 + Math.cos(angle) * dist;
            t.targetY = height / 2 + Math.sin(angle) * dist;
            t.color = Math.random() > 0.5 ? '#FFF1FA' : '#FF3CAC';
            t.isBoxed = false;
            t.glow = 16;
          } else {
            // Floating fragments
            t.targetX = Math.random() * width;
            t.targetY = Math.random() * height;
            t.targetChar = String.fromCharCode(33 + Math.floor(Math.random() * 90));
            t.color = '#B44AFF';
            t.isBoxed = false;
            t.glow = 3;
          }
        });
      }

      ctx.clearRect(0, 0, width, height);

      // Draw faint connections between adjacent tokens in subtle magenta/pink
      ctx.strokeStyle = 'rgba(255, 60, 172, 0.08)';
      ctx.lineWidth = 1;
      for (let i = 0; i < tokens.length; i += 2) {
        if (i + 1 < tokens.length) {
          ctx.beginPath();
          ctx.moveTo(tokens[i].x, tokens[i].y);
          ctx.lineTo(tokens[i + 1].x, tokens[i + 1].y);
          ctx.stroke();
        }
      }

      // Render tokens
      tokens.forEach((t) => {
        t.x += (t.targetX - t.x) * 0.06;
        t.y += (t.targetY - t.y) * 0.06;

        ctx.font = '13px "JetBrains Mono", monospace';
        ctx.fillStyle = t.color;
        ctx.shadowColor = t.color;
        ctx.shadowBlur = t.glow;

        if (t.isBoxed) {
          ctx.strokeStyle = 'rgba(255, 60, 172, 0.4)';
          ctx.strokeRect(t.x - 12, t.y - 14, 24, 20);
        }

        ctx.fillText(t.targetChar, t.x - 4, t.y);
      });

      // Horizontal scanner beam line across hero in electric magenta
      const scanY = (cycle * 2) % height;
      const grad = ctx.createLinearGradient(0, scanY, width, scanY);
      grad.addColorStop(0, 'rgba(240, 0, 255, 0)');
      grad.addColorStop(0.5, 'rgba(255, 60, 172, 0.35)');
      grad.addColorStop(1, 'rgba(240, 0, 255, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, scanY - 1, width, 2);

      animId = requestAnimationFrame(renderHero);
    };

    renderHero();

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center items-center px-4 pt-28 pb-16 overflow-hidden">
      {/* Background Interactive Morphing Canvas */}
      <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center opacity-65">
        <canvas ref={canvasRef} className="w-full h-full max-w-5xl" />
      </div>

      {/* Ambient pink-purple radial glow behind heading */}
      <div className="absolute w-[600px] h-[350px] bg-[radial-gradient(ellipse_at_center,rgba(255,60,172,0.12)_0%,rgba(180,74,255,0.06)_50%,transparent_75%)] pointer-events-none -z-0 blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-cyber-card/90 border border-cyber-pink/30 text-cyber-pink font-mono text-xs tracking-widest uppercase shadow-neon-sm animate-pulse-slow">
          <Terminal className="w-3.5 h-3.5 text-cyber-pink" />
          <span>LANGUAGE MODEL VISUALIZATION SYSTEM // 001</span>
        </div>

        {/* Main Heading */}
        <div className="space-y-2">
          <h1 className="font-heading font-black text-5xl sm:text-7xl lg:text-8xl tracking-tight text-cyber-primary leading-[0.95] select-none">
            EVERY WORD<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-pink via-cyber-magenta to-cyber-purple matrix-glow-text">
              IS A PREDICTION.
            </span>
          </h1>
        </div>

        {/* Supporting description */}
        <p className="max-w-2xl mx-auto text-base sm:text-xl text-cyber-secondary font-normal leading-relaxed">
          Step inside a language model. Watch sentences dissolve into tokens, probabilities emerge, and uncertainty become a number.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={onInitialize}
            className="matrix-btn-primary px-7 py-3.5 rounded-xl flex items-center gap-3 text-sm font-bold tracking-wider group"
          >
            <span>INITIALIZE SYSTEM</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onExploreScience}
            className="matrix-btn-secondary px-7 py-3.5 rounded-xl flex items-center gap-3 text-sm font-semibold tracking-wider"
          >
            <BookOpen className="w-4 h-4 text-cyber-pink" />
            <span>EXPLORE THE SCIENCE</span>
          </button>
        </div>

        {/* System Status Panel */}
        <div className="pt-6">
          <div className="inline-flex flex-wrap items-center justify-center gap-6 sm:gap-8 px-6 py-3 rounded-xl bg-cyber-card/85 border border-cyber-border text-xs font-mono text-cyber-secondary backdrop-blur-md shadow-neon-sm">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-magenta opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-magenta"></span>
              </span>
              <span className="text-cyber-pink">MODEL:</span>
              <span className="text-cyber-primary font-bold">DISTILGPT-2</span>
            </div>
            <div className="w-px h-3 bg-cyber-purple/30 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="text-cyber-pink">ENGINE:</span>
              <span className="text-cyber-primary font-bold">READY (82M)</span>
            </div>
            <div className="w-px h-3 bg-cyber-purple/30 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="text-cyber-pink">MODE:</span>
              <span className="text-cyber-purple font-bold">LANGUAGE ANALYSIS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Down indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cyber-muted font-mono text-[10px] tracking-widest opacity-70 hover:opacity-100 transition-opacity">
        <span>SCROLL TO ENTER</span>
        <ArrowDown className="w-4 h-4 text-cyber-pink animate-bounce" />
      </div>
    </section>
  );
};
