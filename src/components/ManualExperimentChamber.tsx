import React, { useState, useMemo } from 'react';
import { ManualToken, ManualCalculationResult } from '../types/matrix';
import { Sliders, Plus, Trash2, RotateCcw, Sparkles, AlertCircle, CheckCircle, Calculator, ArrowRight } from 'lucide-react';
import { formatProbability } from '../utils/perplexityMath';

const INITIAL_TOKENS: ManualToken[] = [
  { id: '1', token: 'I', probability: 0.5 },
  { id: '2', token: 'love', probability: 0.8 },
  { id: '3', token: 'Python', probability: 0.2 },
];

export const ManualExperimentChamber: React.FC = () => {
  const [tokens, setTokens] = useState<ManualToken[]>(INITIAL_TOKENS);
  const [errorState, setErrorState] = useState<string | null>(null);

  const applyPresetA = () => {
    setTokens([
      { id: '1', token: 'I', probability: 0.5 },
      { id: '2', token: 'love', probability: 0.8 },
      { id: '3', token: 'Python', probability: 0.2 },
    ]);
    setErrorState(null);
  };

  const applyPresetB = () => {
    setTokens([
      { id: '1', token: 'Token1', probability: 0.125 },
      { id: '2', token: 'Token2', probability: 0.125 },
      { id: '3', token: 'Token3', probability: 0.125 },
      { id: '4', token: 'Token4', probability: 0.125 },
      { id: '5', token: 'Token5', probability: 0.125 },
      { id: '6', token: 'Token6', probability: 0.125 },
      { id: '7', token: 'Token7', probability: 0.125 },
      { id: '8', token: 'Token8', probability: 0.125 },
    ]);
    setErrorState(null);
  };

  const applyPresetC = () => {
    setTokens([
      { id: '1', token: 'The', probability: 0.9 },
      { id: '2', token: 'cat', probability: 0.85 },
      { id: '3', token: 'sat', probability: 0.8 },
      { id: '4', token: 'on', probability: 0.92 },
      { id: '5', token: 'the', probability: 0.95 },
      { id: '6', token: 'banana', probability: 0.002 },
    ]);
    setErrorState(null);
  };

  const handleAddToken = () => {
    if (tokens.length >= 12) {
      setErrorState('Maximum 12 tokens allowed for simulation stability.');
      return;
    }
    const newId = String(Date.now());
    setTokens((prev) => [...prev, { id: newId, token: `word_${prev.length + 1}`, probability: 0.5 }]);
    setErrorState(null);
  };

  const handleRemoveToken = (id: string) => {
    if (tokens.length <= 1) {
      setErrorState('At least one token must exist in the simulation.');
      return;
    }
    setTokens((prev) => prev.filter((t) => t.id !== id));
    setErrorState(null);
  };

  const handleUpdateToken = (id: string, updates: Partial<ManualToken>) => {
    setTokens((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const updated = { ...t, ...updates };
          if (updated.probability !== undefined) {
            updated.probability = Math.max(0.0001, Math.min(1.0, updated.probability));
          }
          return updated;
        }
        return t;
      })
    );
    setErrorState(null);
  };

  const calcResult: ManualCalculationResult = useMemo(() => {
    if (tokens.length === 0) {
      return {
        tokens: [],
        tokenCount: 0,
        reciprocalList: [],
        reciprocalProduct: 1,
        reciprocalProductScientific: '1.0',
        avgNegLogProb: 0,
        perplexity: 1,
        valid: false,
        errorMessage: 'At least one token is required.',
      };
    }

    const invalidToken = tokens.find((t) => !t.token.trim() || t.probability <= 0 || t.probability > 1);
    if (invalidToken) {
      return {
        tokens,
        tokenCount: tokens.length,
        reciprocalList: [],
        reciprocalProduct: 0,
        reciprocalProductScientific: '0',
        avgNegLogProb: 0,
        perplexity: 0,
        valid: false,
        errorMessage: 'All tokens must have names and probabilities in the range (0, 1].',
      };
    }

    const N = tokens.length;
    let logReciprocalSum = 0;
    const reciprocalList = tokens.map((t) => {
      const rec = 1 / t.probability;
      logReciprocalSum += Math.log(rec);
      return rec;
    });

    const avgNegLog = logReciprocalSum / N;
    const perplexity = Math.exp(avgNegLog);

    const log10Val = logReciprocalSum / Math.LN10;
    const exp = Math.floor(log10Val);
    const mant = Math.pow(10, log10Val - exp);
    let reciprocalProductScientific: string;
    if (Math.abs(exp) < 6) {
      reciprocalProductScientific = Math.exp(logReciprocalSum).toLocaleString(undefined, {
        maximumFractionDigits: 2,
        minimumFractionDigits: 1,
      });
    } else {
      reciprocalProductScientific = `${mant.toFixed(3)} × 10^${exp}`;
    }

    return {
      tokens,
      tokenCount: N,
      reciprocalList,
      reciprocalProduct: Math.exp(logReciprocalSum),
      reciprocalProductScientific,
      avgNegLogProb: avgNegLog,
      perplexity,
      valid: true,
    };
  }, [tokens]);

  return (
    <section id="manual-section" className="py-20 px-4 max-w-6xl mx-auto space-y-8">
      {/* Section Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-cyber-pink tracking-widest uppercase">
            <Sliders className="w-3.5 h-3.5 text-cyber-pink" />
            <span>05 / MANUAL SIMULATION</span>
          </div>
          <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-cyber-purple/15 border border-cyber-purple/40 text-cyber-pink">
            SIMULATED — NOT FROM THE MODEL
          </span>
        </div>
        <h2 className="font-heading font-bold text-3xl sm:text-5xl text-cyber-primary tracking-tight">
          TAKE CONTROL OF PROBABILITY.
        </h2>
        <p className="text-cyber-secondary text-sm sm:text-base max-w-2xl">
          What happens when you change the probability of a token? Experiment with custom values and watch the reciprocal geometric mean update live.
        </p>
      </div>

      {/* Preset selector bar */}
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl matrix-panel border border-cyber-border font-mono text-xs">
        <span className="text-cyber-muted flex items-center gap-1.5 mr-2">
          <Sparkles className="w-3.5 h-3.5 text-cyber-pink" />
          <span>LOAD PRESET:</span>
        </span>
        <button
          onClick={applyPresetA}
          className="px-3 py-1.5 rounded-lg bg-cyber-elevated border border-cyber-border hover:border-cyber-pink text-cyber-primary hover:text-cyber-pink transition-colors"
        >
          PRESET A: "I love Python" (0.5, 0.8, 0.2)
        </button>
        <button
          onClick={applyPresetB}
          className="px-3 py-1.5 rounded-lg bg-cyber-elevated border border-cyber-border hover:border-cyber-pink text-cyber-primary hover:text-cyber-pink transition-colors"
        >
          PRESET B: Equal 8 Tokens (P = 0.125 → PPL 8.0)
        </button>
        <button
          onClick={applyPresetC}
          className="px-3 py-1.5 rounded-lg bg-cyber-elevated border border-cyber-border hover:border-cyber-pink text-cyber-primary hover:text-cyber-pink transition-colors"
        >
          PRESET C: One Surprising Word (Cat on banana)
        </button>
      </div>

      {/* Main Grid: Token Editor (7 Cols) and Live Math Reveal (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Token Table & Sliders (7 Cols) */}
        <div className="lg:col-span-7 matrix-panel rounded-2xl p-6 border border-cyber-border space-y-5">
          <div className="flex items-center justify-between border-b border-cyber-border pb-3">
            <div className="font-mono text-xs text-cyber-muted">
              TOKEN PROBABILITY EDITOR ({tokens.length} TOKENS)
            </div>
            <button
              onClick={handleAddToken}
              className="matrix-btn-secondary px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-cyber-pink" />
              <span>ADD TOKEN</span>
            </button>
          </div>

          {errorState && (
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorState}</span>
            </div>
          )}

          {/* Tokens Table */}
          <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
            {tokens.map((token, idx) => (
              <div
                key={token.id}
                className="p-3.5 rounded-xl bg-cyber-elevated/90 border border-cyber-border hover:border-cyber-pink/40 transition-colors space-y-2.5 font-mono text-xs"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-cyber-muted text-[10px]">#{idx + 1}</span>
                    <input
                      type="text"
                      value={token.token}
                      onChange={(e) => handleUpdateToken(token.id, { token: e.target.value })}
                      placeholder="Token name"
                      className="bg-cyber-input px-2.5 py-1 rounded border border-cyber-border text-cyber-primary font-bold focus:border-cyber-pink focus:outline-none w-32"
                    />
                  </div>

                  {/* Number Input & Reciprocal */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <span className="text-cyber-muted text-[10px]">P:</span>
                      <input
                        type="number"
                        min="0.001"
                        max="1.0"
                        step="0.01"
                        value={token.probability}
                        onChange={(e) =>
                          handleUpdateToken(token.id, { probability: parseFloat(e.target.value) || 0.01 })
                        }
                        className="bg-cyber-input px-2 py-1 rounded border border-cyber-border text-cyber-pink font-bold w-20 text-right focus:border-cyber-pink focus:outline-none"
                      />
                    </div>

                    <div className="text-[11px] text-cyber-muted w-20 text-right" title="Reciprocal odds (1 / P)">
                      1/P: <span className="text-cyber-primary font-semibold">{(1 / token.probability).toFixed(1)}</span>
                    </div>

                    <button
                      onClick={() => handleRemoveToken(token.id)}
                      className="p-1.5 rounded hover:bg-cyber-input text-cyber-muted hover:text-red-400 transition-colors"
                      title="Delete token"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Cyberpunk Pink Slider */}
                <input
                  type="range"
                  min="0.005"
                  max="1.0"
                  step="0.005"
                  value={token.probability}
                  onChange={(e) =>
                    handleUpdateToken(token.id, { probability: parseFloat(e.target.value) })
                  }
                  className="w-full accent-[#FF3CAC] bg-cyber-input h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Live Calculation Panel (5 Cols) */}
        <div className="lg:col-span-5 matrix-panel-glow rounded-2xl p-6 border border-cyber-pink/35 space-y-6">
          <div className="border-b border-cyber-border pb-3">
            <span className="font-mono text-xs text-cyber-pink block uppercase tracking-wider">
              STEP-BY-STEP CALCULATION
            </span>
            <div className="text-xs text-cyber-muted font-mono mt-0.5">
              FORMULA: PPL = ( ∏ (1/P_i) )^(1/N)
            </div>
          </div>

          {calcResult.valid ? (
            <div className="space-y-4 font-mono text-xs">
              {/* Step 1 */}
              <div className="p-3.5 rounded-xl bg-cyber-card/90 border border-cyber-border space-y-1">
                <span className="text-cyber-pink text-[10px] block font-bold">
                  STEP 01: MULTIPLY RECIPROCALS
                </span>
                <p className="text-cyber-muted text-[11px]">
                  ∏ (1 / P_i) = {calcResult.reciprocalList.map((r) => r.toFixed(1)).join(' × ')}
                </p>
                <div className="text-cyber-primary font-bold text-sm">
                  = {calcResult.reciprocalProductScientific}
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-3.5 rounded-xl bg-cyber-card/90 border border-cyber-border space-y-1">
                <span className="text-cyber-purple text-[10px] block font-bold">
                  STEP 02: COUNT TOKENS
                </span>
                <div className="text-cyber-primary font-bold text-sm">
                  N = {calcResult.tokenCount} tokens
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-3.5 rounded-xl bg-cyber-card/90 border border-cyber-border space-y-1">
                <span className="text-cyber-muted text-[10px] block font-bold">
                  STEP 03: TAKE THE N-TH ROOT
                </span>
                <div className="text-cyber-primary font-bold text-sm">
                  ({calcResult.reciprocalProductScientific})^(1/{calcResult.tokenCount})
                </div>
              </div>

              {/* Step 4: Big Score */}
              <div className="p-5 rounded-xl bg-cyber-bg border border-cyber-pink text-center space-y-2 shadow-neon-sm">
                <span className="text-[10px] text-cyber-muted uppercase tracking-wider block">
                  STEP 04: RESULTING PERPLEXITY
                </span>
                <div className="font-heading font-black text-5xl text-cyber-pink matrix-glow-text">
                  {calcResult.perplexity.toFixed(3)}
                </div>
                <p className="text-[11px] text-cyber-muted max-w-xs mx-auto">
                  Equivalent to choosing uniformly among {calcResult.perplexity.toFixed(2)} options.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs">
              {calcResult.errorMessage}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
