import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="-mt-16 flex min-h-screen flex-1 items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-accent" />
    </div>
  );
}
