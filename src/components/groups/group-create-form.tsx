'use client';
import * as actions from '@/actions';
import { useFormState } from 'react-dom';

const GroupCreateForm = () => {
  const [formState, action] = useFormState(actions.createGroup, {
    errors: {},
  });

  return (
    <form action={action}>
      <div>
        <label>Group Name:</label>
        <input
          type='text'
          name='name'
          placeholder='Enter group name'
        />
        {formState.errors.name ? <span>{formState.errors.name?.join(', ')}</span> : null}
      </div>
      {formState.errors._form ? <div>{formState.errors._form?.join(', ')}</div> : null}
      <button type='submit'>Create</button>
    </form>
  );
};

export default GroupCreateForm;
