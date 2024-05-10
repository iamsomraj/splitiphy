'use client';

import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import NextTopLoader from 'nextjs-toploader';

const Providers = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <NextTopLoader />
      <ClerkProvider
        appearance={{
          baseTheme: dark,
        }}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </ClerkProvider>
    </>
  );
};

export default Providers;
