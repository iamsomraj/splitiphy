'use client';
import * as actions from '@/actions';
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
import { useFormState } from 'react-dom';
import FormButton from '../shared/form-button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const GroupCreateForm = () => {
  const [formState, action] = useFormState(actions.createGroup, {
    errors: {},
  });

  return (
    <>
      <Card className="col-span-2 bg-muted/40">
        <CardHeader className="gap-2 pb-3">
          <CardTitle>Your Groups</CardTitle>
          <CardDescription className="leading-relaxed">
            Find existing groups or create a new one to manage your expenses
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Create New Group</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Grouo</DialogTitle>
                <DialogDescription>
                  Start by creating a new group to manage your expenses
                </DialogDescription>
              </DialogHeader>
              <form action={action}>
                <div className="flex flex-col gap-4">
                  <Label htmlFor="name">Group Name</Label>
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Enter group name"
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
                <DialogFooter>
                  <FormButton>Create Group</FormButton>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </>
  );
};

export default GroupCreateForm;
