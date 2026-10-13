"use client";

import {
  CaretDownIcon,
  FacebookLogoIcon,
  InstagramLogoIcon,
  MapPinIcon,
  PhoneIcon,
  TiktokLogoIcon,
  YoutubeLogoIcon,
} from "@phosphor-icons/react";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const HELP_LINE = "0781427209";

const LANGUAGES = [
  { code: "EN", name: "English" },
  { code: "KIN", name: "Ikinyarwanda" },
  { code: "FR", name: "Français" },
];

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://instagram.com",
    Icon: InstagramLogoIcon,
  },
  { label: "Facebook", href: "https://facebook.com", Icon: FacebookLogoIcon },
  { label: "TikTok", href: "https://tiktok.com", Icon: TiktokLogoIcon },
  { label: "YouTube", href: "https://youtube.com", Icon: YoutubeLogoIcon },
];

export default function TopBar() {
  const [language, setLanguage] = useState("EN");
  const current = LANGUAGES.find((lang) => lang.code === language);

  return (
    <div className="w-full border-b border-brand/20 bg-brand-soft text-primary">
      <div className="mx-auto flex h-9 w-full max-w-7xl items-center gap-4 px-4 text-xs md:grid md:grid-cols-[1fr_auto_1fr]">
        <div className="hidden items-center gap-3 md:flex md:justify-self-start">
          {SOCIALS.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
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

        <div className="flex items-center gap-4 md:justify-self-end">
          <a
            href={`tel:${HELP_LINE}`}
            className="flex items-center gap-1.5 font-semibold transition-colors hover:text-brand"
          >
            <PhoneIcon size={14} weight="bold" />
            <span className="hidden sm:inline">{HELP_LINE}</span>
          </a>
          <span className="h-4 w-px bg-primary/20" />
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 font-semibold uppercase tracking-wider transition-colors hover:text-brand">
              {current?.code}
              <CaretDownIcon size={12} weight="bold" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup
                value={language}
                onValueChange={setLanguage}
              >
                {LANGUAGES.map((lang) => (
                  <DropdownMenuRadioItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
