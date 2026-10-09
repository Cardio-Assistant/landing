'use client';
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { PiArrowSquareOut } from 'react-icons/pi';

import { useI18n } from './i18n/context';

import type { KeyboardEvent, RefObject } from 'react';

// Screenshots of the new interface (only the test patient is visible on them).
// The order matches `showcase.screens` in the dictionary.
const SCREENS = [
  { src: '/screens/3d-analysis-01-3d-stenosis-highlight.webp', width: 1440, height: 900 },
  { src: '/screens/3d-analysis-02-branches-and-profile.webp', width: 1440, height: 931 },
  { src: '/screens/3d-analysis-03-conclusion-editor.webp', width: 1440, height: 1427 },
  { src: '/screens/patient-conclusions-01-card-tab.webp', width: 1440, height: 1351 },
  { src: '/screens/patient-conclusions-03-summary-report-confirmed.webp', width: 1584, height: 1802 },
];

export function InterfaceSection({
  targetRef,
  isInView,
}: {
  targetRef: RefObject<HTMLDivElement>;
  isInView: boolean;
}) {
  const { t } = useI18n();
  const sc = t.showcase;
  const [active, setActive] = useState(0);
  const tabListRef = useRef<HTMLDivElement>(null);

  const screen = sc.screens[active];
  const shot = SCREENS[active];

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const last = SCREENS.length - 1;
    let next = active;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = active === last ? 0 : active + 1;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = active === 0 ? last : active - 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = last;
    else return;

    e.preventDefault();
    setActive(next);
    tabListRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  };

  return (
    <section
      id='interface'
      ref={ targetRef }
      className='relative border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-24 sm:py-32'
    >
      <div className='mx-auto max-w-6xl px-6'>
        <motion.div
          initial={ { opacity: 0, y: 16 } }
          animate={ isInView ? { opacity: 1, y: 0 } : {} }
          transition={ { duration: 0.6 } }
          className='mx-auto max-w-2xl text-center'
        >
          <div className='inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-400'>
            {sc.badge}
          </div>
          <h2 className='mt-5 text-balance text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl'>
            {sc.title}
          </h2>
          <p className='mx-auto mt-5 max-w-xl text-balance text-base leading-relaxed text-slate-600 dark:text-slate-400'>
            {sc.subtitle}
          </p>
        </motion.div>

        <div className='mt-14 grid grid-cols-1 gap-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-10'>
          <div
            ref={ tabListRef }
            role='tablist'
            aria-label={ sc.tablistLabel }
            className='-mx-6 flex snap-x gap-2 overflow-x-auto px-6 pb-2 lg:sticky lg:top-24 lg:mx-0 lg:flex-col lg:self-start lg:overflow-visible lg:px-0 lg:pb-0'
          >
            {sc.screens.map((s, i) => {
              const selected = active === i;

              return (
                <button
                  key={ s.tab }
                  type='button'
                  role='tab'
                  id={ `ui-tab-${i}` }
                  aria-selected={ selected }
                  aria-controls='ui-panel'
                  tabIndex={ selected ? 0 : -1 }
                  onClick={ () => setActive(i) }
                  onKeyDown={ onKeyDown }
                  className={ `flex flex-shrink-0 snap-start items-center gap-3 whitespace-nowrap rounded-2xl border px-4 py-3 text-left text-sm font-medium transition-colors lg:w-full lg:whitespace-normal ${selected
                    ? 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-500/30 dark:bg-blue-500/15 dark:text-blue-100'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:text-white'}` }
                >
                  <span
                    className={ `flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-xs font-semibold ${selected
                      ? 'bg-blue-600 text-white dark:bg-blue-500'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}` }
                  >
                    {i + 1}
                  </span>
                  <span>{s.tab}</span>
                </button>
              );
            })}
          </div>

          <div role='tabpanel' id='ui-panel' aria-labelledby={ `ui-tab-${active}` } className='min-w-0'>
            <motion.figure
              key={ active }
              initial={ { opacity: 0, y: 10 } }
              animate={ { opacity: 1, y: 0 } }
              transition={ { duration: 0.35 } }
            >
              {/* The caption below describes the screen; this link is a mouse/touch shortcut to the full-size file. */}
              <a
                href={ shot.src }
                target='_blank'
                rel='noopener noreferrer'
                tabIndex={ -1 }
                aria-hidden='true'
                className='block cursor-zoom-in overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-xl shadow-slate-300/50 dark:border-slate-700 dark:shadow-black/40'
              >
                <Image
                  src={ shot.src }
                  alt={ screen.alt }
                  width={ shot.width }
                  height={ shot.height }
                  quality={ 85 }
                  sizes='(min-width: 1200px) 792px, (min-width: 1024px) calc(100vw - 360px), calc(100vw - 48px)'
                  className='h-auto w-full'
                />
              </a>

              <figcaption className='mt-6'>
                <h3 className='text-lg font-semibold tracking-tight text-slate-900 dark:text-white sm:text-xl'>
                  {screen.title}
                </h3>
                <p className='mt-2 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base'>
                  {screen.text}
                </p>
                <a
                  href={ shot.src }
                  target='_blank'
                  rel='noopener noreferrer'
                  className='mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-200'
                >
                  <PiArrowSquareOut size={ 16 } />
                  {sc.openFull}
                </a>
              </figcaption>
            </motion.figure>
          </div>
        </div>

        <p className='mx-auto mt-12 max-w-3xl text-center text-xs leading-relaxed text-slate-500 dark:text-slate-400'>
          {sc.note}
        </p>
      </div>
    </section>
  );
}
