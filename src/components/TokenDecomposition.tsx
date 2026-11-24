import React, { useState } from 'react';
import { PerplexityResult, TokenPrediction } from '../types/matrix';
import { Database, Eye, Code, ChevronRight, Info, Layers, Tag } from 'lucide-react';
import { formatProbability } from '../utils/perplexityMath';

interface TokenDecompositionProps {
  result: PerplexityResult;
  selectedTokenIdx: number;
  onSelectToken: (idx: number) => void;
}

export const TokenDecomposition: React.FC<TokenDecompositionProps> = ({
  result,
  selectedTokenIdx,
  onSelectToken,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const selectedToken =
    selectedTokenIdx >= 0 && selectedTokenIdx < result.tokens.length
      ? result.tokens[selectedTokenIdx]
      : result.tokens[0] || null;

  const activeToken = hoveredIdx !== null ? result.tokens[hoveredIdx] : selectedToken;

  return (
    <section id="decomposition-section" className="py-20 px-4 max-w-6xl mx-auto space-y-8">
      {/* Section Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 font-mono text-xs text-cyber-pink tracking-widest uppercase">
          <Database className="w-3.5 h-3.5 text-cyber-pink" />
          <span>02 / TOKEN DECOMPOSITION</span>
        </div>
        <h2 className="font-heading font-bold text-3xl sm:text-5xl text-cyber-primary tracking-tight">
          LANGUAGE IS DATA.
        </h2>
        <p className="text-cyber-secondary text-sm sm:text-base max-w-2xl">
          Language models do not see words or letters. They partition raw text into discrete Byte-Pair Encoding (BPE) subword tokens mapped to numerical vectors.
        </p>
      </div>

      {/* Main Grid: Horizontal Stream on Top, Detail Panel Below */}
      <div className="space-y-6">
        {/* Token Stream Container */}
        <div className="matrix-panel rounded-2xl p-6 border border-cyber-border shadow-neon-sm space-y-4">
          <div className="flex items-center justify-between font-mono text-xs text-cyber-muted">
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyber-pink" />
              <span>INTERACTIVE TOKEN SEQUENCE ({result.tokens.length} TOKENS)</span>
            </span>
            <span>CLICK ANY TOKEN FOR DEEP INSPECTION</span>
          </div>

          {/* Horizontal scrollable tokens row */}
          <div className="flex items-center gap-3 overflow-x-auto pb-4 pt-2">
            {result.tokens.map((token, idx) => {
              const isSelected = selectedTokenIdx === idx;
              const isHovered = hoveredIdx === idx;

              return (
                <button
                  key={idx}
                  onClick={() => onSelectToken(idx)}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className={`flex-shrink-0 text-left px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none ${
                    isSelected
                      ? 'bg-cyber-pink/25 border-cyber-pink shadow-neon-md scale-105'
                      : isHovered
                      ? 'bg-cyber-elevated border-cyber-pink/60 text-cyber-pink shadow-neon-sm'
                      : 'bg-cyber-elevated/80 border-cyber-border text-cyber-primary hover:border-cyber-pink/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 text-[10px] font-mono text-cyber-muted mb-1">
                    <span>#{token.index}</span>
                    <span className="text-cyber-purple">ID:{token.tokenId}</span>
                  </div>

                  <div className="font-mono font-bold text-base sm:text-lg flex items-center">
                    {token.hasLeadingSpace && (
                      <span className="text-cyber-muted text-xs mr-0.5 select-none" title="Preceding space">
                        ␣
                      </span>
                    )}
                    <span>{token.cleanToken}</span>
                  </div>

                  <div className="mt-2 pt-1.5 border-t border-cyber-border/50 text-[11px] font-mono flex items-center justify-between">
                    <span className="text-cyber-muted">P:</span>
                    <span className={token.probability > 0.2 ? 'text-cyber-pink font-bold' : 'text-cyber-primary'}>
                      {formatProbability(token.probability)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Context pill preview for hovered/active token */}
          {activeToken && (
            <div className="p-3 rounded-lg bg-cyber-bg/80 border border-cyber-border font-mono text-xs flex items-center gap-2 text-cyber-muted">
              <Info className="w-3.5 h-3.5 text-cyber-pink flex-shrink-0" />
              <span>Context for #{activeToken.index} ("{activeToken.cleanToken}"):</span>
              <span className="text-cyber-primary font-semibold truncate">
                {activeToken.precedingContext.length > 0
                  ? `[${activeToken.precedingContext.map((c) => `"${c}"`).join(', ')}]`
                  : '<|endoftext|> (BOS)'}
              </span>
            </div>
          )}
        </div>

        {/* Selected Token Detail Panel */}
        {selectedToken && (
          <div className="matrix-panel-glow rounded-2xl p-6 sm:p-8 border border-cyber-pink/35 shadow-neon-md">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyber-border pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyber-pink/15 border border-cyber-pink/40 flex items-center justify-center font-mono font-bold text-cyber-pink text-lg shadow-neon-sm">
                  {selectedToken.cleanToken.slice(0, 2)}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-xl text-cyber-primary flex items-center gap-2">
                    <span>TOKEN #{selectedToken.index}:</span>
                    <span className="text-cyber-pink font-mono">
                      "{selectedToken.token}"
                    </span>
                  </h3>
                  <p className="font-mono text-xs text-cyber-muted">
                    DISTILGPT-2 BPE VOCABULARY METRICS
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="matrix-tag">POSITION: {selectedToken.index} OF {result.tokenCount - 1}</span>
                <span className="matrix-tag">VOCAB ID: {selectedToken.tokenId}</span>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
              {/* Metric 1 */}
              <div className="bg-cyber-card/90 p-4 rounded-xl border border-cyber-border space-y-1">
                <span className="text-cyber-muted text-[10px] block uppercase">
                  CONDITIONAL PROBABILITY P(t_i | context)
                </span>
                <div className="text-2xl font-bold text-cyber-pink">
                  {formatProbability(selectedToken.probability)}
                </div>
                <p className="text-[11px] text-cyber-muted">
                  Likelihood assigned to this token given preceding text.
                </p>
              </div>

              {/* Metric 2 */}
              <div className="bg-cyber-card/90 p-4 rounded-xl border border-cyber-border space-y-1">
                <span className="text-cyber-muted text-[10px] block uppercase">
                  NEGATIVE LOG PROB (-ln P)
                </span>
                <div className="text-2xl font-bold text-cyber-primary">
                  {selectedToken.negLogProb.toFixed(4)}
                </div>
                <p className="text-[11px] text-cyber-muted">
                  Surprise factor (cross-entropy contribution in nats).
                </p>
              </div>

              {/* Metric 3 */}
              <div className="bg-cyber-card/90 p-4 rounded-xl border border-cyber-border space-y-1">
                <span className="text-cyber-muted text-[10px] block uppercase">
                  RECIPROCAL (1 / P)
                </span>
                <div className="text-2xl font-bold text-cyber-purple">
                  {(1 / Math.max(selectedToken.probability, 1e-15)).toLocaleString(undefined, {
                    maximumFractionDigits: 1,
                  })}
                </div>
                <p className="text-[11px] text-cyber-muted">
                  1-in-N odds of picking this token at random.
                </p>
              </div>

              {/* Metric 4 */}
              <div className="bg-cyber-card/90 p-4 rounded-xl border border-cyber-border space-y-1">
                <span className="text-cyber-muted text-[10px] block uppercase">
                  PRE-SPACE / BYTE PREFIX
                </span>
                <div className="text-2xl font-bold text-cyber-primary">
                  {selectedToken.hasLeadingSpace ? 'YES (Ġ byte)' : 'NONE (raw)'}
                </div>
                <p className="text-[11px] text-cyber-muted">
                  GPT-2 encodes word boundaries with a leading space byte.
                </p>
              </div>
            </div>

            {/* Preceding Context Breakdown */}
            <div className="mt-6 p-4 rounded-xl bg-cyber-bg/90 border border-cyber-border font-mono text-xs space-y-2">
              <span className="text-cyber-muted block text-[10px] uppercase">
                CONDITIONING HISTORY (CAUSAL CONTEXT WINDOW)
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-1 rounded bg-cyber-card border border-cyber-border text-cyber-muted">
                  &lt;|endoftext|&gt; [50256]
                </span>
                {selectedToken.precedingContext.map((c, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 rounded bg-cyber-card border border-cyber-border text-cyber-secondary"
                  >
                    "{c}"
                  </span>
                ))}
                <span className="text-cyber-pink font-bold">→</span>
                <span className="px-2 py-1 rounded bg-cyber-pink/20 border border-cyber-pink text-cyber-pink font-bold">
                  "{selectedToken.token}" (Target)
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
