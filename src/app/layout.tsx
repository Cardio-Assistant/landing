// eslint-disable-next-line import/order
import type { Metadata } from 'next';

import localFont from 'next/font/local';

import './globals.css';
import ReactQueryProveder from '@/components/react-query-provider';
import { ThemeProvider } from '@/components/theme-provider';

const geistSans = localFont({
  src     : './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight  : '100 900',
});
const geistMono = localFont({
  src     : './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight  : '100 900',
});

const SITE_URL = 'https://ai-cardio.ru';
const TITLE = 'Cardio Assistant — ИИ для кардиохирургии';
const DESCRIPTION = 'ИИ-платформа для врача: 3D-модель коронарных артерий по ангиограммам, анализ сужений и проект заключения с рекомендациями и источниками. Рабочий прототип, не медицинское изделие.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title       : TITLE,
  description : DESCRIPTION,
  openGraph   : {
    type           : 'website',
    siteName       : 'Cardio Assistant',
    locale         : 'ru_RU',
    alternateLocale: ['en_US'],
    url            : '/about',
    title          : TITLE,
    description    : DESCRIPTION,
    images         : [
      {
        url   : '/og-image.jpg',
        width : 1200,
        height: 630,
        alt   : 'Экран анализа 3D-модели коронарных артерий в Cardio Assistant',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ru' suppressHydrationWarning>
      <body
        className={ `${geistSans.variable} ${geistMono.variable} antialiased` }
      >
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
          <ReactQueryProveder>
            {children}
          </ReactQueryProveder>
        </ThemeProvider>
      </body>
    </html>
  );
}
