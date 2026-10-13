import Link from 'next/link';

import { LEGAL_DATE, LEGAL_DOCS, LEGAL_ORDER, legalPath } from '@/legal/documents';
import { OPERATOR } from '@/legal/operator';
import { Article, MailLink, OperatorTable, Section } from '@/legal/ui';

import type { Metadata } from 'next';

const TITLE = 'Правовая информация — Cardio Assistant';
const DESCRIPTION = 'Политика обработки персональных данных, согласия на обработку, пользовательское соглашение и сведения об операторе ООО «Нексли». Legal information in English: short note.';

export const metadata: Metadata = {
  title      : TITLE,
  description: DESCRIPTION,
  alternates : { canonical: '/legal' },
  openGraph  : { type: 'website', siteName: 'Cardio Assistant', locale: 'ru_RU', url: '/legal', title: TITLE, description: DESCRIPTION },
};

export default function LegalIndexPage() {
  return (
    <>
      <header className='mb-10 border-b border-slate-200 pb-8 dark:border-slate-800'>
        <p className='text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400'>{OPERATOR.shortName} · Cardio Assistant</p>
        <h1 className='mt-3 text-balance text-3xl font-semibold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-4xl'>Правовая информация</h1>
        <p className='mt-4 text-slate-600 dark:text-slate-400'>
          Документы о том, как {OPERATOR.shortName} обрабатывает персональные данные на сайте и в веб-приложении Cardio Assistant. Действуют с {LEGAL_DATE}.
        </p>
      </header>

      <ul className='grid gap-4'>
        {LEGAL_ORDER.map((k) => (
          <li key={ k }>
            <Link
              href={ legalPath(k) }
              className='block rounded-2xl border border-slate-200 p-5 transition-colors hover:border-blue-200 hover:bg-blue-50/50 dark:border-slate-800 dark:hover:border-blue-500/30 dark:hover:bg-blue-500/10'
            >
              <span className='block text-base font-semibold text-slate-900 dark:text-white'>{LEGAL_DOCS[k].title}</span>
              <span className='mt-1 block text-sm leading-relaxed text-slate-600 dark:text-slate-400'>{LEGAL_DOCS[k].summary}</span>
              <span className='mt-2 block text-xs text-slate-500 dark:text-slate-500'>Редакция от {LEGAL_DATE} · версия {LEGAL_DOCS[k].version}</span>
            </Link>
          </li>
        ))}
      </ul>

      <Article>
        <Section id='operator' title='Оператор'>
          <OperatorTable />
        </Section>

        <section id='en' lang='en' className='mt-14 rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900'>
          <h2 className='mt-0 text-xl font-semibold tracking-tight text-slate-900 dark:text-white'>Legal information (English note)</h2>
          <p>
            Cardio Assistant is operated by {OPERATOR.shortNameEn} ({OPERATOR.shortName}), a company registered in Russia (TIN {OPERATOR.inn}, PSRN {OPERATOR.ogrn}; Perm Krai).
            The legal documents of this site are published in Russian, and the Russian text is the authoritative one:{' '}
            {LEGAL_ORDER.map((k, i) => (
              <span key={ k }>
                {i > 0 && ' · '}
                <Link href={ legalPath(k) }>{LEGAL_DOCS[k].titleEn}</Link>
              </span>
            ))}
            .
          </p>
          <p>In short:</p>
          <ul>
            <li>We process only what you give us: the contact form (name, e-mail or phone, message, IP address) and the account data of the web app.</li>
            <li>There are no analytics or advertising cookies: only technical storage (theme, language, sign-in).</li>
            <li>
              The web app and its database run on servers in Russia. Contact-form requests are delivered by e-mail to our mailbox on a Russian mail service; nothing is sent abroad.
            </li>
            <li>Consent is given separately for each purpose and can be withdrawn at any time by e-mail to <MailLink />.</li>
            <li>The web app is a research prototype of a clinical decision-support system, not a medical device. Do not upload identifiable patient data without a legal basis.</li>
          </ul>
        </section>
      </Article>
    </>
  );
}
