import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { UserGroupsWithData } from '@/db/queries';
import paths from '@/lib/paths';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

type GroupItemProps = {
  group: UserGroupsWithData[0];
};

const GroupItem = ({ group }: GroupItemProps) => {
  return (
    <Link href={paths.groupShow(group.uuid)}>
      <Card className="hover:bg-accent">
        <CardHeader>
          <CardTitle>{group.name}</CardTitle>
          <CardDescription className="text-sm font-semibold text-accent-foreground/40">
            {formatDistanceToNow(new Date(group.createdAt), {
              addSuffix: true,
            })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {group.groupExpenses.length > 0 ? (
            <p>{group.groupExpenses[0].expense.name}</p>
          ) : (
            <p>{group.owner.firstName + ' ' + group.owner.lastName}</p>
          )}
          <span>{group.groupMemberships.length} members</span>
        </CardContent>
      </Card>
    </Link>
  );
};

export default GroupItem;
