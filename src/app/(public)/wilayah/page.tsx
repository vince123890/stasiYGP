import { Users } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getTerritories } from "@/lib/queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wilayah & Lingkungan — Paroki Yohanes Gabriel Perboyre",
};

export const revalidate = 300;

export default async function WilayahPage() {
  const territories = await getTerritories();

  return (
    <Container className="py-16">
      <SectionHeading
        eyebrow="Struktur Teritorial"
        title="Wilayah & Lingkungan"
        description="Pembagian wilayah dan lingkungan umat Paroki Yohanes Gabriel Perboyre."
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {territories.map((t) => (
          <Card key={t.id} className="p-6">
            <h3 className="font-display text-lg text-parish-900">{t.name}</h3>
            <p className="text-sm text-parish-700/70">Ketua Wilayah: {t.chairman}</p>
            <div className="mt-4 divide-y divide-parish-100 border-t border-parish-100">
              {t.neighborhoods.map((n) => (
                <div key={n.id} className="flex items-center justify-between gap-2 py-2.5">
                  <div>
                    <p className="text-sm font-medium text-parish-800">{n.name}</p>
                    <p className="text-xs text-parish-700/70">Ketua: {n.chairman}</p>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-parish-500">
                    <Users size={12} />
                    {n.family_count} KK
                  </span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </Container>
  );
}
