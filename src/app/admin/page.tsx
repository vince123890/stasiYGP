import Link from "next/link";
import {
  Newspaper,
  Megaphone,
  Users,
  Images,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import {
  getLatestArticles,
  getAnnouncements,
  getOrganizationMembers,
  getGalleries,
} from "@/lib/queries";

export default async function AdminDashboardPage() {
  const [articles, announcements, bgks, dps, galleries] = await Promise.all([
    getLatestArticles(100),
    getAnnouncements(),
    getOrganizationMembers("BGKS"),
    getOrganizationMembers("DPS"),
    getGalleries(),
  ]);

  const stats = [
    { label: "Artikel", value: articles.length, icon: Newspaper, href: "/admin/artikel" },
    { label: "Pengumuman", value: announcements.length, icon: Megaphone, href: "/admin/pengumuman" },
    { label: "Anggota Organisasi", value: bgks.length + dps.length, icon: Users, href: "/admin/organisasi" },
    { label: "Galeri", value: galleries.length, icon: Images, href: "/admin/galeri" },
  ];

  return (
    <Container className="max-w-none px-6 py-10 lg:px-10">
      <h1 className="font-display text-2xl text-parish-900">Dashboard</h1>
      <p className="mt-1 text-sm text-parish-700/70">
        Ringkasan konten Paroki Yohanes Gabriel Perboyre.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.label} href={s.href}>
              <Card className="p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-parish-50 text-parish-600">
                  <Icon size={18} />
                </span>
                <p className="mt-3 font-display text-2xl text-parish-900">{s.value}</p>
                <p className="text-sm text-parish-700/70">{s.label}</p>
              </Card>
            </Link>
          );
        })}
      </div>
    </Container>
  );
}
