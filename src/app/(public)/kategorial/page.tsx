import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getCategoricalGroups } from "@/lib/queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kategorial — Paroki Yohanes Gabriel Perboyre",
};

export const revalidate = 300;

export default async function KategorialPage() {
  const groups = await getCategoricalGroups();

  return (
    <Container className="py-16">
      <SectionHeading
        eyebrow="Kelompok Umat"
        title="Kategorial"
        description="Berbagai kelompok kategorial yang aktif melayani di Paroki Yohanes Gabriel Perboyre."
      />

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {groups.map((g) => (
          <Card key={g.id} className="p-6">
            <h3 className="font-display text-lg text-parish-900">{g.name}</h3>
            <div
              className="prose prose-parish mt-3 max-w-none text-sm leading-relaxed text-parish-800/90"
              dangerouslySetInnerHTML={{ __html: g.content }}
            />
            <div className="mt-4 space-y-1 border-t border-parish-100 pt-4 text-sm text-parish-700/80">
              {g.schedule && <p>Jadwal: {g.schedule}</p>}
              {g.contact && <p>Kontak: {g.contact}</p>}
            </div>
          </Card>
        ))}
      </div>
    </Container>
  );
}
