import { GroupWithData } from '@/db/queries';

import GroupUserSearchForm from '@/components/groups/group-user-search-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

type GroupMembersProps = {
  group: GroupWithData;
} & React.HTMLAttributes<HTMLDivElement>;

const GroupMembers = ({ group, className, ...rest }: GroupMembersProps) => {
  return group ? (
    <div className={cn(className)} {...rest}>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Manage Members</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">{group.name} Members</DialogTitle>
            <DialogDescription>
              These are the users that are part of this group
            </DialogDescription>
          </DialogHeader>
          <GroupUserSearchForm group={group} />
          <ul className="flex max-h-48 flex-col gap-2 overflow-y-auto font-bold scrollbar-none">
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
                    <span className="text-sm text-muted-foreground">
                      {member.user.email}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  ) : null;
};

export default GroupMembers;
