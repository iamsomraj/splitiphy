'use client';

import { Button } from '@/components/ui/button';
import * as actions from '@/actions';
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
import { useTransition } from 'react';
import { cn } from '@/lib/utils';

type GroupItemProps = {
  group: ManyGroupsWithData[0];
};

const GroupItem = ({ group }: GroupItemProps) => {
  const [pending, startTransition] = useTransition();
  return (
    <Card
      className={cn(
        'hover:bg-accent',
        pending && 'pointer-events-none opacity-60',
      )}
    >
      <CardHeader>
        <CardTitle className="flex cursor-pointer justify-between">
          <Link href={paths.groupShow(group.uuid)}>
            <span>{group.name}</span>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsVerticalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  startTransition(async () => {
                    await actions.deleteGroup(group?.uuid || '');
                  });
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardTitle>
        <CardDescription className="cursor-pointer text-sm font-semibold text-accent-foreground/40">
          <Link href={paths.groupShow(group.uuid)}>
            {formatDistanceToNow(new Date(group.createdAt), {
              addSuffix: true,
            })}
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent className="cursor-pointer">
        <Link href={paths.groupShow(group.uuid)}>
          <p>{group.owner.firstName + ' ' + group.owner.lastName}</p>
          <span>{group.groupMemberships.length} members</span>
        </Link>
      </CardContent>
    </Card>
  );
};

export default GroupItem;
