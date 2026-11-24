import React, { useState, useEffect, useRef } from 'react';
import { PerplexityResult } from '../types/matrix';
import { Compass, Activity } from 'lucide-react';
import { formatProbability } from '../utils/perplexityMath';

interface MatrixLabProps {
  result: PerplexityResult;
  selectedTokenIdx: number;
  onSelectToken: (idx: number) => void;
}

type ViewMode = 'network' | 'radar' | 'stream';

export const MatrixLab: React.FC<MatrixLabProps> = ({
  result,
  selectedTokenIdx,
  onSelectToken,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('network');
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let animId: number;
    const rotate = () => {
      setRotationAngle((prev) => (prev + 0.005) % (Math.PI * 2));
      animId = requestAnimationFrame(rotate);
    };
    animId = requestAnimationFrame(rotate);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Canvas visual rendering in Cyberpunk Pink / Magenta
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    const height = (canvas.height = 360);
    const centerX = width / 2;
    const centerY = height / 2;

    const tokens = result.tokens;
    const count = tokens.length;

    let tick = 0;

    const renderLab = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // Cyber grid background in lab in subtle pink
      ctx.strokeStyle = 'rgba(255, 60, 172, 0.035)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      if (viewMode === 'network' || viewMode === 'stream') {
        const nodePositions = tokens.map((t, i) => {
          if (viewMode === 'network') {
            const angle = rotationAngle + (i / count) * Math.PI * 2;
            const radius = Math.min(width, height) * 0.35;
            return {
              x: centerX + Math.cos(angle) * radius,
              y: centerY + Math.sin(angle) * (radius * 0.65),
              token: t,
              idx: i,
            };
          } else {
            const step = (width - 120) / Math.max(1, count - 1);
            const x = 60 + i * step;
            const y = centerY + Math.sin(tick * 0.03 + i * 0.8) * 35;
            return { x, y, token: t, idx: i };
          }
        });

        // Draw connections
        ctx.strokeStyle = 'rgba(240, 0, 255, 0.20)';
        ctx.lineWidth = 1.5;
        for (let i = 0; i < nodePositions.length - 1; i++) {
          const p1 = nodePositions[i];
          const p2 = nodePositions[i + 1];

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();

          // Flowing data particle along line in neon pink
          const frac = (tick * 0.02 + i * 0.3) % 1;
          const px = p1.x + (p2.x - p1.x) * frac;
          const py = p1.y + (p2.y - p1.y) * frac;

          ctx.fillStyle = '#FF3CAC';
          ctx.shadowColor = '#FF3CAC';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw nodes
        nodePositions.forEach((np) => {
          const isSelected = selectedTokenIdx === np.idx;
          const prob = np.token.probability;
          const nodeRadius = 8 + prob * 12;

          ctx.fillStyle = isSelected ? '#FF3CAC' : '#140D1B';
          ctx.strokeStyle = '#FF3CAC';
          ctx.lineWidth = isSelected ? 3 : 1.5;
          ctx.shadowColor = '#FF3CAC';
          ctx.shadowBlur = isSelected ? 20 : 6;

          ctx.beginPath();
          ctx.arc(np.x, np.y, nodeRadius, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.font = '11px "JetBrains Mono", monospace';
          ctx.fillStyle = isSelected ? '#FF3CAC' : '#FFF1FA';
          ctx.shadowBlur = 0;
          ctx.textAlign = 'center';
          ctx.fillText(np.token.cleanToken, np.x, np.y - nodeRadius - 5);
        });
      } else if (viewMode === 'radar') {
        const maxRadius = Math.min(width, height) * 0.38;

        // Draw concentric circles in purple/pink
        [0.25, 0.5, 0.75, 1.0].forEach((r) => {
          ctx.strokeStyle = 'rgba(255, 60, 172, 0.12)';
          ctx.beginPath();
          ctx.arc(centerX, centerY, maxRadius * r, 0, Math.PI * 2);
          ctx.stroke();
        });

        // Polygon of actual token probabilities
        ctx.beginPath();
        const radarPoints = tokens.map((t, i) => {
          const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
          const r = Math.max(0.08, t.probability) * maxRadius;
          return {
            x: centerX + Math.cos(angle) * r,
            y: centerY + Math.sin(angle) * r,
            token: t,
            idx: i,
          };
        });

        radarPoints.forEach((rp, i) => {
          if (i === 0) ctx.moveTo(rp.x, rp.y);
          else ctx.lineTo(rp.x, rp.y);
        });
        ctx.closePath();

        ctx.fillStyle = 'rgba(255, 60, 172, 0.22)';
        ctx.fill();
        ctx.strokeStyle = '#FF3CAC';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#FF3CAC';
        ctx.shadowBlur = 12;
        ctx.stroke();

        // Node dots
        radarPoints.forEach((rp) => {
          ctx.fillStyle = selectedTokenIdx === rp.idx ? '#FF3CAC' : '#FFF1FA';
          ctx.beginPath();
          ctx.arc(rp.x, rp.y, 4, 0, Math.PI * 2);
          ctx.fill();

          ctx.font = '10px "JetBrains Mono", monospace';
          ctx.fillStyle = '#C2AFC3';
          ctx.shadowBlur = 0;
          ctx.fillText(rp.token.cleanToken, rp.x, rp.y - 8);
        });
      }

      animId = requestAnimationFrame(renderLab);
    };

    renderLab();
    return () => cancelAnimationFrame(animId);
  }, [viewMode, result.tokens, selectedTokenIdx, rotationAngle]);

  return (
    <section id="lab-section" className="py-20 px-4 max-w-6xl mx-auto space-y-8">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-cyber-pink tracking-widest uppercase">
            <Compass className="w-3.5 h-3.5 text-cyber-pink" />
            <span>06 / MATRIX LAB</span>
          </div>
          <h2 className="font-heading font-bold text-3xl sm:text-5xl text-cyber-primary tracking-tight">
            INTERACTIVE VISUALIZATION ENVIRONMENT.
          </h2>
          <p className="text-cyber-secondary text-sm sm:text-base max-w-2xl">
            Inspect the live vector topology and probability manifolds generated by DistilGPT-2.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-cyber-card border border-cyber-border font-mono text-xs">
          <button
            onClick={() => setViewMode('network')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              viewMode === 'network'
                ? 'bg-cyber-pink text-cyber-bg font-bold shadow-neon-sm'
                : 'text-cyber-secondary hover:text-cyber-primary'
            }`}
          >
            ORBIT TOPOLOGY
          </button>
          <button
            onClick={() => setViewMode('stream')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              viewMode === 'stream'
                ? 'bg-cyber-pink text-cyber-bg font-bold shadow-neon-sm'
                : 'text-cyber-secondary hover:text-cyber-primary'
            }`}
          >
            CAUSAL STREAM
          </button>
          <button
            onClick={() => setViewMode('radar')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              viewMode === 'radar'
                ? 'bg-cyber-pink text-cyber-bg font-bold shadow-neon-sm'
                : 'text-cyber-secondary hover:text-cyber-primary'
            }`}
          >
            PROBABILITY RADAR
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="matrix-panel-glow rounded-3xl p-6 sm:p-8 border border-cyber-pink/35 shadow-neon-md relative overflow-hidden">
        {/* Top Info Bar */}
        <div className="flex items-center justify-between border-b border-cyber-border pb-4 mb-4 font-mono text-xs text-cyber-muted">
          <span className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyber-magenta animate-pulse" />
            <span>LIVE COMPUTATIONAL VIEWPORT // MODE: {viewMode.toUpperCase()}</span>
          </span>
          <span>{result.tokenCount} NODES RENDERED</span>
        </div>

        {/* Canvas */}
        <div className="relative min-h-[360px] flex items-center justify-center">
          <canvas ref={canvasRef} className="w-full h-[360px] block" />
        </div>

        {/* Bottom Interactive Token Selector */}
        <div className="mt-4 pt-4 border-t border-cyber-border flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <span className="text-cyber-muted mr-1">SELECT TOKEN:</span>
            {result.tokens.map((t, idx) => (
              <button
                key={idx}
                onClick={() => onSelectToken(idx)}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
                  selectedTokenIdx === idx
                    ? 'bg-cyber-pink text-cyber-bg font-bold shadow-neon-sm'
                    : 'bg-cyber-card text-cyber-primary hover:bg-cyber-elevated border border-cyber-border'
                }`}
              >
                #{idx} {t.cleanToken}
              </button>
            ))}
          </div>

          <div className="text-cyber-pink text-[11px]">
            ACTIVE: #{selectedTokenIdx} ("{result.tokens[selectedTokenIdx]?.cleanToken}")
          </div>
        </div>
      </div>
    </section>
  );
};
