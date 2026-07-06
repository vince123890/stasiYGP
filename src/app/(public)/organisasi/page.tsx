import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { OrganizationTree } from "@/components/organization/OrganizationTree";
import { getOrganizationMembers } from "@/lib/queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Struktur Organisasi — Stasi Yohanes Gabriel Perboyre",
};

export const revalidate = 300;

export default async function OrganisasiPage() {
  const [bgks, dps] = await Promise.all([
    getOrganizationMembers("BGKS"),
    getOrganizationMembers("DPS"),
  ]);

  return (
    <Container className="py-16">
      <SectionHeading
        eyebrow="Kepengurusan"
        title="Struktur Organisasi"
        description="Badan Gereja Kalisari Stasi (BGKS) dan Dewan Pastoral Stasi (DPS) Yohanes Gabriel Perboyre."
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="font-display text-xl text-parish-900">BGKS</h2>
          <p className="mt-1 text-sm text-parish-700/70">Badan Gereja Kalisari Stasi</p>
          <div className="mt-5">
            <OrganizationTree members={bgks} />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-display text-xl text-parish-900">DPS</h2>
          <p className="mt-1 text-sm text-parish-700/70">Dewan Pastoral Stasi</p>
          <div className="mt-5">
            <OrganizationTree members={dps} />
          </div>
        </Card>
      </div>
    </Container>
  );
}
