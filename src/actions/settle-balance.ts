'use server';

import db from '@/db/drizzle';
import { groupUserBalances } from '@/db/schema';
import paths from '@/lib/paths';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function settleBalance(groupUuid: string, balanceUuid: string) {
  await db
    .update(groupUserBalances)
    .set({
      amount: '0.00',
    })
    .where(eq(groupUserBalances.uuid, balanceUuid));

  revalidatePath(paths.groupShow(groupUuid));
  redirect(paths.groupShow(groupUuid));
}
