import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../useTheme';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      className="flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2.5 shadow-sm transition-colors hover:bg-slate-100 dark:border-slate-600/60 dark:bg-slate-800/50 dark:shadow-none dark:hover:bg-slate-700/50"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 text-slate-500 dark:text-slate-400" />
      ) : (
        <Moon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
      )}
    </button>
  );
}
