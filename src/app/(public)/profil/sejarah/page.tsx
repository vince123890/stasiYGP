import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getParishHistory } from "@/lib/queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sejarah Paroki — Paroki Yohanes Gabriel Perboyre",
};

export const revalidate = 300;

export default async function SejarahPage() {
  const history = await getParishHistory();

  return (
    <Container className="py-16">
      <SectionHeading
        eyebrow="Perjalanan Kami"
        title="Sejarah Paroki"
        description="Perjalanan Paroki Yohanes Gabriel Perboyre dari masa ke masa."
      />

      <div className="mt-10 max-w-3xl space-y-8 border-l-2 border-parish-100 pl-8">
        {history.map((h) => (
          <div key={h.id} className="relative">
            <span className="absolute -left-[2.35rem] top-1.5 h-3 w-3 rounded-full bg-parish-600" />
            <p className="font-display text-2xl text-parish-900">{h.year}</p>
            <p className="mt-0.5 text-sm font-semibold uppercase tracking-wide text-gold-600">
              {h.category}
            </p>
            <div
              className="prose prose-parish mt-3 max-w-none text-sm leading-relaxed text-parish-800/90"
              dangerouslySetInnerHTML={{ __html: h.content }}
            />
          </div>
        ))}
      </div>
    </Container>
  );
}
