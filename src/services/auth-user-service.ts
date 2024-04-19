import db from '@/db/drizzle';
import { users } from '@/db/schema';
import { clerkClient, currentUser } from '@clerk/nextjs';
import { User as ClerkUser } from '@clerk/nextjs/server';
import { eq, ilike, or } from 'drizzle-orm';

interface CurrentUser {
  id: string;
  externalAccounts?: { username: string }[];
  emailAddresses?: { id: string; emailAddress: string }[];
  primaryEmailAddressId?: string;
  phoneNumbers?: { id: string; phoneNumber: string }[];
  primaryPhoneNumberId?: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
}

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
      isDeleted: false,
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
    const response = await clerkClient.users.getUserList({
      query: searchTerm,
    });

    return response.map((user) => this.mapUserToDbFormat(user));
  }

  public async getUsersBySearchTermFromDB(searchTerm: string) {
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
