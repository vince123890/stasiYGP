import Link from "next/link";
import { DeleteButton } from "@/components/ui/DeleteButton";
import type { OrganizationMember } from "@/types/database";

function TreeNode({
  member,
  depth,
  onDelete,
}: {
  member: OrganizationMember;
  depth: number;
  onDelete: (id: string) => Promise<void>;
}) {
  return (
    <li>
      <div
        className="flex flex-wrap items-center justify-between gap-2 border-b border-parish-50 py-2"
        style={{ paddingLeft: `${depth * 1.25}rem` }}
      >
        <div>
          <span className="text-sm font-semibold text-parish-800">{member.position_title}</span>
          <span className="text-sm text-parish-700/80"> — {member.member_name}</span>
        </div>
        <div className="flex items-center gap-1">
          <Link
            href={`/admin/organisasi/${member.id}/edit`}
            className="rounded-md px-2.5 py-1 text-xs font-medium text-parish-600 hover:bg-parish-50"
          >
            Edit
          </Link>
          <DeleteButton action={onDelete.bind(null, member.id)} />
        </div>
      </div>
      {member.children && member.children.length > 0 && (
        <ul className="border-l border-parish-100">
          {member.children.map((child) => (
            <TreeNode key={child.id} member={child} depth={depth + 1} onDelete={onDelete} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function OrganizationTreeAdmin({
  members,
  onDelete,
}: {
  members: OrganizationMember[];
  onDelete: (id: string) => Promise<void>;
}) {
  if (members.length === 0) {
    return <p className="p-6 text-center text-sm text-parish-700/70">Belum ada anggota.</p>;
  }

  return (
    <ul className="space-y-0.5">
      {members.map((m) => (
        <TreeNode key={m.id} member={m} depth={0} onDelete={onDelete} />
      ))}
    </ul>
  );
}
