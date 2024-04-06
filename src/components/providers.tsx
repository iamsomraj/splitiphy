'use client';

import { ThemeProvider } from '@/components/theme-provider';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
const Providers = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <ClerkProvider
        appearance={{
          baseTheme: dark,
        }}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </ClerkProvider>
    </>
  );
};

export default Providers;
