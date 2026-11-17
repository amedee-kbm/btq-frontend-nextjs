import {
  EnvelopeSimpleIcon,
  MapPinIcon,
  PhoneIcon,
  WhatsappLogoIcon,
} from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { getDictionary, languageAlternates } from "@/i18n";
import { getSiteSettingsOrFallback } from "@/lib/catalog/settings";
import { whatsAppChatUrl } from "@/lib/whatsapp";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const t = getDictionary(lang);
  return {
    title: t.common.contact,
    description: t.contact.description,
    alternates: languageAlternates(lang, "/contact"),
  };
}

export default async function ContactPage({ params }: Props) {
  const t = getDictionary((await params).lang);
  const settings = await getSiteSettingsOrFallback();
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`;

  const items = [
    settings.whatsapp_number && {
      Icon: WhatsappLogoIcon,
      label: "WhatsApp",
      value: `+${settings.whatsapp_number.replace(/\D/g, "")}`,
      href: whatsAppChatUrl(settings.whatsapp_number),
      action: t.contact.chat,
      external: true,
    },
    settings.phone && {
      Icon: PhoneIcon,
      label: t.contact.phone,
      value: settings.phone,
      href: `tel:${settings.phone.replace(/\s/g, "")}`,
      action: t.contact.call,
    },
    settings.email && {
      Icon: EnvelopeSimpleIcon,
      label: t.contact.email,
      value: settings.email,
      href: `mailto:${settings.email}`,
      action: t.contact.sendEmail,
    },
    settings.address && {
      Icon: MapPinIcon,
      label: t.contact.visit,
      value: settings.address,
      href: mapUrl,
      action: t.contact.openMaps,
      external: true,
    },
  ].filter(Boolean) as {
    Icon: typeof PhoneIcon;
    label: string;
    value: string;
    href: string;
    action: string;
    external?: boolean;
  }[];

  return (
    <PageContainer className="max-w-3xl">
      <PageHeader
        title={t.common.contact}
        description={t.contact.intro}
        breadcrumb={[{ label: t.common.contact }]}
      />
      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map(({ Icon, label, value, href, action, external }) => (
          <li key={label}>
            <a
              href={href}
              {...(external && {
                target: "_blank",
                rel: "noopener noreferrer",
              })}
              className="flex h-full gap-4 border border-divider bg-card p-5 transition-colors hover:border-ink-muted"
            >
              <Icon
                size={28}
                className="shrink-0 text-brand"
                aria-hidden="true"
              />
              <span className="flex flex-col gap-1">
                <span className="text-xs font-bold tracking-wider text-ink-muted uppercase">
                  {label}
                </span>
                <span className="font-bold">{value}</span>
                <span className="text-sm text-ink-soft underline underline-offset-4">
                  {action}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </PageContainer>
  );
}
