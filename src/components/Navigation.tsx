import React, { useState } from 'react';
import { ModelProgress } from '../types/matrix';
import { Terminal, Cpu } from 'lucide-react';
import { ModelStatusModal } from './ModelStatusModal';

interface NavigationProps {
  progress: ModelProgress;
  onPreloadModel: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ progress, onPreloadModel }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="fixed top-4 left-0 right-0 z-40 px-4 md:px-8 max-w-7xl mx-auto">
        <nav className="matrix-panel rounded-2xl px-5 py-3 border border-matrix-border flex items-center justify-between shadow-neon-sm">
          {/* Left Brand */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-cyber-pink/15 border border-cyber-pink/40 flex items-center justify-center text-cyber-pink group-hover:shadow-neon-sm transition-all duration-300">
              <Terminal className="w-4 h-4 text-cyber-pink" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-sm tracking-widest text-cyber-primary group-hover:text-cyber-pink transition-colors">
                MATRIX <span className="text-cyber-pink">/</span> LANGUAGE
              </span>
              <span className="font-mono text-[10px] tracking-wider text-cyber-muted uppercase">
                PERPLEXITY EXPLORER
              </span>
            </div>
          </a>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-6 font-mono text-xs text-cyber-secondary">
            <a
              href="#input-section"
              className="hover:text-cyber-magenta transition-colors tracking-wider"
            >
              // 01. EXPLORE
            </a>
            <a
              href="#decomposition-section"
              className="hover:text-cyber-magenta transition-colors tracking-wider"
            >
              // 02. TOKENS
            </a>
            <a
              href="#uncertainty-section"
              className="hover:text-cyber-magenta transition-colors tracking-wider"
            >
              // 03. PERPLEXITY
            </a>
            <a
              href="#manual-section"
              className="hover:text-cyber-magenta transition-colors tracking-wider"
            >
              // 04. EXPERIMENTS
            </a>
            <a
              href="#system-explained"
              className="hover:text-cyber-magenta transition-colors tracking-wider"
            >
              // 05. HOW IT WORKS
            </a>
          </div>

          {/* Right Status */}
          <div className="flex items-center gap-3">
            {/* Pulsing System Online badge with Electric Magenta dot */}
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyber-bgSecondary border border-cyber-border text-[11px] font-mono text-cyber-primary">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-magenta opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-magenta"></span>
              </span>
              <span className="text-cyber-pink font-medium">SYSTEM ONLINE</span>
            </div>

            {/* Model status pill button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyber-bgSecondary/90 hover:bg-cyber-pink/10 border border-cyber-border hover:border-cyber-pink/50 text-cyber-primary hover:text-cyber-pink text-xs font-mono transition-all duration-200"
              title="Click to view model runtime specs"
            >
              <Cpu className="w-3.5 h-3.5 text-cyber-purple" />
              <span>DISTILGPT-2</span>
              {progress.state === 'loading' && (
                <span className="text-[10px] text-cyber-pink animate-pulse">
                  {progress.progress}%
                </span>
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Status Modal */}
      <ModelStatusModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        progress={progress}
        onPreload={onPreloadModel}
      />
    </>
  );
};
