'use client';
import { motion } from 'framer-motion';

import { useI18n } from './context';

export function LangSwitch({ className = '' }: { className?: string }) {
  const { locale, setLocale } = useI18n();
  const isEn = locale === 'en';

  return (
    <div
      className={ `relative inline-flex h-8 items-center rounded-full border border-slate-200 bg-white p-0.5 text-[11px] font-semibold dark:border-slate-700 dark:bg-slate-900 ${className}` }
      role='group'
    >
      <motion.span
        layout
        transition={ { type: 'spring', stiffness: 500, damping: 34 } }
        className='absolute inset-y-0.5 w-9 rounded-full bg-slate-900 shadow-sm dark:bg-slate-100'
        style={ { left: isEn ? 'calc(50% - 2px)' : '2px' } }
      />
      <button
        onClick={ () => setLocale('ru') }
        className={ `relative z-10 w-9 rounded-full py-1 transition-colors ${!isEn ? 'text-white dark:text-slate-900' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'}` }
        aria-label='Русский'
      >
        RU
      </button>
      <button
        onClick={ () => setLocale('en') }
        className={ `relative z-10 w-9 rounded-full py-1 transition-colors ${isEn ? 'text-white dark:text-slate-900' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'}` }
        aria-label='English'
      >
        EN
      </button>
    </div>
  );
}
