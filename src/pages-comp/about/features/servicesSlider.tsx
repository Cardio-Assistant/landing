'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { useI18n } from './i18n/context';

export default function ServicesSlider() {
  const { t } = useI18n();
  const slides = t.investors.slides;
  const tabs = t.investors.tabs;
  const [[active, direction], setState] = useState<[number, number]>([0, 0]);

  const goTo = (next: number) => {
    if (next < 0 || next > slides.length - 1 || next === active) return;
    setState([next, next > active ? 1 : -1]);
  };

  const go = (dir: 'left' | 'right') => {
    goTo(dir === 'left' ? active - 1 : active + 1);
  };

  const current = slides[active];
  const pointsGridCols = current.points.length === 4 ? 'sm:grid-cols-2' : 'sm:grid-cols-3';

  return (
    <div className='mx-auto w-full max-w-6xl px-6 py-24 sm:py-32'>
      <div className='mx-auto max-w-2xl text-center'>
        <div className='inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600'>
          {t.investors.badge}
        </div>
        <h2 className='mt-5 text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl'>
          {t.investors.title}
        </h2>
        <p className='mx-auto mt-5 max-w-xl text-balance text-base leading-relaxed text-slate-600'>
          {t.investors.subtitle}
        </p>
      </div>

      <div className='mt-12 flex items-center justify-center gap-2 overflow-x-auto'>
        <button
          onClick={ () => go('left') }
          disabled={ active === 0 }
          className='hidden h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40 sm:inline-flex'
          aria-label='Prev'
        >
          <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={ 2 } className='h-4 w-4'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M15 19l-7-7 7-7' />
          </svg>
        </button>

        <ul className='flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1'>
          {tabs.map((label, i) => (
            <li key={ i } className='relative'>
              <button
                onClick={ () => goTo(i) }
                className={ `relative z-10 whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${active === i ? 'text-white' : 'text-slate-600 hover:text-slate-900'}` }
              >
                {active === i && (
                  <motion.span
                    layoutId='tabPill'
                    className='absolute inset-0 -z-10 rounded-full bg-slate-900'
                    transition={ { type: 'spring', stiffness: 400, damping: 32 } }
                  />
                )}
                {label}
              </button>
            </li>
          ))}
        </ul>

        <button
          onClick={ () => go('right') }
          disabled={ active === slides.length - 1 }
          className='hidden h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40 sm:inline-flex'
          aria-label='Next'
        >
          <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={ 2 } className='h-4 w-4'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M9 5l7 7-7 7' />
          </svg>
        </button>
      </div>

      <div className='relative mt-10 overflow-hidden'>
        <AnimatePresence mode='wait' custom={ direction }>
          <motion.div
            key={ active }
            custom={ direction }
            variants={ {
              enter : (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
              center: { x: 0, opacity: 1 },
              exit  : (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
            } }
            initial='enter'
            animate='center'
            exit='exit'
            transition={ {
              x      : { type: 'spring', stiffness: 260, damping: 30 },
              opacity: { duration: 0.25 },
            } }
            drag='x'
            dragConstraints={ { left: 0, right: 0 } }
            dragElastic={ 0.18 }
            onDragEnd={ (_, info) => {
              if (info.offset.x > 80) go('left');
              if (info.offset.x < -80) go('right');
            } }
          >
            <div className='overflow-hidden rounded-3xl border border-slate-200 bg-white'>
              {/* Заголовок слайда */}
              <div className='border-b border-slate-200 px-8 py-8 sm:px-12 sm:py-10'>
                <div className='flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between'>
                  <h3 className='text-balance text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl'>
                    {current.title}
                  </h3>
                  <span className='inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600'>
                    {String(active + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* Метрики */}
              <div className='grid grid-cols-1 gap-px bg-slate-200 sm:grid-cols-3'>
                {current.metrics.map((m, i) => (
                  <div key={ i } className='bg-white px-8 py-6 sm:px-12'>
                    <div className='text-3xl font-semibold tracking-tight sm:text-4xl'>
                      <span className='text-gradient-accent'>{m.value}</span>
                    </div>
                    <div className='mt-2 text-sm text-slate-600'>{m.label}</div>
                  </div>
                ))}
              </div>

              {/* Пункты — адаптивная сетка без пустых ячеек */}
              <div className={ `grid grid-cols-1 gap-px bg-slate-200 ${pointsGridCols}` }>
                {current.points.map((p, i) => (
                  <div key={ i } className='bg-white p-8 sm:p-10'>
                    <div className='flex items-start gap-4'>
                      <div className='flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-semibold text-blue-600 ring-1 ring-blue-100'>
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <div>
                        <h4 className='text-base font-semibold text-slate-900'>{p.title}</h4>
                        <p className='mt-1.5 text-sm leading-relaxed text-slate-600'>{p.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Прогресс-индикатор */}
        <div className='mt-6 flex justify-center gap-1.5'>
          {slides.map((_, i) => (
            <button
              key={ i }
              onClick={ () => goTo(i) }
              className={ `h-1 rounded-full transition-all ${active === i ? 'w-8 bg-slate-900' : 'w-2 bg-slate-300 hover:bg-slate-400'}` }
              aria-label={ `Slide ${i + 1}` }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
