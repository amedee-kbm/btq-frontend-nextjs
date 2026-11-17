import type { Metadata } from "next";
import { ProsePage } from "@/components/layout/prose-page";
import { getDictionary, languageAlternates, toLocale } from "@/i18n";
import { Link } from "@/i18n/link";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: getDictionary(lang).legal.privacy,
    alternates: languageAlternates(lang, "/privacy"),
  };
}

// Placeholder plain-language policy; the owner supplies the final text (PRD §3.7).
const CONTENT = {
  en: (
    <>
      <p>We keep this simple and collect as little as possible.</p>
      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>If you create an account:</strong> your email, an optional
          preferred name, your password (stored encrypted) and the items you
          save as favorites.
        </li>
        <li>
          <strong>When you order:</strong> the conversation happens on WhatsApp,
          under WhatsApp's own privacy terms.
        </li>
      </ul>
      <p>
        We don't run ads or analytics trackers, and we don't sell your data.
      </p>
      <h2>Cookies</h2>
      <p>
        We only use cookies to keep you signed in (for up to 30 days of
        inactivity) and to remember your language.
      </p>
      <h2>Your choices</h2>
      <p>
        To delete your account and favorites,{" "}
        <Link href="/contact">contact us</Link>.
      </p>
    </>
  ),
  rw: (
    <>
      <p>Tubikora mu buryo bworoshye, kandi dukusanya amakuru make ashoboka.</p>
      <h2>Ibyo dukusanya</h2>
      <ul>
        <li>
          <strong>Iyo ufunguye konti:</strong> imeri yawe, izina ukunda kwitwa
          (si ngombwa), ijambo ry'ibanga ryawe (ribikwa mu ibanga) n'ibicuruzwa
          ubika mu byo ukunda.
        </li>
        <li>
          <strong>Iyo utumije:</strong> ikiganiro kibera kuri WhatsApp,
          hakurikijwe amabwiriza y'ibanga ya WhatsApp ubwayo.
        </li>
      </ul>
      <p>
        Ntidukoresha amatangazo cyangwa porogaramu zikurikirana abasura urubuga,
        kandi ntitugurisha amakuru yawe.
      </p>
      <h2>Cookies</h2>
      <p>
        Dukoresha cookies gusa kugira ngo ugume winjiye (kugeza ku minsi 30
        udakoresheje urubuga) no kwibuka ururimi wahisemo.
      </p>
      <h2>Uburenganzira bwawe</h2>
      <p>
        Kugira ngo usibe konti yawe n'ibyo wabitse,{" "}
        <Link href="/contact">twandikire</Link>.
      </p>
    </>
  ),
};

export default async function PrivacyPage({ params }: Props) {
  const lang = toLocale((await params).lang);
  return (
    <ProsePage title={getDictionary(lang).legal.privacy}>
      {CONTENT[lang]}
    </ProsePage>
  );
}
