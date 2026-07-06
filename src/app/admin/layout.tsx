import { redirect } from "next/navigation";
import { createAuthClient } from "@/lib/supabase/server-auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="flex min-h-screen bg-cream-100">
      <AdminSidebar email={user.email ?? ""} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
