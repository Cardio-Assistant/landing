import Link from 'next/link';
import { PiArrowLeft } from 'react-icons/pi';

import { IconAiCardio } from '@/pages-comp/about/features/icon-ai';
import { ThemeToggle } from '@/pages-comp/about/features/theme-toggle';
import { LEGAL_DOCS, LEGAL_ORDER, legalPath } from '@/legal/documents';
import { OPERATOR } from '@/legal/operator';

// The frame of the legal documents: a quiet header, a narrow reading column and a footer with
// the operator's details. The documents are plain server-rendered pages (no client state), so
// they are readable without JavaScript and print cleanly.
export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-white'>
      <header className='border-b border-slate-200 dark:border-slate-800'>
        <div className='mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-4'>
          <Link href='/about' className='flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'>
            <PiArrowLeft size={ 16 } />
            <IconAiCardio />
            <span className='font-semibold tracking-tight'>Cardio Assistant</span>
          </Link>
          <div className='flex items-center gap-3'>
            <Link href='/legal' className='hidden text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white sm:inline'>
              Правовая информация
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className='mx-auto max-w-3xl px-6 py-12 sm:py-16'>{children}</main>

      <footer className='border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900'>
        <div className='mx-auto max-w-3xl px-6 py-8 text-xs leading-relaxed text-slate-500 dark:text-slate-400'>
          <p className='font-medium text-slate-700 dark:text-slate-300'>
            {OPERATOR.shortName} · ИНН {OPERATOR.inn} · ОГРН {OPERATOR.ogrn}
          </p>
          <p className='mt-1'>
            {OPERATOR.address} ·{' '}
            <a href={ `mailto:${OPERATOR.email}` } className='hover:text-slate-900 dark:hover:text-white'>{OPERATOR.email}</a>
          </p>
          <ul className='mt-4 flex flex-wrap gap-x-5 gap-y-1'>
            {LEGAL_ORDER.map((k) => (
              <li key={ k }>
                <Link href={ legalPath(k) } className='hover:text-slate-900 dark:hover:text-white'>{LEGAL_DOCS[k].title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </footer>
    </div>
  );
}
