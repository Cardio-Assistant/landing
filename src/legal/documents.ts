// The legal documents published under /legal: the policy of the site and the consent for its
// contact form. (The registration consent and the terms of use of the web application are not
// published here: the application has its own documents, decision of 13.10.2026.)
//
// The edition of a document is the date it came into force. The contact form sends the edition
// of the consent the person saw and /api/contact writes it into the request. When a text
// changes, change its edition here.
export const LEGAL_VERSION = '2026-10-13';
export const LEGAL_DATE = '13.10.2026';

export type LegalDocKey = 'privacy' | 'consentContacts';

export interface LegalDoc {
  key: LegalDocKey;
  slug: string;
  version: string;
  title: string;
  titleEn: string;
  // One line for the hub page.
  summary: string;
  summaryEn: string;
}

export const LEGAL_DOCS: Record<LegalDocKey, LegalDoc> = {
  privacy: {
    key      : 'privacy',
    slug     : 'privacy',
    version  : LEGAL_VERSION,
    title    : 'Политика обработки персональных данных',
    titleEn  : 'Privacy policy',
    summary  : 'Какие данные мы обрабатываем на сайте, зачем, как долго и как защищаем; ваши права; cookie.',
    summaryEn: 'What data we process on the site, why, for how long and how it is protected; your rights; cookies.',
  },
  consentContacts: {
    key      : 'consentContacts',
    slug     : 'consent-contacts',
    version  : LEGAL_VERSION,
    title    : 'Согласие на обработку персональных данных (форма обратной связи)',
    titleEn  : 'Consent to personal data processing (contact form)',
    summary  : 'Даётся отдельно при отправке формы «Оставьте заявку» на сайте.',
    summaryEn: 'Given separately when you send the contact form on the site.',
  },
};

export const LEGAL_ORDER: LegalDocKey[] = ['privacy', 'consentContacts'];

export const legalPath = (key: LegalDocKey) => `/legal/${LEGAL_DOCS[key].slug}`;
export const legalUrl = (key: LegalDocKey, siteUrl = 'https://ai-cardio.ru') => `${siteUrl}${legalPath(key)}`;

// Where the cookie section of the Policy starts (the banner and the footer link to it).
export const COOKIES_ANCHOR = '#cookies';
export const cookiesPath = () => `${legalPath('privacy')}${COOKIES_ANCHOR}`;
