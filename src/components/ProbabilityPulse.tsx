import React, { useState, useEffect, useRef } from 'react';
import { PerplexityResult, TokenPrediction } from '../types/matrix';
import { Zap, Eye } from 'lucide-react';
import { formatProbability } from '../utils/perplexityMath';

interface ProbabilityPulseProps {
  result: PerplexityResult;
  selectedTokenIdx: number;
  onSelectToken: (idx: number) => void;
}

export const ProbabilityPulse: React.FC<ProbabilityPulseProps> = ({
  result,
  selectedTokenIdx,
  onSelectToken,
}) => {
  const [activePulseIndex, setActivePulseIndex] = useState<number>(0);
  const [pulseProgress, setPulseProgress] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Traveling pulse along tokens
  useEffect(() => {
    let animId: number;
    let start = performance.now();
    const tokenCount = result.tokens.length;

    const animatePulse = (now: number) => {
      const elapsed = now - start;
      const stepDuration = 800;
      const totalCycle = stepDuration * tokenCount;
      const cycleTime = elapsed % totalCycle;

      const currentIdx = Math.floor(cycleTime / stepDuration);
      const frac = (cycleTime % stepDuration) / stepDuration;

      setActivePulseIndex(currentIdx);
      setPulseProgress(frac);

      animId = requestAnimationFrame(animatePulse);
    };

    animId = requestAnimationFrame(animatePulse);
    return () => cancelAnimationFrame(animId);
  }, [result.tokens.length]);

  // Canvas drawing for glowing lines and traveling photons in Cyberpunk Pink / Magenta
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    const height = (canvas.height = 200);

    const tokenCount = result.tokens.length;
    if (tokenCount === 0) return;

    const padding = 60;
    const availableWidth = width - padding * 2;
    const stepX = tokenCount > 1 ? availableWidth / (tokenCount - 1) : 0;
    const centerY = height / 2;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw connection lines between nodes
      for (let i = 0; i < tokenCount - 1; i++) {
        const x1 = padding + i * stepX;
        const x2 = padding + (i + 1) * stepX;
        const tNext = result.tokens[i + 1];

        const prob = tNext.probability;
        const isContextHighlighted =
          selectedTokenIdx >= 0 && (i + 1 <= selectedTokenIdx);

        const arch = (i % 2 === 0 ? -1 : 1) * 22;
        const cpX = (x1 + x2) / 2;
        const cpY = centerY + arch;

        ctx.beginPath();
        ctx.moveTo(x1, centerY);
        ctx.quadraticCurveTo(cpX, cpY, x2, centerY);

        if (isContextHighlighted) {
          ctx.strokeStyle = '#FF3CAC';
          ctx.lineWidth = 2.5;
          ctx.shadowColor = '#F000FF';
          ctx.shadowBlur = 12;
        } else {
          ctx.strokeStyle = `rgba(255, 60, 172, ${Math.max(0.14, Math.min(0.85, prob * 1.5))})`;
          ctx.lineWidth = Math.max(1, prob * 3.5);
          ctx.shadowColor = '#FF3CAC';
          ctx.shadowBlur = Math.max(2, prob * 12);
        }
        ctx.stroke();

        // Traveling photon along active connection
        if (i === activePulseIndex) {
          const t = pulseProgress;
          const bx = Math.pow(1 - t, 2) * x1 + 2 * (1 - t) * t * cpX + Math.pow(t, 2) * x2;
          const by = Math.pow(1 - t, 2) * centerY + 2 * (1 - t) * t * cpY + Math.pow(t, 2) * centerY;

          ctx.fillStyle = '#FFF1FA';
          ctx.shadowColor = '#FF3CAC';
          ctx.shadowBlur = 18;
          ctx.beginPath();
          ctx.arc(bx, by, 4.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = 'rgba(240, 0, 255, 0.7)';
          ctx.beginPath();
          ctx.arc(bx - (x2 - x1) * 0.05, by, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.shadowBlur = 0;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [result.tokens, activePulseIndex, pulseProgress, selectedTokenIdx]);

  return (
    <div className="matrix-panel rounded-2xl p-6 sm:p-8 border border-cyber-border shadow-neon-md space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyber-border pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyber-pink/10 border border-cyber-pink/30 flex items-center justify-center text-cyber-pink">
            <Zap className="w-4 h-4 text-cyber-pink" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-cyber-primary">
              PROBABILITY PULSE
            </h3>
            <p className="font-mono text-xs text-cyber-muted">
              CAUSAL PROPAGATION &amp; LUMINANCE MAPPING
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 font-mono text-[11px] text-cyber-secondary">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyber-pink shadow-neon-sm" />
            <span>High P (&gt;30%)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyber-magenta" />
            <span>Medium P (5-30%)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyber-violet" />
            <span>Low P (&lt;5%)</span>
          </span>
        </div>
      </div>

      {/* Interactive Pulse Visualization */}
      <div className="relative min-h-[220px] flex items-center justify-center overflow-x-auto py-4">
        {/* Canvas line layer */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        {/* Token Node Elements */}
        <div className="relative z-10 w-full flex items-center justify-between px-8 sm:px-14 min-w-[500px]">
          {result.tokens.map((token, idx) => {
            const isSelected = selectedTokenIdx === idx;
            const isPulseActive = activePulseIndex === idx;
            const isPrecedingContext = selectedTokenIdx >= 0 && idx < selectedTokenIdx;

            const prob = token.probability;
            const glowPx = Math.round(4 + prob * 26);
            const bgOpacity = Math.max(0.15, Math.min(0.9, prob * 1.8));

            return (
              <button
                key={idx}
                onClick={() => onSelectToken(idx)}
                className={`relative group flex flex-col items-center focus:outline-none transition-all duration-300 ${
                  isSelected
                    ? 'scale-125 z-20'
                    : isPulseActive
                    ? 'scale-110 z-15'
                    : isPrecedingContext
                    ? 'opacity-95'
                    : selectedTokenIdx >= 0
                    ? 'opacity-40'
                    : 'opacity-90 hover:opacity-100 hover:scale-105'
                }`}
                title={`Token ${idx}: ${token.cleanToken} (P: ${formatProbability(prob)})`}
              >
                {/* Node Orb */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-xs border transition-all duration-300 ${
                    isSelected
                      ? 'border-cyber-pink bg-cyber-pink text-cyber-bg font-black shadow-neon-lg'
                      : isPulseActive
                      ? 'border-cyber-pink bg-cyber-elevated text-cyber-pink shadow-neon-md'
                      : 'bg-cyber-card/90 text-cyber-primary border-cyber-border hover:border-cyber-pink'
                  }`}
                  style={{
                    boxShadow: isSelected
                      ? `0 0 25px #FF3CAC`
                      : `0 0 ${glowPx}px rgba(255, 60, 172, ${bgOpacity})`,
                  }}
                >
                  <span>{token.cleanToken.slice(0, 4)}</span>
                </div>

                {/* Sub-label with exact probability */}
                <div className="mt-2 text-center font-mono text-[11px] leading-tight">
                  <div
                    className={`font-semibold transition-colors ${
                      isSelected
                        ? 'text-cyber-pink font-bold'
                        : prob > 0.3
                        ? 'text-cyber-pink'
                        : prob > 0.05
                        ? 'text-cyber-magenta'
                        : 'text-cyber-muted'
                    }`}
                  >
                    {formatProbability(prob)}
                  </div>
                  <div className="text-[9px] text-cyber-muted">#{idx}</div>
                </div>

                {/* Pulse wave ring if active */}
                {isPulseActive && (
                  <span className="absolute -inset-2 rounded-2xl border border-cyber-pink/50 animate-ping pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Token Context Inspector Card */}
      {selectedTokenIdx >= 0 && selectedTokenIdx < result.tokens.length && (
        <div className="p-4 rounded-xl bg-cyber-bg/95 border border-cyber-pink/35 text-xs font-mono animate-fadeIn flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-cyber-pink">
              <Eye className="w-3.5 h-3.5" />
              <span className="font-bold">
                NODE #{selectedTokenIdx}: "{result.tokens[selectedTokenIdx].cleanToken}"
              </span>
              <span className="text-cyber-muted">(Token ID: {result.tokens[selectedTokenIdx].tokenId})</span>
            </div>
            <div className="text-cyber-secondary text-[11px]">
              Preceding Context: {result.tokens[selectedTokenIdx].precedingContext.length > 0 ? (
                <span className="text-cyber-primary font-semibold">
                  "{result.tokens[selectedTokenIdx].precedingContext.join('')}"
                </span>
              ) : (
                <span className="text-cyber-muted italic">&lt;|endoftext|&gt; (BOS start)</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div>
              <span className="text-cyber-muted block text-[10px]">CONDITIONAL PROB P</span>
              <span className="text-cyber-pink text-sm font-bold">
                {formatProbability(result.tokens[selectedTokenIdx].probability)}
              </span>
            </div>
            <div>
              <span className="text-cyber-muted block text-[10px]">SURPRISE (-ln P)</span>
              <span className="text-cyber-primary text-sm font-bold">
                {result.tokens[selectedTokenIdx].negLogProb.toFixed(3)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
