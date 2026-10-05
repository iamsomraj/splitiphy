import * as actions from '@/actions';
import FormButton from '@/components/shared/form-button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import db from '@/db/drizzle';
import { groups } from '@/db/schema';
import paths from '@/lib/paths';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import { redirect } from 'next/navigation';

type InvitePageProps = {
  params: Promise<{
    token: string;
  }>;
};

export default async function InvitePage(props: InvitePageProps) {
  const { token } = await props.params;
  const { userId } = await auth();

  const group = await db.query.groups.findFirst({
    where: eq(groups.inviteToken, token),
    with: {
      owner: true,
      groupMemberships: true,
    },
  });

  if (!group) {
    return (
      <main className="flex flex-1 items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Invite link is invalid</CardTitle>
            <CardDescription>
              This link has expired or was revoked. Ask a group member for a new
              one.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href={paths.dashboard()} className="underline">
              Go to dashboard
            </Link>
          </CardFooter>
        </Card>
      </main>
    );
  }

  if (group.groupMemberships.some((member) => member.userId === userId)) {
    redirect(paths.groupShow(group.uuid));
  }

  const memberCount = group.groupMemberships.length;

  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Join {group.name}</CardTitle>
          <CardDescription>
            {group.owner.firstName} {group.owner.lastName} invited you to split
            expenses together.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {memberCount} {memberCount === 1 ? 'member' : 'members'}
        </CardContent>
        <CardFooter>
          <form
            action={actions.joinGroupByInvite.bind(null, token)}
            className="w-full"
          >
            <FormButton className="w-full">Join group</FormButton>
          </form>
        </CardFooter>
      </Card>
    </main>
  );
}
