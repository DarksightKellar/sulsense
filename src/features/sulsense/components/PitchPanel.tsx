import { IN_TUNE_CENTS_THRESHOLD } from '../constants';
import { clampCents, getTunerColor } from '../music';
import type { NoteObject } from '../types';

interface PitchPanelProps {
  cents: number;
  errorMessage: string | null;
  frequency: number | null;
  isListening: boolean;
  liveNote: NoteObject | null;
}

export function PitchPanel({
  cents,
  errorMessage,
  frequency,
  isListening,
  liveNote,
}: PitchPanelProps) {
  const displayedCents = cents > 0 ? `+${cents}` : `${cents}`;

  return (
    <section className="flex min-h-55 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-6 shadow dark:border-slate-600/60 dark:bg-slate-800/50 dark:shadow-none">
      <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
        Live Pitch Data
      </h2>

      <div className="w-full text-center text-6xl font-black tracking-tighter text-slate-800 dark:text-slate-50">
        {liveNote?.string ?? '--'}
      </div>

      <div className="mt-2 h-5 text-sm font-mono text-slate-400 dark:text-slate-300/70">
        {frequency ? `${frequency.toFixed(1)} Hz` : isListening ? 'Listening…' : 'Mic Offline'}
      </div>

      <div
        className={`mt-3 min-h-5 text-center text-sm ${
          errorMessage ? 'text-rose-600 dark:text-rose-300' : 'text-transparent'
        }`}
        aria-live="polite"
      >
        {errorMessage ?? 'Ready'}
      </div>

      {liveNote ? (
        <div className="mt-4 w-full px-2">
          <div className="mb-1 flex justify-between text-xs text-slate-400 dark:text-slate-300/70">
            <span className="text-slate-400 dark:text-slate-300/70">Flat</span>
            <span className="px-2 font-bold tracking-widest text-slate-800 dark:text-slate-200">
              {displayedCents}
            </span>
            <span className="text-slate-400 dark:text-slate-300/70">Sharp</span>
          </div>

          <div className="relative h-4 overflow-hidden rounded-full border border-slate-300 bg-slate-100 dark:border-slate-600/80 dark:bg-slate-950/80">
            <div className="absolute top-0 bottom-0 left-1/2 z-10 w-0.5 bg-slate-400 dark:bg-slate-400/90" />
            <div
              className="absolute top-0 bottom-0 -ml-1 w-2 rounded-full transition-all duration-75"
              style={{
                left: `${50 + clampCents(cents)}%`,
                backgroundColor: getTunerColor(cents),
                boxShadow:
                  Math.abs(cents) <= IN_TUNE_CENTS_THRESHOLD
                    ? `0 0 8px ${getTunerColor(cents, 0.8)}`
                    : `0 0 6px ${getTunerColor(cents, 0.45)}`,
              }}
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}
