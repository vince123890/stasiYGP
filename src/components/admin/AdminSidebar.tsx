"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Newspaper,
  Megaphone,
  Clock,
  CalendarHeart,
  GalleryHorizontalEnd,
  Users,
  BookOpen,
  Heart,
  HeartHandshake,
  Map,
  Images,
  FileText,
  Building2,
  HandCoins,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoutButton } from "@/app/admin/LogoutButton";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/artikel", label: "Artikel", icon: Newspaper },
  { href: "/admin/pengumuman", label: "Pengumuman", icon: Megaphone },
  { href: "/admin/jadwal-misa", label: "Jadwal Misa", icon: Clock },
  { href: "/admin/kalender-liturgi", label: "Kalender Liturgi", icon: CalendarHeart },
  { href: "/admin/hero-slides", label: "Hero Slides", icon: GalleryHorizontalEnd },
  { href: "/admin/organisasi", label: "Organisasi (BGKP/DPP)", icon: Users },
  { href: "/admin/pastor", label: "Pastor", icon: BookOpen },
  { href: "/admin/sejarah", label: "Sejarah", icon: BookOpen },
  { href: "/admin/kategorial", label: "Kategorial", icon: Heart },
  { href: "/admin/karya-sosial", label: "Karya Sosial", icon: HeartHandshake },
  { href: "/admin/wilayah", label: "Wilayah & Lingkungan", icon: Map },
  { href: "/admin/galeri", label: "Galeri", icon: Images },
  { href: "/admin/formulir", label: "Formulir", icon: FileText },
  { href: "/admin/profil", label: "Profil Paroki", icon: Building2 },
  { href: "/admin/intensi-misa", label: "Intensi Misa", icon: HandCoins },
];

export function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-parish-100 bg-white">
      <div className="flex items-center gap-2 border-b border-parish-100 px-5 py-4">
        <Image src="/logo.png" alt="" width={32} height={32} className="h-8 w-8 object-contain" />
        <div>
          <p className="font-display text-sm leading-tight text-parish-900">Admin Paroki YGP</p>
          <p className="truncate text-xs text-parish-700/60">{email}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {NAV.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-parish-600 text-white"
                  : "text-parish-700 hover:bg-parish-50"
              )}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-parish-100 p-3">
        <LogoutButton />
      </div>
    </aside>
  );
}
