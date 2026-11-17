import type { Metadata } from "next";
import { ProsePage } from "@/components/layout/prose-page";
import { getDictionary, languageAlternates, toLocale } from "@/i18n";
import { Link } from "@/i18n/link";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: getDictionary(lang).legal.terms,
    alternates: languageAlternates(lang, "/terms"),
  };
}

// Placeholder plain-language terms; the owner supplies the final text (PRD §3.7).
const CONTENT = {
  en: (
    <>
      <p>
        Bukiaa is a boutique in Kigali, Rwanda. This website is a catalog: it
        shows our items, prices and what's available, so you can choose before
        you contact us.
      </p>
      <h2>Orders</h2>
      <p>
        Orders are made on WhatsApp, not on this website. An order is confirmed
        only when we confirm it with you in the chat. Availability shown on the
        site is updated by hand and can occasionally be out of date.
      </p>
      <h2>Prices and payment</h2>
      <p>
        Prices are in Rwandan francs (RWF). Payment is by MoMo or cash, on
        delivery or at pickup. Delivery fees are agreed on WhatsApp.
      </p>
      <h2>Returns and exchanges</h2>
      <p>
        See <Link href="/faq#returns">Returns &amp; exchanges</Link> in our FAQ.
      </p>
      <h2>Accounts</h2>
      <p>
        An account is only used to save your favorites. Please keep your
        password private.
      </p>
      <h2>Questions</h2>
      <p>
        <Link href="/contact">Contact us</Link> any time.
      </p>
    </>
  ),
  rw: (
    <>
      <p>
        Bukiaa ni iduka ry'imyenda i Kigali, mu Rwanda. Uru rubuga ni kataloge:
        rwerekana ibicuruzwa byacu, ibiciro n'ibihari, kugira ngo uhitemo mbere
        yo kutwandikira.
      </p>
      <h2>Gutumiza</h2>
      <p>
        Gutumiza bikorerwa kuri WhatsApp, si kuri uru rubuga. Ibyo watumije
        byemezwa gusa iyo tubikwemereye mu kiganiro. Ibihari bigaragara ku
        rubuga bivugururwa n'intoki, rimwe na rimwe bishobora kuba bitajyanye
        n'igihe.
      </p>
      <h2>Ibiciro no kwishyura</h2>
      <p>
        Ibiciro biri mu mafaranga y'u Rwanda (RWF). Wishyura na MoMo cyangwa mu
        ntoki, igihe ukibonye cyangwa igihe uje kugifata. Igiciro cyo
        kukikugezaho cyumvikanwaho kuri WhatsApp.
      </p>
      <h2>Gusubiza no guhinduza</h2>
      <p>
        Reba <Link href="/faq#returns">Gusubiza no guhinduza</Link> mu bibazo
        bikunze kubazwa.
      </p>
      <h2>Konti</h2>
      <p>
        Konti ikoreshwa gusa kubika ibyo ukunda. Ntukamenyeshe abandi ijambo
        ry'ibanga ryawe.
      </p>
      <h2>Ibibazo</h2>
      <p>
        <Link href="/contact">Twandikire</Link> igihe cyose.
      </p>
    </>
  ),
};

export default async function TermsPage({ params }: Props) {
  const lang = toLocale((await params).lang);
  return (
    <ProsePage title={getDictionary(lang).legal.terms}>
      {CONTENT[lang]}
    </ProsePage>
  );
}
