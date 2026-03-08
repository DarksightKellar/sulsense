import { Activity, Target } from 'lucide-react';
import type { Mode } from '../types';

interface ModeToggleProps {
  mode: Mode;
  onChange: (mode: Mode) => void;
}

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
      <button
        type="button"
        aria-pressed={mode === 'explorer'}
        onClick={() => onChange('explorer')}
        className={`flex items-center gap-2 rounded-md px-4 py-2 transition-colors ${
          mode === 'explorer'
            ? 'bg-blue-100 font-semibold text-blue-700'
            : 'hover:bg-slate-100'
        }`}
      >
        <Activity className="h-4 w-4" />
        Explorer
      </button>

      <button
        type="button"
        aria-pressed={mode === 'trainer'}
        onClick={() => onChange('trainer')}
        className={`flex items-center gap-2 rounded-md px-4 py-2 transition-colors ${
          mode === 'trainer'
            ? 'bg-indigo-100 font-semibold text-indigo-700'
            : 'hover:bg-slate-100'
        }`}
      >
        <Target className="h-4 w-4" />
        Trainer
      </button>
    </div>
  );
}
