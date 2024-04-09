'use client';
import * as actions from '@/actions';
import FormButton from '@/components/shared/form-button';
import { Button } from '@/components/ui/button';
import {
  Card,
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';

type DivProps = React.HTMLAttributes<HTMLDivElement>;

type GroupUserSearchFormProps = {
  groupUuid: string;
} & DivProps;

const GroupUserSearchForm = ({
  groupUuid,
  className,
  ...rest
}: GroupUserSearchFormProps) => {
  const searchParams = useSearchParams();
  const searchUserAction = actions.searchUsers.bind(null, groupUuid);

  return (
    <>
      <Card
        className={cn(
          'flex w-fit flex-col items-center justify-start gap-6 bg-muted/40 p-6 sm:flex-row sm:p-6 sm:px-12',
          className,
        )}
        {...rest}
      >
        <CardHeader className="p-0">
          <CardTitle>Search Members</CardTitle>
          <CardDescription className="leading-relaxed">
            Add members to your group to start managing expenses
          </CardDescription>
        </CardHeader>
        <CardFooter className="p-0">
          <form action={searchUserAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                name="term"
                placeholder="Search for a user"
                defaultValue={searchParams.get('term') || ''}
              />
              <div className="text-sm text-muted-foreground">
                Type the name of the user you want to add to the group
              </div>
            </div>
            <FormButton>Search</FormButton>
          </form>
        </CardFooter>
      </Card>
    </>
  );
};

export default GroupUserSearchForm;
