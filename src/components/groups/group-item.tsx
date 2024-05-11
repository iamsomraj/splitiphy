'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ManyGroupsWithData } from '@/db/queries';
import paths from '@/lib/paths';
import { DotsVerticalIcon } from '@radix-ui/react-icons';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

type GroupItemProps = {
  group: ManyGroupsWithData[0];
};

const GroupItem = ({ group }: GroupItemProps) => {
  return (
    <Link href={paths.groupShow(group.uuid)}>
      <Card className="hover:bg-accent">
        <CardHeader>
          <CardTitle className="flex justify-between">
            <span>{group.name}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <DotsVerticalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={async () => {}}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardTitle>
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
