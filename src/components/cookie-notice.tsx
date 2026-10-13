'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { useI18n } from '@/pages-comp/about/features/i18n/context';
import { LEGAL_VERSION, cookiesPath } from '@/legal/documents';

// The demo served under /web (same origin, https://ai-cardio.ru) uses the same key: a person
// who closes the notice on the site does not see it again in the demo. The value is the
// edition of the legal documents, so a changed notice is shown once more.
const STORAGE_KEY = 'ca-cookie-notice';

// The notice that the site uses only technical cookies and local storage (there is no
// analytics, no advertising, no third-party scripts). It is deliberately small, sits in a
// corner and asks for nothing but an acknowledgement.
export function CookieNotice() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) !== LEGAL_VERSION) setVisible(true);
    } catch {
      // Storage is blocked (private window, site data off): show the notice on every visit.
      setVisible(true);
    }
  }, []);

  const close = () => {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, LEGAL_VERSION);
    } catch {
      // Not remembered: the notice returns on the next visit, nothing breaks.
    }
  };

  if (!visible) return null;

  return (
    <div
      role='region'
      aria-label={ t.cookies.label }
      className='fixed inset-x-4 bottom-4 z-50 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg shadow-slate-300/40 backdrop-blur dark:border-slate-700 dark:bg-slate-900/95 dark:shadow-black/40 sm:right-auto sm:max-w-md'
    >
      <p className='text-xs leading-relaxed text-slate-600 dark:text-slate-300'>
        {t.cookies.text}{' '}
        <Link href={ cookiesPath() } className='font-medium text-blue-700 underline-offset-2 hover:underline dark:text-blue-300'>
          {t.cookies.more}
        </Link>
      </p>
      <button
        type='button'
        onClick={ close }
        className='mt-3 inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white'
      >
        {t.cookies.ok}
      </button>
    </div>
  );
}
