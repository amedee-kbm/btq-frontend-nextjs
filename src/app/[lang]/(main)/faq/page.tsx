import type { Metadata } from "next";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import {
  getDictionary,
  type Locale,
  languageAlternates,
  toLocale,
} from "@/i18n";
import { Link } from "@/i18n/link";
import { getSiteSettingsOrFallback } from "@/lib/catalog/settings";
import { whatsAppChatUrl } from "@/lib/whatsapp";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const t = getDictionary(lang);
  return {
    title: t.faq.title,
    description: t.faq.description,
    alternates: languageAlternates(lang, "/faq"),
  };
}

type Faq = { q: string; a: React.ReactNode };
type Section = { id: string; title: string; items: Faq[] };

/** Section ids stay the same in every language: /terms links to #returns. */
function sections(
  lang: Locale,
  whatsapp: React.ReactNode,
  address: string,
): Section[] {
  if (lang === "rw") {
    return [
      {
        id: "ordering",
        title: "Gutumiza",
        items: [
          {
            q: "Ntumiza nte?",
            a: (
              <ol>
                <li>
                  Reba mu <Link href="/shop">iduka</Link>, ufungure igicuruzwa
                  ukunze.
                </li>
                <li>Hitamo ibara n'ingano.</li>
                <li>
                  Kanda <strong>Tumiza kuri WhatsApp</strong>. WhatsApp ifunguka
                  ifite ubutumwa buvuga igicuruzwa nyirizina, ingano n'ibara —
                  wohereze gusa.
                </li>
                <li>
                  Twemeza ko gihari, hanyuma muri icyo kiganiro tukumvikana nawe
                  uko wishyura n'uko kikugeraho cyangwa uko ugifata.
                </li>
              </ol>
            ),
          },
          {
            q: "Igicuruzwa cyangwa ingano byashize. Bizagaruka?",
            a: (
              <p>
                Rimwe na rimwe! Hitamo ingano n'ibara ushaka, ukande{" "}
                <strong>Baza niba bizagaruka</strong>. Bitwoherereza ubutumwa
                kuri WhatsApp, tukakumenyesha.
              </p>
            ),
          },
          {
            q: "Nabonye ikintu kuri TikTok. Nakibona nte?",
            a: (
              <p>
                Shakisha ukoresheje kode y'igicuruzwa (nka{" "}
                <strong>BQ-0142</strong>) cyangwa ijambo riri mu izina ryacyo
                (nka "satin") ahandikwa gushakisha hejuru.
              </p>
            ),
          },
          {
            q: "Nkeneye konti?",
            a: (
              <p>
                Oya. Konti uyikenera gusa kugira ngo ubike ibyo ukunda ku
                bikoresho byawe byose. Gutumiza bihora bikorerwa kuri WhatsApp.
              </p>
            ),
          },
        ],
      },
      {
        id: "payment",
        title: "Kwishyura",
        items: [
          {
            q: "Nishyura nte?",
            a: (
              <p>
                Na <strong>MoMo</strong> cyangwa <strong>mu ntoki</strong> —
                igihe ukibonye, cyangwa igihe uje kugifata. Nta kwishyura
                ukoresheje ikarita kuri uru rubuga.
              </p>
            ),
          },
        ],
      },
      {
        id: "delivery",
        title: "Kukugezaho no gufatira",
        items: [
          {
            q: "Mugeza ibicuruzwa ku bakiriya?",
            a: (
              <p>
                Yego, na motari i Kigali hose. Twumvikana nawe uko bikugeraho
                n'igiciro cyabyo kuri {whatsapp} igihe utumiza.
              </p>
            ),
          },
          {
            q: "Nshobora kwifatira ibyo natumije?",
            a: (
              <p>
                Yego, kuri <strong>{address}</strong>. Tubwire mu kiganiro igihe
                wifuza kuza.
              </p>
            ),
          },
        ],
      },
      {
        id: "returns",
        title: "Gusubiza no guhinduza",
        items: [
          {
            // Owner to supply the final returns/exchanges policy (PRD §3.7).
            q: "Nshobora gusubiza cyangwa guhinduza igicuruzwa?",
            a: (
              <p>
                Twandikire kuri {whatsapp} mbere yo kugura, umenye uburyo bwo
                guhinduza buhari kuri icyo gicuruzwa, kandi vuba bishoboka niba
                hari ikitagenze neza ku byo watumije.
              </p>
            ),
          },
        ],
      },
      {
        id: "sizing",
        title: "Ubufasha ku ngano",
        items: [
          {
            q: "Nahitamo nte ingano yanjye?",
            a: (
              <p>
                Buri gicuruzwa kigaragaza <strong>uko gikwira</strong> (urugero
                "Runs small", ni ukuvuga ko ari gito) n'igitambaro cyacyo.
                Ntubizi neza? Twoherereze ingano usanzwe wambara n'ibipimo byawe
                kuri {whatsapp}, tugufashe guhitamo.
              </p>
            ),
          },
        ],
      },
    ];
  }

  return [
    {
      id: "ordering",
      title: "Ordering",
      items: [
        {
          q: "How do I order?",
          a: (
            <ol>
              <li>
                Browse the <Link href="/shop">shop</Link> and open an item you
                like.
              </li>
              <li>Pick your colour and size.</li>
              <li>
                Tap <strong>Order on WhatsApp</strong>. WhatsApp opens with a
                message naming the exact item, size and colour — just send it.
              </li>
              <li>
                We confirm availability, then arrange payment and delivery or
                pickup with you in the chat.
              </li>
            </ol>
          ),
        },
        {
          q: "An item or size is sold out. Will it come back?",
          a: (
            <p>
              Sometimes! Select the size and colour you want and tap{" "}
              <strong>Ask if it's coming back</strong>. It sends us a message on
              WhatsApp and we'll let you know.
            </p>
          ),
        },
        {
          q: "I saw something on TikTok. How do I find it?",
          a: (
            <p>
              Search by the item code (like <strong>BQ-0142</strong>) or a word
              from its name (like "satin") using the search bar at the top.
            </p>
          ),
        },
        {
          q: "Do I need an account?",
          a: (
            <p>
              No. You only need an account to save favorites across your
              devices. Ordering always happens on WhatsApp.
            </p>
          ),
        },
      ],
    },
    {
      id: "payment",
      title: "Payment",
      items: [
        {
          q: "How can I pay?",
          a: (
            <p>
              With <strong>MoMo</strong> or <strong>cash</strong> — on delivery,
              or when you pick up your order. There are no online card payments
              on the website.
            </p>
          ),
        },
      ],
    },
    {
      id: "delivery",
      title: "Delivery & pickup",
      items: [
        {
          q: "Do you deliver?",
          a: (
            <p>
              Yes, by motard across Kigali. We arrange the delivery and its fee
              with you on {whatsapp} when you order.
            </p>
          ),
        },
        {
          q: "Can I pick up my order?",
          a: (
            <p>
              Yes, at <strong>{address}</strong>. Let us know in the chat when
              you'd like to come.
            </p>
          ),
        },
      ],
    },
    {
      id: "returns",
      title: "Returns & exchanges",
      items: [
        {
          // Owner to supply the final returns/exchanges policy (PRD §3.7).
          q: "Can I return or exchange an item?",
          a: (
            <p>
              Please message us on {whatsapp} before you buy to check the
              exchange options for your item, and as soon as possible if
              something isn't right with your order.
            </p>
          ),
        },
      ],
    },
    {
      id: "sizing",
      title: "Sizing help",
      items: [
        {
          q: "How do I choose my size?",
          a: (
            <p>
              Each item shows a <strong>fit note</strong> (for example "Runs
              small") and its material. Not sure? Send us your usual size and
              measurements on {whatsapp} and we'll help you choose.
            </p>
          ),
        },
      ],
    },
  ];
}

export default async function FaqPage({ params }: Props) {
  const lang = toLocale((await params).lang);
  const t = getDictionary(lang);
  const settings = await getSiteSettingsOrFallback();
  const whatsapp = (
    <a
      href={whatsAppChatUrl(settings.whatsapp_number)}
      target="_blank"
      rel="noopener noreferrer"
    >
      WhatsApp
    </a>
  );

  return (
    <PageContainer className="max-w-3xl">
      <PageHeader title={t.faq.title} breadcrumb={[{ label: t.faq.crumb }]} />
      <div className="flex flex-col gap-10">
        {sections(
          lang,
          whatsapp,
          settings.address || "CHIC Building B30A, Kigali",
        ).map((section) => (
          <section
            key={section.id}
            id={section.id}
            aria-labelledby={`${section.id}-h`}
          >
            <h2 id={`${section.id}-h`} className="pb-3 font-heading text-2xl">
              {section.title}
            </h2>
            <div className="border-t border-divider">
              {section.items.map((item) => (
                <details
                  key={item.q}
                  className="group border-b border-divider"
                  open={section.id === "ordering"}
                >
                  <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-3 font-bold [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <span
                      aria-hidden="true"
                      className="text-xl font-normal text-ink-muted transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <div className="prose prose-sm max-w-none pb-4 text-ink-soft prose-a:text-ink prose-strong:text-ink">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}
        <p className="text-sm text-ink-muted">
          {t.faq.stillQuestion}{" "}
          <Link
            href="/contact"
            className="font-bold text-ink underline underline-offset-4"
          >
            {t.faq.contactUs}
          </Link>
        </p>
      </div>
    </PageContainer>
  );
}
