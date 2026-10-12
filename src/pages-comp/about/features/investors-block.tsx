import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

import { useI18n } from './i18n/context';

// The "for investors" block: three short points (market, model, status), nothing more.
export default function InvestorsBlock() {
  const { t } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-15%' });
  const inv = t.investors;

  return (
    <div ref={ ref } className='mx-auto w-full max-w-6xl px-6 py-24 sm:py-32'>
      <motion.div
        initial={ { opacity: 0, y: 16 } }
        animate={ isInView ? { opacity: 1, y: 0 } : {} }
        transition={ { duration: 0.6 } }
        className='mx-auto max-w-2xl text-center'
      >
        <div className='inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-400'>
          {inv.badge}
        </div>
        <h2 className='mt-5 text-balance text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl'>
          {inv.title}
        </h2>
      </motion.div>

      <div className='mt-14 grid grid-cols-1 gap-6 md:grid-cols-3'>
        {inv.points.map((p, i) => (
          <motion.div
            key={ p.title }
            initial={ { opacity: 0, y: 16 } }
            animate={ isInView ? { opacity: 1, y: 0 } : {} }
            transition={ { duration: 0.6, delay: 0.1 + i * 0.1 } }
            className='rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8'
          >
            <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/15 text-sm font-semibold text-blue-600 dark:text-blue-300 ring-1 ring-blue-100 dark:ring-blue-500/30'>
              {String(i + 1).padStart(2, '0')}
            </div>
            <h3 className='mt-5 text-lg font-semibold tracking-tight text-slate-900 dark:text-white'>{p.title}</h3>
            <p className='mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400'>{p.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
