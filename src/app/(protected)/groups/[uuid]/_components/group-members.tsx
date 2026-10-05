import { SingleGroupWithData } from '@/db/queries';

import GroupInviteLink from '@/app/(protected)/groups/[uuid]/_components/group-invite-link';
import GroupUserSearchForm from '@/app/(protected)/groups/[uuid]/search/_components/group-user-search-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Settings } from 'lucide-react';

type GroupMembersProps = {
  group: SingleGroupWithData;
  currentUserId?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const GroupMembers = ({
  group,
  currentUserId,
  className,
  ...rest
}: GroupMembersProps) => {
  return group ? (
    <div className={cn(className)} {...rest}>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full sm:w-auto">
            <Settings className="mr-2 h-3.5 w-3.5" />
            Manage
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">{group.name} Members</DialogTitle>
            <DialogDescription>
              These are the users that are part of this group
            </DialogDescription>
          </DialogHeader>
          <GroupInviteLink
            groupUuid={group.uuid || ''}
            inviteToken={group.inviteToken}
            isOwner={group.ownerId === currentUserId}
          />
          <GroupUserSearchForm group={group} />
          <ul className="scrollbar-none flex max-h-48 flex-col gap-2 overflow-y-auto font-bold">
            {group.groupMemberships.map((member) => (
              <li
                key={member.uuid}
                className="rounded-md p-2 hover:bg-muted/40"
              >
                <div className="flex items-center gap-2 font-medium">
                  <span>
                    {member.user.firstName + ' ' + member.user.lastName}
                  </span>
                  {member.user.email.length > 0 && (
                    <span className="hidden text-sm text-muted-foreground sm:block">
                      {member.user.email}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>
    </div>
  ) : null;
};

export default GroupMembers;
