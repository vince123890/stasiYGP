import { NextResponse } from "next/server";
import { getArticles } from "@/lib/queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categorySlug = searchParams.get("category") ?? undefined;
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "9");

  try {
    const { articles, total } = await getArticles({ categorySlug, page, pageSize });
    return NextResponse.json({ data: articles, total, page, pageSize });
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil artikel" },
      { status: 500 }
    );
  }
}
