import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { TerritoryForm } from "@/components/admin/TerritoryForm";
import { getRowByIdAdmin } from "@/lib/admin/queries";
import { createAuthClient } from "@/lib/supabase/server-auth";
import { updateRowWithChildren } from "@/lib/admin/actions";
import { formToValues, parseRepeatedRows } from "@/lib/admin/form-helpers";
import type { Neighborhood, Territory } from "@/types/database";

export default async function EditTerritoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const territory = await getRowByIdAdmin<Territory>("territories", id);
  if (!territory) notFound();

  const supabase = await createAuthClient();
  const { data: neighborhoods } = await supabase
    .from("neighborhoods")
    .select("*")
    .eq("territory_id", id)
    .order("name");

  async function action(formData: FormData) {
    "use server";
    const values = formToValues(formData);

    const neighborhoodRows = parseRepeatedRows(formData, "neighborhoods").map((r) => ({
      name: r.name,
      chairman: r.chairman,
      family_count: Number(r.family_count) || 0,
    }));

    await updateRowWithChildren(
      "territories",
      id,
      values,
      { table: "neighborhoods", parentColumn: "territory_id", rows: neighborhoodRows },
      "/admin/wilayah"
    );
  }

  return (
    <Container className="max-w-3xl px-6 py-10 lg:px-10">
      <h1 className="font-display text-2xl text-parish-900">Edit Wilayah</h1>
      <div className="mt-6">
        <TerritoryForm
          territory={territory}
          neighborhoods={(neighborhoods ?? []) as Neighborhood[]}
          action={action}
        />
      </div>
    </Container>
  );
}
