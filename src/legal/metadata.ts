import { LEGAL_DOCS, legalPath } from './documents';

import type { LegalDocKey } from './documents';
import type { Metadata } from 'next';

// Title, description, canonical address and the share card of a legal page. The root layout
// carries the share card of the main page (its title, its picture); a legal page must not
// inherit that, so it sets its own.
export function legalMetadata(key: LegalDocKey, description: string): Metadata {
  const title = `${LEGAL_DOCS[key].title} – Cardio Assistant`;
  const path = legalPath(key);

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph : { type: 'website', siteName: 'Cardio Assistant', locale: 'ru_RU', url: path, title, description },
  };
}
