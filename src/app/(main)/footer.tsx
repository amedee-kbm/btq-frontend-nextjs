import Link from "next/link";

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

type FooterColumn = {
  title: string;
  links: FooterLink[];
};

const CONTACT = {
  whatsapp: "+250781427209",
  whatsappHref: "https://wa.me/250781427209",
  phoneHref: "tel:+250781427209",
  emailHref: "",
  email: "",
};

const APP_STORE_URL = "";

const COLUMNS: FooterColumn[] = [
  {
    title: "Shop",
    links: [
      {
        label: "Categories",
        href: "/categories",
        external: true,
      },
      {
        label: "Offers",
        href: "/offers",
        external: true,
      },
      {
        label: "Trending",
        href: "/trending",
        external: true,
      },
      {
        label: "New arrivals",
        href: "/new",
        external: true,
      },
    ],
  },
  {
    title: "Your account",
    links: [
      {
        label: "My orders",
        href: "/orders",
        external: true,
      },
      {
        label: "Favorites",
        href: "/favorites",
        external: true,
      },
      {
        label: "Addresses",
        href: "/addresses",
        external: true,
      },
      {
        label: "Notifications",
        href: "",
        external: true,
      },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Blog", href: "", external: true },
      {
        label: "Help & support",
        href: "/support",
        external: true,
      },
      {
        label: "Contact us",
        href: "/contact",
        external: true,
      },
      { label: "FAQ", href: "faq", external: true },
      {
        label: "Return Policy",
        href: "/returns",
        external: true,
      },
      {
        label: "Terms of Use",
        href: "/terms",
        external: true,
      },
      {
        label: "Privacy Policy",
        href: "/privacy",
        external: true,
      },
    ],
  },
];

const SOCIALS = [
  {
    label: "Btq. on Instagram (@btq.)",
    href: "https://instagram.com/btq.",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    label: "Btq. on TikTok (@btq.)",
    href: "https://www.tiktok.com/@btq.",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.69a8.16 8.16 0 0 0 4.77 1.52V6.69h-1.84z" />
      </svg>
    ),
  },
  {
    label: "Btq. on X (@btq.)",
    href: "https://x.com/btq.",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M18.244 2H21.5l-7.46 8.52L23 22h-6.87l-4.79-6.27L5.7 22H2.44l7.97-9.11L1.5 2h6.99l4.34 5.75L18.244 2zm-2.4 18.06h1.92L7.27 3.84H5.21l10.63 16.22z" />
      </svg>
    ),
  },
];

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t border-divider bg-card pb-24 md:pb-0 px-4">
      <div className="mx-auto max-w-6xl py-10 md:py-14">
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-12">
          {/* Brand + contact */}
          <div className="col-span-2 lg:col-span-5">
            <Link href="/" className="inline-flex font-logo font-bold text-lg">
              {/* Using a plain img keeps this a server component with no width/height config.
                  Swap for next/image if you prefer optimization. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <em>Btq.</em>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">
              Rwanda's premier online clothing store. Shop styles for every
              occasion, delivered to your door the same day.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download Isokko on the App Store"
                className="transition-opacity hover:opacity-80"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/appstore-badge.svg"
                  alt="Download on the App Store"
                  className="h-10 w-auto"
                  loading="lazy"
                  decoding="async"
                />
              </a>
              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Get Isokko on Google Play"
                className="transition-opacity hover:opacity-80"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/googleplay-badge.svg"
                  alt="Get it on Google Play"
                  className="h-10 w-auto"
                  loading="lazy"
                  decoding="async"
                />
              </a>
            </div>

            <p className="mt-4 text-xs font-medium text-ink-muted">
              Kigali, Rwanda
            </p>

            <ul className="mt-5 space-y-1.5 text-sm">
              <li>
                <a
                  href={CONTACT.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink-soft hover:text-ink"
                >
                  <span className="font-bold text-ink-muted">WhatsApp:</span>{" "}
                  {CONTACT.whatsapp}
                </a>
              </li>
              <li>
                <a
                  href={CONTACT.phoneHref}
                  className="text-ink-soft hover:text-ink"
                >
                  <span className="font-bold text-ink-muted">Call:</span>{" "}
                  {CONTACT.whatsapp}
                </a>
              </li>
              <li>
                <a
                  href={CONTACT.emailHref}
                  className="text-ink-soft hover:text-ink"
                >
                  <span className="font-bold text-ink-muted">Email:</span>{" "}
                  {CONTACT.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Link columns */}
          {COLUMNS.map((column) => (
            <div key={column.title} className="lg:col-span-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wide text-ink-muted">
                {column.title}
              </h3>
              <ul className="mt-3 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-ink-soft transition-colors hover:text-ink"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm font-medium text-ink-soft transition-colors hover:text-ink"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-divider pt-6 sm:flex-row sm:items-center">
          <span className="text-xs text-ink-muted">
            © {year} Btq. · Kigali, Rwanda
          </span>

          <ul className="flex items-center gap-2">
            {SOCIALS.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="grid h-9 w-9 place-items-center rounded-full text-ink-muted transition-colors hover:bg-bone hover:text-ink"
                >
                  {social.icon}
                </a>
              </li>
            ))}
          </ul>

          <span className="text-xs font-medium text-ink-muted">
            Pay with MoMo · Cash
          </span>
        </div>
      </div>
    </footer>
  );
}
