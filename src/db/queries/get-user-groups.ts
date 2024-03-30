import db from '@/db/drizzle';
import { groups, users } from '@/db/schema';
import { auth, currentUser } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';
import { cache } from 'react';

const createOrUpdateLoggedInUser = async () => {
  const currUser = await currentUser();

  if (!currUser || !currUser.id) {
    return null;
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, currUser.id),
  });

  if (!user) {
    return await db
      .insert(users)
      .values({
        id: currUser.id,
        username: currUser.externalAccounts?.find((a) => !!a.username)?.username || '',
        email: currUser.emailAddresses?.find((e) => e.id === currUser.primaryEmailAddressId)?.emailAddress || '',
        phone: currUser.phoneNumbers?.find((p) => p.id === currUser.primaryPhoneNumberId)?.phoneNumber || '',
        firstName: currUser.firstName || '',
        lastName: currUser.lastName || '',
        profileImage: currUser.imageUrl || '',
        createdAt: new Date(),
        updatedAt: null,
        isDeleted: false,
      })
      .returning();
  } else {
    return await db
      .update(users)
      .set({
        username: currUser.externalAccounts?.find((a) => !!a.username)?.username || '',
        email: currUser.emailAddresses?.find((e) => e.id === currUser.primaryEmailAddressId)?.emailAddress || '',
        phone: currUser.phoneNumbers?.find((p) => p.id === currUser.primaryPhoneNumberId)?.phoneNumber || '',
        firstName: currUser.firstName || '',
        lastName: currUser.lastName || '',
        profileImage: currUser.imageUrl || '',
      })
      .where(eq(users.id, currUser.id))
      .returning();
  }
};

export const getUserGroups = cache(async () => {
  const authUser = await auth();

  if (!authUser || !authUser.userId) {
    return [];
  }

  const session = await createOrUpdateLoggedInUser();

  if (!session || !session[0].id) {
    return [];
  }

  const ownedGroups = await db.query.groups.findMany({
    where: eq(groups.ownerId, session[0].id),
    with: {
      groupExpenses: true,
      groupMemberships: true,
      userBalances: true,
    },
  });
  return ownedGroups;
});

export type UserGroupsWithData = Awaited<ReturnType<typeof getUserGroups>>;
