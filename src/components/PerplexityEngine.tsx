import React, { useState } from 'react';
import { PerplexityResult } from '../types/matrix';
import { Calculator, Sparkles, ChevronRight, Check, ArrowRight, HelpCircle } from 'lucide-react';
import { formatProbability } from '../utils/perplexityMath';

interface PerplexityEngineProps {
  result: PerplexityResult;
}

export const PerplexityEngine: React.FC<PerplexityEngineProps> = ({ result }) => {
  const [activeStage, setActiveStage] = useState<number>(5);

  const stages = [
    {
      num: 1,
      title: 'TOKEN PROBABILITIES',
      subtitle: 'Extract P(t_i | t_<i)',
      desc: 'Retrieve all conditional next-token probabilities calculated by the model forward pass.',
    },
    {
      num: 2,
      title: 'NEGATIVE LOGARITHM',
      subtitle: '-ln P(t_i)',
      desc: 'Convert probabilities into "surprise" or information content (cross-entropy in nats).',
    },
    {
      num: 3,
      title: 'CROSS-ENTROPY AVERAGE',
      subtitle: 'Loss = 1/N × Σ (-ln P)',
      desc: 'Compute the mean surprise across all tokens in the sequence.',
    },
    {
      num: 4,
      title: 'EXPONENTIAL FUNCTION',
      subtitle: 'PPL = exp(Loss)',
      desc: 'Apply the natural exponential to map the loss back to the branching factor of equivalent choices.',
    },
    {
      num: 5,
      title: 'FINAL PERPLEXITY',
      subtitle: 'PPL = Geometric Mean',
      desc: 'The final quantified measure of model uncertainty for this exact sentence.',
    },
  ];

  return (
    <section id="uncertainty-section" className="py-20 px-4 max-w-6xl mx-auto space-y-8">
      {/* Section Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 font-mono text-xs text-cyber-pink tracking-widest uppercase">
          <Calculator className="w-3.5 h-3.5 text-cyber-pink" />
          <span>04 / UNCERTAINTY ENGINE</span>
        </div>
        <h2 className="font-heading font-bold text-3xl sm:text-5xl text-cyber-primary tracking-tight">
          TURN UNCERTAINTY INTO A NUMBER.
        </h2>
        <p className="text-cyber-secondary text-sm sm:text-base max-w-2xl">
          Perplexity is the formal exponentiated cross-entropy of a language model on a text sequence. It translates abstract log-likelihoods into an intuitive branching factor.
        </p>
      </div>

      {/* Formula Showcase Banner */}
      <div className="matrix-panel rounded-2xl p-6 sm:p-8 border border-cyber-border text-center space-y-3 shadow-neon-sm">
        <span className="font-mono text-xs text-cyber-muted uppercase tracking-wider block">
          MATHEMATICAL DEFINITION
        </span>
        <div className="font-mono text-lg sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-cyber-pink via-cyber-magenta to-cyber-purple font-bold tracking-wider matrix-glow-text py-2">
          Perplexity = exp( - 1/N × ∑ log P( token_i | previous tokens ) )
        </div>
        <p className="font-mono text-xs text-cyber-muted max-w-xl mx-auto">
          Equivalently: the geometric mean of the reciprocal token probabilities ( ∏ (1/P_i) )^(1/N).
        </p>
      </div>

      {/* Step-by-Step Interactive Calculation Stages */}
      <div className="space-y-6">
        {/* Stage Navigation Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {stages.map((st) => (
            <button
              key={st.num}
              onClick={() => setActiveStage(st.num)}
              className={`p-3 rounded-xl font-mono text-xs text-left border transition-all duration-200 ${
                activeStage === st.num
                  ? 'bg-cyber-pink/20 border-cyber-pink text-cyber-pink shadow-neon-sm'
                  : 'bg-cyber-elevated/80 border-cyber-border hover:border-cyber-pink/40 text-cyber-secondary'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold">STEP 0{st.num}</span>
                {activeStage === st.num && <Sparkles className="w-3 h-3 text-cyber-pink" />}
              </div>
              <div className="font-semibold text-cyber-primary truncate">{st.title}</div>
            </button>
          ))}
        </div>

        {/* Stage Content Panel */}
        <div className="matrix-panel-glow rounded-2xl p-6 sm:p-8 border border-cyber-pink/35 shadow-neon-md">
          {/* STEP 1: TOKEN PROBABILITIES */}
          {activeStage === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-cyber-border pb-4">
                <span className="font-mono text-xs text-cyber-pink block uppercase">STEP 01</span>
                <h3 className="font-heading font-bold text-2xl text-cyber-primary mt-1">
                  RETRIEVE CONDITIONAL TOKEN PROBABILITIES
                </h3>
                <p className="font-mono text-xs text-cyber-muted mt-1">
                  At each step i, the model computes logits over all 50,257 tokens and outputs P(t_i | t_&lt;i).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
                {result.tokens.map((t, idx) => (
                  <div key={idx} className="bg-cyber-card/90 p-3.5 rounded-xl border border-cyber-border space-y-1">
                    <div className="flex justify-between text-cyber-muted text-[10px]">
                      <span>TOKEN #{idx}</span>
                      <span>ID:{t.tokenId}</span>
                    </div>
                    <div className="text-sm font-bold text-cyber-primary">"{t.token}"</div>
                    <div className="text-cyber-pink font-semibold">{formatProbability(t.probability)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: NEGATIVE LOG PROBABILITIES */}
          {activeStage === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-cyber-border pb-4">
                <span className="font-mono text-xs text-cyber-pink block uppercase">STEP 02</span>
                <h3 className="font-heading font-bold text-2xl text-cyber-primary mt-1">
                  CALCULATE NEGATIVE LOGARITHMS (-ln P)
                </h3>
                <p className="font-mono text-xs text-cyber-muted mt-1">
                  Taking the negative natural logarithm converts probability to information entropy (surprise).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
                {result.tokens.map((t, idx) => (
                  <div key={idx} className="bg-cyber-card/90 p-3.5 rounded-xl border border-cyber-border space-y-1">
                    <div className="flex justify-between text-cyber-muted text-[10px]">
                      <span>TOKEN #{idx}</span>
                      <span>P: {formatProbability(t.probability)}</span>
                    </div>
                    <div className="text-sm font-bold text-cyber-primary">"{t.token}"</div>
                    <div className="text-cyber-purple font-bold">
                      -ln({t.probability.toFixed(4)}) = {t.negLogProb.toFixed(3)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: AVERAGE NEGATIVE LOG PROB */}
          {activeStage === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-cyber-border pb-4">
                <span className="font-mono text-xs text-cyber-pink block uppercase">STEP 03</span>
                <h3 className="font-heading font-bold text-2xl text-cyber-primary mt-1">
                  AVERAGE CROSS-ENTROPY LOSS
                </h3>
                <p className="font-mono text-xs text-cyber-muted mt-1">
                  Sum all negative log probabilities and divide by token count N = {result.tokenCount}.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-cyber-bg/90 border border-cyber-border font-mono text-xs space-y-3">
                <div className="text-cyber-muted">
                  Sum of Negative Log Probabilities:
                </div>
                <div className="text-cyber-primary font-semibold text-sm">
                  {result.tokens.map((t) => t.negLogProb.toFixed(2)).join(' + ')} ={' '}
                  <span className="text-cyber-pink font-bold">{result.totalNegLogProb.toFixed(3)}</span>
                </div>
                <div className="pt-2 border-t border-cyber-border text-cyber-secondary flex items-center justify-between text-sm">
                  <span>Average (Loss = Total / {result.tokenCount}):</span>
                  <span className="text-cyber-pink text-lg font-bold">
                    {result.avgNegLogProb.toFixed(4)} nats/token
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: EXPONENTIAL */}
          {activeStage === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-cyber-border pb-4">
                <span className="font-mono text-xs text-cyber-pink block uppercase">STEP 04</span>
                <h3 className="font-heading font-bold text-2xl text-cyber-primary mt-1">
                  APPLY EXPONENTIAL OPERATOR
                </h3>
                <p className="font-mono text-xs text-cyber-muted mt-1">
                  Invert the natural logarithm via exp(Loss) to translate loss into perplexity.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-cyber-bg/90 border border-cyber-border font-mono text-center space-y-4">
                <div className="text-sm text-cyber-muted">
                  exp( {result.avgNegLogProb.toFixed(4)} )
                </div>
                <div className="text-4xl sm:text-6xl font-heading font-black text-transparent bg-clip-text bg-gradient-to-r from-cyber-pink to-cyber-magenta matrix-glow-text">
                  = {result.perplexity.toFixed(3)}
                </div>
                <p className="text-xs text-cyber-muted max-w-lg mx-auto">
                  This undoes the log space operation, turning loss back into the geometric mean of 1/P.
                </p>
              </div>
            </div>
          )}

          {/* STEP 5: FINAL SCORE SUMMARY */}
          {activeStage === 5 && (
            <div className="space-y-8 animate-fadeIn">
              <div className="text-center space-y-3">
                <span className="font-mono text-xs text-cyber-muted tracking-widest uppercase">
                  DETERMINED PERPLEXITY
                </span>
                <div className="font-heading font-black text-6xl sm:text-8xl text-transparent bg-clip-text bg-gradient-to-b from-[#FFF1FA] via-[#FF3CAC] to-[#B44AFF] matrix-glow-text tracking-tight">
                  {result.perplexity.toFixed(3)}
                </div>
                <p className="max-w-xl mx-auto text-sm sm:text-base text-cyber-primary font-normal leading-relaxed">
                  "On average, the model behaves as though it were choosing between approximately{' '}
                  <strong className="text-cyber-pink font-mono">{result.perplexity.toFixed(3)}</strong>{' '}
                  equally likely options at each token position."
                </p>
              </div>

              {/* Comprehensive Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs pt-4 border-t border-cyber-border">
                <div className="bg-cyber-card/85 p-3.5 rounded-xl border border-cyber-border">
                  <span className="text-cyber-muted text-[10px] block">TOTAL TOKENS (N)</span>
                  <span className="text-cyber-primary text-base font-bold">{result.tokenCount}</span>
                </div>
                <div className="bg-cyber-card/85 p-3.5 rounded-xl border border-cyber-border">
                  <span className="text-cyber-muted text-[10px] block">PRODUCT OF 1/P</span>
                  <span className="text-cyber-purple text-base font-bold truncate">
                    {result.reciprocalProductScientific}
                  </span>
                </div>
                <div className="bg-cyber-card/85 p-3.5 rounded-xl border border-cyber-border">
                  <span className="text-cyber-muted text-[10px] block">AVG CROSS-ENTROPY</span>
                  <span className="text-cyber-primary text-base font-bold">
                    {result.avgNegLogProb.toFixed(3)}
                  </span>
                </div>
                <div className="bg-cyber-card/85 p-3.5 rounded-xl border border-cyber-border">
                  <span className="text-cyber-muted text-[10px] block">INFERENCE LATENCY</span>
                  <span className="text-cyber-pink text-base font-bold">
                    {result.inferenceTimeMs} ms
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
