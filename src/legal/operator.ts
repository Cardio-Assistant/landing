// The operator of personal data behind the site (Federal Law 152-FZ).
// One source for the footer, the legal pages and the contact form, so the details
// cannot drift apart. Change them here only.
export const OPERATOR = {
  name        : 'Общество с ограниченной ответственностью «Нексли»',
  shortName   : 'ООО «Нексли»',
  shortNameEn : 'Nexli LLC',
  inn         : '5918223962',
  kpp         : '591801001',
  ogrn        : '1255900018010',
  address     : '617470, Пермский край, г. Кунгур, ул. Свердлова, д. 43, кв. 36',
  email       : 'support@ai-cardio.ru',
  phone       : '+7 982 451-66-89',
  phoneHref   : '+79824516689',
  director    : 'Осипов Александр Денисович',
  directorRole: 'Генеральный директор',
  siteUrl     : 'https://ai-cardio.ru',
} as const;

// How long what is kept (the Policy, sections 4 and 6). If a period changes, change the
// Policy text too and bump the edition: the numbers below are what the pages print.
export const RETENTION = {
  webLogsMonths: 3,  // web server logs
  requestMonths: 12, // contact-form requests (in the operator's mailbox)
  destroyDays  : 30, // destruction after consent is withdrawn / the purpose is achieved (art. 21 of the Law)
} as const;
