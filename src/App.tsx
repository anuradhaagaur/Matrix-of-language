import React, { useState, useEffect } from 'react';
import { PerplexityResult, ModelProgress } from './types/matrix';
import { modelService } from './services/modelService';
import { buildPresetResult } from './services/precomputedModelData';

import { MatrixBackground } from './components/MatrixBackground';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { InputTerminal } from './components/InputTerminal';
import { SentenceDisintegration } from './components/SentenceDisintegration';
import { ProbabilityPulse } from './components/ProbabilityPulse';
import { FinalScoreReveal } from './components/FinalScoreReveal';
import { TokenDecomposition } from './components/TokenDecomposition';
import { ProbabilityMatrix } from './components/ProbabilityMatrix';
import { PerplexityEngine } from './components/PerplexityEngine';
import { ManualExperimentChamber } from './components/ManualExperimentChamber';
import { MatrixLab } from './components/MatrixLab';
import { SystemExplained } from './components/SystemExplained';
import { Footer } from './components/Footer';
import { ModelStatusModal } from './components/ModelStatusModal';

export const App: React.FC = () => {
  const initialSentence = 'I love Python.';
  const [sentence, setSentence] = useState<string>(initialSentence);
  const [activePreset, setActivePreset] = useState<string>(initialSentence);
  const [result, setResult] = useState<PerplexityResult>(() => {
    return buildPresetResult(initialSentence)!;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modelProgress, setModelProgress] = useState<ModelProgress>({
    state: 'idle',
    progress: 0,
  });
  const [selectedTokenIdx, setSelectedTokenIdx] = useState<number>(0);
  const [isSpecsOpen, setIsSpecsOpen] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = modelService.subscribe((progress) => {
      setModelProgress(progress);
    });
    return () => unsubscribe();
  }, []);

  const handleExecuteSentence = async (textToRun: string) => {
    try {
      setIsLoading(true);
      const res = await modelService.analyzeSentence(textToRun);
      setResult(res);
      setSelectedTokenIdx(0);
      setActivePreset(textToRun);
      setIsLoading(false);

      const target = document.getElementById('signature-animation-stage');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err: any) {
      setIsLoading(false);
      console.error('Inference error:', err);
    }
  };

  const scrollToInput = () => {
    const el = document.getElementById('input-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToScience = () => {
    const el = document.getElementById('system-explained');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToBreakdown = () => {
    const el = document.getElementById('decomposition-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-[#0B0610] text-[#FFF1FA]">
      {/* Signature Animated Matrix Background */}
      <MatrixBackground />

      {/* Floating Navigation */}
      <Navigation
        progress={modelProgress}
        onPreloadModel={() => modelService.preloadModel()}
      />

      {/* Hero Section */}
      <Hero
        onInitialize={scrollToInput}
        onExploreScience={scrollToScience}
      />

      {/* Main Container */}
      <main className="relative z-10 space-y-16 sm:space-y-24 pb-24">
        {/* Section 01: Input Sequence */}
        <InputTerminal
          sentence={sentence}
          onSentenceChange={setSentence}
          onSubmit={handleExecuteSentence}
          isLoading={isLoading}
          modelProgress={modelProgress}
          activePreset={activePreset}
        />

        {/* Signature Animation One: Sentence Disintegration */}
        <section id="signature-animation-stage" className="px-4 max-w-5xl mx-auto">
          <SentenceDisintegration
            key={`disintegration-${result.sentence}`}
            result={result}
            onComplete={() => {}}
          />
        </section>

        {/* Signature Animation Two: Probability Pulse */}
        <section className="px-4 max-w-6xl mx-auto">
          <ProbabilityPulse
            result={result}
            selectedTokenIdx={selectedTokenIdx}
            onSelectToken={setSelectedTokenIdx}
          />
        </section>

        {/* Signature Animation Three: Final Score Reveal */}
        <section className="px-4 max-w-5xl mx-auto">
          <FinalScoreReveal
            key={`reveal-${result.sentence}`}
            result={result}
            onExploreBreakdown={scrollToBreakdown}
          />
        </section>

        {/* Section 02: Token Decomposition */}
        <TokenDecomposition
          result={result}
          selectedTokenIdx={selectedTokenIdx}
          onSelectToken={setSelectedTokenIdx}
        />

        {/* Section 03: Prediction Analysis & Probability Matrix */}
        <ProbabilityMatrix
          result={result}
          selectedTokenIdx={selectedTokenIdx}
          onSelectToken={setSelectedTokenIdx}
        />

        {/* Section 04: Uncertainty Engine & Perplexity Formula */}
        <PerplexityEngine result={result} />

        {/* Section 05: Manual Simulation Chamber */}
        <ManualExperimentChamber />

        {/* Section 06: Matrix Lab Interactive Viewport */}
        <MatrixLab
          result={result}
          selectedTokenIdx={selectedTokenIdx}
          onSelectToken={setSelectedTokenIdx}
        />

        {/* Section 07: System Explained Educational Cards */}
        <SystemExplained />
      </main>

      {/* Footer */}
      <Footer onOpenModelStatus={() => setIsSpecsOpen(true)} />

      {/* Model Specs Modal */}
      <ModelStatusModal
        isOpen={isSpecsOpen}
        onClose={() => setIsSpecsOpen(false)}
        progress={modelProgress}
        onPreload={() => modelService.preloadModel()}
      />
    </div>
  );
};

export default App;
