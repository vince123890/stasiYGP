import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { getParishProfile } from "@/lib/queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil Paroki — Stasi Yohanes Gabriel Perboyre",
};

export const revalidate = 300;

export default async function ProfilPage() {
  const profile = await getParishProfile();

  if (!profile) return null;

  return (
    <Container className="py-16">
      <SectionHeading
        eyebrow="Tentang Kami"
        title={profile.stasi_name}
        description={profile.paroki_name ?? undefined}
      />

      <div className="mt-10 grid gap-10 lg:grid-cols-3">
        <div className="space-y-10 lg:col-span-2">
          {profile.about_saint && (
            <div>
              <h2 className="font-display text-xl text-parish-900">Tentang Santo Pelindung</h2>
              <div
                className="prose prose-parish mt-4 max-w-none text-base leading-relaxed text-parish-800/90"
                dangerouslySetInnerHTML={{ __html: profile.about_saint }}
              />
            </div>
          )}

          {profile.vision && (
            <div>
              <h2 className="font-display text-xl text-parish-900">Visi</h2>
              <div
                className="prose prose-parish mt-4 max-w-none text-base leading-relaxed text-parish-800/90"
                dangerouslySetInnerHTML={{ __html: profile.vision }}
              />
            </div>
          )}

          {profile.mission && (
            <div>
              <h2 className="font-display text-xl text-parish-900">Misi</h2>
              <div
                className="prose prose-parish mt-4 max-w-none text-base leading-relaxed text-parish-800/90"
                dangerouslySetInnerHTML={{ __html: profile.mission }}
              />
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <Button href="/profil/sejarah" variant="outline" size="sm">
              Sejarah Paroki
            </Button>
            <Button href="/profil/pastor" variant="outline" size="sm">
              Para Pastor
            </Button>
            <Button href="/organisasi" variant="outline" size="sm">
              Struktur Organisasi
            </Button>
          </div>
        </div>

        <Card className="h-fit space-y-4 p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gold-600">
            Kontak & Alamat
          </h3>
          <p className="flex items-start gap-2 text-sm text-parish-800">
            <MapPin size={16} className="mt-0.5 shrink-0 text-parish-500" />
            {profile.address}
          </p>
          {profile.phone1 && (
            <p className="flex items-center gap-2 text-sm text-parish-800">
              <Phone size={16} className="shrink-0 text-parish-500" />
              {profile.phone1}
            </p>
          )}
          {profile.email && (
            <p className="flex items-center gap-2 text-sm text-parish-800">
              <Mail size={16} className="shrink-0 text-parish-500" />
              {profile.email}
            </p>
          )}
          {profile.office_hours && (
            <p className="flex items-start gap-2 text-sm text-parish-800">
              <Clock size={16} className="mt-0.5 shrink-0 text-parish-500" />
              {profile.office_hours}
            </p>
          )}
        </Card>
      </div>
    </Container>
  );
}
