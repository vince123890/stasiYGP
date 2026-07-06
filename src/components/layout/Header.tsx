"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

type NavItem = { href: string; label: string };
type NavEntry = NavItem | { label: string; items: NavItem[] };

const NAV: NavEntry[] = [
  { href: "/", label: "Beranda" },
  {
    label: "Profil",
    items: [
      { href: "/profil", label: "Profil Paroki" },
      { href: "/profil/sejarah", label: "Sejarah" },
      { href: "/profil/pastor", label: "Para Pastor" },
      { href: "/organisasi", label: "Struktur Organisasi" },
      { href: "/wilayah", label: "Wilayah & Lingkungan" },
    ],
  },
  { href: "/jadwal-misa", label: "Jadwal Misa" },
  {
    label: "Kegiatan",
    items: [
      { href: "/kategorial", label: "Kategorial" },
      { href: "/karya-sosial", label: "Karya Sosial" },
      { href: "/galeri", label: "Galeri" },
    ],
  },
  {
    label: "Info",
    items: [
      { href: "/artikel", label: "Artikel" },
      { href: "/pengumuman", label: "Pengumuman" },
      { href: "/kalender-liturgi", label: "Kalender Liturgi" },
      { href: "/formulir", label: "Formulir" },
      { href: "/intensi-misa", label: "Intensi Misa" },
    ],
  },
];

function DesktopDropdown({ label, items }: { label: string; items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="flex items-center gap-1 text-sm font-medium text-parish-800/80 transition-colors hover:text-parish-700">
        {label}
        <ChevronDown size={14} />
      </button>
      <div
        className={cn(
          "absolute left-1/2 top-full grid w-56 -translate-x-1/2 grid-cols-1 gap-0.5 rounded-xl border border-parish-100 bg-white p-2 shadow-lg transition-all",
          open ? "visible opacity-100" : "invisible opacity-0"
        )}
      >
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-lg px-3 py-2 text-sm text-parish-800 hover:bg-parish-50"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-parish-100/80 bg-cream-50/90 backdrop-blur">
      <Container className="flex h-20 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 font-display text-lg text-parish-900"
        >
          <Image
            src="/logo.png"
            alt="Logo Paroki Yohanes Gabriel Perboyre"
            width={56}
            height={56}
            className="h-14 w-14 object-contain"
          />
          <span className="whitespace-nowrap">Paroki YGP</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((entry) =>
            "items" in entry ? (
              <DesktopDropdown key={entry.label} label={entry.label} items={entry.items} />
            ) : (
              <Link
                key={entry.href}
                href={entry.href}
                className="text-sm font-medium text-parish-800/80 transition-colors hover:text-parish-700"
              >
                {entry.label}
              </Link>
            )
          )}
        </nav>

        <div className="hidden lg:block">
          <Button href="/jadwal-misa" size="sm">
            Lihat Jadwal Misa
          </Button>
        </div>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-full text-parish-800 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Buka menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </Container>

      <div
        className={cn(
          "overflow-y-auto overflow-x-hidden border-t border-parish-100 bg-cream-50 md:hidden transition-[max-height] duration-300",
          open ? "max-h-[80vh]" : "max-h-0 border-t-0"
        )}
      >
        <Container className="flex flex-col gap-1 py-3">
          {NAV.map((entry) =>
            "items" in entry ? (
              <div key={entry.label} className="py-1">
                <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-gold-600">
                  {entry.label}
                </p>
                {entry.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-parish-800 hover:bg-parish-50"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            ) : (
              <Link
                key={entry.href}
                href={entry.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-parish-800 hover:bg-parish-50"
              >
                {entry.label}
              </Link>
            )
          )}
        </Container>
      </div>
    </header>
  );
}
