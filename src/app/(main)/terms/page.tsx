import type { Metadata } from "next";
import Link from "next/link";
import { ProsePage } from "@/components/layout/prose-page";

export const metadata: Metadata = { title: "Terms of use" };

// Placeholder plain-language terms; the owner supplies the final text (PRD §3.7).
export default function TermsPage() {
  return (
    <ProsePage title="Terms of use">
      <p>
        Btq. is a boutique in Kigali, Rwanda. This website is a catalog: it
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
    </ProsePage>
  );
}
