'use client';

import * as actions from '@/actions';
import FormButton from '@/components/shared/form-button';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { ManyGroupsWithData } from '@/db/queries';
import paths from '@/lib/paths';
import { cn } from '@/lib/utils';
import { DotsVerticalIcon } from '@radix-ui/react-icons';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { useTransition } from 'react';
import { useFormState } from 'react-dom';

type GroupItemProps = {
  group: ManyGroupsWithData[0];
};

const GroupItem = ({ group }: GroupItemProps) => {
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();
  const [formState, action] = useFormState(actions.editGroup, {
    errors: {},
  });

  const onGroupDelete = () => {
    startTransition(async () => {
      const response = await actions.deleteGroup(group?.uuid || '');
      const title = response?.title || 'Yay! Group deleted.';
      const message =
        response?.message || 'Great! Your group has been deleted.';
      toast({
        title,
        description: message,
      });
    });
  };

  return (
    <Card className={cn(pending && 'pointer-events-none opacity-60')}>
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
              <DropdownMenuItem onClick={onGroupDelete}>
                Delete
              </DropdownMenuItem>
              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Edit
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit Group</DialogTitle>
                    <DialogDescription>
                      Edit the name of your group.
                    </DialogDescription>
                  </DialogHeader>
                  <form action={action}>
                    <input
                      type="hidden"
                      name="group-uuid"
                      value={group?.uuid || ''}
                    />
                    <div className="flex flex-col gap-4">
                      <Label
                        htmlFor="name"
                        className={cn({
                          'text-destructive': Boolean(
                            formState?.errors?.name || false,
                          ),
                        })}
                      >
                        Name
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        name="name"
                        placeholder="Enter group name"
                        defaultValue={group?.name || ''}
                      />
                      <div className="text-sm text-muted-foreground">
                        This is the name of your group.
                      </div>
                      {formState?.errors.name ? (
                        <span className="text-sm font-medium text-destructive">
                          {formState?.errors.name?.join(', ')}
                        </span>
                      ) : null}
                    </div>
                    {formState?.errors?._form ? (
                      <span className="text-sm font-medium text-destructive">
                        {formState?.errors?._form?.join(', ')}
                      </span>
                    ) : null}
                    <DialogFooter className="pt-2">
                      <FormButton>Edit Group</FormButton>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
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
      <CardFooter>
        <Link href={paths.groupShow(group.uuid)}>
          <Button variant="outline" className="w-full">
            View group
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default GroupItem;
