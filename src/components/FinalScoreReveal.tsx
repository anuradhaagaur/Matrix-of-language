import React, { useState, useEffect, useRef } from 'react';
import { PerplexityResult } from '../types/matrix';
import { Sparkles, ArrowRight, RotateCcw, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FinalScoreRevealProps {
  result: PerplexityResult;
  onExploreBreakdown: () => void;
  onReplayReveal?: () => void;
}

export const FinalScoreReveal: React.FC<FinalScoreRevealProps> = ({
  result,
  onExploreBreakdown,
  onReplayReveal,
}) => {
  const [phase, setPhase] = useState<number>(1);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(2), 700);
    const t2 = setTimeout(() => setPhase(3), 1900);
    const t3 = setTimeout(() => {
      setPhase(4);
      try {
        confetti({
          particleCount: 50,
          spread: 75,
          origin: { y: 0.65 },
          colors: ['#FF3CAC', '#F000FF', '#B44AFF', '#7C3AED', '#FFF1FA'],
          disableForReducedMotion: true,
        });
      } catch (e) {
        // silent
      }
    }, 3100);
    const t4 = setTimeout(() => setPhase(5), 4300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [result]);

  // Canvas convergence and shockwave in pink & magenta
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const width = (canvas.width = canvas.parentElement?.clientWidth || 700);
    const height = (canvas.height = 300);
    const centerX = width / 2;
    const centerY = height / 2;

    interface ConvergeParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      radius: number;
      alpha: number;
    }

    const particleColors = ['#FF3CAC', '#F000FF', '#B44AFF', '#FFF1FA'];
    const particles: ConvergeParticle[] = [];
    for (let i = 0; i < 70; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * (width / 2.2) + 40;
      particles.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.8 + 0.2,
      });
    }

    let waveRadius = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Phase 1 & 2: Particles flowing to center
      if (phase === 1 || phase === 2) {
        particles.forEach((p) => {
          const dx = centerX - p.x;
          const dy = centerY - p.y;
          const dist = Math.hypot(dx, dy);

          if (dist > 5) {
            p.x += (dx / dist) * 4.5;
            p.y += (dy / dist) * 4.5;
          }

          ctx.fillStyle = p.color;
          ctx.shadowColor = '#FF3CAC';
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // Phase 4 & 5: Expanding shockwave ring
      if (phase >= 4) {
        waveRadius += 3.5;
        const waveAlpha = Math.max(0, 1 - waveRadius / 180);

        if (waveAlpha > 0) {
          ctx.strokeStyle = `rgba(240, 0, 255, ${waveAlpha * 0.75})`;
          ctx.lineWidth = 2.5;
          ctx.shadowColor = '#FF3CAC';
          ctx.shadowBlur = 18;
          ctx.beginPath();
          ctx.arc(centerX, centerY, waveRadius, 0, Math.PI * 2);
          ctx.stroke();

          // Second subtle ripple
          if (waveRadius > 40) {
            ctx.strokeStyle = `rgba(180, 74, 255, ${waveAlpha * 0.45})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(centerX, centerY, waveRadius - 30, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [phase]);

  return (
    <div className="relative matrix-panel-glow rounded-3xl p-6 sm:p-10 border border-cyber-pink/40 shadow-neon-lg overflow-hidden text-center space-y-6">
      {/* Background Shockwave Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Header Phase Eyebrow */}
      <div className="relative z-10 flex items-center justify-center gap-2 font-mono text-xs text-cyber-pink">
        <Sparkles className="w-4 h-4 animate-spin text-cyber-magenta" />
        <span className="tracking-widest uppercase">
          {phase < 4 ? `CONVERGENCE IN PROGRESS // PHASE 0${phase}` : 'UNCERTAINTY QUANTIFIED'}
        </span>
      </div>

      {/* Central Interactive Animation Box */}
      <div className="relative z-10 min-h-[220px] flex flex-col items-center justify-center py-4">
        {/* Phase 1 & 2: Token Collapse and Particle Inflow */}
        {(phase === 1 || phase === 2) && (
          <div className="space-y-3 animate-fadeIn">
            <span className="font-mono text-xs text-cyber-muted tracking-wider">
              COLLAPSING {result.tokenCount} TOKEN PROBABILITIES TO GEOMETRIC MEAN...
            </span>
            <div className="text-xl font-heading text-cyber-primary">
              "{result.sentence}"
            </div>
            <div className="flex justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyber-pink animate-ping" />
              <span className="w-2 h-2 rounded-full bg-cyber-magenta animate-ping delay-100" />
              <span className="w-2 h-2 rounded-full bg-cyber-purple animate-ping delay-200" />
            </div>
          </div>
        )}

        {/* Phase 3: Mathematical Reconstruction Stages */}
        {phase === 3 && (
          <div className="space-y-4 animate-fadeIn max-w-md mx-auto">
            <span className="font-mono text-xs text-cyber-pink uppercase tracking-wider">
              SYNTHESIZING CAUSAL LOSS
            </span>
            <div className="grid grid-cols-3 gap-3 font-mono text-xs">
              <div className="bg-cyber-card/90 p-2.5 rounded-lg border border-cyber-border">
                <span className="text-[10px] text-cyber-muted block">TOKENS (N)</span>
                <span className="text-cyber-primary font-bold">{result.tokenCount}</span>
              </div>
              <div className="bg-cyber-card/90 p-2.5 rounded-lg border border-cyber-border">
                <span className="text-[10px] text-cyber-muted block">AVG NEG LOG</span>
                <span className="text-cyber-purple font-bold">{result.avgNegLogProb.toFixed(3)}</span>
              </div>
              <div className="bg-cyber-card/90 p-2.5 rounded-lg border border-cyber-border">
                <span className="text-[10px] text-cyber-muted block">EXP(LOSS)</span>
                <span className="text-cyber-pink font-bold">exp(...)</span>
              </div>
            </div>
            <p className="font-mono text-[11px] text-cyber-muted animate-pulse">
              Computing exp(-1/N × Σ ln P(token)) ...
            </p>
          </div>
        )}

        {/* Phase 4 & 5: Big Perplexity Score Reveal */}
        {(phase === 4 || phase === 5) && (
          <div className="space-y-4 animate-scaleUp">
            <span className="font-mono text-xs tracking-widest text-cyber-muted uppercase">
              PERPLEXITY SCORE
            </span>

            {/* Glowing Big Number with Cyberpunk Pink / Magenta Gradient */}
            <div className="relative inline-block">
              <div className="font-heading font-black text-6xl sm:text-8xl text-transparent bg-clip-text bg-gradient-to-b from-[#FFF1FA] via-[#FF3CAC] to-[#B44AFF] matrix-glow-text select-none tracking-tight">
                {result.perplexity.toFixed(3)}
              </div>
              {/* Soft pink radial glow behind the score */}
              <div className="absolute inset-0 bg-cyber-pink/20 blur-3xl -z-10 rounded-full pointer-events-none" />
            </div>

            {/* Supporting pedagogical explanation */}
            <p className="max-w-xl mx-auto text-sm sm:text-base text-cyber-primary font-normal leading-relaxed pt-2">
              On average, the model behaves as though it were choosing between approximately{' '}
              <strong className="text-cyber-pink font-mono font-bold">
                {result.perplexity.toFixed(3)}
              </strong>{' '}
              equally likely options at each token position.
            </p>

            <div className="pt-2 text-xs font-mono text-cyber-muted flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyber-pink" />
              <span>Prediction complete. Uncertainty quantified.</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="relative z-10 pt-4 border-t border-cyber-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={() => {
            setPhase(1);
            if (onReplayReveal) onReplayReveal();
          }}
          className="text-xs font-mono text-cyber-muted hover:text-cyber-pink flex items-center gap-2 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>REPLAY CONVERGENCE REVEAL</span>
        </button>

        <button
          onClick={onExploreBreakdown}
          className="matrix-btn-primary px-6 py-3 rounded-xl text-xs font-bold flex items-center gap-2 tracking-wider group"
        >
          <span>EXPLORE TOKEN BREAKDOWN</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
