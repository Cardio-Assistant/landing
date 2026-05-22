'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BiHeart, BiPulse } from 'react-icons/bi';
import { PiArrowLeft, PiBellSimple, PiCubeFocus, PiShieldCheck } from 'react-icons/pi';

type Locale = 'ru' | 'en';

const stepIcons = [PiCubeFocus, PiShieldCheck, PiBellSimple];

const demoDict = {
  ru: {
    back       : 'На сайт',
    badge      : 'Демо готовится',
    titleStart : 'Скоро здесь появится',
    titleAccent: 'ранняя версия',
    titleEnd   : 'платформы',
    description: 'Мы собираем демонстрационный кабинет для просмотра 3D-моделей, оценки рисков и подготовки пилотных показов для клиник и партнеров.',
    request    : 'Оставить заявку',
    about      : 'Вернуться к описанию',
    modelLabel : 'Patient model',
    modelCase  : 'Demo case',
    metrics    : ['Scan', 'Model', 'Risk'],
    steps      : [
      {
        title: '3D-реконструкция',
        text : 'Готовим демонстрационный сценарий с сосудистой моделью и понятным врачебным интерфейсом.',
      },
      {
        title: 'Безопасный контур',
        text : 'Демо будет работать без загрузки персональных медицинских данных и с контролем доступа.',
      },
      {
        title: 'Ранний доступ',
        text : 'Оставьте заявку на сайте, и мы пришлем приглашение, когда демо будет открыто.',
      },
    ],
  },
  en: {
    back       : 'Back to site',
    badge      : 'Demo in progress',
    titleStart : 'An',
    titleAccent: 'early version',
    titleEnd   : 'of the platform is coming soon',
    description: 'We are preparing a demo workspace for viewing 3D models, assessing risks, and running pilot presentations for clinics and partners.',
    request    : 'Request access',
    about      : 'Back to overview',
    modelLabel : 'Patient model',
    modelCase  : 'Demo case',
    metrics    : ['Scan', 'Model', 'Risk'],
    steps      : [
      {
        title: '3D reconstruction',
        text : 'We are preparing a demo flow with a vessel model and a clear clinical interface.',
      },
      {
        title: 'Secure environment',
        text : 'The demo will work without uploading personal medical data and with access control.',
      },
      {
        title: 'Early access',
        text : 'Leave a request on the site, and we will send an invitation when the demo opens.',
      },
    ],
  },
};

const fadeUp = {
  hidden : { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export default function DemoPlaceholderPage() {
  const [locale, setLocale] = useState<Locale>('ru');
  const t = demoDict[locale];

  useEffect(() => {
    const saved = localStorage.getItem('locale');
    if (saved === 'ru' || saved === 'en') setLocale(saved);
  }, []);

  const setLanguage = (nextLocale: Locale) => {
    setLocale(nextLocale);
    localStorage.setItem('locale', nextLocale);
  };

  return (
    <main className='min-h-screen overflow-hidden bg-white text-slate-900'>
      <div className='pointer-events-none absolute inset-0 bg-dot-slate mask-radial-fade opacity-80' />
      <div className='pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[720px] -translate-x-1/2 rounded-full bg-gradient-to-br from-blue-200/50 via-cyan-200/40 to-transparent blur-3xl' />

      <section className='relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8'>
        <motion.header
          initial={ { opacity: 0, y: -14 } }
          animate={ { opacity: 1, y: 0 } }
          transition={ { duration: 0.55, ease: 'easeOut' } }
          className='flex items-center justify-between gap-4'
        >
          <Link
            href='/about'
            className='inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur transition-all hover:border-slate-300 hover:bg-white'
          >
            <PiArrowLeft size={ 18 } />
            {t.back}
          </Link>

          <div className='flex items-center gap-2'>
            <div className='relative inline-flex h-8 items-center rounded-full border border-slate-200 bg-white/85 p-0.5 text-[11px] font-semibold shadow-sm backdrop-blur'>
              <motion.span
                layout
                transition={ { type: 'spring', stiffness: 500, damping: 34 } }
                className='absolute inset-y-0.5 w-9 rounded-full bg-slate-900 shadow-sm'
                style={ { left: locale === 'en' ? 'calc(50% - 2px)' : '2px' } }
              />
              <button
                type='button'
                onClick={ () => setLanguage('ru') }
                className={ `relative z-10 w-9 rounded-full py-1 transition-colors ${locale === 'ru' ? 'text-white' : 'text-slate-500 hover:text-slate-900'}` }
                aria-label='Русский'
              >
                RU
              </button>
              <button
                type='button'
                onClick={ () => setLanguage('en') }
                className={ `relative z-10 w-9 rounded-full py-1 transition-colors ${locale === 'en' ? 'text-white' : 'text-slate-500 hover:text-slate-900'}` }
                aria-label='English'
              >
                EN
              </button>
            </div>

            <div className='hidden items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3.5 py-1.5 text-xs font-medium text-slate-600 backdrop-blur sm:inline-flex'>
              <span className='relative flex h-2 w-2'>
                <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75' />
                <span className='relative inline-flex h-2 w-2 rounded-full bg-cyan-500' />
              </span>
              Cardio Assistant
            </div>
          </div>
        </motion.header>

        <div className='grid flex-1 items-center gap-12 py-16 lg:grid-cols-[1fr_420px]'>
          <div>
            <motion.div
              variants={ fadeUp }
              initial='hidden'
              animate='visible'
              transition={ { duration: 0.6, delay: 0.1 } }
              className='inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700'
            >
              {t.badge}
            </motion.div>

            <motion.h1
              variants={ fadeUp }
              initial='hidden'
              animate='visible'
              transition={ { duration: 0.7, delay: 0.2 } }
              className='mt-6 max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl'
            >
              {t.titleStart} <span className='text-gradient-accent'>{t.titleAccent}</span> {t.titleEnd}
            </motion.h1>

            <motion.p
              variants={ fadeUp }
              initial='hidden'
              animate='visible'
              transition={ { duration: 0.7, delay: 0.32 } }
              className='mt-6 max-w-2xl text-balance text-base leading-relaxed text-slate-600 sm:text-lg'
            >
              {t.description}
            </motion.p>

            <motion.div
              variants={ fadeUp }
              initial='hidden'
              animate='visible'
              transition={ { duration: 0.7, delay: 0.44 } }
              className='mt-10 flex flex-col gap-3 sm:flex-row'
            >
              <Link
                href='/about#contact'
                className='inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-slate-700 hover:shadow-md'
              >
                {t.request}
              </Link>
              <Link
                href='/about'
                className='inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50'
              >
                {t.about}
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={ { opacity: 0, scale: 0.95, y: 20 } }
            animate={ { opacity: 1, scale: 1, y: 0 } }
            transition={ { duration: 0.8, delay: 0.26, ease: 'easeOut' } }
            className='relative animate-float'
          >
            <div className='absolute -inset-8 rounded-full bg-gradient-to-br from-blue-300/30 via-cyan-200/30 to-transparent blur-3xl' />
            <div className='relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/60'>
              <div className='rounded-2xl border border-slate-100 bg-slate-50 p-5'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-xs font-medium uppercase tracking-[0.2em] text-slate-500'>{t.modelLabel}</p>
                    <p className='mt-1 text-lg font-semibold text-slate-900'>{t.modelCase}</p>
                  </div>
                  <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100'>
                    <BiHeart size={ 24 } />
                  </div>
                </div>

                <div className='relative mt-8 flex aspect-square items-center justify-center overflow-hidden rounded-3xl bg-white shadow-inner'>
                  <div className='absolute inset-x-8 top-0 h-20 bg-gradient-to-b from-cyan-300/20 to-transparent animate-scan-line' />
                  <div className='relative flex h-44 w-44 items-center justify-center rounded-full border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 animate-pulse-soft'>
                    <div className='absolute h-28 w-28 rounded-full border border-cyan-200 animate-spin-slow' />
                    <div className='absolute h-20 w-36 rotate-[-24deg] rounded-full border-2 border-blue-300/80' />
                    <span className='absolute left-8 top-8 h-2.5 w-2.5 rounded-full bg-cyan-500 shadow-lg shadow-cyan-300 animate-ping-soft' />
                    <span className='absolute bottom-10 right-9 h-2 w-2 rounded-full bg-blue-500 shadow-lg shadow-blue-300 animate-ping-soft animation-delay-700' />
                    <BiPulse className='relative text-blue-600' size={ 72 } />
                  </div>
                </div>

                <div className='mt-6 grid grid-cols-3 gap-3'>
                  {t.metrics.map((item, index) => (
                    <div key={ item } className='rounded-2xl border border-slate-200 bg-white px-3 py-3'>
                      <div className='text-lg font-semibold text-slate-900'>{index === 2 ? 'AI' : `0${index + 1}`}</div>
                      <div className='mt-1 text-xs text-slate-500'>{item}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className='grid gap-4 pb-8 md:grid-cols-3'>
          {t.steps.map((step, index) => {
            const Icon = stepIcons[index];
            return (
              <motion.div
                key={ step.title }
                variants={ fadeUp }
                initial='hidden'
                animate='visible'
                transition={ { duration: 0.55, delay: 0.6 + index * 0.1 } }
                className='rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm backdrop-blur transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-md hover:shadow-blue-100/60'
              >
                <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-100'>
                  <Icon size={ 20 } />
                </div>
                <h2 className='mt-4 text-base font-semibold text-slate-900'>{step.title}</h2>
                <p className='mt-2 text-sm leading-relaxed text-slate-600'>{step.text}</p>
              </motion.div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
