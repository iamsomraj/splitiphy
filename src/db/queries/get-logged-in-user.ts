import UserAuthService from '@/services/auth-user-service';
import { auth } from '@clerk/nextjs';
import { cache } from 'react';

export const getLoggedInUser = cache(async () => {
  const authUser = await auth();

  if (!authUser || !authUser.userId) {
    return null;
  }

  const userAuthService = new UserAuthService();
  const session = await userAuthService.createOrUpdateLoggedInUser();

  if (!session || !session[0].id) {
    return null;
  }

  return session[0];
});

export type LoggedInUser = Awaited<ReturnType<typeof getLoggedInUser>>;
