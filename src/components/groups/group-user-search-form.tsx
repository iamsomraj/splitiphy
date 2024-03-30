'use client';
import * as actions from '@/actions';
import FormButton from '@/components/shared/form-button';
import { useSearchParams } from 'next/navigation';

type GroupUserSearchFormProps = {
  groupUuid: string;
};

const GroupUserSearchForm = ({ groupUuid }: GroupUserSearchFormProps) => {
  const searchParams = useSearchParams();
  const searchUserAction = actions.searchUsers.bind(null, groupUuid);

  return (
    <form action={searchUserAction}>
      <div>
        <input
          type="text"
          name="term"
          placeholder="Search for users"
          defaultValue={searchParams.get('term') ?? ''}
        />
      </div>
      <FormButton>Search</FormButton>
    </form>
  );
};

export default GroupUserSearchForm;
