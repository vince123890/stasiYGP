import { FileText, ExternalLink } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getSacramentForms } from "@/lib/queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Formulir — Paroki Yohanes Gabriel Perboyre",
};

export const revalidate = 300;

export default async function FormulirPage() {
  const forms = await getSacramentForms();

  return (
    <Container className="py-16">
      <SectionHeading
        eyebrow="Administrasi"
        title="Formulir"
        description="Unduh formulir untuk keperluan sakramen dan administrasi paroki."
      />

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {forms.map((f) => (
          <a
            key={f.id}
            href={f.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <Card className="flex items-start gap-4 p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-parish-50 text-parish-600">
                <FileText size={20} />
              </span>
              <div className="flex-1">
                <Badge>{f.category}</Badge>
                <h3 className="mt-2 font-display text-base text-parish-900 group-hover:text-parish-700">
                  {f.name}
                </h3>
                {f.description && (
                  <div
                    className="prose prose-parish prose-sm mt-1 max-w-none text-parish-700/75"
                    dangerouslySetInnerHTML={{ __html: f.description }}
                  />
                )}
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-parish-600">
                  Buka di Google Drive
                  <ExternalLink size={13} />
                </span>
              </div>
            </Card>
          </a>
        ))}
      </div>
    </Container>
  );
}
