import BackButton from '@/app/(protected)/settings/_components/back-button';
import UserSettingsForm from '@/app/(protected)/settings/_components/user-settings-form';
import { getLoggedInUser } from '@/db/queries';

export default async function SettingsPage() {
  const user = await getLoggedInUser();

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 pt-6 pb-12 sm:px-6 lg:px-12">
      <div className="flex flex-wrap items-center gap-4">
        <BackButton />
        <h1 className="text-3xl font-bold sm:text-4xl">Settings</h1>
      </div>
      <UserSettingsForm user={user} />
    </main>
  );
}
