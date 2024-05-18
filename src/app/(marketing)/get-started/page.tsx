import Auth from '@/app/(marketing)/get-started/_components/auth';
import {
  HeroPageHeader,
  HeroPageHeaderDescription,
  HeroPageHeaderHeading,
} from '@/components/shared/hero-header';

export default function Dashboard() {
  return (
    <main className="w-full flex-1 md:grid md:grid-cols-2">
      <div className="flex items-center justify-center py-16">
        <div className="mx-auto flex flex-col gap-6">
          <Auth.Header />
          <div className="flex w-full items-center justify-center">
            <Auth.Form />
            <Auth.SkeletonLoader />
          </div>
        </div>
      </div>
      <div className="hidden items-center justify-center bg-muted md:flex">
        <HeroPageHeader className="w-[550px]">
          <HeroPageHeaderHeading>Easily manage expenses</HeroPageHeaderHeading>
          <HeroPageHeaderDescription>
            Get started today and take control of your finances
          </HeroPageHeaderDescription>
        </HeroPageHeader>
      </div>
    </main>
  );
}
