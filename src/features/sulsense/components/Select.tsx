import { ChevronDown } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface SelectOption<T> {
  value: T;
  label: string;
}

interface SelectProps<T> {
  id?: string;
  label: string;
  options: readonly SelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function Select<T extends number | string>({
  id,
  label,
  options,
  value,
  onChange,
}: SelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayLabel = selectedOption?.label ?? String(value);

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        close();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, close]);

  function handleSelect(optionValue: T) {
    onChange(optionValue);
    close();
  }

  return (
    <div ref={containerRef} className="relative">
      <label
        htmlFor={id}
        className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400"
      >
        {label}
      </label>
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={id}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 font-medium text-slate-700 outline-none transition-colors hover:bg-slate-100 focus:ring-2 focus:ring-indigo-500 dark:border-slate-600/80 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:bg-slate-800/80 dark:focus:ring-slate-500"
      >
        <span>{displayLabel}</span>
        <ChevronDown
          className={`h-4 w-4 text-slate-500 transition-transform dark:text-slate-400 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen ? (
        <ul
          role="listbox"
          className="absolute top-full z-20 mt-1 max-h-48 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-600/80 dark:bg-slate-900"
        >
          {options.map((option) => (
            <li
              key={String(option.value)}
              role="option"
              aria-selected={option.value === value}
              onClick={() => handleSelect(option.value)}
              className={`cursor-pointer px-3 py-2 transition-colors ${
                option.value === value
                  ? 'bg-slate-100 font-medium text-slate-800 dark:bg-slate-700 dark:text-slate-100'
                  : 'text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
