import { clerkClient } from '@clerk/nextjs';
import { ilike, or } from 'drizzle-orm';
import { cache } from 'react';
import db from '../drizzle';
import { users } from '../schema';

const getUsersBySearchTermFromDB = async (searchTerm: string) => {
  const response = await db.query.users.findMany({
    where: or(
      ilike(users.username, `%${searchTerm}%`),
      ilike(users.email, `%${searchTerm}%`),
      ilike(users.firstName, `%${searchTerm}%`),
      ilike(users.lastName, `%${searchTerm}%`),
    ),
  });
  return response;
};

const getUsersBySearchTermFromAuth = async (searchTerm: string) => {
  const response = await clerkClient.users.getUserList({
    query: searchTerm,
  });
  return response.map((user) => ({
    id: user.id,
    username: user.externalAccounts?.find((a) => !!a.username)?.username || '',
    email:
      user.emailAddresses?.find((e) => e.id === user.primaryEmailAddressId)
        ?.emailAddress || '',
    phone:
      user.phoneNumbers?.find((p) => p.id === user.primaryPhoneNumberId)
        ?.phoneNumber || '',
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    profileImage: user.imageUrl || '',
    createdAt: new Date(),
    updatedAt: null,
    isDeleted: false,
  }));
};

export const getUsersBySearchTerm = cache(async (searchTerm: string) => {
  const [dbUsers, authUsers] = await Promise.allSettled([
    getUsersBySearchTermFromDB(searchTerm),
    getUsersBySearchTermFromAuth(searchTerm),
  ]);

  const mergedUsers = [
    ...(dbUsers.status === 'fulfilled' ? dbUsers.value : []),
    ...(authUsers.status === 'fulfilled' ? authUsers.value : []),
  ];

  const uniqueUsers = Array.from(
    new Map(mergedUsers.map((user) => [user.id, user])).values(),
  );

  return uniqueUsers;
});

export type UserSearchResult = Awaited<ReturnType<typeof getUsersBySearchTerm>>;
