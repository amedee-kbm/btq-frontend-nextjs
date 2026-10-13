import {
  FacebookLogoIcon,
  InstagramLogoIcon,
  MapPinIcon,
  PhoneIcon,
  TiktokLogoIcon,
  XLogoIcon,
} from "@phosphor-icons/react/dist/ssr";
import type { SiteSettings } from "@/lib/catalog/types";

export default function TopBar({ settings }: { settings: SiteSettings }) {
  const socials = [
    {
      label: "Instagram",
      href: settings.socials.instagram,
      Icon: InstagramLogoIcon,
    },
    { label: "TikTok", href: settings.socials.tiktok, Icon: TiktokLogoIcon },
    {
      label: "Facebook",
      href: settings.socials.facebook,
      Icon: FacebookLogoIcon,
    },
    { label: "X", href: settings.socials.x, Icon: XLogoIcon },
  ].filter((s) => s.href);

  return (
    <div className="w-full border-b border-brand/20 bg-brand-soft text-primary">
      <div className="mx-auto flex h-9 w-full max-w-7xl items-center gap-4 px-4 text-xs md:grid md:grid-cols-[1fr_auto_1fr]">
        <div className="hidden items-center gap-3 md:flex md:justify-self-start">
          {socials.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Btq. on ${label}`}
              className="transition-colors hover:text-brand"
            >
              <Icon size={16} />
            </a>
          ))}
        </div>

        <p className="mr-auto flex items-center gap-1.5 tracking-wide md:mr-0">
          <MapPinIcon size={14} weight="fill" className="text-brand" />
          <span className="md:hidden">Pickup at CHIC B30A</span>
          <span className="hidden md:inline">
            Pickup at CHIC Building B30A · Motard delivery across Kigali
          </span>
        </p>

        {settings.phone && (
          <a
            href={`tel:${settings.phone.replace(/\s/g, "")}`}
            className="flex items-center gap-1.5 font-semibold transition-colors hover:text-brand md:justify-self-end"
            aria-label={`Call ${settings.phone}`}
          >
            <PhoneIcon size={14} weight="bold" />
            <span className="hidden sm:inline">{settings.phone}</span>
          </a>
        )}
      </div>
    </div>
  );
}
