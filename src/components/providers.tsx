'use client';

import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import paths from '@/lib/paths';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/ui/themes';
import { useTheme } from 'next-themes';
import NextTopLoader from 'nextjs-toploader';

/** Keeps Clerk's widgets in sync with the app's light/dark theme. */
const ThemedClerkProvider = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme();

  return (
    <ClerkProvider
      signInUrl={paths.getStarted()}
      signInFallbackRedirectUrl={paths.dashboard()}
      signUpFallbackRedirectUrl={paths.dashboard()}
      appearance={{
        theme: resolvedTheme === 'dark' ? dark : undefined,
        // Puts Clerk's styles in a CSS layer below Tailwind's utilities so the
        // `elements` class overrides actually apply.
        cssLayerName: 'clerk',
      }}
    >
      {children}
    </ClerkProvider>
  );
};

const Providers = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <NextTopLoader showSpinner={false} />
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ThemedClerkProvider>
          {children}
          <Toaster />
        </ThemedClerkProvider>
      </ThemeProvider>
    </>
  );
};

export default Providers;
