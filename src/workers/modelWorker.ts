import { AutoTokenizer, AutoModelForCausalLM, env } from '@xenova/transformers';

// Configure Transformers.js for web worker environment
env.allowLocalModels = false;
env.useBrowserCache = true;

let tokenizer: any = null;
let model: any = null;
let isInitializing = false;

self.onmessage = async (event: MessageEvent) => {
  const { type, payload } = event.data;

  if (type === 'INIT_MODEL') {
    if (model && tokenizer) {
      self.postMessage({ type: 'MODEL_READY' });
      return;
    }
    if (isInitializing) return;

    try {
      isInitializing = true;
      self.postMessage({
        type: 'MODEL_PROGRESS',
        payload: { state: 'loading', progress: 5, message: 'Fetching DistilGPT-2 tokenizer...' },
      });

      tokenizer = await AutoTokenizer.from_pretrained('Xenova/distilgpt2', {
        progress_callback: (progressInfo: any) => {
          if (progressInfo.status === 'progress') {
            self.postMessage({
              type: 'MODEL_PROGRESS',
              payload: {
                state: 'loading',
                progress: Math.round(progressInfo.progress || 10),
                file: progressInfo.file,
                loadedBytes: progressInfo.loaded,
                totalBytes: progressInfo.total,
                message: `Downloading ${progressInfo.file || 'model components'}...`,
              },
            });
          }
        },
      });

      self.postMessage({
        type: 'MODEL_PROGRESS',
        payload: { state: 'loading', progress: 30, message: 'Fetching DistilGPT-2 weights (ONNX)...' },
      });

      model = await AutoModelForCausalLM.from_pretrained('Xenova/distilgpt2', {
        quantized: true,
        progress_callback: (progressInfo: any) => {
          if (progressInfo.status === 'progress') {
            self.postMessage({
              type: 'MODEL_PROGRESS',
              payload: {
                state: 'loading',
                progress: Math.min(99, Math.round(progressInfo.progress || 50)),
                file: progressInfo.file,
                loadedBytes: progressInfo.loaded,
                totalBytes: progressInfo.total,
                message: `Loading DistilGPT-2 neural network...`,
              },
            });
          }
        },
      });

      isInitializing = false;
      self.postMessage({ type: 'MODEL_READY' });
    } catch (err: any) {
      isInitializing = false;
      console.error('Worker Model initialization error:', err);
      self.postMessage({
        type: 'MODEL_ERROR',
        payload: { message: err?.message || 'Failed to download DistilGPT-2 model weights from CDN' },
      });
    }
  }

  if (type === 'ANALYZE_SENTENCE') {
    const { sentence } = payload;
    const startTime = performance.now();

    try {
      if (!model || !tokenizer) {
        throw new Error('Model is not initialized yet.');
      }

      // Tokenize the input sentence
      const encoded = await tokenizer(sentence);
      const rawTokenIds: number[] = Array.from(encoded.input_ids.data);

      if (rawTokenIds.length === 0) {
        throw new Error('Please enter at least one word or token.');
      }

      // Prepend BOS token <|endoftext|> (ID 50256) for strict causal modeling of token 0
      const BOS_ID = 50256;
      const fullInputIds = [BOS_ID, ...rawTokenIds];

      // Convert to tensor for causal LM forward pass
      // In Xenova transformers, we can pass raw input_ids
      const output = await model({
        input_ids: fullInputIds,
      });

      const logitsTensor = output.logits;
      const vocabSize = 50257;
      const seqLen = fullInputIds.length;
      const logitsData: Float32Array = logitsTensor.data;

      const tokensResult: any[] = [];
      const precedingContextStrings: string[] = [];
      let totalNegLogProb = 0;
      let logReciprocalSum = 0;

      for (let i = 0; i < rawTokenIds.length; i++) {
        const targetTokenId = rawTokenIds[i];
        const logitOffset = i * vocabSize; // predictions from step i (conditioned on tokens 0..i-1)
        
        // Find max logit for numerical stability
        let maxLogit = -Infinity;
        for (let v = 0; v < vocabSize; v++) {
          const val = logitsData[logitOffset + v];
          if (val > maxLogit) maxLogit = val;
        }

        // Compute log-sum-exp
        let sumExp = 0;
        for (let v = 0; v < vocabSize; v++) {
          sumExp += Math.exp(logitsData[logitOffset + v] - maxLogit);
        }
        const logSumExp = maxLogit + Math.log(sumExp);

        // Conditional probability of actual token
        const targetLogit = logitsData[logitOffset + targetTokenId];
        const logP = targetLogit - logSumExp;
        const prob = Math.exp(logP);
        const negLog = -logP;

        totalNegLogProb += negLog;
        logReciprocalSum += -logP; // ln(1/P) = -ln(P)

        // Find top 5 alternative predictions
        const candidateIndices: number[] = [];
        for (let v = 0; v < vocabSize; v++) {
          candidateIndices.push(v);
        }
        candidateIndices.sort((a, b) => logitsData[logitOffset + b] - logitsData[logitOffset + a]);
        const top5Ids = candidateIndices.slice(0, 5);

        const topAlternatives = await Promise.all(
          top5Ids.map(async (altId) => {
            const altLogit = logitsData[logitOffset + altId];
            const altLogP = altLogit - logSumExp;
            const altProb = Math.exp(altLogP);
            const decodedAlt = await tokenizer.decode([altId]);
            return {
              token: decodedAlt,
              tokenId: altId,
              probability: altProb,
              logProb: altLogP,
            };
          })
        );

        // Decode actual token
        const decodedToken = await tokenizer.decode([targetTokenId]);
        const cleanToken = decodedToken.trim();
        const hasLeadingSpace = decodedToken.startsWith(' ');

        tokensResult.push({
          index: i,
          token: decodedToken,
          cleanToken: cleanToken || decodedToken,
          hasLeadingSpace,
          tokenId: targetTokenId,
          probability: prob,
          logProb: logP,
          negLogProb: negLog,
          precedingContext: [...precedingContextStrings],
          topAlternatives,
        });

        precedingContextStrings.push(decodedToken);
      }

      const avgNegLog = totalNegLogProb / rawTokenIds.length;
      const perplexity = Math.exp(avgNegLog);

      const log10Product = logReciprocalSum / Math.LN10;
      const exponent = Math.floor(log10Product);
      const mantissa = Math.pow(10, log10Product - exponent);
      let reciprocalProductScientific: string;
      if (Math.abs(exponent) < 6) {
        reciprocalProductScientific = Math.exp(logReciprocalSum).toLocaleString(undefined, {
          maximumFractionDigits: 3,
          minimumFractionDigits: 1,
        });
      } else {
        reciprocalProductScientific = `${mantissa.toFixed(3)} × 10^${exponent}`;
      }

      const inferenceTimeMs = Math.round(performance.now() - startTime);

      self.postMessage({
        type: 'ANALYSIS_COMPLETE',
        payload: {
          sentence,
          tokens: tokensResult,
          tokenCount: tokensResult.length,
          totalNegLogProb,
          avgNegLogProb: avgNegLog,
          perplexity,
          reciprocalProductScientific,
          inferenceTimeMs,
          convention: 'Causal LM (DistilGPT-2): Context initialized with <|endoftext|> (BOS token 50256). Each token P(t_i | t_<i) evaluated conditioned solely on preceding context.',
          modelName: 'DistilGPT-2 (82M params, ONNX WebAssembly)',
          isRealInference: true,
        },
      });
    } catch (err: any) {
      console.error('Analysis error:', err);
      self.postMessage({
        type: 'ANALYSIS_ERROR',
        payload: { message: err?.message || 'Error executing language model inference.' },
      });
    }
  }
};
