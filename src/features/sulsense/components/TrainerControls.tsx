import { LEVEL_IDS, LEVELS, NOTES_PER_RUN_OPTIONS } from '../constants';
import type { LevelId } from '../types';

interface TrainerControlsProps {
  currentLevel: LevelId;
  notesPerRun: number;
  onLevelChange: (level: LevelId) => void;
  onNotesPerRunChange: (notesPerRun: number) => void;
}

export function TrainerControls({
  currentLevel,
  notesPerRun,
  onLevelChange,
  onNotesPerRunChange,
}: TrainerControlsProps) {
  return (
    <section className="flex flex-col gap-5 rounded-xl border border-slate-200 bg-white p-6 shadow">
      <div>
        <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          Trainer Level
        </h2>
        <select
          value={currentLevel}
          onChange={(event) => onLevelChange(Number(event.target.value) as LevelId)}
          className="w-full rounded-lg border border-slate-300 bg-slate-50 p-2.5 font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {LEVEL_IDS.map((levelId) => (
            <option key={levelId} value={levelId}>
              {LEVELS[levelId].name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          Sequence Length
        </h2>
        <select
          value={notesPerRun}
          onChange={(event) => onNotesPerRunChange(Number(event.target.value))}
          className="w-full rounded-lg border border-slate-300 bg-slate-50 p-2.5 font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {NOTES_PER_RUN_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option} {option === 1 ? 'Note' : 'Notes'}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}
