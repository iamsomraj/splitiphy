import Balance from 'react-wrap-balancer';

import { cn } from '@/lib/utils';

function HeroPageHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={cn(
        'mx-auto flex max-w-[980px] flex-col items-center gap-4 pt-12 pb-10 sm:pt-24 sm:pb-14',
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}

function HeroPageHeaderHeading({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn(
        'text-center text-3xl leading-tight font-bold tracking-tighter md:text-6xl lg:leading-[1.1]',
        className,
      )}
      {...props}
    />
  );
}

function HeroPageHeaderDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <Balance
      className={cn(
        'max-w-[750px] text-center text-lg text-muted-foreground sm:text-xl',
        className,
      )}
      {...props}
    />
  );
}

function HeroPageActions({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex w-full flex-col items-stretch justify-center gap-3 py-4 sm:flex-row sm:items-center md:pb-10',
        className,
      )}
      {...props}
    />
  );
}

export {
  HeroPageHeader,
  HeroPageHeaderHeading,
  HeroPageHeaderDescription,
  HeroPageActions,
};
