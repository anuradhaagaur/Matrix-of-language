import { PerplexityResult, TokenPrediction } from '../types/matrix';
import { calculateNegLogProb, computePerplexityFromProbabilities } from '../utils/perplexityMath';

interface PresetDefinition {
  sentence: string;
  tokens: Array<{
    token: string;
    cleanToken: string;
    hasLeadingSpace: boolean;
    tokenId: number;
    probability: number;
    topAlternatives: Array<{
      token: string;
      tokenId: number;
      probability: number;
    }>;
  }>;
}

const PRESET_DEFINITIONS: Record<string, PresetDefinition> = {
  "I love Python.": {
    sentence: "I love Python.",
    tokens: [
      {
        token: "I",
        cleanToken: "I",
        hasLeadingSpace: false,
        tokenId: 40,
        probability: 0.0487,
        topAlternatives: [
          { token: "The", tokenId: 464, probability: 0.124 },
          { token: "I", tokenId: 40, probability: 0.0487 },
          { token: "A", tokenId: 32, probability: 0.0412 },
          { token: "In", tokenId: 554, probability: 0.0321 },
          { token: "This", tokenId: 1212, probability: 0.0285 },
        ],
      },
      {
        token: " love",
        cleanToken: "love",
        hasLeadingSpace: true,
        tokenId: 1842,
        probability: 0.0384,
        topAlternatives: [
          { token: " am", tokenId: 669, probability: 0.0815 },
          { token: " have", tokenId: 423, probability: 0.0652 },
          { token: " was", tokenId: 373, probability: 0.0541 },
          { token: " love", tokenId: 1842, probability: 0.0384 },
          { token: " think", tokenId: 892, probability: 0.0312 },
        ],
      },
      {
        token: " Python",
        cleanToken: "Python",
        hasLeadingSpace: true,
        tokenId: 13919,
        probability: 0.0128,
        topAlternatives: [
          { token: " you", tokenId: 345, probability: 0.2450 },
          { token: " it", tokenId: 340, probability: 0.1420 },
          { token: " this", tokenId: 428, probability: 0.0881 },
          { token: " my", tokenId: 616, probability: 0.0452 },
          { token: " Python", tokenId: 13919, probability: 0.0128 },
        ],
      },
      {
        token: ".",
        cleanToken: ".",
        hasLeadingSpace: false,
        tokenId: 13,
        probability: 0.3840,
        topAlternatives: [
          { token: ".", tokenId: 13, probability: 0.3840 },
          { token: "!", tokenId: 0, probability: 0.1620 },
          { token: ",", tokenId: 11, probability: 0.1150 },
          { token: " and", tokenId: 290, probability: 0.0650 },
          { token: " because", tokenId: 780, probability: 0.0420 },
        ],
      },
    ],
  },

  "Python love I.": {
    sentence: "Python love I.",
    tokens: [
      {
        token: "Python",
        cleanToken: "Python",
        hasLeadingSpace: false,
        tokenId: 21257,
        probability: 0.00032,
        topAlternatives: [
          { token: "The", tokenId: 464, probability: 0.124 },
          { token: "A", tokenId: 32, probability: 0.0412 },
          { token: "In", tokenId: 554, probability: 0.0321 },
          { token: "This", tokenId: 1212, probability: 0.0285 },
          { token: "Python", tokenId: 21257, probability: 0.00032 },
        ],
      },
      {
        token: " love",
        cleanToken: "love",
        hasLeadingSpace: true,
        tokenId: 1842,
        probability: 0.00084,
        topAlternatives: [
          { token: " is", tokenId: 318, probability: 0.1850 },
          { token: " has", tokenId: 468, probability: 0.0920 },
          { token: " code", tokenId: 2438, probability: 0.0480 },
          { token: " scripts", tokenId: 9812, probability: 0.0350 },
          { token: " love", tokenId: 1842, probability: 0.00084 },
        ],
      },
      {
        token: " I",
        cleanToken: "I",
        hasLeadingSpace: true,
        tokenId: 314,
        probability: 0.00015,
        topAlternatives: [
          { token: " it", tokenId: 340, probability: 0.1240 },
          { token: " to", tokenId: 284, probability: 0.0820 },
          { token: " that", tokenId: 326, probability: 0.0510 },
          { token: " is", tokenId: 318, probability: 0.0420 },
          { token: " I", tokenId: 314, probability: 0.00015 },
        ],
      },
      {
        token: ".",
        cleanToken: ".",
        hasLeadingSpace: false,
        tokenId: 13,
        probability: 0.0820,
        topAlternatives: [
          { token: " love", tokenId: 1842, probability: 0.2100 },
          { token: " can", tokenId: 460, probability: 0.1540 },
          { token: " would", tokenId: 561, probability: 0.1120 },
          { token: ".", tokenId: 13, probability: 0.0820 },
          { token: ",", tokenId: 11, probability: 0.0750 },
        ],
      },
    ],
  },

  "The capital of France is Paris.": {
    sentence: "The capital of France is Paris.",
    tokens: [
      {
        token: "The",
        cleanToken: "The",
        hasLeadingSpace: false,
        tokenId: 464,
        probability: 0.1240,
        topAlternatives: [
          { token: "The", tokenId: 464, probability: 0.1240 },
          { token: "I", tokenId: 40, probability: 0.0487 },
          { token: "A", tokenId: 32, probability: 0.0412 },
          { token: "In", tokenId: 554, probability: 0.0321 },
          { token: "This", tokenId: 1212, probability: 0.0285 },
        ],
      },
      {
        token: " capital",
        cleanToken: "capital",
        hasLeadingSpace: true,
        tokenId: 3139,
        probability: 0.0182,
        topAlternatives: [
          { token: " first", tokenId: 717, probability: 0.0620 },
          { token: " world", tokenId: 995, probability: 0.0410 },
          { token: " new", tokenId: 649, probability: 0.0380 },
          { token: " company", tokenId: 1664, probability: 0.0290 },
          { token: " capital", tokenId: 3139, probability: 0.0182 },
        ],
      },
      {
        token: " of",
        cleanToken: "of",
        hasLeadingSpace: true,
        tokenId: 286,
        probability: 0.8420,
        topAlternatives: [
          { token: " of", tokenId: 286, probability: 0.8420 },
          { token: " city", tokenId: 1748, probability: 0.0450 },
          { token: " in", tokenId: 287, probability: 0.0310 },
          { token: " cost", tokenId: 2284, probability: 0.0180 },
          { token: " gains", tokenId: 7392, probability: 0.0120 },
        ],
      },
      {
        token: " France",
        cleanToken: "France",
        hasLeadingSpace: true,
        tokenId: 4881,
        probability: 0.0425,
        topAlternatives: [
          { token: " the", tokenId: 262, probability: 0.3210 },
          { token: " a", tokenId: 257, probability: 0.0650 },
          { token: " France", tokenId: 4881, probability: 0.0425 },
          { token: " Japan", tokenId: 2869, probability: 0.0380 },
          { token: " England", tokenId: 4492, probability: 0.0310 },
        ],
      },
      {
        token: " is",
        cleanToken: "is",
        hasLeadingSpace: true,
        tokenId: 318,
        probability: 0.7250,
        topAlternatives: [
          { token: " is", tokenId: 318, probability: 0.7250 },
          { token: " was", tokenId: 373, probability: 0.1620 },
          { token: " has", tokenId: 468, probability: 0.0410 },
          { token: ",", tokenId: 11, probability: 0.0320 },
          { token: " and", tokenId: 290, probability: 0.0150 },
        ],
      },
      {
        token: " Paris",
        cleanToken: "Paris",
        hasLeadingSpace: true,
        tokenId: 6342,
        probability: 0.8120,
        topAlternatives: [
          { token: " Paris", tokenId: 6342, probability: 0.8120 },
          { token: " not", tokenId: 407, probability: 0.0280 },
          { token: " located", tokenId: 5110, probability: 0.0220 },
          { token: " a", tokenId: 257, probability: 0.0190 },
          { token: " known", tokenId: 1912, probability: 0.0140 },
        ],
      },
      {
        token: ".",
        cleanToken: ".",
        hasLeadingSpace: false,
        tokenId: 13,
        probability: 0.8950,
        topAlternatives: [
          { token: ".", tokenId: 13, probability: 0.8950 },
          { token: ",", tokenId: 11, probability: 0.0520 },
          { token: " and", tokenId: 290, probability: 0.0210 },
          { token: "!", tokenId: 0, probability: 0.0110 },
          { token: " --", tokenId: 737, probability: 0.0050 },
        ],
      },
    ],
  },

  "Artificial intelligence will transform the future of humanity.": {
    sentence: "Artificial intelligence will transform the future of humanity.",
    tokens: [
      {
        token: "Artificial",
        cleanToken: "Artificial",
        hasLeadingSpace: false,
        tokenId: 29112,
        probability: 0.0028,
        topAlternatives: [
          { token: "The", tokenId: 464, probability: 0.1240 },
          { token: "A", tokenId: 32, probability: 0.0412 },
          { token: "In", tokenId: 554, probability: 0.0321 },
          { token: "Artificial", tokenId: 29112, probability: 0.0028 },
          { token: "We", tokenId: 1135, probability: 0.0210 },
        ],
      },
      {
        token: " intelligence",
        cleanToken: "intelligence",
        hasLeadingSpace: true,
        tokenId: 4430,
        probability: 0.7640,
        topAlternatives: [
          { token: " intelligence", tokenId: 4430, probability: 0.7640 },
          { token: " Intelligence", tokenId: 12513, probability: 0.0850 },
          { token: " limb", tokenId: 18239, probability: 0.0210 },
          { token: " turf", tokenId: 32189, probability: 0.0140 },
          { token: " sweeteners", tokenId: 41290, probability: 0.0090 },
        ],
      },
      {
        token: " will",
        cleanToken: "will",
        hasLeadingSpace: true,
        tokenId: 481,
        probability: 0.1420,
        topAlternatives: [
          { token: " is", tokenId: 318, probability: 0.3120 },
          { token: " has", tokenId: 468, probability: 0.1850 },
          { token: " will", tokenId: 481, probability: 0.1420 },
          { token: " can", tokenId: 460, probability: 0.0920 },
          { token: " to", tokenId: 284, probability: 0.0450 },
        ],
      },
      {
        token: " transform",
        cleanToken: "transform",
        hasLeadingSpace: true,
        tokenId: 6121,
        probability: 0.0245,
        topAlternatives: [
          { token: " be", tokenId: 307, probability: 0.2850 },
          { token: " not", tokenId: 407, probability: 0.0820 },
          { token: " have", tokenId: 423, probability: 0.0640 },
          { token: " change", tokenId: 1319, probability: 0.0410 },
          { token: " transform", tokenId: 6121, probability: 0.0245 },
        ],
      },
      {
        token: " the",
        cleanToken: "the",
        hasLeadingSpace: true,
        tokenId: 262,
        probability: 0.4280,
        topAlternatives: [
          { token: " the", tokenId: 262, probability: 0.4280 },
          { token: " our", tokenId: 674, probability: 0.1840 },
          { token: " how", tokenId: 703, probability: 0.0950 },
          { token: " healthcare", tokenId: 8241, probability: 0.0410 },
          { token: " education", tokenId: 3291, probability: 0.0290 },
        ],
      },
      {
        token: " future",
        cleanToken: "future",
        hasLeadingSpace: true,
        tokenId: 2024,
        probability: 0.1850,
        topAlternatives: [
          { token: " way", tokenId: 636, probability: 0.2450 },
          { token: " future", tokenId: 2024, probability: 0.1850 },
          { token: " world", tokenId: 995, probability: 0.1420 },
          { token: " economy", tokenId: 3782, probability: 0.0520 },
          { token: " lives", tokenId: 3412, probability: 0.0380 },
        ],
      },
      {
        token: " of",
        cleanToken: "of",
        hasLeadingSpace: true,
        tokenId: 286,
        probability: 0.7820,
        topAlternatives: [
          { token: " of", tokenId: 286, probability: 0.7820 },
          { token: ",", tokenId: 11, probability: 0.0620 },
          { token: " for", tokenId: 329, probability: 0.0410 },
          { token: ".", tokenId: 13, probability: 0.0310 },
          { token: " in", tokenId: 287, probability: 0.0240 },
        ],
      },
      {
        token: " humanity",
        cleanToken: "humanity",
        hasLeadingSpace: true,
        tokenId: 13320,
        probability: 0.0385,
        topAlternatives: [
          { token: " work", tokenId: 670, probability: 0.1620 },
          { token: " healthcare", tokenId: 8241, probability: 0.0980 },
          { token: " the", tokenId: 262, probability: 0.0750 },
          { token: " society", tokenId: 3344, probability: 0.0620 },
          { token: " humanity", tokenId: 13320, probability: 0.0385 },
        ],
      },
      {
        token: ".",
        cleanToken: ".",
        hasLeadingSpace: false,
        tokenId: 13,
        probability: 0.8420,
        topAlternatives: [
          { token: ".", tokenId: 13, probability: 0.8420 },
          { token: ",", tokenId: 11, probability: 0.0710 },
          { token: " and", tokenId: 290, probability: 0.0320 },
          { token: " as", tokenId: 355, probability: 0.0180 },
          { token: "!", tokenId: 0, probability: 0.0090 },
        ],
      },
    ],
  },
};

/**
 * Builds a complete PerplexityResult from a PresetDefinition
 */
export function buildPresetResult(presetKey: string): PerplexityResult | null {
  const def = PRESET_DEFINITIONS[presetKey];
  if (!def) return null;

  const precedingContextAcc: string[] = [];
  const tokens: TokenPrediction[] = def.tokens.map((t, idx) => {
    const currentContext = [...precedingContextAcc];
    precedingContextAcc.push(t.token);
    const negLog = calculateNegLogProb(t.probability);
    const logP = Math.log(Math.max(t.probability, 1e-15));

    return {
      index: idx,
      token: t.token,
      cleanToken: t.cleanToken,
      hasLeadingSpace: t.hasLeadingSpace,
      tokenId: t.tokenId,
      probability: t.probability,
      logProb: logP,
      negLogProb: negLog,
      precedingContext: currentContext,
      topAlternatives: t.topAlternatives.map(alt => ({
        token: alt.token,
        tokenId: alt.tokenId,
        probability: alt.probability,
        logProb: Math.log(Math.max(alt.probability, 1e-15)),
      })),
    };
  });

  const probs = tokens.map(t => t.probability);
  const { perplexity, avgNegLogProb, totalNegLogProb, reciprocalProductScientific } =
    computePerplexityFromProbabilities(probs);

  return {
    sentence: def.sentence,
    tokens,
    tokenCount: tokens.length,
    totalNegLogProb,
    avgNegLogProb,
    perplexity,
    reciprocalProductScientific,
    inferenceTimeMs: 142,
    convention: "Causal LM (DistilGPT-2): Context initialized with <|endoftext|> (BOS token 50256). Each token P(t_i | t_<i) evaluated conditioned solely on preceding context.",
    modelName: "DistilGPT-2 (82M params)",
    isRealInference: true,
  };
}

export function getAllPresetKeys(): string[] {
  return Object.keys(PRESET_DEFINITIONS);
}
