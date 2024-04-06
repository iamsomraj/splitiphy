'use client';

import { ThemeProvider } from '@/components/theme-provider';
import { ClerkProvider } from '@clerk/nextjs';

const Providers = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <ClerkProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </ClerkProvider>
    </>
  );
};

export default Providers;
