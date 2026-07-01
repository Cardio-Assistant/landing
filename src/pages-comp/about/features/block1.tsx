import { motion } from 'framer-motion';
import Link from 'next/link';

import { prefex } from '../page';

import { useI18n } from './i18n/context';

import type { RefObject } from 'react';

export function BlockOne({
  targetRef,
  scrollHintRef,
}: {
  targetRef: RefObject<HTMLDivElement>;
  scrollHintRef: RefObject<HTMLDivElement>;
}) {
  const { t } = useI18n();

  const handleClick = () => {
    targetRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleScrollHint = () => {
    scrollHintRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const metrics = [t.hero.metric1, t.hero.metric2, t.hero.metric3];

  return (
    <section className='relative min-h-screen overflow-hidden bg-white dark:bg-slate-950 pt-28'>
      <div className='pointer-events-none absolute inset-0 bg-dot-slate mask-radial-fade' />
      <div className='pointer-events-none absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-gradient-to-br from-blue-200/50 via-cyan-200/40 to-transparent blur-3xl' />

      <div className='relative mx-auto flex max-w-7xl flex-col items-center px-6 pb-20 pt-16 lg:flex-row lg:gap-12 lg:pb-32 lg:pt-24'>
        <div className='w-full flex-1 text-center lg:text-left'>
          <motion.div
            initial={ { opacity: 0, y: 16 } }
            animate={ { opacity: 1, y: 0 } }
            transition={ { duration: 0.6 } }
            className='mx-auto inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-3.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 backdrop-blur lg:mx-0'
          >
            <span className='relative flex h-2 w-2'>
              <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75' />
              <span className='relative inline-flex h-2 w-2 rounded-full bg-cyan-500' />
            </span>
            {t.hero.badge}
          </motion.div>

          <motion.h1
            initial={ { opacity: 0, y: 20 } }
            animate={ { opacity: 1, y: 0 } }
            transition={ { duration: 0.7, delay: 0.1 } }
            className='mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl'
          >
            {t.hero.title1}<br className='hidden sm:block' /> {t.hero.title2}{' '}
            <span className='text-gradient-accent'>{t.hero.title3}</span>
          </motion.h1>

          <motion.p
            initial={ { opacity: 0, y: 20 } }
            animate={ { opacity: 1, y: 0 } }
            transition={ { duration: 0.7, delay: 0.2 } }
            className='mx-auto mt-6 max-w-xl text-balance text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg lg:mx-0'
          >
            {t.hero.subtitle}
          </motion.p>

          <motion.div
            initial={ { opacity: 0, y: 20 } }
            animate={ { opacity: 1, y: 0 } }
            transition={ { duration: 0.7, delay: 0.3 } }
            className='mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start'
          >
            <Link
              href='/web/auth'
              className='group inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 dark:bg-slate-100 px-6 py-3 text-sm font-medium text-white dark:text-slate-900 shadow-sm transition-all hover:bg-slate-700 dark:hover:bg-white hover:shadow-md sm:w-auto'
            >
              {t.hero.ctaDemo}
              <svg className='h-4 w-4 transition-transform group-hover:translate-x-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={ 2 } d='M17 8l4 4m0 0l-4 4m4-4H3' />
              </svg>
            </Link>
            <button
              onClick={ handleClick }
              className='inline-flex w-full items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 transition-all hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 sm:w-auto'
            >
              {t.hero.ctaTalk}
            </button>
          </motion.div>

          <motion.div
            initial={ { opacity: 0 } }
            animate={ { opacity: 1 } }
            transition={ { duration: 0.7, delay: 0.5 } }
            className='mt-12 grid grid-cols-3 gap-6 border-t border-slate-200 dark:border-slate-800 pt-8 lg:max-w-md'
          >
            {metrics.map((m) => (
              <div key={ m.label } className='text-center lg:text-left'>
                <div className='text-2xl font-semibold tracking-tight text-slate-900 dark:text-white'>{m.value}</div>
                <div className='mt-1 text-xs text-slate-500 dark:text-slate-400'>{m.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={ { opacity: 0, scale: 0.95 } }
          animate={ { opacity: 1, scale: 1 } }
          transition={ { duration: 0.8, delay: 0.2 } }
          className='relative mt-16 flex w-full flex-1 items-center justify-center lg:mt-0'
        >
          <div className='relative'>
            <div className='absolute -inset-8 rounded-full bg-gradient-to-br from-blue-300/30 via-cyan-200/30 to-transparent blur-3xl' />

            <div className='relative animate-float'>
              <div className='relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-xl shadow-slate-200/60 dark:shadow-slate-900/40'>
                <motion.img
                  src={ prefex + '/logo/3d.png' }
                  alt='3D heart model'
                  className='h-auto w-full max-w-[420px] rounded-2xl object-cover'
                />
                <div className='pointer-events-none absolute inset-3 rounded-2xl ring-1 ring-inset ring-white/40' />
              </div>

              <motion.div
                initial={ { opacity: 0, x: -16 } }
                animate={ { opacity: 1, x: 0 } }
                transition={ { duration: 0.6, delay: 0.8 } }
                className='absolute -left-6 top-10 hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 px-3 py-2 text-xs shadow-md backdrop-blur sm:block'
              >
                <div className='flex items-center gap-2'>
                  <span className='h-2 w-2 rounded-full bg-emerald-500' />
                  <span className='font-medium text-slate-900 dark:text-white'>{t.hero.tag1}</span>
                </div>
                <div className='mt-0.5 text-[11px] text-slate-500 dark:text-slate-400'>{t.hero.tag1Sub}</div>
              </motion.div>

              <motion.div
                initial={ { opacity: 0, x: 16 } }
                animate={ { opacity: 1, x: 0 } }
                transition={ { duration: 0.6, delay: 1 } }
                className='absolute -right-6 bottom-12 hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 px-3 py-2 text-xs shadow-md backdrop-blur sm:block'
              >
                <div className='flex items-center gap-2'>
                  <span className='h-2 w-2 rounded-full bg-blue-500' />
                  <span className='font-medium text-slate-900 dark:text-white'>{t.hero.tag2}</span>
                </div>
                <div className='mt-0.5 text-[11px] text-slate-500 dark:text-slate-400'>{t.hero.tag2Sub}</div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      <button
        type='button'
        onClick={ handleScrollHint }
        aria-label='Scroll down'
        className='absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 rounded-full px-4 py-2 text-slate-500 dark:text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-white lg:flex'
      >
        <span className='h-8 w-px bg-gradient-to-b from-transparent via-slate-300 to-slate-400' />
        <span className='flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-sm backdrop-blur animate-bounce-soft'>
          <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={ 2 } d='M19 9l-7 7-7-7' />
          </svg>
        </span>
      </button>
    </section>
  );
}
