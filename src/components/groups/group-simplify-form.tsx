'use client';

import * as actions from '@/actions';
import FormButton from '@/components/shared/form-button';
import { GroupWithData } from '@/db/queries';

type GroupMembersProps = {
  group: GroupWithData;
};

const GroupSimplifyForm = ({ group }: GroupMembersProps) => {
  return group && group.uuid ? (
    <div>
      <FormButton
        onClick={async () => actions.simplifyGroupExpenses(group?.uuid || '')}
      >
        Simplify Expenses
      </FormButton>
    </div>
  ) : null;
};

export default GroupSimplifyForm;
