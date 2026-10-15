"use client";

import { WhatsappLogoIcon } from "@phosphor-icons/react";
import { createContext, useContext, useEffect, useState } from "react";
import { buildInquiryUrl, type InquirySubject } from "@/lib/whatsapp";

const SubjectContext = createContext<(subject?: InquirySubject) => void>(
  () => {},
);

/**
 * A floating "Ask us" WhatsApp button on every page. It opens a general
 * question, unless the page names what it's about with `useAskUsAbout`.
 */
export function AskUsProvider({
  number,
  children,
}: {
  number: string;
  children: React.ReactNode;
}) {
  const [subject, setSubject] = useState<InquirySubject>();

  return (
    <SubjectContext.Provider value={setSubject}>
      {children}
      {number && (
        <a
          href={buildInquiryUrl(number, subject)}
          target="_blank"
          rel="noopener"
          aria-label={
            subject
              ? `Ask us about ${subject.product.name} on WhatsApp`
              : "Ask us a question on WhatsApp"
          }
          className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 flex h-12 items-center gap-2 rounded-full bg-action pr-5 pl-4 text-sm font-bold text-white shadow-lg transition-colors hover:bg-action-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <WhatsappLogoIcon size={22} weight="fill" aria-hidden="true" />
          {subject ? "Ask about this" : "Ask us"}
        </a>
      )}
    </SubjectContext.Provider>
  );
}

/** Points the "Ask us" button at this product while the calling page is shown. */
export function useAskUsAbout({ product, size, color }: InquirySubject) {
  const setSubject = useContext(SubjectContext);
  const { slug, code, name } = product;

  useEffect(() => {
    setSubject({ product: { slug, code, name }, size, color });
    return () => setSubject(undefined);
  }, [setSubject, slug, code, name, size, color]);
}
