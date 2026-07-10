import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { DEFAULT_MAP_EMBED_URL } from "@/components/ParishMap";
import { getParishProfile } from "@/lib/queries";

export async function Footer() {
  const profile = await getParishProfile();

  return (
    <footer className="mt-24 border-t border-parish-100 bg-parish-900 text-parish-50">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-display text-lg">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 p-1">
              <Image src="/logo.png" alt="" width={28} height={28} className="h-full w-full object-contain" />
            </span>
            Paroki YGP
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
                Artikel
              </Link>
            </li>
            <li>
              <Link href="/pengumuman" className="hover:text-white">
                Pengumuman
              </Link>
            </li>
            <li>
              <Link href="/profil" className="hover:text-white">
                Profil Paroki
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gold-400">
            Kontak
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-parish-100/80">
            {profile?.address && (
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0" />
                <div
                  className="prose prose-invert prose-sm max-w-none [&_p]:m-0"
                  dangerouslySetInnerHTML={{ __html: profile.address }}
                />
              </li>
            )}
            {profile?.phone1 && (
              <li className="flex items-center gap-2">
                <Phone size={16} className="shrink-0" />
                {profile.phone1}
              </li>
            )}
            {profile?.email && (
              <li className="flex items-center gap-2">
                <Mail size={16} className="shrink-0" />
                {profile.email}
              </li>
            )}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gold-400">
            Jam Sekretariat
          </h3>
          {profile?.office_hours && (
            <div className="mt-4 flex items-start gap-2 text-sm text-parish-100/80">
              <Clock size={16} className="mt-0.5 shrink-0" />
              <div
                className="prose prose-invert prose-sm max-w-none [&_p]:m-0"
                dangerouslySetInnerHTML={{ __html: profile.office_hours }}
              />
            </div>
          )}

          <div className="mt-5">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gold-400">
              Lokasi
            </h3>
            <div className="overflow-hidden rounded-xl border border-white/10">
              <iframe
                src={profile?.map_embed_url || DEFAULT_MAP_EMBED_URL}
                title="Peta Lokasi Paroki"
                className="h-40 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </Container>

      <div className="border-t border-white/10 py-6">
        <Container className="text-center text-xs text-parish-100/60">
          © {new Date().getFullYear()} Paroki Yohanes Gabriel Perboyre. Seluruh hak cipta dilindungi.
        </Container>
      </div>
    </footer>
  );
}
