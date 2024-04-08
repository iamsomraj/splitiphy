import { UserGroupsWithData } from '@/db/queries';
import paths from '@/lib/paths';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type GroupItemProps = {
  group: UserGroupsWithData[0];
};

const GroupItem = ({ group }: GroupItemProps) => {
  return (
    <Link href={paths.groupShow(group.uuid)}>
      <Card className="bg-muted/40">
        <CardHeader>
          <CardTitle>{group.name}</CardTitle>
          <CardDescription>
            {new Intl.RelativeTimeFormat(undefined).format(
              new Date(group.createdAt).getDay() - new Date().getDay(),
              'days',
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Created by {group.owner.firstName + ' ' + group.owner.lastName}</p>
          <span>{group.groupMemberships.length} members</span>
        </CardContent>
      </Card>
    </Link>
  );
};

export default GroupItem;
