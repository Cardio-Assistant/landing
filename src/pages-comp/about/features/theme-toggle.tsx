'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { FiMonitor, FiMoon, FiSun } from 'react-icons/fi';

const OPTIONS = [
  { value: 'light', label: 'Светлая тема', Icon: FiSun },
  { value: 'system', label: 'Системная тема', Icon: FiMonitor },
  { value: 'dark', label: 'Тёмная тема', Icon: FiMoon },
] as const;

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        className={ `h-8 w-[86px] rounded-full border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 ${className}` }
        aria-hidden
      />
    );
  }

  const current = theme ?? 'system';

  return (
    <div
      className={ `inline-flex h-8 items-center gap-0.5 rounded-full border border-slate-200 bg-white p-0.5 dark:border-slate-700 dark:bg-slate-900 ${className}` }
      role='group'
      aria-label='Тема'
    >
      {OPTIONS.map(({ value, label, Icon }) => {
        const active = current === value;

        return (
          <button
            key={ value }
            type='button'
            onClick={ () => setTheme(value) }
            title={ label }
            aria-label={ label }
            aria-pressed={ active }
            className={ `flex h-7 w-7 items-center justify-center rounded-full transition-colors ${active
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'}` }
          >
            <Icon size={ 14 } />
          </button>
        );
      })}
    </div>
  );
}
