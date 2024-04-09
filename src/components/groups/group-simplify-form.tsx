'use client';

import * as actions from '@/actions';
import FormButton from '@/components/shared/form-button';
import { GroupWithData } from '@/db/queries';
import { cn } from '@/lib/utils';

type GroupMembersProps = {
  group: GroupWithData;
} & React.HTMLAttributes<HTMLDivElement>;

const GroupSimplifyForm = ({
  group,
  className,
  ...rest
}: GroupMembersProps) => {
  return group && group.uuid ? (
    <div className={cn(className)} {...rest}>
      <FormButton
        disabled={group.groupExpenses.length === 0}
        className="w-full"
        size="lg"
        onClick={async () => actions.simplifyGroupExpenses(group?.uuid || '')}
      >
        Simplify Expenses
      </FormButton>
    </div>
  ) : null;
};

export default GroupSimplifyForm;
