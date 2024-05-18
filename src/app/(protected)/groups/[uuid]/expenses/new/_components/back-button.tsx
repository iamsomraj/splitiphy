import { Button } from '@/components/ui/button';
import paths from '@/lib/paths';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

const BackButton = ({ groupUuid }: { groupUuid: string }) => (
  <Link href={paths.groupShow(groupUuid)}>
    <Button variant="outline" size="icon" className="h-7 w-7">
      <ChevronLeft className="h-4 w-4" />
      <span className="sr-only">Back</span>
    </Button>
  </Link>
);

export default BackButton;
