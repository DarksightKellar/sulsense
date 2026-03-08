import { Activity, Target } from 'lucide-react';
import type { Mode } from '../types';

interface ModeToggleProps {
  mode: Mode;
  onChange: (mode: Mode) => void;
}

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-1.5 shadow-sm dark:border-slate-600/60 dark:bg-slate-800/50 dark:shadow-none">
      <button
        type="button"
        aria-pressed={mode === 'explorer'}
        onClick={() => onChange('explorer')}
        className={`flex items-center gap-2 rounded-md px-4 py-2 transition-colors ${
          mode === 'explorer'
            ? 'bg-blue-100 font-semibold text-blue-700 dark:bg-slate-600 dark:text-white'
            : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700/50'
        }`}
      >
        <Activity
          className={`h-4 w-4 ${mode === 'explorer' ? 'text-blue-700 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}
        />
        Explorer
      </button>

      <button
        type="button"
        aria-pressed={mode === 'trainer'}
        onClick={() => onChange('trainer')}
        className={`flex items-center gap-2 rounded-md px-4 py-2 transition-colors ${
          mode === 'trainer'
            ? 'bg-indigo-100 font-semibold text-indigo-700 dark:bg-slate-600 dark:text-white'
            : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700/50'
        }`}
      >
        <Target
          className={`h-4 w-4 ${mode === 'trainer' ? 'text-indigo-700 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}
        />
        Trainer
      </button>
    </div>
  );
}
