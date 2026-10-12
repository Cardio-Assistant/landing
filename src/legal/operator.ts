// The operator of personal data behind the site and the web app (Federal Law 152-FZ).
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
  email       : 'alexosipov03@yandex.ru',
  phone       : '+7 958 872-61-33',
  phoneHref   : '+79588726133',
  director    : 'Осипов Александр Денисович',
  directorRole: 'Генеральный директор',
  siteUrl     : 'https://ai-cardio.ru',
  appUrl      : 'https://ai-cardio.ru/web',
} as const;

// How long what is kept (the Policy, section 4 and 9). If a period changes, change the
// Policy text too and bump the edition: the numbers below are what the pages print.
export const RETENTION = {
  webLogsMonths: 3,  // web server and application logs
  requestMonths: 12, // contact-form requests
  auditMonths  : 12, // the log of access to patient data in the web app
  destroyDays  : 30, // destruction after consent is withdrawn / the purpose is achieved (art. 21 of the Law)
  backupDays   : 14, // daily database dumps are rotated; deleted data leaves them within this time
} as const;
