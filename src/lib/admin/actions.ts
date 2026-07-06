"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createAuthClient } from "@/lib/supabase/server-auth";

export async function createRow(
  table: string,
  values: Record<string, unknown>,
  redirectPath: string
) {
  const supabase = await createAuthClient();
  const { error } = await supabase.from(table).insert(values);
  if (error) throw new Error(error.message);
  revalidatePath(redirectPath);
  revalidatePath("/", "layout");
  redirect(`${redirectPath}?success=1`);
}

export async function updateRow(
  table: string,
  id: string | number,
  values: Record<string, unknown>,
  redirectPath: string
) {
  const supabase = await createAuthClient();
  const { error } = await supabase.from(table).update(values).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(redirectPath);
  revalidatePath("/", "layout");
  redirect(`${redirectPath}?success=1`);
}

export async function reorderRows(
  table: string,
  orderedIds: string[],
  redirectPath: string
) {
  const supabase = await createAuthClient();
  await Promise.all(
    orderedIds.map((id, i) => supabase.from(table).update({ sort_order: i }).eq("id", id))
  );
  revalidatePath(redirectPath);
  revalidatePath("/", "layout");
}

export async function deleteRow(table: string, id: string | number, redirectPath: string) {
  const supabase = await createAuthClient();
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(redirectPath);
  revalidatePath("/", "layout");
}

/** Replaces all child rows (e.g. article_images) for a parent id: delete-all then bulk-insert. */
export async function replaceChildRows(
  table: string,
  parentColumn: string,
  parentId: string,
  rows: Record<string, unknown>[]
) {
  const supabase = await createAuthClient();
  await supabase.from(table).delete().eq(parentColumn, parentId);
  if (rows.length > 0) {
    const { error } = await supabase
      .from(table)
      .insert(rows.map((r) => ({ ...r, [parentColumn]: parentId })));
    if (error) throw new Error(error.message);
  }
}

/** Creates a parent row plus its child rows (e.g. article + article_images) in one call, then redirects. */
export async function createRowWithChildren(
  table: string,
  values: Record<string, unknown>,
  children: { table: string; parentColumn: string; rows: Record<string, unknown>[] } | null,
  redirectPath: string
) {
  const supabase = await createAuthClient();
  const { data: inserted, error } = await supabase
    .from(table)
    .insert(values)
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  if (children && children.rows.length > 0) {
    await replaceChildRows(children.table, children.parentColumn, inserted.id, children.rows);
  }

  revalidatePath(redirectPath);
  revalidatePath("/", "layout");
  redirect(`${redirectPath}?success=1`);
}

/** Updates a parent row plus replaces its child rows, then redirects. */
export async function updateRowWithChildren(
  table: string,
  id: string,
  values: Record<string, unknown>,
  children: { table: string; parentColumn: string; rows: Record<string, unknown>[] } | null,
  redirectPath: string
) {
  const supabase = await createAuthClient();
  const { error } = await supabase.from(table).update(values).eq("id", id);
  if (error) throw new Error(error.message);

  if (children) {
    await replaceChildRows(children.table, children.parentColumn, id, children.rows);
  }

  revalidatePath(redirectPath);
  revalidatePath("/", "layout");
  redirect(`${redirectPath}?success=1`);
}
