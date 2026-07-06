import Link from "next/link";
import { Church, MapPin, Phone, Mail } from "lucide-react";
import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-parish-100 bg-parish-900 text-parish-50">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-display text-lg">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
              <Church size={18} />
            </span>
            Stasi Yohanes Gabriel Perboyre
          </div>
          <p className="mt-4 text-sm leading-relaxed text-parish-100/70">
            Bersatu dalam iman, tumbuh dalam kasih, dan berbagi sukacita Injil
            kepada sesama.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gold-400">
            Jelajahi
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-parish-100/80">
            <li>
              <Link href="/" className="hover:text-white">
                Beranda
              </Link>
            </li>
            <li>
              <Link href="/jadwal-misa" className="hover:text-white">
                Jadwal Misa
              </Link>
            </li>
            <li>
              <Link href="/artikel" className="hover:text-white">
                Artikel &amp; Pengumuman
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gold-400">
            Kontak
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-parish-100/80">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0" />
              Jl. Contoh Raya No. 10, Jakarta
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="shrink-0" />
              (021) 000-0000
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="shrink-0" />
              sekretariat@stasiygp.org
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gold-400">
            Jam Sekretariat
          </h3>
          <p className="mt-4 text-sm text-parish-100/80">
            Senin – Sabtu
            <br />
            08.00 – 16.00 WIB
          </p>
        </div>
      </Container>

      <div className="border-t border-white/10 py-6">
        <Container className="text-center text-xs text-parish-100/60">
          © {new Date().getFullYear()} Stasi Yohanes Gabriel Perboyre. Seluruh hak cipta dilindungi.
        </Container>
      </div>
    </footer>
  );
}
