import { getSharpName } from '../music';
import type { NoteObject } from '../types';

interface PianoProps {
  targetNote: NoteObject | null;
}

interface WhiteKey {
  midi: number;
  name: string;
  oct: number;
}

interface BlackKey {
  midi: number;
  whiteIndexBefore: number;
}

export function Piano({ targetNote }: PianoProps) {
  const startMidi = 53;
  const endMidi = 107;
  const activeMidi = targetNote?.midi;
  const whiteKeys: WhiteKey[] = [];
  const blackKeys: BlackKey[] = [];
  let whiteIndex = 0;

  for (let midi = startMidi; midi <= endMidi; midi += 1) {
    const name = getSharpName(midi);

    if (name.includes('#')) {
      blackKeys.push({
        midi,
        whiteIndexBefore: whiteIndex - 1,
      });

      continue;
    }

    whiteKeys.push({
      midi,
      name,
      oct: Math.floor(midi / 12) - 1,
    });

    whiteIndex += 1;
  }

  const whiteKeyWidth = 32;
  const blackKeyWidth = 20;

  return (
    <section className="custom-scrollbar w-full overflow-x-auto rounded-xl border border-slate-700 bg-slate-900 p-4 shadow dark:border-slate-600/60 dark:bg-slate-800/50 dark:shadow-none">
      <div
        className="relative mx-auto h-32"
        style={{ width: `${whiteKeys.length * whiteKeyWidth}px` }}
      >
        <div className="flex h-full w-full">
          {whiteKeys.map((key) => (
            <div
              key={key.midi}
              className={`relative h-32 shrink-0 rounded-b border-r border-slate-300 transition-colors last:border-r-0 dark:border-slate-600 ${
                activeMidi === key.midi
                  ? 'bg-blue-400 dark:bg-slate-400'
                  : 'bg-white'
              }`}
              style={{ width: `${whiteKeyWidth}px` }}
            >
              {key.name === 'C' ? (
                <div className="pointer-events-none absolute bottom-2 w-full select-none text-center text-[10px] font-medium text-slate-400 dark:text-slate-500">
                  C{key.oct}
                </div>
              ) : null}
            </div>
          ))}
        </div>

        {blackKeys.map((key) => (
          <div
            key={key.midi}
            className={`absolute top-0 z-10 h-20 rounded-b border border-slate-800 shadow-md transition-colors dark:border-slate-700 ${
              activeMidi === key.midi
                ? 'bg-blue-500 dark:bg-slate-500'
                : 'bg-black dark:bg-slate-900'
            }`}
            style={{
              left: `${(key.whiteIndexBefore + 1) * whiteKeyWidth - blackKeyWidth / 2}px`,
              width: `${blackKeyWidth}px`,
            }}
          />
        ))}
      </div>
    </section>
  );
}
