'use client';
import * as actions from '@/actions';
import { createGroupSchema } from '@/actions/create-group';
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Input } from '../ui/input';

const GroupCreateForm = () => {
  const [formState, action] = useFormState(actions.createGroup, {
    errors: {},
  });

  const form = useForm<z.infer<typeof createGroupSchema>>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      name: '',
    },
  });

  async function onSubmit(data: z.infer<typeof createGroupSchema>) {
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <>
      <Card className="col-span-2 bg-muted/40 sm:col-span-1">
        <CardHeader className="pb-3">
          <CardTitle>Your Groups</CardTitle>
          <CardDescription className="text-balance leading-relaxed">
            Introducing Our Dynamic Groups Dashboard for Seamless Management and
            Insightful Analysis.
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
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="w-2/3 space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Group Name</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter group name"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This is the name of your group.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="btn-primary">
                    Create Group
                  </Button>
                  {formState.errors._form ? (
                    <div>{formState.errors._form?.join(', ')}</div>
                  ) : null}
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </>
  );
};

export default GroupCreateForm;
