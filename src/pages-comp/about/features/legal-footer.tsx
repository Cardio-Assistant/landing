import Link from 'next/link';

import { LEGAL_DOCS, LEGAL_ORDER, cookiesPath, legalPath } from '@/legal/documents';
import { OPERATOR } from '@/legal/operator';

import { useI18n } from './i18n/context';

// The operator's details and the links to the legal documents, for the footer of the site.
// It sits next to (not instead of) the block with the Fund's support.
export function LegalFooter() {
  const { t, locale } = useI18n();
  const en = locale === 'en';
  const l = t.footer.legal;

  return (
    <div className='border-t border-slate-100 dark:border-slate-900'>
      <div className='mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 lg:flex-row lg:items-start lg:justify-between lg:gap-10'>
        <div className='text-center text-xs leading-relaxed text-slate-500 dark:text-slate-400 lg:text-left'>
          <p className='font-medium text-slate-700 dark:text-slate-300'>
            {en ? `${OPERATOR.shortNameEn} (${OPERATOR.shortName})` : OPERATOR.shortName}
          </p>
          <p>
            {l.inn} {OPERATOR.inn} · {l.ogrn} {OPERATOR.ogrn} ·{' '}
            <a href={ `mailto:${OPERATOR.email}` } className='hover:text-slate-900 dark:hover:text-white'>{OPERATOR.email}</a>
          </p>
        </div>

        <nav aria-label={ l.label } className='text-center lg:text-right'>
          <ul className='flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs text-slate-500 dark:text-slate-400 lg:justify-end'>
            {LEGAL_ORDER.map((k) => (
              <li key={ k }>
                <Link href={ legalPath(k) } className='underline-offset-2 hover:text-slate-900 hover:underline dark:hover:text-white'>
                  {en ? LEGAL_DOCS[k].titleEn : LEGAL_DOCS[k].title}
                </Link>
              </li>
            ))}
            <li>
              <Link href={ cookiesPath() } className='underline-offset-2 hover:text-slate-900 hover:underline dark:hover:text-white'>
                {l.cookies}
              </Link>
            </li>
          </ul>
          {l.note && <p className='mt-2 text-xs text-slate-400 dark:text-slate-500'>{l.note}</p>}
        </nav>
      </div>
    </div>
  );
}
