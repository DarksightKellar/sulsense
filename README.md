# SulSense

**Incremental Fingerboard Internalization** — a web app that trains violin fingerboard awareness with live pitch tracking and structured note runs.

## Tech Stack

- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4
- Lucide React
- Vitest

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Local dev server |
| `npm run build` | TypeScript + Vite production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | ESLint |
| `npm run test:unit` | Vitest unit tests |
| `npm run typecheck` | TypeScript check only |

## Modes

1. **Explorer** — Free exploration: mic on, live pitch shown on staff and piano.
2. **Trainer** — Structured practice: random note sequences from a chosen level; play each note in tune for 5 consecutive frames to advance.

## Domain

- **Positions 1–4** map to violin fingerboard positions.
- **Sequence items** include note, string constraint, and finger number.
- **Tuning**: ±20 cents around the target note counts as in tune.

## Pitch Detection

- Uses `getUserMedia` for mic input.
- Web Audio `AnalyserNode` + autocorrelation for frequency.
- High-pass filter at 160 Hz to reduce low rumble.
- Converts Hz → MIDI → `NoteObject`; `getCents` for tuning feedback.

## Deployment

Configured for Netlify via `netlify.toml`. Connect the repo in the Netlify UI; build settings are read from the config.
