import Link from 'next/link';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import { Blocks } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import paths from '@/lib/paths';

type Props = {
  children: React.ReactNode;
  link?: string;
};

export function Announcement({ children, link }: Props) {
  return (
    <Link
      href={link || paths.home()}
      className="inline-flex max-w-full items-center rounded-lg bg-muted px-3 py-1 text-left text-xs font-medium sm:text-sm"
    >
      <Blocks className="h-4 w-4 shrink-0" />{' '}
      <Separator className="mx-2 h-4" orientation="vertical" />{' '}
      <span>{children}</span>
      <ArrowRightIcon className="ml-1 h-4 w-4 shrink-0" />
    </Link>
  );
}
