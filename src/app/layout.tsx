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

export const metadata: Metadata = {
  title      : 'Cardio Assistant',
  description: ' ',
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
