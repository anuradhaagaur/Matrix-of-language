export interface AlternativePrediction {
  token: string;
  tokenId: number;
  probability: number;
  logProb: number;
}

export interface TokenPrediction {
  index: number;
  token: string;
  cleanToken: string;
  hasLeadingSpace: boolean;
  tokenId: number;
  probability: number;
  logProb: number;
  negLogProb: number;
  precedingContext: string[];
  topAlternatives: AlternativePrediction[];
}

export interface PerplexityResult {
  sentence: string;
  tokens: TokenPrediction[];
  tokenCount: number;
  totalNegLogProb: number;
  avgNegLogProb: number;
  perplexity: number;
  reciprocalProductScientific: string;
  inferenceTimeMs: number;
  convention: string;
  modelName: string;
  isRealInference: boolean;
}

export type ModelState = 'idle' | 'loading' | 'ready' | 'error' | 'analyzing';

export interface ModelProgress {
  state: ModelState;
  progress: number;
  file?: string;
  loadedBytes?: number;
  totalBytes?: number;
  message?: string;
}

export interface ManualToken {
  id: string;
  token: string;
  probability: number;
}

export interface ManualCalculationResult {
  tokens: ManualToken[];
  tokenCount: number;
  reciprocalList: number[];
  reciprocalProduct: number;
  reciprocalProductScientific: string;
  avgNegLogProb: number;
  perplexity: number;
  valid: boolean;
  errorMessage?: string;
}
