'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import {
  PiArrowUp,
  PiGraphLight,
  PiHeadCircuitBold,
  PiLightbulb,
  PiMagnifyingGlass,
  PiPerson,
} from 'react-icons/pi';
import { BiHeart, BiPulse } from 'react-icons/bi';
import { LuHandHeart } from 'react-icons/lu';

import { BlockOne } from './features/block1';
import ServicesSlider from './features/servicesSlider';
import { CardTeam } from './features/card/ui/card-team';
import { NavBar } from './features/navbar';
import { ContactSection } from './features/contact-section';
import { ProblemBlock } from './features/problem-section';
import { I18nProvider, useI18n } from './features/i18n/context';

export const prefex = '';

const partnerLogos = [
  { logo: 'logo/cardio.png', round: false },
  { logo: 'logo/fmi.png', round: true },
  { logo: 'logo/incub.jpg', round: true },
];

const solutionIcons = [
  [PiHeadCircuitBold, BiHeart, PiGraphLight],
  [PiPerson, BiPulse, PiMagnifyingGlass],
  [PiLightbulb, LuHandHeart],
];

const teamPeople = [
  { name: 'Барулина Марина', img: 'team/ma.png', dept: 'mentors' as const },
  { name: 'Породиков Артём', img: 'team/artem.png', dept: 'mentors' as const },
  { name: 'Осипов Александр', img: 'team/alex-o.png', dept: 'lead' as const },
  { name: 'Шаров Роман', img: 'team/roma.png', dept: 'dev' as const },
  { name: 'Аухадиев Михаил', img: 'team/misha.png', dept: 'dev' as const },
  { name: 'Бочкарев Владислав', img: 'team/vlad.png', dept: 'ai' as const },
  { name: 'Усынин Александр', img: 'team/alex-y.png', dept: 'ai' as const },
  { name: 'Стрелков Юрий', img: 'team/yra.jpg', dept: 'economy' as const },
];

function ScrollTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 640);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.button
      type='button'
      initial={ { opacity: 0, y: 12, scale: 0.95 } }
      animate={ { opacity: 1, y: 0, scale: 1 } }
      exit={ { opacity: 0, y: 12, scale: 0.95 } }
      onClick={ () => window.scrollTo({ top: 0, behavior: 'smooth' }) }
      aria-label='Scroll to top'
      className='fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-700 shadow-lg shadow-slate-200/70 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-600'
    >
      <PiArrowUp size={ 20 } />
    </motion.button>
  );
}

function PageInner() {
  const { t } = useI18n();

  const refAbout = useRef<HTMLDivElement>(null);
  const refProblem = useRef<HTMLDivElement>(null);
  const refSolution = useRef<HTMLDivElement>(null);
  const refInvestors = useRef<HTMLDivElement>(null);
  const refTeam = useRef<HTMLDivElement>(null);
  const refContact = useRef<HTMLDivElement>(null);
  const refPartners = useRef<HTMLDivElement>(null);

  const inProblem = useInView(refProblem, { once: true, margin: '-20%' });
  const inSolution = useInView(refSolution, { once: true, margin: '-20%' });
  const inTeam = useInView(refTeam, { once: true, margin: '-20%' });
  const inPartners = useInView(refPartners, { once: true, margin: '-20%' });
  const inContact = useInView(refContact, { once: true, margin: '-20%' });

  const partners = t.partners;
  const partnerNames = [partners.partner1, partners.partner2, partners.partner3];

  return (
    <main className='bg-white text-slate-900'>
      <NavBar
        targetRefAbout={ refAbout }
        targetRefProblem={ refProblem }
        targetRefSolution={ refSolution }
        targetRefInvestors={ refInvestors }
        targetRefTeam={ refTeam }
        targetRefContact={ refContact }
      />

      <div ref={ refAbout }>
        <BlockOne targetRef={ refContact } scrollHintRef={ refPartners } />
      </div>

      {/* Партнёры */}
      <section ref={ refPartners } className='bg-white py-20'>
        <div className='mx-auto max-w-6xl px-6'>
          <motion.p
            initial={ { opacity: 0 } }
            animate={ inPartners ? { opacity: 1 } : {} }
            transition={ { duration: 0.6 } }
            className='text-center text-xs font-medium uppercase tracking-[0.2em] text-slate-500'
          >
            {partners.eyebrow}
          </motion.p>

          <div className='mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3'>
            {partnerLogos.map((p, i) => (
              <motion.div
                key={ p.logo }
                initial={ { opacity: 0, y: 12 } }
                animate={ inPartners ? { opacity: 1, y: 0 } : {} }
                transition={ { duration: 0.5, delay: i * 0.1 } }
                className='group flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-8 text-center transition-all hover:border-slate-300 hover:shadow-sm'
              >
                <div className='flex h-24 w-24 items-center justify-center'>
                  <Image
                    src={ prefex + '/' + p.logo }
                    alt=''
                    width={ 96 }
                    height={ 96 }
                    className={
                      p.round
                        ? 'h-24 w-24 rounded-full object-cover ring-1 ring-slate-200 transition-transform group-hover:scale-105'
                        : 'max-h-24 max-w-24 object-contain transition-transform group-hover:scale-105'
                    }
                  />
                </div>
                <p className='mt-5 text-sm leading-snug text-slate-700'>{partnerNames[i]}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ProblemBlock targetRef={ refProblem } isInView={ inProblem } />

      {/* Решение */}
      <section ref={ refSolution } className='relative overflow-hidden bg-slate-50 py-24 sm:py-32'>
        <div className='pointer-events-none absolute inset-0 bg-grid-slate mask-radial-fade opacity-50' />

        <div className='relative mx-auto max-w-7xl px-6'>
          <motion.div
            initial={ { opacity: 0, y: 16 } }
            animate={ inSolution ? { opacity: 1, y: 0 } : {} }
            transition={ { duration: 0.6 } }
            className='mx-auto max-w-2xl text-center'
          >
            <div className='inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700'>
              {t.solution.badge}
            </div>
            <h2 className='mt-5 text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl'>
              {t.solution.title}
            </h2>
            <p className='mx-auto mt-5 max-w-xl text-balance text-base leading-relaxed text-slate-600'>
              {t.solution.subtitle}
            </p>
          </motion.div>

          <div className='mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3'>
            {t.solution.cards.map((card, i) => (
              <motion.div
                key={ card.title }
                initial={ { opacity: 0, y: 16 } }
                animate={ inSolution ? { opacity: 1, y: 0 } : {} }
                transition={ { duration: 0.6, delay: 0.15 + i * 0.1 } }
                className='group relative flex flex-col rounded-3xl border border-slate-200 bg-white p-8 transition-all hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/50'
              >
                <div className='absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100' />

                <h3 className='text-xl font-semibold tracking-tight text-slate-900'>{card.title}</h3>
                <p className='mt-3 text-sm leading-relaxed text-slate-600'>{card.description}</p>

                <ul className='mt-6 flex flex-col gap-3'>
                  {card.items.map((text, j) => {
                    const Icon = solutionIcons[i][j];
                    return (
                      <li key={ j } className='flex items-start gap-3'>
                        <div className='mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 ring-1 ring-blue-100'>
                          <Icon size={ 16 } />
                        </div>
                        <span className='text-sm leading-relaxed text-slate-700'>{text}</span>
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Инвесторам / Слайдер */}
      <section ref={ refInvestors } className='bg-white'>
        <ServicesSlider />
      </section>

      {/* Команда */}
      <section ref={ refTeam } className='bg-slate-50 py-24 sm:py-32'>
        <div className='mx-auto max-w-6xl px-6'>
          <motion.div
            initial={ { opacity: 0, y: 16 } }
            animate={ inTeam ? { opacity: 1, y: 0 } : {} }
            transition={ { duration: 0.6 } }
            className='mx-auto max-w-2xl text-center'
          >
            <div className='inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600'>
              {t.team.badge}
            </div>
            <h2 className='mt-5 text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl'>
              {t.team.title}
            </h2>
            <p className='mx-auto mt-5 max-w-xl text-balance text-base leading-relaxed text-slate-600'>
              {t.team.subtitle}
            </p>
          </motion.div>

          <div className='mt-16 grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-3 md:grid-cols-4'>
            {teamPeople.map((person, i) => (
              <motion.div
                key={ person.name }
                initial={ { opacity: 0, y: 12 } }
                animate={ inTeam ? { opacity: 1, y: 0 } : {} }
                transition={ { duration: 0.5, delay: 0.05 + i * 0.05 } }
              >
                <CardTeam
                  name={ person.name }
                  role=''
                  img={ person.img }
                  department={ t.team.groups[person.dept] }
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ContactSection isInView6={ inContact } targetRef6={ refContact } />

      {/* Footer */}
      <footer className='border-t border-slate-200 bg-white'>
        <div className='mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 sm:flex-row'>
          <div className='flex flex-col items-center gap-1 sm:items-start'>
            <p className='text-sm font-medium text-slate-700'>
              {t.footer.brand.replace('{year}', String(new Date().getFullYear()))}
            </p>
            <p className='text-xs text-slate-500'>{t.footer.brandOwn}</p>
          </div>
          <p className='text-xs text-slate-400'>{t.footer.tagline}</p>
        </div>
      </footer>

      <ScrollTopButton />
    </main>
  );
}

export function PageAbout() {
  return (
    <I18nProvider>
      <PageInner />
    </I18nProvider>
  );
}
