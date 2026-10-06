import Feature from '@/app/(marketing)/_components/feature';
import { Announcement } from '@/components/shared/announcements';
import {
  HeroPageActions,
  HeroPageHeader,
  HeroPageHeaderDescription,
  HeroPageHeaderHeading,
} from '@/components/shared/hero-header';
import { Icons } from '@/components/shared/icons';
import { buttonVariants } from '@/components/ui/button';
import { siteConfig } from '@/config/site';
import paths from '@/lib/paths';
import { cn } from '@/lib/utils';
import { Show } from '@clerk/nextjs';
import { DashboardIcon } from '@radix-ui/react-icons';
import {
  ArrowRight,
  ChartLine,
  FileSpreadsheet,
  Handshake,
  Link2,
  Search,
  Split,
  SunMoon,
  WandSparkles,
} from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

const features = [
  {
    title: 'Groups & invite links',
    description:
      'Create a group for a trip or a flat and invite friends with a single link.',
    icon: Link2,
  },
  {
    title: 'Flexible splits',
    description:
      'Split equally or by custom amounts, even when several people paid.',
    icon: Split,
  },
  {
    title: 'Simplify debts',
    description:
      'Collapse a web of IOUs into the fewest payments needed to square up.',
    icon: WandSparkles,
  },
  {
    title: 'Settle up',
    description: 'Record settlements in one tap and keep balances accurate.',
    icon: Handshake,
  },
  {
    title: 'Search & filters',
    description: 'Find any expense by name, category or date range in seconds.',
    icon: Search,
  },
  {
    title: 'CSV export',
    description:
      'Download every expense and share for your spreadsheets or records.',
    icon: FileSpreadsheet,
  },
  {
    title: 'Spending charts',
    description: 'See where the money goes across all your groups over time.',
    icon: ChartLine,
  },
  {
    title: 'Your currency, your theme',
    description:
      'Pick from 20 currencies and switch between light and dark mode.',
    icon: SunMoon,
  },
];

const steps = [
  {
    title: 'Create a group',
    description: 'Start a group and share the invite link with everyone.',
  },
  {
    title: 'Add expenses',
    description:
      'Log who paid and how to split it with a quick step-by-step form.',
  },
  {
    title: 'Settle up',
    description: 'Simplify balances and settle with the fewest payments.',
  },
];

const PrimaryCta = ({ className }: { className?: string }) => (
  <>
    <Show when="signed-in">
      <Link
        href={paths.dashboard()}
        className={cn(buttonVariants({ size: 'lg' }), className)}
      >
        <DashboardIcon className="mr-2 h-4 w-4" />
        Go to dashboard
      </Link>
    </Show>
    <Show when="signed-out">
      <Link
        href={paths.getStarted()}
        className={cn(buttonVariants({ size: 'lg' }), className)}
      >
        Get started for free
        <ArrowRight className="ml-2 h-4 w-4" />
      </Link>
    </Show>
  </>
);

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

// Lets search engines show splitiphy as a free web app
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  author: {
    '@type': 'Person',
    name: 'Somraj Mukherjee',
    url: siteConfig.links.gitHub,
  },
  sameAs: [siteConfig.links.sourceGithub],
};

export default function IndexPage() {
  return (
    <div className="relative flex w-full flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <main className="relative container flex flex-col gap-16 px-4 pb-16 sm:gap-24 sm:px-6 sm:pb-24">
        <HeroPageHeader>
          <Announcement link={paths.getStarted()}>
            New: invite links, CSV export & expense filters
          </Announcement>
          <HeroPageHeaderHeading>
            Split bills, not friendships
          </HeroPageHeaderHeading>
          <HeroPageHeaderDescription>
            {siteConfig.description}
          </HeroPageHeaderDescription>
          <HeroPageActions>
            <PrimaryCta />
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href={siteConfig.links.sourceGithub}
              className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
            >
              <Icons.gitHub className="mr-2 h-4 w-4" />
              Star on GitHub
            </Link>
          </HeroPageActions>
        </HeroPageHeader>

        <section id="how-it-works" className="flex flex-col gap-8">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
            <HeroPageHeaderHeading className="text-2xl md:text-4xl">
              How it works
            </HeroPageHeaderHeading>
            <HeroPageHeaderDescription className="text-base sm:text-lg">
              From the first expense to the last settlement in three steps.
            </HeroPageHeaderDescription>
          </div>
          <ol className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <li
                key={step.title}
                className="flex gap-4 rounded-xl border bg-muted/40 p-5"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {index + 1}
                </span>
                <div className="space-y-1">
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section id="features" className="flex flex-col gap-8">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
            <HeroPageHeaderHeading className="text-2xl md:text-4xl">
              Everything you need to share costs
            </HeroPageHeaderHeading>
            <HeroPageHeaderDescription className="text-base sm:text-lg">
              {siteConfig.name} keeps track of who owes whom, so you don&apos;t
              have to.
            </HeroPageHeaderDescription>
          </div>
          <Feature.List>
            {features.map(({ title, description, icon: Icon }) => (
              <Feature.Item
                key={title}
                title={title}
                description={description}
                icon={<Icon className="h-5 w-5" />}
              />
            ))}
          </Feature.List>
        </section>

        <section className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 rounded-2xl border bg-muted/40 px-6 py-10 text-center sm:py-14">
          <HeroPageHeaderHeading className="text-2xl md:text-4xl">
            Ready to split your next bill?
          </HeroPageHeaderHeading>
          <HeroPageHeaderDescription className="text-base sm:text-lg">
            It&apos;s free and open source. Create your first group in under a
            minute.
          </HeroPageHeaderDescription>
          <PrimaryCta className="w-full sm:w-auto" />
          <p className="text-sm text-muted-foreground">
            The code is available on{' '}
            <Link
              href={siteConfig.links.sourceGithub}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              GitHub
            </Link>
            .
          </p>
        </section>
      </main>
    </div>
  );
}
