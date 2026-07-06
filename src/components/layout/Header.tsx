"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Church, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

const NAV_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/jadwal-misa", label: "Jadwal Misa" },
  { href: "/artikel", label: "Artikel" },
  { href: "/pengumuman", label: "Pengumuman" },
];

const MORE_LINKS = [
  { href: "/profil", label: "Profil Paroki" },
  { href: "/profil/sejarah", label: "Sejarah" },
  { href: "/profil/pastor", label: "Para Pastor" },
  { href: "/organisasi", label: "Struktur Organisasi" },
  { href: "/wilayah", label: "Wilayah & Lingkungan" },
  { href: "/kategorial", label: "Kategorial" },
  { href: "/karya-sosial", label: "Karya Sosial" },
  { href: "/galeri", label: "Galeri" },
  { href: "/formulir", label: "Formulir" },
  { href: "/intensi-misa", label: "Intensi Misa" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-parish-100/80 bg-cream-50/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-lg text-parish-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-parish-600 text-white">
            <Church size={18} />
          </span>
          <span className="hidden sm:inline">Stasi Yohanes Gabriel Perboyre</span>
          <span className="sm:hidden">StasiYGP</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-parish-800/80 transition-colors hover:text-parish-700"
            >
              {link.label}
            </Link>
          ))}

          <div
            className="relative"
            onMouseEnter={() => setMoreOpen(true)}
            onMouseLeave={() => setMoreOpen(false)}
          >
            <button className="flex items-center gap-1 text-sm font-medium text-parish-800/80 transition-colors hover:text-parish-700">
              Selengkapnya
              <ChevronDown size={14} />
            </button>
            <div
              className={cn(
                "absolute right-0 top-full grid w-64 grid-cols-1 gap-0.5 rounded-xl border border-parish-100 bg-white p-2 shadow-lg transition-all",
                moreOpen ? "visible opacity-100" : "invisible opacity-0"
              )}
            >
              {MORE_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-2 text-sm text-parish-800 hover:bg-parish-50"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <div className="hidden md:block">
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
          open ? "max-h-[70vh]" : "max-h-0 border-t-0"
        )}
      >
        <Container className="flex flex-col gap-1 py-3">
          {[...NAV_LINKS, ...MORE_LINKS].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-parish-800 hover:bg-parish-50"
            >
              {link.label}
            </Link>
          ))}
        </Container>
      </div>
    </header>
  );
}
