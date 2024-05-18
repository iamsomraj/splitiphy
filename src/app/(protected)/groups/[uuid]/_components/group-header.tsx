type GroupHeaderProps = {
  groupName: string;
  memberCount: number;
};

const GroupHeader = ({ groupName, memberCount }: GroupHeaderProps) => (
  <div className="flex flex-wrap items-end gap-2">
    <span className="text-4xl font-bold">{groupName}</span>
    <span className="font-medium text-accent-foreground/40">
      {memberCount} {memberCount > 1 ? 'members' : 'member'}
    </span>
  </div>
);

export default GroupHeader;
