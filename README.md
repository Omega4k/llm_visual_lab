# LLM Visual Lab

A local, interactive learning tool that shows how AI / LLMs work:
tokens, embeddings, attention, and next-token prediction — with a small
local Llama model for live examples. Nothing leaves your machine.

## Status

Ten lessons: token visualizer (teaching approximation), 3D embedding word
cloud (with why words cluster), animated toy training run with a 3D loss
landscape, attention explorer, next-token probability stepper (real
temperature maths on teaching data), a layer-by-layer token journey through
the transformer stack, a real trainable toy model in 3D, context-window
forgetting demo, hallucination traps, and a streaming playground that talks
to a local model server. Lessons 1–6, 8 and 9 are schematic teaching models;
lesson 7 is a real tiny model in the page; lesson 10 uses the real model.

## Run it

From this folder:

```
python -m http.server 8000
```

Then open http://localhost:8000 in your browser.

No build step and no Node.js required. The 3D view loads its library from
a CDN on first use; everything else works offline.

## Local model setup

1. Install Ollama from ollama.com/download
2. Pull the small model (1.3 GB):

   ```
   ollama pull llama3.2:1b
   ```

3. Start it (`ollama serve`, or launch the Ollama app).
4. In the page, press **Re-check** — the status pill should turn green.

Optional upgrade for better generations (2.0 GB): `llama3.2:3b`
(change `MODEL` at the top of `app.js`).

## Files

- `index.html` — page structure and lesson text
- `styles.css` — all styling
- `app.js` — tokenizer demo, model status/generation, 3D embedding scene

## Features

- Knowledge levels (Beginner / Medium / Expert), four colour themes, optional sound. Pilot: lessons 1 and 5 are additive — the base text never changes, higher levels only reveal tagged “goes deeper” blocks (highlighted briefly on level-up); the other lessons still swap text per level
- Progress tracking, saved locally; checkpoint quizzes (2 questions per lesson) live in a slide-in Quiz drawer (button in the top bar), separate from the lessons
- "Mark complete" plus a Next-lesson button on every lesson
- Lesson 1 compares the teaching splitter with a real BPE tokenizer (GPT-2 family,
  loaded on demand; Llama's algorithm is the same family with a larger vocabulary)
- Lesson 7 can be retrained on your own sentences (vocabulary rebuilds from your words)
- Lesson 3 has a 3D loss landscape: a ball descends by real gradient descent with a learning-rate slider (crawl, settle, or overshoot the valley)
- Lesson 10 uses real Ollama debug data: per-token logprobs with clickable tokens, 3D candidate towers, a model-facts card (`/api/show`), server-measured tok/s, and the full context token-ID strip (template tokens included)
- Top-of-page showcase: a live token journey — your prompt's tokens rise through a 16-layer 3D stack while the real model generates, ending in real next-token candidate towers (layer pass is a labelled schematic replay; tokens, output and probabilities are real)

## Roadmap

- Attention explorer for your own sentences
- Toy-model generation mode (chain its predictions into sentences)
- Mobile / touch polish
