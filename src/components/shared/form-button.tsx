'use client';

import { useFormStatus } from 'react-dom';
import { Button, ButtonProps } from '@/components/ui/button';

const FormButton = ({ children, disabled, ...props }: ButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending || disabled} {...props}>
      {pending ? 'Loading...' : children}
    </Button>
  );
};

export default FormButton;
