import UserSettingsForm from '@/components/users/user-settings-form';
import { getLoggedInUser } from '@/db/queries';

export default async function SettingsPage() {
  const user = await getLoggedInUser();

  return (
    <main className="flex flex-1 flex-col gap-6 divide-y py-4 pt-6 sm:py-6 lg:py-12">
      <div className="flex flex-col gap-6 px-6 sm:px-12">
        <div className="flex flex-wrap items-end gap-2">
          <span className="text-4xl font-bold">Settings</span>
        </div>
        <UserSettingsForm user={user} />
      </div>
    </main>
  );
}
