import Providers from '@/app/providers';
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
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
    <html lang="en">
      <body
        className={`${GeistSans.className} ${GeistSans.variable} ${GeistMono.variable}`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
