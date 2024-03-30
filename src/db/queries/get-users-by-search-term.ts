import { clerkClient } from '@clerk/nextjs';

export const getUsersBySearchTerm = async (searchTerm: string) => {
  const response = await clerkClient.users.getUserList({
    query: searchTerm,
  });
  return response.map((user) => ({
    id: user.id,
    username: user?.username || '',
    name: user.firstName + ' ' + user.lastName,
    image: user.imageUrl,
  }));
};

export type UserSearchResult = Awaited<ReturnType<typeof getUsersBySearchTerm>>;
