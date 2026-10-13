import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { getSiteSettingsOrFallback } from "@/lib/catalog/settings";
import { whatsAppChatUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "How to order & FAQ",
  description:
    "How ordering on WhatsApp works at Btq.: payment with MoMo or cash, motard delivery or pickup at CHIC Building B30A, exchanges and sizing.",
};

type Faq = { q: string; a: React.ReactNode };

export default async function FaqPage() {
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

  const sections: { id: string; title: string; items: Faq[] }[] = [
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
              Yes, at{" "}
              <strong>
                {settings.address || "CHIC Building B30A, Kigali"}
              </strong>
              . Let us know in the chat when you'd like to come.
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

  return (
    <PageContainer className="max-w-3xl">
      <PageHeader title="How to order & FAQ" breadcrumb={[{ label: "FAQ" }]} />
      <div className="flex flex-col gap-10">
        {sections.map((section) => (
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
          Still have a question?{" "}
          <Link
            href="/contact"
            className="font-bold text-ink underline underline-offset-4"
          >
            Contact us
          </Link>
        </p>
      </div>
    </PageContainer>
  );
}
