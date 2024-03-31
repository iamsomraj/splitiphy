import * as actions from '@/actions';
import FormButton from '@/components/shared/form-button';
import { GroupWithData } from '@/db/queries';
import { useFormState } from 'react-dom';

type GroupMembersProps = {
  group: GroupWithData;
};

const GroupSimplifyForm = ({ group }: GroupMembersProps) => {
  const [formState, action] = useFormState(
    actions.simplifyGroupExpenses.bind(null, group?.uuid || ''),
    {
      errors: {},
    },
  );
  return group ? (
    <form>
      <FormButton>Settle Up</FormButton>
    </form>
  ) : null;
};

export default GroupSimplifyForm;
