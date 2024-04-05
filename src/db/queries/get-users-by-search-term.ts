import UserAuthService from '@/services/auth-user-service';
import { cache } from 'react';

export const getUsersBySearchTerm = cache(async (searchTerm: string) => {
  const userAuthService = new UserAuthService();
  const [dbUsers, authUsers] = await Promise.allSettled([
    userAuthService.getUsersBySearchTermFromDB(searchTerm),
    userAuthService.getUsersBySearchTermFromAuth(searchTerm),
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
