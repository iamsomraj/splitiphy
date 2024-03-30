'use client';

import { useFormStatus } from 'react-dom';

interface FormButtonProps {
  children: React.ReactNode;
}

export default function FormButton({ children }: FormButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Loading...' : children}
    </button>
  );
}
