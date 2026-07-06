import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/ui/ImageUpload";
import type { OrganizationMember } from "@/types/database";

function flattenWithDepth(
  members: OrganizationMember[],
  depth = 0
): { member: OrganizationMember; depth: number }[] {
  return members.flatMap((m) => [
    { member: m, depth },
    ...flattenWithDepth(m.children ?? [], depth + 1),
  ]);
}

export function OrganizationMemberForm({
  member,
  allBgks,
  allDps,
  action,
}: {
  member?: OrganizationMember;
  allBgks: OrganizationMember[];
  allDps: OrganizationMember[];
  action: (formData: FormData) => void;
}) {
  const bgksFlat = flattenWithDepth(allBgks).filter((x) => x.member.id !== member?.id);
  const dpsFlat = flattenWithDepth(allDps).filter((x) => x.member.id !== member?.id);

  return (
    <form action={action} className="space-y-6">
      <Card className="space-y-4 p-6">
        <Field label="Kelompok" htmlFor="group_name">
          <Select id="group_name" name="group_name" defaultValue={member?.group_name ?? "DPS"}>
            <option value="BGKS">BGKP</option>
            <option value="DPS">DPP</option>
          </Select>
        </Field>

        <Field label="Jabatan" htmlFor="position_title">
          <Input
            id="position_title"
            name="position_title"
            required
            placeholder="Kasie. Liturgi"
            defaultValue={member?.position_title}
          />
        </Field>

        <Field label="Nama" htmlFor="member_name">
          <Input id="member_name" name="member_name" required defaultValue={member?.member_name} />
        </Field>

        <Field label="Atasan (opsional)" htmlFor="parent_id" hint="Kosongkan jika ini posisi tingkat atas">
          <Select id="parent_id" name="parent_id" defaultValue={member?.parent_id ?? ""}>
            <option value="">— Tidak ada (tingkat atas) —</option>
            <optgroup label="BGKP">
              {bgksFlat.map(({ member: m, depth }) => (
                <option key={m.id} value={m.id}>
                  {"  ".repeat(depth)}
                  {m.position_title} — {m.member_name}
                </option>
              ))}
            </optgroup>
            <optgroup label="DPP">
              {dpsFlat.map(({ member: m, depth }) => (
                <option key={m.id} value={m.id}>
                  {"  ".repeat(depth)}
                  {m.position_title} — {m.member_name}
                </option>
              ))}
            </optgroup>
          </Select>
        </Field>

        <ImageUpload name="photo_url" label="Foto (opsional)" defaultValue={member?.photo_url} />

        <Field label="Urutan Tampil" htmlFor="sort_order">
          <Input id="sort_order" name="sort_order" type="number" defaultValue={member?.sort_order ?? 0} />
        </Field>
      </Card>

      <div className="flex justify-end gap-3">
        <Button href="/admin/organisasi" variant="outline">
          Batal
        </Button>
        <Button type="submit">Simpan</Button>
      </div>
    </form>
  );
}
