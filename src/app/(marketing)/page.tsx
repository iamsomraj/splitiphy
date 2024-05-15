import Feature from '@/app/(marketing)/_components/feature';
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
        <section className="container space-y-6 py-8 dark:bg-transparent md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <PageHeaderHeading>Features</PageHeaderHeading>
            <PageHeaderDescription>
              {siteConfig.name} offers a variety of features to help you manage
              your shared expenses with ease.
            </PageHeaderDescription>
          </div>
          <Feature.List>
            <Feature.Item
              title="Expense Tracking"
              description="Easily keep track of all shared expenses with friends and family."
              icon={<Icons.dollar className="h-12 w-12 fill-current" />}
            />
            <Feature.Item
              title="Group Expense Splitting"
              description="Split bills seamlessly among multiple individuals."
              icon={<Icons.group className="h-12 w-12 fill-current" />}
            />
            <Feature.Item
              title="Expense Categories"
              description="Organize your expenses into customizable categories."
              icon={<Icons.folder className="h-12 w-12" />}
            />
          </Feature.List>
        </section>

        <section id="open-source" className="container py-8 md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <PageHeaderHeading>Proudly Open Source</PageHeaderHeading>
            <PageHeaderDescription>
              {siteConfig.name} is open source and powered by open source
              software. <br /> The code is available on{' '}
              <Link
                href={siteConfig.links.sourceGithub}
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-4"
              >
                GitHub
              </Link>
              .{' '}
            </PageHeaderDescription>
          </div>
        </section>
      </main>
    </div>
  );
}
