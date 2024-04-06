import { Announcement } from '@/components/shared/announcements';
import { Icons } from '@/components/shared/icons';
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from '@/components/shared/page-header';
import { buttonVariants } from '@/components/ui/button';
import { siteConfig } from '@/config/site';
import paths from '@/lib/paths';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function IndexPage() {
  return (
    <div className="relative flex w-full flex-1 flex-col bg-muted/40">
      <main className="container relative">
        <PageHeader>
          <Announcement link={paths.signUp()}>
            Introducing Simplify Mode
          </Announcement>
          <PageHeaderHeading>{siteConfig.header}</PageHeaderHeading>
          <PageHeaderDescription>
            {siteConfig.description}
          </PageHeaderDescription>
          <PageActions>
            <Link href={paths.signIn()} className={cn(buttonVariants())}>
              Get Started
            </Link>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href={siteConfig.links.github}
              className={cn(buttonVariants({ variant: 'outline' }))}
            >
              <Icons.gitHub className="mr-2 h-4 w-4" />
              GitHub
            </Link>
          </PageActions>
        </PageHeader>
      </main>
    </div>
  );
}
