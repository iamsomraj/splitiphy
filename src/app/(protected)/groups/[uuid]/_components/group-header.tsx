type GroupHeaderProps = {
  groupName: string;
  memberCount: number;
};

const GroupHeader = ({ groupName, memberCount }: GroupHeaderProps) => (
  <div className="flex flex-wrap items-end gap-2">
    <h1 className="text-3xl font-bold break-words sm:text-4xl">{groupName}</h1>
    <span className="font-medium text-accent-foreground/40">
      {memberCount} {memberCount > 1 ? 'members' : 'member'}
    </span>
  </div>
);

export default GroupHeader;
