import type { ReactNode } from 'react';

interface LegalLayoutProps {
  children: ReactNode;
}

export default function LegalLayout({ children }: LegalLayoutProps) {
  return <main className="flex-1 px-4 py-10 sm:px-6 sm:py-12">{children}</main>;
}
