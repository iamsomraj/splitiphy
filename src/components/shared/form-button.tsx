'use client';

import { useFormStatus } from 'react-dom';
type HTMLButtonAttributes = React.ButtonHTMLAttributes<HTMLButtonElement>;
type FormButtonProps = {
  children: React.ReactNode;
} & HTMLButtonAttributes;

const FormButton = ({ children, ...props }: FormButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} {...props}>
      {pending ? 'Loading...' : children}
    </button>
  );
};

export default FormButton;
