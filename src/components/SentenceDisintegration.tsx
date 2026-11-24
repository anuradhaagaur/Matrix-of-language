import React, { useEffect, useState, useRef } from 'react';
import { PerplexityResult, TokenPrediction } from '../types/matrix';
import { Sparkles, Scan, ArrowRight, Play, CheckCircle } from 'lucide-react';
import { formatProbability } from '../utils/perplexityMath';

interface SentenceDisintegrationProps {
  result: PerplexityResult;
  onComplete: () => void;
  autoStart?: boolean;
}

export const SentenceDisintegration: React.FC<SentenceDisintegrationProps> = ({
  result,
  onComplete,
  autoStart = true,
}) => {
  const [phase, setPhase] = useState<number>(autoStart ? 1 : 0);
  const [activeTokenIdx, setActiveTokenIdx] = useState<number>(-1);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (phase === 0) return;

    if (phase === 1) {
      const t = setTimeout(() => setPhase(2), 900);
      return () => clearTimeout(t);
    }

    if (phase === 2) {
      const t = setTimeout(() => setPhase(3), 1200);
      return () => clearTimeout(t);
    }

    if (phase === 3) {
      const t = setTimeout(() => setPhase(4), 1100);
      return () => clearTimeout(t);
    }

    if (phase === 4) {
      const t = setTimeout(() => {
        setPhase(5);
        setActiveTokenIdx(0);
      }, 800);
      return () => clearTimeout(t);
    }

    if (phase === 5) {
      if (activeTokenIdx < result.tokens.length) {
        const t = setTimeout(() => {
          setActiveTokenIdx((prev) => prev + 1);
        }, 320);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => {
          setPhase(6);
          onComplete();
        }, 500);
        return () => clearTimeout(t);
      }
    }
  }, [phase, activeTokenIdx, result.tokens.length, onComplete]);

  // Canvas particle disintegration animation in neon pink & magenta
  useEffect(() => {
    if (phase !== 2) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const width = (canvas.width = canvas.parentElement?.clientWidth || 700);
    const height = (canvas.height = 240);

    interface DisintegrateParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      char: string;
      alpha: number;
      size: number;
      color: string;
    }

    const particles: DisintegrateParticle[] = [];
    const chars = result.sentence.split('');
    const charSpacing = Math.min(22, width / (chars.length + 2));
    const startX = (width - chars.length * charSpacing) / 2;
    const particleColors = ['#FF3CAC', '#F000FF', '#B44AFF', '#FFF1FA'];

    chars.forEach((c, idx) => {
      for (let p = 0; p < 8; p++) {
        particles.push({
          x: startX + idx * charSpacing + (Math.random() - 0.5) * 8,
          y: height / 2 + (Math.random() - 0.5) * 12,
          vx: (Math.random() - 0.5) * 3.5,
          vy: (Math.random() - 0.5) * 3.5 - 1.2,
          char: Math.random() > 0.5 ? c : String.fromCharCode(48 + Math.floor(Math.random() * 70)),
          alpha: 1.0,
          size: Math.random() * 2 + 1.5,
          color: particleColors[Math.floor(Math.random() * particleColors.length)],
        });
      }
    });

    const render = () => {
      ctx.fillStyle = 'rgba(11, 6, 16, 0.25)';
      ctx.fillRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.018;

        if (p.alpha > 0) {
          ctx.font = '12px "JetBrains Mono", monospace';
          ctx.fillStyle = p.color;
          ctx.shadowColor = '#FF3CAC';
          ctx.shadowBlur = 8;
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillText(p.char, p.x, p.y);

          ctx.fillStyle = '#FFF1FA';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1.0;
        }
      });

      if (particles.some((p) => p.alpha > 0)) {
        animId = requestAnimationFrame(render);
      }
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [phase, result.sentence]);

  return (
    <div className="matrix-panel-glow rounded-2xl p-6 sm:p-8 border border-cyber-pink/40 shadow-neon-lg overflow-hidden relative">
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-cyber-border pb-4 mb-6">
        <div className="flex items-center gap-2 text-cyber-pink font-mono text-xs">
          <Scan className="w-4 h-4 animate-spin text-cyber-magenta" />
          <span className="tracking-widest">
            TRANSFORMATION SEQUENCE // PHASE 0{phase} OF 05
          </span>
        </div>
        <div className="font-mono text-xs text-cyber-muted">
          {phase === 1 && 'PHASE 1: ORIGINAL TEXT'}
          {phase === 2 && 'PHASE 2: ATOMIC DISINTEGRATION'}
          {phase === 3 && 'PHASE 3: BPE TOKEN EXTRACTION'}
          {phase === 4 && 'PHASE 4: TOKEN ALIGNMENT'}
          {phase === 5 && 'PHASE 5: CAUSAL INFERENCE SCAN'}
          {phase === 6 && 'SEQUENCE COMPLETE'}
        </div>
      </div>

      {/* Main Animation Stage */}
      <div className="min-h-[200px] flex flex-col items-center justify-center relative py-6">
        {/* PHASE 1: Original Sentence */}
        {phase === 1 && (
          <div className="text-center space-y-4 animate-fadeIn">
            <span className="text-[11px] font-mono tracking-widest text-cyber-muted uppercase">
              INPUT STRING
            </span>
            <div className="font-heading font-bold text-3xl sm:text-4xl text-cyber-primary tracking-wide border-b border-cyber-pink/40 pb-3">
              "{result.sentence}"
            </div>
            <p className="font-mono text-xs text-cyber-secondary">
              Deconstructing characters into Byte-Pair Encoding space...
            </p>
          </div>
        )}

        {/* PHASE 2: Particle Disintegration Canvas */}
        {phase === 2 && (
          <div className="w-full relative flex items-center justify-center">
            <canvas ref={canvasRef} className="w-full max-w-2xl h-[160px] block" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="font-mono text-xs text-cyber-pink tracking-widest bg-cyber-bg/85 px-4 py-1.5 rounded-full border border-cyber-pink/40 shadow-neon-sm">
                DISSOLVING INTO BYTE DATA...
              </span>
            </div>
          </div>
        )}

        {/* PHASE 3: Token Extraction */}
        {phase === 3 && (
          <div className="space-y-4 text-center animate-fadeIn w-full">
            <span className="text-[11px] font-mono tracking-widest text-cyber-muted uppercase">
              DISTILGPT-2 TOKENIZER OUTPUT
            </span>
            <div className="flex flex-wrap items-center justify-center gap-3 py-2">
              {result.tokens.map((token, i) => (
                <div
                  key={i}
                  className="px-4 py-2.5 rounded-xl bg-cyber-elevated border border-cyber-pink/60 shadow-neon-sm font-mono text-base sm:text-lg text-cyber-primary flex items-center gap-2 transform transition-all duration-300 scale-105"
                >
                  <span className="text-cyber-pink text-xs">[{i}]</span>
                  <span className="font-bold">
                    {token.hasLeadingSpace && <span className="text-cyber-muted">␣</span>}
                    {token.cleanToken}
                  </span>
                </div>
              ))}
            </div>
            <p className="font-mono text-xs text-cyber-pink">
              {result.tokenCount} discrete tokens identified in 50,257-dimensional vocabulary.
            </p>
          </div>
        )}

        {/* PHASE 4 & 5: Token Stream & Scanning Processing */}
        {(phase === 4 || phase === 5 || phase === 6) && (
          <div className="w-full space-y-6">
            <div className="flex items-center justify-between font-mono text-xs text-cyber-muted">
              <span>CAUSAL TOKEN SEQUENCE</span>
              <span>SCANNER PULSE: {Math.min(activeTokenIdx, result.tokens.length)} / {result.tokens.length}</span>
            </div>

            {/* Horizontal Token Stream */}
            <div className="flex items-center justify-start sm:justify-center gap-3 overflow-x-auto pb-4 pt-2">
              {result.tokens.map((t, idx) => {
                const isCurrent = idx === activeTokenIdx && phase === 5;
                const isPassed = idx < activeTokenIdx || phase === 6;

                return (
                  <div
                    key={idx}
                    className={`flex-shrink-0 px-4 py-3 rounded-xl border transition-all duration-300 ${
                      isCurrent
                        ? 'bg-cyber-pink/25 border-cyber-pink shadow-neon-md scale-110'
                        : isPassed
                        ? 'bg-cyber-elevated/90 border-cyber-border text-cyber-primary'
                        : 'bg-cyber-bg/60 border-cyber-border/40 opacity-40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 text-[10px] font-mono text-cyber-muted mb-1">
                      <span>#{t.index}</span>
                      <span className="text-cyber-purple">ID:{t.tokenId}</span>
                    </div>

                    <div className="font-mono font-bold text-sm sm:text-base text-cyber-primary flex items-center gap-1">
                      {t.hasLeadingSpace && <span className="text-cyber-muted text-xs">␣</span>}
                      <span>{t.cleanToken}</span>
                    </div>

                    {/* Probability indicator */}
                    <div className="mt-2 pt-2 border-t border-cyber-border/50 text-[11px] font-mono">
                      <span className={isCurrent || isPassed ? 'text-cyber-pink font-bold' : 'text-cyber-muted'}>
                        {formatProbability(t.probability)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Scanner line indicator */}
            <div className="w-full bg-cyber-bgSecondary h-1 rounded-full overflow-hidden relative">
              <div
                className="bg-gradient-to-r from-cyber-pink via-cyber-magenta to-cyber-purple h-full transition-all duration-300 shadow-neon-sm"
                style={{
                  width: `${(Math.min(activeTokenIdx, result.tokens.length) / result.tokens.length) * 100}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer control */}
      <div className="mt-4 pt-4 border-t border-cyber-border flex items-center justify-between text-xs font-mono">
        <div className="text-cyber-muted">
          {phase < 6 ? 'Synchronizing neural forward pass with animation...' : 'Inference complete.'}
        </div>
        {phase === 6 && (
          <button
            onClick={() => {
              setPhase(1);
              setActiveTokenIdx(-1);
            }}
            className="flex items-center gap-1.5 text-cyber-pink hover:underline"
          >
            <Play className="w-3.5 h-3.5" />
            <span>REPLAY DISINTEGRATION</span>
          </button>
        )}
      </div>
    </div>
  );
};
