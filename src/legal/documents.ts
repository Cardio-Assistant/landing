// The legal documents published under /legal. The edition of a document is the date it
// came into force; the web app sends the edition of the consent and the terms the person
// saw, and the api stores it (api: internal/consent, web: config/legal.ts). When a text
// changes, change its edition here AND there, and deploy the three together.
export const LEGAL_VERSION = '2026-10-13';
export const LEGAL_DATE = '13.10.2026';

export type LegalDocKey = 'privacy' | 'consentContacts' | 'consentRegistration' | 'terms';

export interface LegalDoc {
  key: LegalDocKey;
  slug: string;
  // Identifier recorded with an acceptance (the api knows registration_consent and terms).
  code: string;
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
    code     : 'privacy_policy',
    version  : LEGAL_VERSION,
    title    : 'Политика обработки персональных данных',
    titleEn  : 'Privacy policy',
    summary  : 'Какие данные мы обрабатываем на сайте и в веб-приложении, зачем, как долго и как защищаем; ваши права; cookie.',
    summaryEn: 'What data we process on the site and in the web app, why, for how long and how it is protected; your rights; cookies.',
  },
  consentContacts: {
    key      : 'consentContacts',
    slug     : 'consent-contacts',
    code     : 'contacts_consent',
    version  : LEGAL_VERSION,
    title    : 'Согласие на обработку персональных данных (форма обратной связи)',
    titleEn  : 'Consent to personal data processing (contact form)',
    summary  : 'Даётся отдельно при отправке формы «Оставьте заявку» на сайте.',
    summaryEn: 'Given separately when you send the contact form on the site.',
  },
  consentRegistration: {
    key      : 'consentRegistration',
    slug     : 'consent-registration',
    code     : 'registration_consent',
    version  : LEGAL_VERSION,
    title    : 'Согласие на обработку персональных данных (регистрация в веб-приложении)',
    titleEn  : 'Consent to personal data processing (web app registration)',
    summary  : 'Даётся отдельно при регистрации или активации учётной записи в веб-приложении Cardio Assistant.',
    summaryEn: 'Given separately when you register or activate an account in the Cardio Assistant web app.',
  },
  terms: {
    key      : 'terms',
    slug     : 'terms',
    code     : 'terms',
    version  : LEGAL_VERSION,
    title    : 'Пользовательское соглашение (веб-приложение)',
    titleEn  : 'Terms of use (web app)',
    summary  : 'Условия использования веб-приложения Cardio Assistant: статус прототипа, обязанности, права, ответственность.',
    summaryEn: 'Terms of using the Cardio Assistant web app: prototype status, obligations, rights, liability.',
  },
};

export const LEGAL_ORDER: LegalDocKey[] = ['privacy', 'consentContacts', 'consentRegistration', 'terms'];

export const legalPath = (key: LegalDocKey) => `/legal/${LEGAL_DOCS[key].slug}`;
export const legalUrl = (key: LegalDocKey, siteUrl = 'https://ai-cardio.ru') => `${siteUrl}${legalPath(key)}`;

// Where the cookie section of the Policy starts (the banner and the footer link to it).
export const COOKIES_ANCHOR = '#cookies';
export const cookiesPath = () => `${legalPath('privacy')}${COOKIES_ANCHOR}`;
