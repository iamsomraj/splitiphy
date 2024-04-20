'use client';
import * as actions from '@/actions';
import FormButton from '@/components/shared/form-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SingleGroupWithData } from '@/db/queries';
import { useSearchParams } from 'next/navigation';

type GroupUserSearchFormProps = {
  group: SingleGroupWithData;
};

const GroupUserSearchForm = ({ group }: GroupUserSearchFormProps) => {
  const searchParams = useSearchParams();
  const searchUserAction = actions.searchUsers.bind(null, group?.uuid || '');

  return (
    <>
      <form action={searchUserAction} className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            name="term"
            placeholder="John Doe"
            defaultValue={searchParams.get('term') || ''}
            autoFocus={false}
          />
          <div className="text-sm text-muted-foreground">
            Search the name of the user you want to add to the group
          </div>
        </div>
        <FormButton>Search</FormButton>
      </form>
    </>
  );
};

export default GroupUserSearchForm;
