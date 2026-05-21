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
    <section ref={ targetRef } className='relative bg-white py-24 sm:py-32'>
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
          <h2 className='mt-5 text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl'>
            {t.problem.title}
          </h2>
          <p className='mx-auto mt-5 max-w-xl text-balance text-base leading-relaxed text-slate-600'>
            {t.problem.subtitle}
          </p>
        </motion.div>

        <div className='mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-slate-200 bg-slate-200 md:grid-cols-3'>
          {t.problem.stats.map((s, i) => (
            <motion.div
              key={ s.label }
              initial={ { opacity: 0, y: 16 } }
              animate={ isInView ? { opacity: 1, y: 0 } : {} }
              transition={ { duration: 0.6, delay: 0.15 + i * 0.1 } }
              className='bg-white p-8 sm:p-10'
            >
              <div className='text-5xl font-semibold tracking-tight text-slate-900 sm:text-6xl'>
                <span className='text-gradient-accent'>{s.value}</span>
              </div>
              <div className='mt-3 text-sm font-medium text-slate-900'>{s.label}</div>
              <div className='mt-1 text-sm leading-relaxed text-slate-500'>{s.note}</div>
            </motion.div>
          ))}
        </div>

        <div className='mt-12 grid grid-cols-1 gap-6 md:grid-cols-3'>
          {t.problem.items.map((p, i) => (
            <motion.div
              key={ p.title }
              initial={ { opacity: 0, y: 16 } }
              animate={ isInView ? { opacity: 1, y: 0 } : {} }
              transition={ { duration: 0.6, delay: 0.4 + i * 0.1 } }
              className='group relative rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-slate-300 hover:shadow-sm'
            >
              <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-700'>
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3 className='mt-4 text-base font-semibold text-slate-900'>{p.title}</h3>
              <p className='mt-2 text-sm leading-relaxed text-slate-600'>{p.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
