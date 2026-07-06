import { Heart, Gift, Calendar, BookOpen } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getSocialMinistries } from "@/lib/queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Karya Sosial — Stasi Yohanes Gabriel Perboyre",
};

export const revalidate = 300;

const ICONS: Record<string, typeof Heart> = { Heart, Gift, Calendar, BookOpen };

export default async function KaryaSosialPage() {
  const ministries = await getSocialMinistries();

  return (
    <Container className="py-16">
      <SectionHeading
        eyebrow="Pelayanan Kasih"
        title="Karya Sosial"
        description="Wujud kepedulian dan pelayanan kasih Stasi Yohanes Gabriel Perboyre kepada sesama."
      />

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {ministries.map((m) => {
          const Icon = ICONS[m.icon ?? "Heart"] ?? Heart;
          return (
            <Card key={m.id} className="p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-parish-50 text-parish-600">
                <Icon size={20} />
              </span>
              <h3 className="mt-4 font-display text-lg text-parish-900">{m.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-parish-800/90">{m.description}</p>
              {m.activities && (
                <div
                  className="prose prose-parish mt-4 max-w-none border-t border-parish-100 pt-4 text-sm text-parish-700/80"
                  dangerouslySetInnerHTML={{ __html: m.activities }}
                />
              )}
            </Card>
          );
        })}
      </div>
    </Container>
  );
}
