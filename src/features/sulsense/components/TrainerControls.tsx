import { LEVEL_IDS, LEVELS, NOTES_PER_RUN_OPTIONS } from '../constants';
import type { LevelId } from '../types';
import { Select } from './Select';

interface TrainerControlsProps {
  currentLevel: LevelId;
  notesPerRun: number;
  onLevelChange: (level: LevelId) => void;
  onNotesPerRunChange: (notesPerRun: number) => void;
}

const LEVEL_OPTIONS = LEVEL_IDS.map((id) => ({
  value: id,
  label: LEVELS[id].name,
}));

const NOTES_OPTIONS = NOTES_PER_RUN_OPTIONS.map((n) => ({
  value: n,
  label: `${n} ${n === 1 ? 'Note' : 'Notes'}`,
}));

export function TrainerControls({
  currentLevel,
  notesPerRun,
  onLevelChange,
  onNotesPerRunChange,
}: TrainerControlsProps) {
  return (
    <section className="flex flex-col gap-5 rounded-xl border border-slate-200 bg-white p-6 shadow dark:border-slate-600/60 dark:bg-slate-800/50 dark:shadow-none">
      <Select
        id="trainer-level"
        label="Trainer Level"
        options={LEVEL_OPTIONS}
        value={currentLevel}
        onChange={onLevelChange}
      />
      <Select
        id="sequence-length"
        label="Sequence Length"
        options={NOTES_OPTIONS}
        value={notesPerRun}
        onChange={onNotesPerRunChange}
      />
    </section>
  );
}
