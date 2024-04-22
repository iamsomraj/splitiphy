import { Button } from '@/components/ui/button';
import UserSettingsForm from '@/components/users/user-settings-form';
import { getLoggedInUser } from '@/db/queries';
import paths from '@/lib/paths';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

const BackButton = () => (
  <Link href={paths.dashboard()}>
    <Button variant="outline" size="icon" className="h-7 w-7">
      <ChevronLeft className="h-4 w-4" />
      <span className="sr-only">Back</span>
    </Button>
  </Link>
);

export default async function SettingsPage() {
  const user = await getLoggedInUser();

  return (
    <main className="flex flex-1 flex-col gap-6 divide-y py-4 pt-6 sm:py-6 lg:py-12">
      <div className="flex flex-col gap-6 px-6 sm:px-12">
        <div className="flex flex-wrap items-center gap-4">
          <BackButton />
          <span className="text-4xl font-bold">Settings</span>
        </div>
        <UserSettingsForm user={user} />
      </div>
    </main>
  );
}
