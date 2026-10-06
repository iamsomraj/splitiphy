import Providers from '@/components/providers';
import Footer from '@/components/shared/footer';
import NavBar from '@/components/shared/nav-bar';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { GeistMono } from 'geist/font/mono';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Lets content extend under notches; spacing uses safe-area insets instead.
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafaf9' },
    { media: '(prefers-color-scheme: dark)', color: '#0e0c0b' },
  ],
};

export const metadata: Metadata = {
  title: {
    default: siteConfig.header,
    template: `%s - ${siteConfig.name}`,
  },
  metadataBase: new URL(siteConfig.url),
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: 'iamsomraj',
      url: 'https://portfolio-iamsomraj.vercel.app',
    },
  ],
  creator: 'shadcn',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@iSomraj',
  },
  icons: {
    icon: '/favicon.ico',
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'flex min-h-screen flex-col bg-background font-sans antialiased',
          `${inter.variable} ${GeistMono.variable}`,
        )}
      >
        <Providers>
          <NavBar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
