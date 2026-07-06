import type { OrganizationMember } from "@/types/database";

function TreeNode({ member, depth }: { member: OrganizationMember; depth: number }) {
  return (
    <li>
      <div
        className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 py-1.5"
        style={{ paddingLeft: `${depth * 1.25}rem` }}
      >
        <span className="text-sm font-semibold text-parish-800">{member.position_title}</span>
        <span className="text-sm text-parish-700/80">— {member.member_name}</span>
      </div>
      {member.children && member.children.length > 0 && (
        <ul className="border-l border-parish-100">
          {member.children.map((child) => (
            <TreeNode key={child.id} member={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function OrganizationTree({ members }: { members: OrganizationMember[] }) {
  return (
    <ul className="space-y-0.5">
      {members.map((m) => (
        <TreeNode key={m.id} member={m} depth={0} />
      ))}
    </ul>
  );
}
