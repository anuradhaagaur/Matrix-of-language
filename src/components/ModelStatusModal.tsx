import React from 'react';
import { ModelProgress } from '../types/matrix';
import { X, Cpu, CheckCircle2, AlertCircle, RefreshCw, Layers, ShieldCheck } from 'lucide-react';

interface ModelStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: ModelProgress;
  onPreload: () => void;
}

export const ModelStatusModal: React.FC<ModelStatusModalProps> = ({
  isOpen,
  onClose,
  progress,
  onPreload,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg matrix-panel-glow rounded-xl p-6 border border-cyber-pink/35 text-cyber-primary shadow-neon-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyber-border pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyber-pink/15 border border-cyber-pink/40 flex items-center justify-center text-cyber-pink">
              <Cpu className="w-5 h-5 text-cyber-purple" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-cyber-primary tracking-wide">
                SYSTEM CORE STATUS
              </h3>
              <p className="font-mono text-xs text-cyber-muted">
                DISTILGPT-2 NEURAL RUNTIME
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-cyber-bgSecondary text-cyber-muted hover:text-cyber-pink transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status specs */}
        <div className="space-y-4 font-mono text-xs">
          <div className="bg-cyber-bgSecondary/90 p-3.5 rounded-lg border border-cyber-border flex items-center justify-between">
            <span className="text-cyber-muted">ARCHITECTURE</span>
            <span className="text-cyber-pink font-semibold">Causal Transformer (6 Layers)</span>
          </div>

          <div className="bg-cyber-bgSecondary/90 p-3.5 rounded-lg border border-cyber-border flex items-center justify-between">
            <span className="text-cyber-muted">PARAMETERS</span>
            <span className="text-cyber-primary font-semibold">82 Million</span>
          </div>

          <div className="bg-cyber-bgSecondary/90 p-3.5 rounded-lg border border-cyber-border flex items-center justify-between">
            <span className="text-cyber-muted">VOCABULARY SIZE</span>
            <span className="text-cyber-primary font-semibold">50,257 BPE Tokens</span>
          </div>

          <div className="bg-cyber-bgSecondary/90 p-3.5 rounded-lg border border-cyber-border flex items-center justify-between">
            <span className="text-cyber-muted">EVALUATION CONVENTION</span>
            <span className="text-cyber-purple font-semibold">&lt;|endoftext|&gt; BOS (50256)</span>
          </div>

          <div className="bg-cyber-bgSecondary/90 p-3.5 rounded-lg border border-cyber-border flex items-center justify-between">
            <span className="text-cyber-muted">EXECUTION BACKEND</span>
            <span className="text-cyber-magenta font-semibold">ONNX Runtime (WASM / WebGPU)</span>
          </div>

          {/* Model state / progress bar */}
          <div className="p-4 rounded-lg bg-cyber-bg/90 border border-cyber-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-cyber-secondary">
                {progress.state === 'ready' && <CheckCircle2 className="w-4 h-4 text-cyber-pink" />}
                {progress.state === 'loading' && <RefreshCw className="w-4 h-4 text-cyber-magenta animate-spin" />}
                {progress.state === 'error' && <AlertCircle className="w-4 h-4 text-amber-400" />}
                {progress.state === 'idle' && <Layers className="w-4 h-4 text-cyber-muted" />}
                <span>STATUS: {progress.state.toUpperCase()}</span>
              </span>
              <span className="text-cyber-pink font-bold">{progress.progress}%</span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-cyber-bgSecondary h-2 rounded-full overflow-hidden border border-cyber-border">
              <div
                className="bg-gradient-to-r from-cyber-pink via-cyber-magenta to-cyber-purple h-full transition-all duration-300 shadow-neon-sm"
                style={{ width: `${progress.progress}%` }}
              />
            </div>

            <p className="text-[11px] text-cyber-muted">
              {progress.message || (progress.state === 'ready' ? 'Neural weights loaded into browser memory.' : 'Ready to analyze sentences.')}
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-6 flex justify-end gap-3">
          {progress.state !== 'ready' && progress.state !== 'loading' && (
            <button
              onClick={onPreload}
              className="matrix-btn-primary px-4 py-2 rounded-lg text-xs flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              DOWNLOAD / CACHE WEIGHTS (82MB)
            </button>
          )}
          <button
            onClick={onClose}
            className="matrix-btn-secondary px-4 py-2 rounded-lg text-xs"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
