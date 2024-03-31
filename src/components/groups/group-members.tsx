import { GroupWithData } from '@/db/queries';

type GroupMembersProps = {
  group: GroupWithData;
};

const GroupMembers = ({ group }: GroupMembersProps) => {
  return group ? (
    <div>
      <h2>Members</h2>
      <ul className="flex flex-col gap-y-4">
        {group.groupMemberships.map((member) => (
          <li key={member.uuid}>
            <div>@{member.user.username}</div>
            <div>{member.user.firstName + ' ' + member.user.lastName}</div>
            <div>{member.user.email}</div>
          </li>
        ))}
      </ul>
    </div>
  ) : null;
};

export default GroupMembers;
