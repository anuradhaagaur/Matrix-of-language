import React, { useState } from 'react';
import { BookOpen, CheckCircle2, AlertTriangle } from 'lucide-react';

export const SystemExplained: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const cards = [
    {
      id: 1,
      title: 'WHAT IS A TOKEN?',
      subtitle: 'The Atoms of Machine Language',
      summary:
        'Language models do not process whole sentences or raw letters. Instead, a tokenizer cuts text into discrete chunks called tokens using Byte-Pair Encoding (BPE).',
      points: [
        'A token can be a full word ("love"), a subword ("trans" + "form"), or punctuation (".").',
        'In GPT-2 and DistilGPT-2, leading spaces before words are encoded with a special byte (Ġ), distinguishing " apple" from "apple".',
        'DistilGPT-2 has a fixed vocabulary of 50,257 tokens, each mapped to a unique integer ID.',
      ],
      interactiveDemo: (
        <div className="p-4 rounded-xl bg-cyber-bg/90 border border-cyber-border space-y-2 font-mono text-xs">
          <div className="text-cyber-muted text-[10px] uppercase">Interactive BPE Token Breakdown:</div>
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="px-2.5 py-1 rounded bg-cyber-elevated border border-cyber-pink text-cyber-pink">
              [The] (ID 464)
            </span>
            <span className="px-2.5 py-1 rounded bg-cyber-elevated border border-cyber-pink text-cyber-pink">
              [Ġcapital] (ID 3139)
            </span>
            <span className="px-2.5 py-1 rounded bg-cyber-elevated border border-cyber-pink text-cyber-pink">
              [Ġof] (ID 286)
            </span>
            <span className="px-2.5 py-1 rounded bg-cyber-elevated border border-cyber-pink text-cyber-pink">
              [ĠFrance] (ID 4881)
            </span>
          </div>
          <p className="text-[11px] text-cyber-muted">
            Notice how space characters are attached to the subsequent token as a prefix byte!
          </p>
        </div>
      ),
    },
    {
      id: 2,
      title: 'WHAT IS PROBABILITY?',
      subtitle: 'Softmax Over 50,257 Dimensions',
      summary:
        'A causal language model processes previous tokens and produces a vector of 50,257 raw numerical scores called logits. Softmax transforms these logits into a normalized probability distribution.',
      points: [
        'The model assigns a probability P(t_i | t_<i) to every token in its vocabulary.',
        'The sum of all 50,257 probabilities is guaranteed to equal exactly 1.0 (100%).',
        'When text is natural and follows learned patterns, the model concentrates high probability onto a few likely candidates.',
      ],
      interactiveDemo: (
        <div className="p-4 rounded-xl bg-cyber-bg/90 border border-cyber-border space-y-2 font-mono text-xs">
          <div className="text-cyber-muted text-[10px] uppercase">After "The capital of France is...":</div>
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span>" Paris" (High Probability)</span>
              <span className="text-cyber-pink font-bold">81.2%</span>
            </div>
            <div className="flex justify-between">
              <span>" not"</span>
              <span className="text-cyber-secondary">2.8%</span>
            </div>
            <div className="flex justify-between">
              <span>" banana" (Extreme Surprise)</span>
              <span className="text-cyber-muted">&lt; 0.001%</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: 'WHAT IS PERPLEXITY?',
      subtitle: 'The Branching Factor of Uncertainty',
      summary:
        'Perplexity (PPL) measures how "perplexed" or surprised a language model is by a sequence of text. Mathematically, it is the exponentiated average negative log-likelihood per token.',
      points: [
        'Perplexity is the geometric mean of the reciprocal probabilities: ( ∏ 1/P_i )^(1/N).',
        'If a model has a perplexity of 5.0, it predicts the sentence as easily as if it were guessing randomly among 5 equally likely words at each position.',
        'A model that knows the text well achieves very low perplexity (close to 1). A model that encounters nonsensical or out-of-distribution text exhibits high perplexity (in the hundreds or thousands).',
      ],
      interactiveDemo: (
        <div className="p-4 rounded-xl bg-cyber-bg/90 border border-cyber-border space-y-2 font-mono text-xs">
          <div className="text-cyber-muted text-[10px] uppercase">Branching Factor Comparison:</div>
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-cyber-card p-2.5 rounded-lg border border-cyber-border">
              <span className="text-[10px] text-cyber-pink block font-bold">FLUENT SENTENCE</span>
              <span className="text-lg font-bold text-cyber-pink">PPL ≈ 3.4</span>
              <span className="text-[10px] text-cyber-muted block">Choosing between ~3 choices</span>
            </div>
            <div className="bg-cyber-card p-2.5 rounded-lg border border-cyber-border">
              <span className="text-[10px] text-amber-400 block font-bold">SCRAMBLED TEXT</span>
              <span className="text-lg font-bold text-amber-400">PPL ≈ 2,400</span>
              <span className="text-[10px] text-cyber-muted block">Choosing between 2,400 choices</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: 'HOW DO WE INTERPRET IT?',
      subtitle: 'Guidelines for Fair Evaluation',
      summary:
        'While lower perplexity generally indicates superior model fit, valid scientific comparisons require strict consistency across test conditions.',
      points: [
        'Vocabulary Normalization: Never compare perplexities across models that use different tokenizers without normalizing by character or byte length.',
        'Domain Specificity: A model trained on news will have high perplexity on Python code or medical jargon, but low perplexity on journalism.',
        'Not a Direct Proxy for Truth: A model can assign high probability (low perplexity) to fluent but factually incorrect statements if they match common rhetorical tropes.',
      ],
      interactiveDemo: (
        <div className="p-4 rounded-xl bg-cyber-bg/90 border border-cyber-border space-y-2 font-mono text-xs">
          <div className="flex items-center gap-2 text-cyber-secondary">
            <CheckCircle2 className="w-4 h-4 text-cyber-pink flex-shrink-0" />
            <span>Always evaluate under identical tokenization and BOS context conventions.</span>
          </div>
          <div className="flex items-center gap-2 text-cyber-muted text-[11px]">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>Perplexity measures sequence predictability, not moral reasoning or factual infallibility.</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="system-explained" className="py-20 px-4 max-w-6xl mx-auto space-y-8">
      {/* Section Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 font-mono text-xs text-cyber-pink tracking-widest uppercase">
          <BookOpen className="w-3.5 h-3.5 text-cyber-pink" />
          <span>06 / SYSTEM EXPLAINED</span>
        </div>
        <h2 className="font-heading font-bold text-3xl sm:text-5xl text-cyber-primary tracking-tight">
          UNDERSTAND WHAT HAPPENED.
        </h2>
        <p className="text-cyber-secondary text-sm sm:text-base max-w-2xl">
          Core concepts in computational linguistics, information theory, and generative artificial intelligence demystified.
        </p>
      </div>

      {/* 4 Educational Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card, idx) => (
          <div
            key={card.id}
            className="matrix-panel rounded-2xl p-6 sm:p-8 border border-cyber-border hover:border-cyber-pink/40 transition-all duration-300 space-y-5 shadow-neon-sm"
          >
            {/* Card Header */}
            <div className="flex items-center justify-between border-b border-cyber-border pb-4">
              <div>
                <span className="font-mono text-xs text-cyber-pink block font-bold">
                  CARD 0{card.id}
                </span>
                <h3 className="font-heading font-bold text-xl sm:text-2xl text-cyber-primary mt-0.5">
                  {card.title}
                </h3>
                <span className="font-mono text-xs text-cyber-muted block">
                  {card.subtitle}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-cyber-card border border-cyber-border flex items-center justify-center text-cyber-pink font-mono font-bold">
                0{card.id}
              </div>
            </div>

            {/* Summary */}
            <p className="text-sm text-cyber-primary leading-relaxed">
              {card.summary}
            </p>

            {/* Key bullet points */}
            <ul className="space-y-2 text-xs font-mono text-cyber-secondary">
              {card.points.map((pt, pIdx) => (
                <li key={pIdx} className="flex items-start gap-2">
                  <span className="text-cyber-pink mt-0.5 font-bold">▸</span>
                  <span className="leading-relaxed">{pt}</span>
                </li>
              ))}
            </ul>

            {/* Interactive demo widget */}
            {card.interactiveDemo}
          </div>
        ))}
      </div>
    </section>
  );
};
