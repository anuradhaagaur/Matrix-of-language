# THE MATRIX OF LANGUAGE
### An Interactive Language Model Perplexity Explorer

> *"EVERY WORD IS A PREDICTION."*

**The Matrix of Language** is an interactive, cinematic web application that demystifies causal language modeling, tokenization, conditional probabilities, and perplexity. Designed with a cyberpunk aesthetic, it allows users to feed sentences into a real language model (DistilGPT-2), watch sentences disintegrate into tokens, observe probability pulses across sequential dependencies, and calculate perplexity step-by-step.

---

## 🔮 Key Features

- **Cyberpunk Pink & Electric Magenta Aesthetic**: Cinematic digital environment inspired by neural research instruments.
- **Real Language Model Inference**: In-browser DistilGPT-2 forward pass and tokenization using Transformers.js and ONNX WebAssembly.
- **Signature Animation 1 — Sentence Disintegration**: Cinematic 5-phase transformation from raw text characters into Byte-Pair Encoding (BPE) token blocks.
- **Signature Animation 2 — Probability Pulse**: Dynamic Bézier connection network where node luminance and particle pulses reflect conditional token probabilities.
- **Signature Animation 3 — The Final Reveal**: Particle convergence, mathematical synthesis, and expanding shockwave revealing the quantified perplexity score.
- **Token Decomposition**: Deep inspection of BPE tokens, GPT-2 vocabulary IDs (50,257 tokens), negative log probabilities, and full conditioning context.
- **Probability Matrix**: SVG trajectory curve of model certainty across the sequence and alternative next-token candidate probability distributions.
- **Perplexity Engine**: Interactive 5-stage mathematical breakdown of the perplexity formula:
  $$\text{Perplexity} = \exp\left( -\frac{1}{N} \sum_{i=1}^N \ln P(\text{token}_i \mid \text{previous tokens}) \right)$$
- **Manual Experiment Chamber**: Decoupled probability editor with presets, sliders, and live reciprocal geometric mean calculations.
- **Matrix Lab**: Interactive 2D/3D computational viewport supporting Orbit Topology, Causal Stream, and Probability Radar views.
- **Educational Cards**: Beginner-friendly deep dives into tokens, softmax probabilities, perplexity interpretation, and evaluation conventions.

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/anuradhaagaur/matrix-of-language.git
cd matrix-of-language

# Install dependencies
npm install --legacy-peer-deps --ignore-scripts

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Tech Stack

- **Framework**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, PostCSS
- **Animations & Effects**: Framer Motion, HTML5 Canvas, Canvas Confetti
- **Icons**: Lucide React
- **ML / Neural Runtime**: Transformers.js, ONNX Runtime WebAssembly, DistilGPT-2

---

## 📜 Evaluation Convention

- **Architecture**: Causal Transformer (DistilGPT-2, 6 Layers, 82M parameters, 50,257 vocabulary tokens).
- **Conditioning**: Initialized with `<|endoftext|>` Beginning-of-Sequence token (ID 50256). Each token $t_i$ is evaluated strictly against preceding tokens $t_{<i}$.
