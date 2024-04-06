import Link from 'next/link';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import { Blocks } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import paths from '@/lib/paths';
import { link } from 'fs';

type Props = {
  children: React.ReactNode;
  link?: string;
};

export function Announcement({ children, link }: Props) {
  return (
    <Link
      href={link || paths.home()}
      className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-center text-sm font-medium"
    >
      <Blocks className="h-4 w-4" />{' '}
      <Separator className="mx-2 h-4" orientation="vertical" />{' '}
      <span>{children}</span>
      <ArrowRightIcon className="ml-1 h-4 w-4" />
    </Link>
  );
}
