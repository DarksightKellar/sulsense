import { LEVELS } from '../constants';
import { formatOrdinal, getTunerColor } from '../music';
import type { DisplaySequenceItem, LevelId, Mode, NoteObject } from '../types';

const E4_STEP = 30;
const E4_Y = 100;
const STAFF_LINE_GAP = 20;
const STEP_SPACING = 10;
const NOTE_GAP = 85;

interface StaffProps {
  activeIndex: number;
  cents: number;
  currentLevel: LevelId;
  liveNote: NoteObject | null;
  mode: Mode;
  sequence: readonly DisplaySequenceItem[];
  hitFrames: number;
}

function getLedgerLinePositions(noteY: number) {
  const lines: number[] = [];

  if (noteY > 120) {
    for (let position = 120; position <= noteY; position += STAFF_LINE_GAP) {
      lines.push(position);
    }
  }

  if (noteY < 0) {
    for (let position = 0; position >= noteY; position -= STAFF_LINE_GAP) {
      lines.push(position);
    }
  }

  return lines;
}

export function Staff({
  activeIndex,
  cents,
  currentLevel,
  liveNote,
  mode,
  sequence,
  hitFrames,
}: StaffProps) {
  const position = LEVELS[currentLevel].position;
  const startX = 200 - ((sequence.length - 1) * NOTE_GAP) / 2;

  return (
    <section className="relative flex h-full w-full items-center overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow sm:p-8">
      {mode === 'trainer' && sequence.length > 0 ? (
        <div className="absolute top-4 left-6 z-10 flex flex-col transition-opacity duration-300 sm:top-6 sm:left-8">
          <div className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 font-sans text-xs font-bold uppercase tracking-wider text-slate-500 shadow-sm sm:text-sm">
            {formatOrdinal(position)} Position
          </div>
        </div>
      ) : null}

      <svg width="100%" height="100%" viewBox="0 -150 400 350" className="mx-auto">
        {[0, 1, 2, 3, 4].map((index) => (
          <line
            key={index}
            x1="30"
            y1={20 + index * STAFF_LINE_GAP}
            x2="370"
            y2={20 + index * STAFF_LINE_GAP}
            stroke="#1e293b"
            strokeWidth="2"
          />
        ))}

        <text
          x="40"
          y="60"
          fontSize="120"
          fontFamily="serif"
          fill="#1e293b"
          dominantBaseline="central"
          textAnchor="middle"
        >
          𝄞
        </text>

        {sequence.map((item, index) => {
          const noteY = E4_Y - (item.noteObj.step - E4_STEP) * STEP_SPACING;
          const noteX = startX + index * NOTE_GAP;
          const ledgerLines = getLedgerLinePositions(noteY);
          const isActiveNote = mode === 'trainer' && index === activeIndex;
          const isCompletedNote = mode === 'trainer' && index < activeIndex;

          let noteColor = '#0f172a';
          let fingerColor = '#475569';
          let scaleValue = 1;

          if (mode === 'trainer') {
            if (isCompletedNote) {
              noteColor = '#10b981';
            } else if (isActiveNote) {
              noteColor =
                liveNote?.midi === item.noteObj.midi ? getTunerColor(cents) : '#0f172a';
              scaleValue = 1.15;
            } else {
              noteColor = '#cbd5e1';
              fingerColor = '#cbd5e1';
            }
          } else {
            noteColor = getTunerColor(cents);
          }

          const previousItem = sequence[index - 1];
          const showConstraint =
            mode === 'trainer' &&
            item.constraint &&
            (index === 0 || item.constraint !== previousItem?.constraint);
          const constraintLabel = item.constraint?.toLowerCase() ?? '';

          return (
            <g
              key={`${item.noteObj.string}-${index}`}
              transform={`translate(${noteX}, ${noteY}) scale(${scaleValue})`}
              style={{ transition: 'transform 0.15s ease-out' }}
            >
              {ledgerLines.map((lineY) => (
                <line
                  key={lineY}
                  x1={-18}
                  y1={lineY - noteY}
                  x2={18}
                  y2={lineY - noteY}
                  stroke="#1e293b"
                  strokeWidth="2"
                />
              ))}

              {item.noteObj.acc === '#' ? (
                <text x="-26" y="8" fontSize="26" fontFamily="sans-serif" fill={noteColor}>
                  ♯
                </text>
              ) : null}

              {item.noteObj.acc === 'b' ? (
                <text x="-26" y="8" fontSize="26" fontFamily="sans-serif" fill={noteColor}>
                  ♭
                </text>
              ) : null}

              <ellipse cx="0" cy="0" rx="13" ry="9" fill={noteColor} transform="rotate(-15)" />

              {item.finger !== null && index === 0 ? (
                <text
                  x="-5"
                  y="-18"
                  fontSize="18"
                  fontFamily="serif"
                  fontWeight="bold"
                  fill={fingerColor}
                  stroke="white"
                  strokeWidth="4"
                  paintOrder="stroke"
                >
                  {item.finger}
                </text>
              ) : null}

              {showConstraint ? (
                <text
                  x="0"
                  y={-45 - noteY}
                  textAnchor="middle"
                  fontSize="16"
                  fontStyle="italic"
                  fontFamily="serif"
                  fontWeight="bold"
                  fill={index > activeIndex ? '#cbd5e1' : '#475569'}
                >
                  {constraintLabel}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>

      {mode === 'trainer' ? (
        <div className="absolute right-0 bottom-0 left-0 h-3 overflow-hidden bg-slate-100">
          <div
            className="h-full bg-emerald-500 transition-all duration-100 ease-linear"
            style={{ width: `${(hitFrames / 5) * 100}%` }}
          />
        </div>
      ) : null}
    </section>
  );
}
