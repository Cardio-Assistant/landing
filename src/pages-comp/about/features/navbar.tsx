import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { IconAiCardio } from './icon-ai';
import { useI18n } from './i18n/context';
import { LangSwitch } from './i18n/lang-switch';

import type { RefObject } from 'react';

type NavBarProps = {
  targetRefAbout: RefObject<HTMLDivElement>;
  targetRefProblem: RefObject<HTMLDivElement>;
  targetRefSolution: RefObject<HTMLDivElement>;
  targetRefInvestors: RefObject<HTMLDivElement>;
  targetRefTeam: RefObject<HTMLDivElement>;
  targetRefContact: RefObject<HTMLDivElement>;
};

const NavLink = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => (
  <button
    onClick={ onClick }
    className='relative text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 group'
  >
    {children}
    <span className='absolute -bottom-1 left-0 h-px w-0 bg-slate-900 transition-all duration-300 group-hover:w-full' />
  </button>
);

export function NavBar({
  targetRefAbout,
  targetRefProblem,
  targetRefSolution,
  targetRefInvestors,
  targetRefTeam,
  targetRefContact,
}: NavBarProps) {
  const { t } = useI18n();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (ref: RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setIsMenuOpen(false);
  };

  const links = [
    { label: t.nav.about, ref: targetRefAbout },
    { label: t.nav.problem, ref: targetRefProblem },
    { label: t.nav.solution, ref: targetRefSolution },
    { label: t.nav.investors, ref: targetRefInvestors },
    { label: t.nav.team, ref: targetRefTeam },
    { label: t.nav.contact, ref: targetRefContact },
  ];

  return (
    <header className='fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4'>
      <motion.nav
        initial={ { y: -20, opacity: 0 } }
        animate={ { y: 0, opacity: 1 } }
        transition={ { duration: 0.6, ease: 'easeOut' } }
        className={ `
          flex w-full max-w-6xl items-center justify-between
          rounded-full border px-3 py-2 transition-all duration-300
          ${isScrolled
      ? 'border-slate-200 bg-white/85 shadow-sm backdrop-blur-md'
      : 'border-transparent bg-white/60 backdrop-blur-sm'}
        ` }
      >
        <button
          onClick={ () => scrollTo(targetRefAbout) }
          className='flex flex-shrink-0 items-center gap-2 pl-1'
        >
          <IconAiCardio />
          <span className='hidden text-base font-semibold tracking-tight text-slate-900 sm:inline'>
            Cardio Assistant
          </span>
        </button>

        <div className='hidden items-center gap-4 lg:flex xl:gap-6'>
          {links.map((l) => (
            <NavLink key={ l.label } onClick={ () => scrollTo(l.ref) }>
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className='flex items-center gap-2'>
          <LangSwitch />

          <button
            onClick={ () => scrollTo(targetRefContact) }
            className='hidden rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-slate-700 xl:inline-flex'
          >
            {t.nav.cta}
          </button>

          <button
            className='inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 lg:hidden'
            onClick={ () => setIsMenuOpen(!isMenuOpen) }
            aria-label='Menu'
          >
            <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={ 1.8 }
                d={ isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 7h16M4 12h16M4 17h16' }
              />
            </svg>
          </button>
        </div>
      </motion.nav>

      {isMenuOpen && (
        <motion.div
          initial={ { opacity: 0, y: -8 } }
          animate={ { opacity: 1, y: 0 } }
          className='absolute left-4 right-4 top-20 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg lg:hidden'
        >
          <ul className='flex flex-col gap-1 text-slate-700'>
            {links.map((l) => (
              <li key={ l.label }>
                <button
                  onClick={ () => scrollTo(l.ref) }
                  className='w-full rounded-lg px-4 py-3 text-left text-sm font-medium hover:bg-slate-50'
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </header>
  );
}
