'use client';

import * as actions from '@/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import paths from '@/lib/paths';
import { Copy, Link2, Link2Off } from 'lucide-react';
import { useSyncExternalStore, useTransition } from 'react';

type GroupInviteLinkProps = {
  groupUuid: string;
  inviteToken: string | null;
  isOwner: boolean;
};

const GroupInviteLink = ({
  groupUuid,
  inviteToken,
  isOwner,
}: GroupInviteLinkProps) => {
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();
  // window is unavailable during SSR, so the origin is read on the client only.
  const origin = useSyncExternalStore(
    () => () => {},
    () => window.location.origin,
    () => '',
  );

  const inviteUrl = inviteToken
    ? `${origin}${paths.groupInvite(inviteToken)}`
    : '';

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: 'Invite link copied!',
        description: 'Anyone with this link can join the group.',
      });
    } catch {
      toast({
        title: 'Could not copy the link',
        description: 'Please copy it manually.',
      });
    }
  };

  const onCreate = () =>
    startTransition(async () => {
      const response = await actions.createInviteLink(groupUuid);
      if (!response.state) {
        toast({ title: 'Uh oh!', description: response.message });
        return;
      }
      await copyToClipboard(
        `${window.location.origin}${paths.groupInvite(response.inviteToken)}`,
      );
    });

  const onRevoke = () =>
    startTransition(async () => {
      const response = await actions.revokeInviteLink(groupUuid);
      toast({
        title: response.state ? 'Invite link revoked' : 'Uh oh!',
        description: response.message,
      });
    });

  if (!inviteToken) {
    return (
      <Button
        type="button"
        variant="secondary"
        disabled={pending}
        onClick={onCreate}
      >
        <Link2 className="mr-2 h-3.5 w-3.5" />
        {pending ? 'Creating link...' : 'Create invite link'}
      </Button>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Input readOnly value={inviteUrl} aria-label="Group invite link" />
        <Button
          type="button"
          variant="secondary"
          size="icon"
          disabled={pending || !inviteUrl}
          onClick={() => copyToClipboard(inviteUrl)}
        >
          <Copy className="h-4 w-4" />
          <span className="sr-only">Copy invite link</span>
        </Button>
        {isOwner && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={pending}
            onClick={onRevoke}
          >
            <Link2Off className="h-4 w-4" />
            <span className="sr-only">Revoke invite link</span>
          </Button>
        )}
      </div>
      <p className="text-sm text-muted-foreground">
        Share this link with friends to let them join the group.
      </p>
    </div>
  );
};

export default GroupInviteLink;
