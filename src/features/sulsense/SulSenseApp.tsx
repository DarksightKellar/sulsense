import { Mic, MicOff, Music } from 'lucide-react';
import { ThemeToggle } from './components/ThemeToggle';
import { startTransition, useCallback, useEffect, useRef, useState } from 'react';
import { IN_TUNE_CENTS_THRESHOLD } from './constants';
import { generateSequence } from './sequence';
import { usePitchDetection } from './usePitchDetection';
import { ModeToggle } from './components/ModeToggle';
import { Piano } from './components/Piano';
import { PitchPanel } from './components/PitchPanel';
import { Staff } from './components/Staff';
import { TrainerControls } from './components/TrainerControls';
import type { DisplaySequenceItem, LevelId, Mode, SequenceItem } from './types';

const REQUIRED_HIT_FRAMES = 5;
const COMPLETION_DELAY_MS = 100;

export default function SulSenseApp() {
  const [mode, setMode] = useState<Mode>('explorer');
  const [currentLevel, setCurrentLevel] = useState<LevelId>(1);
  const [notesPerRun, setNotesPerRun] = useState(1);
  const [targetSequence, setTargetSequence] = useState<SequenceItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hitFrames, setHitFrames] = useState(0);
  const completionTimeoutRef = useRef<number | null>(null);

  const {
    cents,
    errorMessage,
    frequency,
    isListening,
    note: liveNote,
    toggleListening,
  } = usePitchDetection();

  const clearCompletionTimeout = useCallback(() => {
    if (completionTimeoutRef.current === null) {
      return;
    }

    window.clearTimeout(completionTimeoutRef.current);
    completionTimeoutRef.current = null;
  }, []);

  const initializeSequence = useCallback(
    (level: LevelId = currentLevel, runLength: number = notesPerRun) => {
      clearCompletionTimeout();

      startTransition(() => {
        setTargetSequence(generateSequence(level, runLength));
        setActiveIndex(0);
        setHitFrames(0);
      });
    },
    [clearCompletionTimeout, currentLevel, notesPerRun],
  );

  const resetTrainerState = useCallback(() => {
    clearCompletionTimeout();

    startTransition(() => {
      setTargetSequence([]);
      setActiveIndex(0);
      setHitFrames(0);
    });
  }, [clearCompletionTimeout]);

  function handleModeChange(nextMode: Mode) {
    setMode(nextMode);

    if (nextMode === 'trainer') {
      initializeSequence();
      return;
    }

    clearCompletionTimeout();
    setHitFrames(0);
  }

  function handleLevelChange(level: LevelId) {
    setCurrentLevel(level);

    if (mode === 'trainer') {
      initializeSequence(level, notesPerRun);
      return;
    }

    resetTrainerState();
  }

  function handleNotesPerRunChange(nextRunLength: number) {
    setNotesPerRun(nextRunLength);

    if (mode === 'trainer') {
      initializeSequence(currentLevel, nextRunLength);
      return;
    }

    resetTrainerState();
  }

  useEffect(() => {
    if (mode !== 'trainer') {
      return;
    }

    const currentTarget = targetSequence[activeIndex];

    if (!currentTarget) {
      return;
    }

    const isCorrectPitch =
      liveNote?.midi === currentTarget.noteObj.midi &&
      Math.abs(cents) <= IN_TUNE_CENTS_THRESHOLD;

    if (!isCorrectPitch) {
      setHitFrames((currentFrames) => Math.max(0, currentFrames - 1));
      return;
    }

    setHitFrames((currentFrames) => {
      const nextFrames = currentFrames + 1;

      if (nextFrames < REQUIRED_HIT_FRAMES) {
        return nextFrames;
      }

      if (activeIndex < targetSequence.length - 1) {
        setActiveIndex((currentIndex) => currentIndex + 1);
      } else if (completionTimeoutRef.current === null) {
        completionTimeoutRef.current = window.setTimeout(() => {
          completionTimeoutRef.current = null;
          initializeSequence();
        }, COMPLETION_DELAY_MS);
      }

      return 0;
    });
  }, [activeIndex, cents, initializeSequence, liveNote, mode, targetSequence]);

  useEffect(() => {
    return () => {
      if (completionTimeoutRef.current !== null) {
        window.clearTimeout(completionTimeoutRef.current);
      }
    };
  }, []);

  const displaySequence: DisplaySequenceItem[] =
    mode === 'explorer'
      ? liveNote
        ? [
            {
              noteObj: liveNote,
              constraint: null,
              finger: null,
            },
          ]
        : []
      : targetSequence;

  const displayIndex = mode === 'explorer' ? 0 : activeIndex;
  const displayPianoNote = mode === 'explorer' ? liveNote : targetSequence[activeIndex]?.noteObj ?? null;

  return (
    <div className="min-h-screen bg-transparent p-4 text-slate-800 md:p-6 dark:text-slate-100">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-5xl flex-col md:min-h-[calc(100vh-3rem)]">
        <header className="mb-6 flex w-full shrink-0 flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-slate-900 dark:font-black dark:text-slate-50">
              <Music className="h-8 w-8 text-blue-600 dark:text-slate-400" />
              SulSense
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-300/80">
              Incremental Fingerboard Internalization
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <ModeToggle mode={mode} onChange={handleModeChange} />
          </div>

          <button
            type="button"
            onClick={toggleListening}
            className={`flex items-center gap-2 rounded-full px-6 py-3 font-bold text-white! shadow-md transition-colors ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700'
                : 'bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="h-5 w-5" />
                Stop Mic
              </>
            ) : (
              <>
                <Mic className="h-5 w-5" />
                Start Mic
              </>
            )}
          </button>
        </header>

        <main className="flex w-full min-h-0 grow flex-col gap-6">
          <div className="grid grow grid-cols-1 gap-6 min-h-0 lg:grid-cols-3">
            <div className="flex flex-col gap-6 lg:col-span-1">
              <PitchPanel
                cents={cents}
                errorMessage={errorMessage}
                frequency={frequency}
                isListening={isListening}
                liveNote={liveNote}
              />

              <TrainerControls
                currentLevel={currentLevel}
                notesPerRun={notesPerRun}
                onLevelChange={handleLevelChange}
                onNotesPerRunChange={handleNotesPerRunChange}
              />
            </div>

            <div className="flex min-h-87.5 flex-col space-y-2 lg:col-span-2">
              <div className="shrink-0 text-center text-sm font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300/80">
                {mode === 'explorer' ? 'Explorer Visualization' : 'Trainer Target Sequence'}
              </div>
              <div className="grow">
                <Staff
                  activeIndex={displayIndex}
                  cents={cents}
                  currentLevel={currentLevel}
                  hitFrames={hitFrames}
                  liveNote={liveNote}
                  mode={mode}
                  sequence={displaySequence}
                />
              </div>
            </div>
          </div>

          <section className="mt-auto w-full shrink-0 space-y-2 pt-4">
            <div className="text-center text-sm font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300/80">
              Piano Reference
            </div>
            <Piano targetNote={displayPianoNote} />
          </section>
        </main>
      </div>
    </div>
  );
}
