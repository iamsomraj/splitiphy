import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from '@/components/shared/page-header';
import { buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { siteConfig } from '@/config/site';
import paths from '@/lib/paths';
import { cn } from '@/lib/utils';
import { ClerkLoaded, ClerkLoading, SignIn } from '@clerk/nextjs';
import Link from 'next/link';

const AuthDisclaimer = () => (
  <p className="max-w-xs px-8 text-center text-sm text-muted-foreground">
    By clicking continue, you agree to our{' '}
    <Link
      href={paths.terms()}
      className="underline underline-offset-4 hover:text-primary"
    >
      Terms of Service
    </Link>{' '}
    and{' '}
    <Link
      href={paths.privacy()}
      className="underline underline-offset-4 hover:text-primary"
    >
      Privacy Policy
    </Link>
    .
  </p>
);

const CommunitySection = () => (
  <section className="flex flex-col items-center justify-center">
    <div className="flex w-56 flex-col items-center justify-center gap-2 text-center sm:w-64">
      <h1 className="flex justify-center gap-2 text-3xl font-bold">
        Join the {siteConfig.name} community
      </h1>
      <p className="text-balance text-muted-foreground">
        Select your preferred method to start
      </p>
    </div>
  </section>
);

const AuthComponent = () => (
  <ClerkLoaded>
    <div className="flex flex-col items-center justify-center gap-4">
      <SignIn
        afterSignInUrl={paths.dashboard()}
        afterSignUpUrl={paths.dashboard()}
        appearance={{
          layout: {
            socialButtonsVariant: 'blockButton',
          },
          variables: {
            fontFamily: 'inherit',
          },
          elements: {
            card: 'bg-inherit shadow-none',
            header: 'hidden',
            socialButtons: 'flex flex-col gap-4',
            socialButtonsBlockButtonText: cn(
              'text-sm font-medium text-nowrap hover:text-accent-foreground',
            ),
            socialButtonsProviderIcon__apple:
              'mix-blend-difference dark:mix-blend-normal',
            socialButtonsProviderIcon__github:
              'mix-blend-difference dark:mix-blend-normal',
            socialButtonsBlockButton: cn(
              buttonVariants({ variant: 'secondary' }),
            ),
            socialButtonsBlockButtonArrow: 'hidden',
            footer: 'hidden',
          },
        }}
      />
      <AuthDisclaimer />
    </div>
  </ClerkLoaded>
);

const AuthSkeletonLoader = () => (
  <ClerkLoading>
    <div className="flex w-full flex-col items-start gap-4 py-8">
      <Skeleton className="h-12 w-full rounded-md" />
      <Skeleton className="h-12 w-full rounded-md" />
      <Skeleton className="h-12 w-full rounded-md" />
    </div>
  </ClerkLoading>
);

export default function Dashboard() {
  return (
    <main className="w-full flex-1 md:grid md:grid-cols-2">
      <div className="flex items-center justify-center py-16">
        <div className="mx-auto flex flex-col gap-6">
          <CommunitySection />
          <div className="flex w-full items-center justify-center">
            <AuthComponent />
            <AuthSkeletonLoader />
          </div>
        </div>
      </div>
      <div className="hidden items-center justify-center bg-muted md:flex">
        <PageHeader className="w-[550px]">
          <PageHeaderHeading>Easily manage expenses</PageHeaderHeading>
          <PageHeaderDescription>
            Get started today and take control of your finances
          </PageHeaderDescription>
        </PageHeader>
      </div>
    </main>
  );
}
