/**
 * Numerically stable Perplexity and Probability Mathematical Utilities
 */

/**
 * Numerically stable Log-Sum-Exp over an array of logits
 * LSE(z) = max(z) + ln(sum(exp(z_i - max(z))))
 */
export function logSumExp(logits: number[] | Float32Array): number {
  let max = -Infinity;
  for (let i = 0; i < logits.length; i++) {
    if (logits[i] > max) max = logits[i];
  }
  if (!isFinite(max)) return 0;

  let sumExp = 0;
  for (let i = 0; i < logits.length; i++) {
    sumExp += Math.exp(logits[i] - max);
  }
  return max + Math.log(sumExp);
}

/**
 * Converts a logit vector into softmax probabilities
 */
export function softmax(logits: number[] | Float32Array): Float32Array {
  const lse = logSumExp(logits);
  const probs = new Float32Array(logits.length);
  for (let i = 0; i < logits.length; i++) {
    probs[i] = Math.exp(logits[i] - lse);
  }
  return probs;
}

/**
 * Calculates negative log probability (natural log) with clipping to prevent -Infinity
 */
export function calculateNegLogProb(prob: number): number {
  const safeProb = Math.max(Math.min(prob, 1.0), 1e-15);
  return -Math.log(safeProb);
}

/**
 * Computes perplexity from an array of conditional token probabilities
 */
export function computePerplexityFromProbabilities(probs: number[]): {
  perplexity: number;
  avgNegLogProb: number;
  totalNegLogProb: number;
  reciprocalProductScientific: string;
} {
  if (probs.length === 0) {
    return {
      perplexity: 1.0,
      avgNegLogProb: 0,
      totalNegLogProb: 0,
      reciprocalProductScientific: '1.00',
    };
  }

  let totalNegLogProb = 0;
  let logReciprocalSum = 0;

  for (const p of probs) {
    const safeProb = Math.max(Math.min(p, 1.0), 1e-15);
    const negLog = -Math.log(safeProb);
    totalNegLogProb += negLog;
    logReciprocalSum += Math.log(1 / safeProb);
  }

  const avgNegLogProb = totalNegLogProb / probs.length;
  const perplexity = Math.exp(avgNegLogProb);

  // Compute scientific notation representation of product of reciprocals
  // ln(product) = logReciprocalSum
  // log10(product) = logReciprocalSum / ln(10)
  const log10Product = logReciprocalSum / Math.LN10;
  const exponent = Math.floor(log10Product);
  const mantissa = Math.pow(10, log10Product - exponent);
  
  let reciprocalProductScientific: string;
  if (Math.abs(exponent) < 6) {
    const rawVal = Math.exp(logReciprocalSum);
    reciprocalProductScientific = rawVal.toLocaleString(undefined, {
      maximumFractionDigits: 3,
      minimumFractionDigits: 1,
    });
  } else {
    reciprocalProductScientific = `${mantissa.toFixed(3)} × 10^${exponent}`;
  }

  return {
    perplexity,
    avgNegLogProb,
    totalNegLogProb,
    reciprocalProductScientific,
  };
}

/**
 * Format probability as percentage with appropriate decimal precision
 */
export function formatProbability(p: number): string {
  if (p >= 0.1) return `${(p * 100).toFixed(2)}%`;
  if (p >= 0.01) return `${(p * 100).toFixed(3)}%`;
  if (p >= 0.0001) return `${(p * 100).toFixed(4)}%`;
  return `${(p * 100).toExponential(2)}%`;
}
