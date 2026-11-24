import React, { useState } from 'react';
import { Terminal, Play, X, Sparkles, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { ModelProgress } from '../types/matrix';

interface InputTerminalProps {
  sentence: string;
  onSentenceChange: (text: string) => void;
  onSubmit: (sentence: string) => void;
  isLoading: boolean;
  modelProgress: ModelProgress;
  activePreset: string;
}

const PRESETS = [
  { label: 'Standard Sentence', text: 'I love Python.' },
  { label: 'Syntactic Surprise', text: 'Python love I.' },
  { label: 'Factual Certainty', text: 'The capital of France is Paris.' },
  { label: 'Long Causal Context', text: 'Artificial intelligence will transform the future of humanity.' },
];

export const InputTerminal: React.FC<InputTerminalProps> = ({
  sentence,
  onSentenceChange,
  onSubmit,
  isLoading,
  modelProgress,
  activePreset,
}) => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!sentence.trim()) {
      setErrorMsg('Please enter a sentence to execute prediction.');
      return;
    }
    setErrorMsg(null);
    onSubmit(sentence.trim());
  };

  const handleSelectPreset = (text: string) => {
    onSentenceChange(text);
    setErrorMsg(null);
    onSubmit(text);
  };

  return (
    <section id="input-section" className="relative py-20 px-4 max-w-5xl mx-auto">
      {/* Section Header */}
      <div className="mb-8 space-y-2">
        <div className="inline-flex items-center gap-2 font-mono text-xs text-cyber-pink tracking-widest uppercase">
          <Terminal className="w-3.5 h-3.5 text-cyber-pink" />
          <span>01 / INPUT SEQUENCE</span>
        </div>
        <h2 className="font-heading font-bold text-3xl sm:text-5xl text-cyber-primary tracking-tight">
          FEED THE LANGUAGE MODEL.
        </h2>
        <p className="text-cyber-secondary text-sm sm:text-base max-w-2xl">
          Enter a sentence and watch the model process it one token at a time.
        </p>
      </div>

      {/* Terminal Container */}
      <div className="matrix-panel-glow rounded-2xl p-6 sm:p-8 border border-cyber-border shadow-neon-md relative overflow-hidden">
        {/* Terminal top bar */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-cyber-border/80 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-cyber-pink inline-block shadow-neon-sm" />
            <span className="ml-2 text-cyber-muted tracking-wider">
              DISTILGPT2://CAUSAL_INFERENCE_PORT
            </span>
          </div>
          <div className="text-[11px] text-cyber-pink bg-cyber-bgSecondary/90 px-2.5 py-1 rounded border border-cyber-border">
            BOS_TOKEN: &lt;|endoftext|&gt; (50256)
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Large text input */}
          <div className="relative">
            <textarea
              value={sentence}
              onChange={(e) => {
                onSentenceChange(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              rows={3}
              placeholder="Type any sentence here or choose a preset below..."
              disabled={isLoading}
              className="w-full matrix-input p-4 sm:p-5 rounded-xl font-heading text-lg sm:text-2xl text-cyber-primary resize-none placeholder:text-cyber-muted/60 focus:ring-1 focus:ring-cyber-pink"
            />

            {/* Clear button inside input */}
            {sentence && !isLoading && (
              <button
                type="button"
                onClick={() => onSentenceChange('')}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-cyber-bgSecondary text-cyber-muted hover:text-cyber-pink border border-cyber-border hover:border-cyber-pink transition-colors"
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Input metadata and characters */}
          <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-cyber-secondary">
            <div className="flex items-center gap-4">
              <span>CHARS: <strong className="text-cyber-primary">{sentence.length}</strong></span>
              <span>WORDS: <strong className="text-cyber-primary">{sentence.trim() ? sentence.trim().split(/\s+/).length : 0}</strong></span>
              <span>EST. TOKENS: <strong className="text-cyber-pink">{Math.max(1, Math.round(sentence.length / 3.8))}</strong></span>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-1.5 text-amber-400 font-sans text-xs">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Preset Buttons */}
          <div className="space-y-2">
            <div className="font-mono text-xs text-cyber-muted flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cyber-pink" />
              <span>EXPERIMENT PRESETS:</span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {PRESETS.map((preset) => (
                <button
                  key={preset.text}
                  type="button"
                  onClick={() => handleSelectPreset(preset.text)}
                  disabled={isLoading}
                  className={`px-3.5 py-2 rounded-lg font-mono text-xs text-left transition-all duration-200 border ${
                    activePreset === preset.text
                      ? 'bg-cyber-pink/20 border-cyber-pink text-cyber-pink shadow-neon-sm'
                      : 'bg-cyber-elevated/90 border-cyber-border hover:border-cyber-pink/60 text-cyber-primary hover:text-cyber-pink'
                  }`}
                >
                  <span className="block text-[10px] text-cyber-muted mb-0.5">{preset.label}</span>
                  <span>"{preset.text}"</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="font-mono text-xs text-cyber-muted">
              Press Enter or click Execute to run forward pass
            </div>

            <button
              type="submit"
              disabled={isLoading || !sentence.trim()}
              className="matrix-btn-primary px-8 py-4 rounded-xl flex items-center justify-center gap-3 text-sm font-bold tracking-wider group"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-cyber-bg" />
                  <span>
                    {modelProgress.message || 'PROCESSING SEQUENCE...'}
                  </span>
                </>
              ) : (
                <>
                  <span>EXECUTE PREDICTION</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Live Loading Overlay / Banner */}
        {isLoading && (
          <div className="mt-6 p-4 rounded-xl bg-cyber-bg/95 border border-cyber-pink/40 text-xs font-mono space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between text-cyber-pink">
              <span className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-cyber-magenta" />
                <span>
                  {modelProgress.state === 'loading'
                    ? 'INITIALIZING DISTILGPT-2 NEURAL WEIGHTS...'
                    : 'RUNNING TOKENIZATION & CAUSAL LOGITS...'}
                </span>
              </span>
              <span>{modelProgress.progress}%</span>
            </div>

            <div className="w-full bg-cyber-bgSecondary h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyber-pink via-cyber-magenta to-cyber-purple h-full transition-all duration-300 shadow-neon-sm"
                style={{ width: `${Math.max(15, modelProgress.progress)}%` }}
              />
            </div>

            <div className="flex justify-between text-[11px] text-cyber-muted">
              <span>EXTRACTING VOCABULARY IDS</span>
              <span>COMPUTING SOFTMAX DISTRIBUTIONS</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
