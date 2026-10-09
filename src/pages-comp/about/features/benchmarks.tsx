import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

import { useI18n } from './i18n/context';

// Numbers measured on the project GPU stand (see `benchmarks` in the dictionary).
export function BenchmarksStrip() {
  const { t } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-15%' });
  const b = t.benchmarks;

  return (
    <div ref={ ref } className='mt-20'>
      <motion.div
        initial={ { opacity: 0, y: 16 } }
        animate={ isInView ? { opacity: 1, y: 0 } : {} }
        transition={ { duration: 0.6 } }
        className='mx-auto max-w-2xl text-center'
      >
        <h3 className='text-balance text-xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-2xl'>
          {b.title}
        </h3>
        <p className='mt-3 text-balance text-sm leading-relaxed text-slate-600 dark:text-slate-400'>{b.subtitle}</p>
      </motion.div>

      <div className='mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-200 dark:bg-slate-800 sm:grid-cols-2 lg:grid-cols-4'>
        {b.items.map((m, i) => (
          <motion.div
            key={ m.label }
            initial={ { opacity: 0, y: 16 } }
            animate={ isInView ? { opacity: 1, y: 0 } : {} }
            transition={ { duration: 0.6, delay: 0.1 + i * 0.1 } }
            className='bg-white dark:bg-slate-900 p-8'
          >
            <div className='text-4xl font-semibold tracking-tight'>
              <span className='text-gradient-accent'>{m.value}</span>
            </div>
            <div className='mt-3 text-sm font-medium text-slate-900 dark:text-white'>{m.label}</div>
            <div className='mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400'>{m.note}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
