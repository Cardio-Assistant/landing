import { motion } from 'framer-motion';

import { useI18n } from './i18n/context';

import type { RefObject } from 'react';

export function ProblemBlock({
  targetRef,
  isInView,
}: {
  targetRef: RefObject<HTMLDivElement>;
  isInView: boolean;
}) {
  const { t } = useI18n();

  return (
    <section ref={ targetRef } className='relative bg-white dark:bg-slate-950 py-24 sm:py-32'>
      <div className='mx-auto max-w-7xl px-6'>
        <motion.div
          initial={ { opacity: 0, y: 16 } }
          animate={ isInView ? { opacity: 1, y: 0 } : {} }
          transition={ { duration: 0.6 } }
          className='mx-auto max-w-2xl text-center'
        >
          <div className='inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700'>
            {t.problem.badge}
          </div>
          <h2 className='mt-5 text-balance text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl'>
            {t.problem.title}
          </h2>
          <p className='mx-auto mt-5 max-w-xl text-balance text-base leading-relaxed text-slate-600 dark:text-slate-400'>
            {t.problem.subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={ { opacity: 0, y: 16 } }
          animate={ isInView ? { opacity: 1, y: 0 } : {} }
          transition={ { duration: 0.6, delay: 0.15 } }
          className='mx-auto mt-14 max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center sm:p-10'
        >
          <div className='text-5xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-6xl'>
            <span className='text-gradient-accent'>{t.problem.stat.value}</span>
          </div>
          <div className='mt-3 text-sm font-medium text-slate-900 dark:text-white'>{t.problem.stat.label}</div>
          <div className='mt-1 text-sm text-slate-500 dark:text-slate-400'>{t.problem.stat.note}</div>
        </motion.div>
      </div>
    </section>
  );
}
