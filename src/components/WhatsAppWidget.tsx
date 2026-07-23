"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { PHONE_TEL } from "@/lib/constants";

const WA_NUMBER = PHONE_TEL.replace(/[^0-9]/g, "");

const TOPICS = [
  { emoji: "🏠", label: "Buying a home", message: "Hi! I'm looking to buy a home and would like some help." },
  { emoji: "💰", label: "Selling my home", message: "Hi! I'm thinking about selling my home and would like to talk." },
  { emoji: "🇵🇪", label: "Properties in Peru", message: "Hi! I'm interested in your properties in Peru." },
  { emoji: "💬", label: "Something else", message: "Hi! I have a question for Perfecto Homes." },
];

export default function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);
  const [listingContext, setListingContext] = useState<string | null>(null);
  const pathname = usePathname();

  // On a listing page, carry the property into the conversation.
  // Read the DOM in an effect (not during render) to avoid a hydration
  // mismatch that would leave the server-rendered href in place.
  useEffect(() => {
    if (/^\/(listings|peru)\/[^/]+\/?$/.test(pathname)) {
      const property = document.querySelector("h1")?.textContent?.trim() || document.title.split("|")[0].trim();
      setListingContext(`Hi! I'm interested in ${property} (${window.location.href})`);
    } else {
      setListingContext(null);
    }
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const waLink = () => {
    const message = listingContext || (picked !== null ? TOPICS[picked].message : "Hi! I have a question for Perfecto Homes.");
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  const track = (action: string) => {
    if (typeof window !== "undefined" && typeof (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag === "function") {
      (window as unknown as { gtag: (...args: unknown[]) => void }).gtag("event", action, { event_category: "whatsapp_widget", page: pathname });
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-3">
      {/* Chat Panel */}
      <div
        className={`w-[calc(100vw-2rem)] max-w-xs sm:max-w-sm origin-bottom-right transition-all duration-300 ${
          open ? "opacity-100 scale-100 translate-y-0" : "pointer-events-none opacity-0 scale-95 translate-y-2"
        }`}
      >
        <div className="overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-2xl">
          {/* Header */}
          <div className="bg-dark px-5 py-4 flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
              <Image src="/images/logo/perfecto-logo.svg" alt="Perfecto Homes" width={26} height={26} className="object-contain" />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-dark" />
            </div>
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm leading-tight">Perfecto Homes</p>
              <p className="text-white/60 text-xs mt-0.5">Typically replies within minutes</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="ml-auto text-white/60 hover:text-white text-xl leading-none p-1"
            >
              &times;
            </button>
          </div>

          {/* Conversation */}
          <div className="bg-light-gray px-4 py-5 space-y-3">
            <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-white border border-gray-100 px-4 py-3 text-sm text-dark leading-relaxed">
              Hi there 👋 Welcome to Perfecto Homes. What can we help you with today?
            </div>

            {picked === null ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {TOPICS.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => { setPicked(i); track("whatsapp_topic_selected"); }}
                    className="rounded-full border border-gold/40 bg-white px-3.5 py-2 text-[13px] font-medium text-dark hover:bg-gold hover:text-white hover:border-gold transition-colors"
                  >
                    {t.emoji} {t.label}
                  </button>
                ))}
              </div>
            ) : (
              <>
                <div className="ml-auto max-w-[85%] w-fit rounded-2xl rounded-tr-md bg-gold/15 border border-gold/20 px-4 py-3 text-sm text-dark">
                  {TOPICS[picked].emoji} {TOPICS[picked].label}
                </div>
                <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-white border border-gray-100 px-4 py-3 text-sm text-dark leading-relaxed">
                  Great choice! Tap below and we&apos;ll continue on WhatsApp.
                </div>
              </>
            )}
          </div>

          {/* CTA */}
          <div className="bg-white px-4 py-4 border-t border-gray-100">
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("whatsapp_chat_started")}
              className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1ebe57] text-white font-semibold py-3 px-6 rounded-lg text-sm transition-colors"
            >
              <WhatsAppIcon className="w-4 h-4" />
              Start Chat on WhatsApp
            </a>
            <p className="text-center text-[11px] text-medium-gray mt-2">Opens WhatsApp &middot; no account info shared</p>
          </div>
        </div>
      </div>

      {/* Launcher */}
      <button
        onClick={() => { setOpen(!open); if (!open) track("whatsapp_widget_opened"); }}
        aria-label={open ? "Close WhatsApp chat" : "Chat with us on WhatsApp"}
        aria-expanded={open}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:scale-105 active:scale-95 transition-transform"
      >
        <span className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${open ? "opacity-0 rotate-90" : "opacity-100 rotate-0"}`}>
          <WhatsAppIcon className="w-7 h-7" />
        </span>
        <span className={`absolute inset-0 flex items-center justify-center text-2xl font-light transition-all duration-200 ${open ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"}`}>
          &times;
        </span>
        {!open && <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-gold border-2 border-white" />}
      </button>
    </div>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
