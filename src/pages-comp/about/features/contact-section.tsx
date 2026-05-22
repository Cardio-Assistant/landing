import { motion } from 'framer-motion';
import { PiEnvelopeSimple, PiPhone, PiMapPin } from 'react-icons/pi';

import FeedbackForm from './form';
import { useI18n } from './i18n/context';

import type { RefObject } from 'react';

export function ContactSection({
  targetRef6,
  isInView6,
}: {
  targetRef6: RefObject<HTMLDivElement>;
  isInView6: boolean;
}) {
  const { t } = useI18n();

  return (
    <section id='contact' ref={ targetRef6 } className='relative overflow-hidden bg-slate-50 py-24 sm:py-32'>
      <div className='pointer-events-none absolute -top-32 left-1/2 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-br from-blue-200/40 via-cyan-100/30 to-transparent blur-3xl' />

      <div className='relative mx-auto max-w-6xl px-6'>
        <motion.div
          initial={ { opacity: 0, y: 16 } }
          animate={ isInView6 ? { opacity: 1, y: 0 } : {} }
          transition={ { duration: 0.6 } }
          className='mx-auto max-w-2xl text-center'
        >
          <div className='inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600'>
            {t.contact.badge}
          </div>
          <h2 className='mt-5 text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl'>
            {t.contact.title1} <span className='text-gradient-accent'>{t.contact.title2}</span>
          </h2>
          <p className='mx-auto mt-5 max-w-lg text-balance text-base leading-relaxed text-slate-600'>
            {t.contact.subtitle}
          </p>
        </motion.div>

        <div className='mt-16 grid grid-cols-1 gap-8 lg:grid-cols-5'>
          <motion.div
            initial={ { opacity: 0, y: 16 } }
            animate={ isInView6 ? { opacity: 1, y: 0 } : {} }
            transition={ { duration: 0.6, delay: 0.15 } }
            className='lg:col-span-2'
          >
            <div className='rounded-3xl border border-slate-200 bg-white p-8'>
              <h3 className='text-lg font-semibold text-slate-900'>{t.contact.directH}</h3>
              <p className='mt-2 text-sm text-slate-600'>{t.contact.directS}</p>

              <ul className='mt-8 flex flex-col gap-5'>
                <li className='flex items-start gap-4'>
                  <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600'>
                    <PiPhone size={ 20 } />
                  </div>
                  <div>
                    <div className='text-xs uppercase tracking-wide text-slate-500'>{t.contact.phone}</div>
                    <a href='tel:+79824516689' className='mt-0.5 block text-base font-medium text-slate-900 hover:text-blue-600'>
                      +7 (982) 451-66-89
                    </a>
                  </div>
                </li>
                <li className='flex items-start gap-4'>
                  <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600'>
                    <PiEnvelopeSimple size={ 20 } />
                  </div>
                  <div>
                    <div className='text-xs uppercase tracking-wide text-slate-500'>{t.contact.email}</div>
                    <a href='mailto:alexosipov03@yandex.com' className='mt-0.5 block break-all text-base font-medium text-slate-900 hover:text-blue-600'>
                      alexosipov03@yandex.com
                    </a>
                  </div>
                </li>
                <li className='flex items-start gap-4'>
                  <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600'>
                    <PiMapPin size={ 20 } />
                  </div>
                  <div>
                    <div className='text-xs uppercase tracking-wide text-slate-500'>{t.contact.city}</div>
                    <div className='mt-0.5 text-base font-medium text-slate-900'>{t.contact.cityVal}</div>
                  </div>
                </li>
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={ { opacity: 0, y: 16 } }
            animate={ isInView6 ? { opacity: 1, y: 0 } : {} }
            transition={ { duration: 0.6, delay: 0.25 } }
            className='lg:col-span-3'
          >
            <FeedbackForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
