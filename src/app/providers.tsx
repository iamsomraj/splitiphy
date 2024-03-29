'use client';

import { ClerkProvider } from '@clerk/nextjs';

const Providers = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <ClerkProvider>{children}</ClerkProvider>
    </>
  );
};


export default Providers;