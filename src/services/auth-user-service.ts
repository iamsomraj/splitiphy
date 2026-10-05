import db from '@/db/drizzle';
import { users } from '@/db/schema';
import {
  User as ClerkUser,
  clerkClient,
  currentUser,
} from '@clerk/nextjs/server';
import { eq, ilike, or } from 'drizzle-orm';

class UserAuthService {
  private async getCurrentUser(): Promise<ClerkUser | null> {
    return await currentUser();
  }

  private mapUserToDbFormat(user: ClerkUser) {
    return {
      id: user.id,
      username:
        user.externalAccounts?.find((a) => !!a.username)?.username || '',
      email:
        user.emailAddresses?.find((e) => e.id === user.primaryEmailAddressId)
          ?.emailAddress || '',
      phone:
        user.phoneNumbers?.find((p) => p.id === user.primaryPhoneNumberId)
          ?.phoneNumber || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      profileImage: user.imageUrl || '',
      updatedAt: null,
    };
  }

  public async createOrUpdateLoggedInUser(): Promise<
    (typeof users.$inferSelect)[] | null
  > {
    const currUser = await this.getCurrentUser();

    if (!currUser || !currUser.id) {
      return null;
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, currUser.id),
    });

    const userData = await this.mapUserToDbFormat(currUser);

    if (!user) {
      return await db.insert(users).values(userData).returning();
    } else {
      return await db
        .update(users)
        .set(userData)
        .where(eq(users.id, currUser.id))
        .returning();
    }
  }

  public async getUsersBySearchTermFromAuth(searchTerm: string) {
    const client = await clerkClient();
    const response = await client.users.getUserList({
      query: searchTerm,
    });

    return response.data.map((user) => this.mapUserToDbFormat(user));
  }

  public async getUserByIdFromAuth(userId: string) {
    try {
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      return this.mapUserToDbFormat(user);
    } catch {
      return null;
    }
  }

  public async getUsersBySearchTermFromDB(searchTerm: string) {
    searchTerm = searchTerm.replace(/[\\%_]/g, (char) => `\\${char}`);
    const response = await db.query.users.findMany({
      where: or(
        ilike(users.username, `%${searchTerm}%`),
        ilike(users.email, `%${searchTerm}%`),
        ilike(users.firstName, `%${searchTerm}%`),
        ilike(users.lastName, `%${searchTerm}%`),
      ),
    });
    return response;
  }
}

export default UserAuthService;
