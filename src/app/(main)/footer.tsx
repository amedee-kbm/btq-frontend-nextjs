import Link from "next/link";
import type { SiteSettings } from "@/lib/catalog/types";
import { whatsAppChatUrl } from "@/lib/whatsapp";

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

type FooterColumn = {
  title: string;
  links: { label: string; href: string }[];
};

const COLUMNS: FooterColumn[] = [
  {
    title: "Shop",
    links: [
      { label: "Shop all", href: "/shop" },
      { label: "New arrivals", href: "/collections/new-arrivals" },
      { label: "Promos", href: "/collections/promos" },
      { label: "Occasions", href: "/occasions" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "How to order / FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
];

const ICON_PROPS = { width: 18, height: 18, viewBox: "0 0 24 24" } as const;

const SOCIAL_ICONS: Record<keyof SiteSettings["socials"], React.ReactNode> = {
  instagram: (
    <svg
      aria-hidden="true"
      {...ICON_PROPS}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  tiktok: (
    <svg aria-hidden="true" {...ICON_PROPS} fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.69a8.16 8.16 0 0 0 4.77 1.52V6.69h-1.84z" />
    </svg>
  ),
  x: (
    <svg
      aria-hidden="true"
      {...ICON_PROPS}
      width={16}
      height={16}
      fill="currentColor"
    >
      <path d="M18.244 2H21.5l-7.46 8.52L23 22h-6.87l-4.79-6.27L5.7 22H2.44l7.97-9.11L1.5 2h6.99l4.34 5.75L18.244 2zm-2.4 18.06h1.92L7.27 3.84H5.21l10.63 16.22z" />
    </svg>
  ),
  facebook: (
    <svg aria-hidden="true" {...ICON_PROPS} fill="currentColor">
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" />
    </svg>
  ),
};

const SOCIAL_NAMES: Record<keyof SiteSettings["socials"], string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  x: "X",
  facebook: "Facebook",
};

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function Footer({ settings }: { settings: SiteSettings }) {
  const year = new Date().getFullYear();
  const socials = (
    Object.keys(SOCIAL_ICONS) as (keyof SiteSettings["socials"])[]
  ).filter((key) => settings.socials[key]);

  const contacts = [
    settings.whatsapp_number && {
      label: "WhatsApp",
      value: `+${settings.whatsapp_number.replace(/\D/g, "")}`,
      href: whatsAppChatUrl(settings.whatsapp_number),
      external: true,
    },
    settings.phone && {
      label: "Call",
      value: settings.phone,
      href: `tel:${settings.phone.replace(/\s/g, "")}`,
    },
    settings.email && {
      label: "Email",
      value: settings.email,
      href: `mailto:${settings.email}`,
    },
  ].filter(Boolean) as {
    label: string;
    value: string;
    href: string;
    external?: boolean;
  }[];

  return (
    <footer className="mt-16 w-full border-t border-divider bg-card px-4">
      <div className="mx-auto max-w-6xl py-10 md:py-14">
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-12">
          {/* Brand + contact */}
          <div className="col-span-2 lg:col-span-6">
            <Link href="/" className="inline-flex font-logo text-2xl font-bold">
              <em>Btq.</em>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">
              Women's fashion in Kigali: dresses, matching sets, jeans and
              boubous. Browse here, order on WhatsApp.
            </p>

            <ul className="mt-5 space-y-1.5 text-sm">
              {contacts.map((contact) => (
                <li key={contact.label}>
                  <a
                    href={contact.href}
                    {...(contact.external && {
                      target: "_blank",
                      rel: "noopener noreferrer",
                    })}
                    className="text-ink-soft hover:text-ink"
                  >
                    <span className="font-bold text-ink-muted">
                      {contact.label}:
                    </span>{" "}
                    {contact.value}
                  </a>
                </li>
              ))}
              {settings.address && (
                <li className="text-ink-soft">
                  <span className="font-bold text-ink-muted">Visit:</span>{" "}
                  {settings.address}
                </li>
              )}
            </ul>
          </div>

          {/* Link columns */}
          {COLUMNS.map((column) => (
            <div key={column.title} className="lg:col-span-2">
              <h3 className="text-xs font-extrabold tracking-wide text-ink-muted uppercase">
                {column.title}
              </h3>
              <ul className="mt-3 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm font-medium text-ink-soft transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-divider pt-6 sm:flex-row sm:items-center">
          <span className="text-xs text-ink-muted">
            © {year} Btq. · Kigali, Rwanda · Pay with MoMo · Cash
          </span>

          {socials.length > 0 && (
            <ul className="flex items-center gap-2">
              {socials.map((key) => (
                <li key={key}>
                  <a
                    href={settings.socials[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Btq. on ${SOCIAL_NAMES[key]}`}
                    className="grid h-9 w-9 place-items-center rounded-full text-ink-muted transition-colors hover:bg-bone hover:text-ink"
                  >
                    {SOCIAL_ICONS[key]}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
}
