import Providers from '@/components/providers';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Splitiphy',
  description: 'Easily split bills with friends and family',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${GeistSans.className} ${GeistSans.variable} ${GeistMono.variable}`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
