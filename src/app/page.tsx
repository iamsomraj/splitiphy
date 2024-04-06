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
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <PageHeader>
          <Announcement link={paths.signUp()}>
            Introducing Splitiphy! Get started by creating an account.
          </Announcement>
          <PageHeaderHeading>
            Splitiphy - Simplify Your Shared Expenses
          </PageHeaderHeading>
          <PageHeaderDescription>
            Effortlessly manage and split bills with friends and family.
            User-friendly. Flexible. Secure.
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
