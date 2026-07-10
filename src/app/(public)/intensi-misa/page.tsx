import { Phone, Landmark } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RichTextContent } from "@/components/ui/RichTextContent";
import { getMassIntentionsInfo } from "@/lib/queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Intensi Misa — Paroki Yohanes Gabriel Perboyre",
};

export const revalidate = 300;

export default async function IntensiMisaPage() {
  const info = await getMassIntentionsInfo();

  if (!info) return null;

  return (
    <Container className="max-w-3xl py-16">
      <SectionHeading
        eyebrow="Liturgi"
        title="Intensi Misa"
        description="Informasi cara mengajukan intensi misa (syukur, arwah, atau niat khusus)."
      />

      <div className="mt-10 space-y-6">
        {info.contact_wa && (
          <Card className="flex items-center gap-3 p-5">
            <Phone size={18} className="text-parish-500" />
            <span className="text-sm text-parish-800">
              Hubungi <strong>{info.contact_wa}</strong> untuk menyampaikan intensi misa.
            </span>
          </Card>
        )}

        {info.format_info && (
          <div>
            <h2 className="font-display text-lg text-parish-900">Format Intensi</h2>
            <RichTextContent
              html={info.format_info}
              className="mt-3 text-sm text-parish-800/90"
            />
          </div>
        )}

        {info.deadline_info && (
          <div>
            <h2 className="font-display text-lg text-parish-900">Batas Penyampaian</h2>
            <RichTextContent
              html={info.deadline_info}
              className="mt-3 text-sm text-parish-800/90"
            />
          </div>
        )}

        {info.offering_info && (
          <div>
            <h2 className="font-display text-lg text-parish-900">Persembahan</h2>
            <RichTextContent
              html={info.offering_info}
              className="mt-3 text-sm text-parish-800/90"
            />
          </div>
        )}

        <Card className="p-5">
          <h2 className="flex items-center gap-2 font-display text-lg text-parish-900">
            <Landmark size={18} className="text-parish-500" />
            Rekening Persembahan
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {info.church_account_number && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">
                  Persembahan Gereja
                </p>
                <p className="mt-1 text-sm text-parish-800">
                  {info.church_bank_name} — {info.church_account_number}
                </p>
                <p className="text-sm text-parish-700/70">a.n. {info.church_account_name}</p>
              </div>
            )}
            {info.social_account_number && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">
                  Karya Sosial
                </p>
                <p className="mt-1 text-sm text-parish-800">
                  {info.social_bank_name} — {info.social_account_number}
                </p>
                <p className="text-sm text-parish-700/70">a.n. {info.social_account_name}</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </Container>
  );
}
