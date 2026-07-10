import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getPastors } from "@/lib/queries";
import type { Metadata } from "next";
import type { Pastor } from "@/types/database";

export const metadata: Metadata = {
  title: "Para Pastor — Paroki Yohanes Gabriel Perboyre",
};

export const revalidate = 300;

function PastorCard({ pastor }: { pastor: Pastor }) {
  return (
    <Card className="p-5">
      <h3 className="font-display text-lg text-parish-900">{pastor.name}</h3>
      <p className="text-sm text-parish-700/70">
        {pastor.priest_type}
        {pastor.serve_from &&
          ` · ${pastor.serve_from}${pastor.serve_to ? `–${pastor.serve_to}` : '–sekarang'}`}
      </p>
      {pastor.biography && (
        <div
          className="prose prose-parish prose-sm mt-3 max-w-none text-parish-800/90"
          dangerouslySetInnerHTML={{ __html: pastor.biography }}
        />
      )}
    </Card>
  );
}

export default async function PastorPage() {
  const pastors = await getPastors();
  const active = pastors.filter((p) => p.pastor_type === "Gembala Kami");
  const past = pastors.filter((p) => p.pastor_type === "Pernah Berkarya");

  return (
    <Container className="py-16">
      <SectionHeading
        eyebrow="Gembala Umat"
        title="Para Pastor"
        description="Para romo yang melayani dan pernah berkarya di Paroki Yohanes Gabriel Perboyre."
      />

      <div className="mt-10 space-y-12">
        <div>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gold-600">
            Gembala Kami Saat Ini
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {active.map((p) => (
              <PastorCard key={p.id} pastor={p} />
            ))}
          </div>
        </div>

        {past.length > 0 && (
          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gold-600">
              Pernah Berkarya
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {past.map((p) => (
                <PastorCard key={p.id} pastor={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}
