import React from 'react';
import { PerplexityResult, TokenPrediction } from '../types/matrix';
import { BarChart3, TrendingUp, HelpCircle, Layers, CheckCircle2 } from 'lucide-react';
import { formatProbability } from '../utils/perplexityMath';

interface ProbabilityMatrixProps {
  result: PerplexityResult;
  selectedTokenIdx: number;
  onSelectToken: (idx: number) => void;
}

export const ProbabilityMatrix: React.FC<ProbabilityMatrixProps> = ({
  result,
  selectedTokenIdx,
  onSelectToken,
}) => {
  const selectedToken =
    selectedTokenIdx >= 0 && selectedTokenIdx < result.tokens.length
      ? result.tokens[selectedTokenIdx]
      : result.tokens[0] || null;

  const graphWidth = 600;
  const graphHeight = 120;
  const paddingX = 40;
  const paddingY = 20;

  const points = result.tokens.map((t, i) => {
    const x =
      result.tokens.length > 1
        ? paddingX + (i / (result.tokens.length - 1)) * (graphWidth - paddingX * 2)
        : graphWidth / 2;
    const y = graphHeight - paddingY - t.probability * (graphHeight - paddingY * 2);
    return { x, y, prob: t.probability, token: t.cleanToken, idx: i };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaD =
    points.length > 0
      ? `${pathD} L ${points[points.length - 1].x} ${graphHeight - paddingY} L ${points[0].x} ${
          graphHeight - paddingY
        } Z`
      : '';

  return (
    <section id="probability-section" className="py-20 px-4 max-w-6xl mx-auto space-y-8">
      {/* Section Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 font-mono text-xs text-cyber-pink tracking-widest uppercase">
          <BarChart3 className="w-3.5 h-3.5 text-cyber-pink" />
          <span>03 / PREDICTION ANALYSIS</span>
        </div>
        <h2 className="font-heading font-bold text-3xl sm:text-5xl text-cyber-primary tracking-tight">
          HOW CERTAIN WAS THE MODEL?
        </h2>
        <p className="text-cyber-secondary text-sm sm:text-base max-w-2xl">
          At each position, DistilGPT-2 assigns a probability distribution over its 50,257 vocabulary tokens. Fluency corresponds to high certainty; unusual words produce probability drops.
        </p>
      </div>

      {/* Probability Curve Overview Graph */}
      <div className="matrix-panel rounded-2xl p-6 border border-cyber-border shadow-neon-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-cyber-muted">
          <span className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyber-pink" />
            <span>TOKEN PROBABILITY TRAJECTORY (0% - 100%)</span>
          </span>
          <span>CLICK POINT TO SELECT TOKEN</span>
        </div>

        {/* SVG Curve */}
        <div className="w-full overflow-x-auto py-2">
          <svg
            viewBox={`0 0 ${graphWidth} ${graphHeight}`}
            className="w-full h-36 min-w-[500px] overflow-visible"
          >
            <defs>
              <linearGradient id="cyberProbAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF3CAC" stopOpacity="0.40" />
                <stop offset="60%" stopColor="#F000FF" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="cyberLineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#FF3CAC" />
                <stop offset="50%" stopColor="#F000FF" />
                <stop offset="100%" stopColor="#B44AFF" />
              </linearGradient>
            </defs>

            {/* Grid line at 50% */}
            <line
              x1={paddingX}
              y1={graphHeight / 2}
              x2={graphWidth - paddingX}
              y2={graphHeight / 2}
              stroke="rgba(255, 60, 172, 0.15)"
              strokeDasharray="4 4"
            />
            <text
              x={paddingX - 10}
              y={graphHeight / 2 + 4}
              fill="#A58BA0"
              fontSize="9"
              fontFamily="JetBrains Mono"
              textAnchor="end"
            >
              50%
            </text>

            {/* Area Fill */}
            {areaD && <path d={areaD} fill="url(#cyberProbAreaGrad)" />}

            {/* Trajectory Line */}
            {pathD && (
              <path
                d={pathD}
                fill="none"
                stroke="url(#cyberLineGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Interactive Points */}
            {points.map((p) => {
              const isSelected = selectedTokenIdx === p.idx;

              return (
                <g
                  key={p.idx}
                  className="cursor-pointer group"
                  onClick={() => onSelectToken(p.idx)}
                >
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isSelected ? 6 : 4}
                    fill={isSelected ? '#FF3CAC' : '#100916'}
                    stroke="#FF3CAC"
                    strokeWidth={isSelected ? 3 : 2}
                    className="transition-all duration-200 group-hover:scale-125"
                  />
                  {/* Point Label */}
                  <text
                    x={p.x}
                    y={p.y - 10}
                    fill={isSelected ? '#FF3CAC' : '#C2AFC3'}
                    fontSize="10"
                    fontFamily="JetBrains Mono"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    textAnchor="middle"
                  >
                    {p.token}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Main Grid: Probability Bars on Left, Alternative Predictions on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Token Probability Breakdown Bars (7 Cols) */}
        <div className="lg:col-span-7 matrix-panel rounded-2xl p-6 border border-cyber-border space-y-4">
          <div className="flex items-center justify-between font-mono text-xs text-cyber-muted border-b border-cyber-border pb-3">
            <span>TOKEN</span>
            <span>PROBABILITY (P)</span>
            <span>SURPRISE (-ln P)</span>
          </div>

          <div className="space-y-3">
            {result.tokens.map((token, idx) => {
              const isSelected = selectedTokenIdx === idx;
              const probPercent = Math.max(0.5, token.probability * 100);

              return (
                <div
                  key={idx}
                  onClick={() => onSelectToken(idx)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all duration-200 space-y-2 ${
                    isSelected
                      ? 'bg-cyber-pink/20 border-cyber-pink shadow-neon-sm'
                      : 'bg-cyber-card/70 border-cyber-border hover:border-cyber-pink/40'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-cyber-muted text-[10px]">#{token.index}</span>
                      <span className="font-bold text-cyber-primary">
                        {token.hasLeadingSpace && <span className="text-cyber-muted">␣</span>}
                        {token.cleanToken}
                      </span>
                    </div>

                    <div className="flex items-center gap-6">
                      <span className="text-cyber-pink font-semibold">
                        {formatProbability(token.probability)}
                      </span>
                      <span className="text-cyber-muted text-[11px]">
                        {token.negLogProb.toFixed(2)} nats
                      </span>
                    </div>
                  </div>

                  {/* Horizontal Bar with Cyberpunk Pink / Magenta Gradient */}
                  <div className="w-full bg-cyber-input h-2 rounded-full overflow-hidden border border-cyber-border/60">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isSelected
                          ? 'bg-gradient-to-r from-cyber-pink via-cyber-magenta to-cyber-purple shadow-neon-sm'
                          : token.probability > 0.3
                          ? 'bg-cyber-pink'
                          : token.probability > 0.05
                          ? 'bg-cyber-magenta'
                          : 'bg-cyber-violet'
                      }`}
                      style={{ width: `${probPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Alternative Candidate Distribution for Selected Token (5 Cols) */}
        <div className="lg:col-span-5 matrix-panel-glow rounded-2xl p-6 border border-cyber-pink/35 space-y-4">
          <div className="border-b border-cyber-border pb-3">
            <span className="font-mono text-xs text-cyber-pink block uppercase tracking-wider">
              ALTERNATIVE NEXT-TOKEN CANDIDATES
            </span>
            <p className="font-heading font-semibold text-sm text-cyber-primary mt-1">
              What else could have followed context #{selectedToken.index}?
            </p>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {selectedToken.topAlternatives.map((alt, i) => {
              const isActualChosen = alt.token.trim() === selectedToken.cleanToken.trim();
              const altPercent = Math.max(1, alt.probability * 100);

              return (
                <div
                  key={i}
                  className={`p-3 rounded-xl border space-y-2 ${
                    isActualChosen
                      ? 'bg-cyber-pink/20 border-cyber-pink shadow-neon-sm'
                      : 'bg-cyber-elevated/80 border-cyber-border'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-cyber-muted">#{i + 1}</span>
                      <span className="font-bold text-cyber-primary">
                        "{alt.token}"
                      </span>
                      {isActualChosen && (
                        <span className="text-[10px] bg-cyber-pink text-cyber-bg px-1.5 py-0.5 rounded font-black">
                          ACTUAL TOKEN
                        </span>
                      )}
                    </div>
                    <span className="text-cyber-pink font-bold">
                      {formatProbability(alt.probability)}
                    </span>
                  </div>

                  <div className="w-full bg-cyber-input h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        isActualChosen
                          ? 'bg-gradient-to-r from-cyber-pink to-cyber-magenta'
                          : 'bg-cyber-violet'
                      }`}
                      style={{ width: `${altPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-lg bg-cyber-bg/90 border border-cyber-border text-[11px] font-mono text-cyber-muted flex items-center gap-2">
            <HelpCircle className="w-3.5 h-3.5 text-cyber-pink flex-shrink-0" />
            <span>
              DistilGPT-2 assigns probabilities to all 50,257 vocabulary tokens summing to exactly 1.0.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
