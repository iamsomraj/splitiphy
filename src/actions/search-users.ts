'use server';

import paths from '@/lib/paths';
import { redirect } from 'next/navigation';

export async function searchUsers(groupUuid: string, formData: FormData) {
  const term = formData.get('term');

  if (typeof term !== 'string' || !term || !groupUuid) {
    redirect(paths.dashboard());
  }

  redirect(paths.groupUserSearch(groupUuid, term));
}
