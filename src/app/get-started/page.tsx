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

export default function Dashboard() {
  return (
    <div className="w-full flex-1 lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center py-16">
        <div className="mx-auto grid gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="flex justify-center gap-2 text-3xl font-bold">
              Join the {siteConfig.name} community
            </h1>
            <p className="text-balance text-muted-foreground">
              Select your preferred method to start
            </p>
          </div>
          <div className="flex w-full items-center justify-center">
            <ClerkLoaded>
              <SignIn
                afterSignInUrl={paths.groups()}
                afterSignUpUrl={paths.groups()}
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
                    socialButtonsProviderIcon: 'hidden dark:block',
                    socialButtonsBlockButton: cn(
                      buttonVariants({ variant: 'secondary' }),
                    ),
                    socialButtonsBlockButtonArrow: 'hidden',
                    footer: 'hidden',
                  },
                }}
              />
            </ClerkLoaded>
            <ClerkLoading>
              <div className="flex w-full flex-col items-start gap-4 py-8">
                <Skeleton className="h-12 w-full rounded-md" />
                <Skeleton className="h-12 w-full rounded-md" />
                <Skeleton className="h-12 w-full rounded-md" />
              </div>
            </ClerkLoading>
          </div>
        </div>
      </div>
      <div className="hidden items-center justify-center bg-muted lg:flex">
        <PageHeader className="w-[550px]">
          <PageHeaderHeading>Easily manage expenses</PageHeaderHeading>
          <PageHeaderDescription>
            Get started today and take control of your finances
          </PageHeaderDescription>
        </PageHeader>
      </div>
    </div>
  );
}
