import React from 'react';
import { Terminal, ArrowUp, Github, Info, Cpu } from 'lucide-react';

interface FooterProps {
  onOpenModelStatus: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenModelStatus }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-cyber-border bg-[#0B0610] py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Brand & Tagline */}
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-cyber-pink/15 border border-cyber-pink/40 flex items-center justify-center text-cyber-pink">
                <Terminal className="w-4 h-4 text-cyber-pink" />
              </div>
              <span className="font-heading font-bold text-base text-cyber-primary tracking-wider">
                THE MATRIX OF LANGUAGE
              </span>
            </div>
            <p className="font-mono text-xs text-cyber-muted">
              "Decoding language, one token at a time."
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center gap-6 font-mono text-xs text-cyber-secondary">
            <button
              onClick={onOpenModelStatus}
              className="hover:text-cyber-pink transition-colors flex items-center gap-1.5"
            >
              <Cpu className="w-3.5 h-3.5 text-cyber-purple" />
              <span>MODEL SPECS</span>
            </button>
            <a
              href="#system-explained"
              className="hover:text-cyber-magenta transition-colors"
            >
              METHODOLOGY
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyber-magenta transition-colors flex items-center gap-1.5"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GITHUB</span>
            </a>
            <button
              onClick={scrollToTop}
              className="hover:text-cyber-pink transition-colors flex items-center gap-1.5 text-cyber-pink"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>BACK TO TOP</span>
            </button>
          </div>
        </div>

        {/* Technical Footer Status */}
        <div className="pt-8 border-t border-cyber-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-cyber-muted">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyber-pink inline-block shadow-neon-sm" />
            <span className="tracking-widest uppercase">
              DISTILGPT-2 (82M) // BPE 50257 // CYBER RUNTIME STABLE
            </span>
          </div>

          <div className="tracking-widest text-cyber-pink font-semibold text-[11px]">
            // END OF TRANSMISSION.
          </div>
        </div>
      </div>
    </footer>
  );
};
