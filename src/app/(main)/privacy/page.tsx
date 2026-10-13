import type { Metadata } from "next";
import Link from "next/link";
import { ProsePage } from "@/components/layout/prose-page";

export const metadata: Metadata = { title: "Privacy" };

// Placeholder plain-language policy; the owner supplies the final text (PRD §3.7).
export default function PrivacyPage() {
  return (
    <ProsePage title="Privacy">
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
        inactivity).
      </p>
      <h2>Your choices</h2>
      <p>
        To delete your account and favorites,{" "}
        <Link href="/contact">contact us</Link>.
      </p>
    </ProsePage>
  );
}
