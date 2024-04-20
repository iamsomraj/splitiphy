import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ManyGroupWithData } from '@/db/queries';
import paths from '@/lib/paths';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

type GroupItemProps = {
  group: ManyGroupWithData[0];
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
          <p>{group.owner.firstName + ' ' + group.owner.lastName}</p>
          <span>{group.groupMemberships.length} members</span>
        </CardContent>
      </Card>
    </Link>
  );
};

export default GroupItem;
