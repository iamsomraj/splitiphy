import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';

const font = Nunito({ subsets: ['latin'] });

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
    <ClerkProvider>
      <html lang='en'>
        <body className={font.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
