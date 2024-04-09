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
import { SignedIn, SignedOut } from '@clerk/nextjs';
import { DashboardIcon } from '@radix-ui/react-icons';
import { UsersIcon } from 'lucide-react';
import Link from 'next/link';

export default function IndexPage() {
  return (
    <div className="relative flex w-full flex-1 flex-col">
      <main className="container relative">
        <PageHeader>
          <SignedIn>
            <Announcement link={paths.dashboard()}>
              Introducing Simplify Mode
            </Announcement>
          </SignedIn>
          <SignedOut>
            <Announcement link={paths.getStarted()}>
              Introducing Simplify Mode
            </Announcement>
          </SignedOut>
          <PageHeaderHeading>{siteConfig.header}</PageHeaderHeading>
          <PageHeaderDescription>
            {siteConfig.description}
          </PageHeaderDescription>
          <PageActions>
            <SignedIn>
              <Link href={paths.dashboard()} className={cn(buttonVariants())}>
                <DashboardIcon className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </SignedIn>
            <SignedOut>
              <Link href={paths.getStarted()} className={cn(buttonVariants())}>
                Get Started
              </Link>
            </SignedOut>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href={siteConfig.links.sourceGithub}
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
