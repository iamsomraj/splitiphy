import { siteConfig } from '@/config/site';

export default function Footer() {
  return (
    <footer className="py-6">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built by{' '}
          <a
            href={siteConfig.links.sourceGithub}
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            iamsomraj
          </a>
          . The source code is available on{' '}
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
      </div>
    </footer>
  );
}
