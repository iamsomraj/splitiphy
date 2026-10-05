import type { ReactNode } from 'react';

interface LegalLayoutProps {
  children: ReactNode;
}

export default function LegalLayout({ children }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="py-12">
        <main>{children}</main>
        <footer className="container mx-auto mt-12 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Splitiphy. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
