'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
type HTMLButtonAttributes = React.ButtonHTMLAttributes<HTMLButtonElement>;
type FormButtonProps = {
  children: React.ReactNode;
} & HTMLButtonAttributes;

const FormButton = ({ children, ...props }: FormButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} {...props}>
      {pending ? 'Loading...' : children}
    </Button>
  );
};

export default FormButton;
