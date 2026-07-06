import { redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { createAuthClient } from "@/lib/supabase/server-auth";
import { LogoutButton } from "./LogoutButton";

export default async function AdminPage() {
  const supabase = await createAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <Container className="py-16">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-parish-900">Admin</h1>
        <LogoutButton />
      </div>

      <Card className="mt-8 p-6">
        <p className="text-sm text-parish-800">Masuk sebagai {user.email}.</p>
        <p className="mt-2 text-sm text-parish-700/70">
          Halaman pengelolaan konten (artikel, pengumuman, jadwal, dll) akan ditambahkan di
          tahap berikutnya. Saat ini konten dikelola langsung lewat Supabase Studio.
        </p>
        <Button href="/" variant="outline" size="sm" className="mt-4">
          Kembali ke Beranda
        </Button>
      </Card>
    </Container>
  );
}
