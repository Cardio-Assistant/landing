import Link from 'next/link';

import { LEGAL_DOCS, LEGAL_ORDER, legalPath } from './documents';
import { OPERATOR } from './operator';

import type { LegalDocKey } from './documents';
import type { ReactNode } from 'react';

// Building blocks of the legal pages. They render plain, server-side HTML (no state),
// so the documents are readable without JavaScript and print cleanly.

export function MailLink() {
  return (
    <a href={ `mailto:${OPERATOR.email}` } className='break-all'>{OPERATOR.email}</a>
  );
}

export function PhoneLink() {
  return <a href={ `tel:${OPERATOR.phoneHref}` } className='whitespace-nowrap'>{OPERATOR.phone}</a>;
}

// A link to another legal document (relative: it works on any host the site is served from).
export function DocLink({ doc, children }: { doc: LegalDocKey; children?: ReactNode }) {
  return <Link href={ legalPath(doc) }>{children ?? LEGAL_DOCS[doc].title}</Link>;
}

// The title block of a document: operator and name.
export function DocHeader({ doc }: { doc: LegalDocKey }) {
  const d = LEGAL_DOCS[doc];

  return (
    <header className='not-prose mb-10 border-b border-slate-200 pb-8 dark:border-slate-800'>
      <p className='text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400'>
        {OPERATOR.shortName} · Cardio Assistant
      </p>
      <h1 className='mt-3 text-balance text-3xl font-semibold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-4xl'>
        {d.title}
      </h1>
    </header>
  );
}

export function Section({ id, title, children }: { id?: string; title: string; children: ReactNode }) {
  return (
    <section id={ id } className='mt-10 scroll-mt-24 first:mt-0'>
      <h2 className='text-xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-2xl'>{title}</h2>
      <div className='mt-4'>{children}</div>
    </section>
  );
}

export function SubTitle({ id, children }: { id?: string; children: ReactNode }) {
  return <h3 id={ id } className='mt-8 scroll-mt-24 text-lg font-semibold text-slate-900 dark:text-white'>{children}</h3>;
}

// A numbered clause: "1.1. text".
export function Clause({ n, children }: { n: string; children: ReactNode }) {
  return (
    <p>
      <span className='mr-1.5 font-semibold text-slate-900 dark:text-white'>{n}.</span>
      {children}
    </p>
  );
}

export function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul>
      {items.map((item, i) => <li key={ i }>{item}</li>)}
    </ul>
  );
}

const cell = 'border-b border-slate-200 px-4 py-3 align-top dark:border-slate-800';

// A grid of rows: head (optional) and rows of cells.
export function Table({ head, rows }: { head?: string[]; rows: ReactNode[][] }) {
  return (
    <div className='not-prose my-4 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800'>
      <table className='w-full min-w-[34rem] border-collapse text-left text-sm leading-relaxed text-slate-700 dark:text-slate-300'>
        {head && (
          <thead className='bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-900 dark:text-slate-400'>
            <tr>
              {head.map((h) => <th key={ h } className='px-4 py-3 font-medium'>{h}</th>)}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row, i) => (
            <tr key={ i } className='last:[&>td]:border-b-0'>
              {row.map((c, j) => <td key={ j } className={ cell }>{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Two columns: what, and the answer. Used for the purposes in the Policy.
export function DefTable({ rows }: { rows: [string, ReactNode][] }) {
  return (
    <div className='not-prose my-4 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800'>
      <table className='w-full border-collapse text-left text-sm leading-relaxed text-slate-700 dark:text-slate-300'>
        <tbody>
          {rows.map(([k, v]) => (
            <tr key={ k } className='last:[&>*]:border-b-0'>
              <th scope='row' className={ `${cell} w-2/5 bg-slate-50 font-medium text-slate-900 dark:bg-slate-900 dark:text-slate-100 sm:w-1/4` }>{k}</th>
              <td className={ cell }>{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// The operator's details as a table (used by every document).
export function OperatorTable() {
  return (
    <DefTable
      rows={ [
        ['Наименование', OPERATOR.name],
        ['ИНН / КПП', `${OPERATOR.inn} / ${OPERATOR.kpp}`],
        ['ОГРН', OPERATOR.ogrn],
        ['Адрес', OPERATOR.address],
        ['Электронная почта', <MailLink key='mail' />],
        ['Телефон', <PhoneLink key='phone' />],
        ['Ответственный за организацию обработки персональных данных', `${OPERATOR.directorRole} ${OPERATOR.director}`],
      ] }
    />
  );
}

// Links to the other documents, at the end of every page.
export function OtherDocuments({ current }: { current?: LegalDocKey }) {
  const others = LEGAL_ORDER.filter((k) => k !== current);

  return (
    <nav aria-label='Другие документы' className='not-prose mt-14 border-t border-slate-200 pt-8 dark:border-slate-800'>
      <p className='text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400'>Другие документы</p>
      <ul className='mt-4 grid gap-3 sm:grid-cols-2'>
        {others.map((k) => (
          <li key={ k }>
            <Link
              href={ legalPath(k) }
              className='block rounded-2xl border border-slate-200 p-4 text-sm font-medium text-slate-800 transition-colors hover:border-blue-200 hover:bg-blue-50/50 dark:border-slate-800 dark:text-slate-200 dark:hover:border-blue-500/30 dark:hover:bg-blue-500/10'
            >
              {LEGAL_DOCS[k].title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// The wrapper of a document's text: typography, width.
// The text is justified with hyphenation (lang ru gives the browser Russian rules); headings and tables keep the left edge.
export function Article({ children }: { children: ReactNode }) {
  return (
    <article lang='ru' className='prose prose-slate max-w-none text-justify hyphens-auto text-[15px] text-slate-700 dark:prose-invert dark:text-slate-300 prose-headings:text-left prose-p:my-3 prose-p:leading-relaxed prose-ul:my-3 prose-li:my-1 prose-a:font-medium prose-a:text-blue-700 prose-a:no-underline hover:prose-a:underline dark:prose-a:text-blue-300 [&_table]:text-left'>
      {children}
    </article>
  );
}
