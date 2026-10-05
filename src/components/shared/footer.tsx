import { siteConfig } from '@/config/site';
import paths from '@/lib/paths';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t pt-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
      <div className="container flex flex-col items-center justify-between gap-4 px-4 sm:px-6 md:flex-row">
        <p className="text-center text-sm leading-loose text-balance text-muted-foreground md:text-left">
          © {new Date().getFullYear()} {siteConfig.name}. Built by{' '}
          <a
            href={siteConfig.links.gitHub}
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            iamsomraj
          </a>
          . The source code is on{' '}
          <a
            href={siteConfig.links.sourceGithub}
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            GitHub
          </a>
          .
        </p>
        <nav className="flex gap-4 text-sm text-muted-foreground">
          <Link href={paths.terms()} className="hover:text-foreground">
            Terms
          </Link>
          <Link href={paths.privacy()} className="hover:text-foreground">
            Privacy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
