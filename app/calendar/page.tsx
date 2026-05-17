import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Book Your Free Marketing Audit — Scale SD",
  description:
    "Our team will look at your business, figure out where the growth opportunities are, and walk you out with a plan you can run with.",
  robots: { index: false, follow: false },
};

// GHL booking widget. URL + id are exactly what GHL's embed snippet hands
// out — id is required by form_embed.js to auto-resize the iframe height.
const BOOKING_EMBED_URL =
  "https://api.leadconnectorhq.com/widget/booking/jCeIaGHG45GKYAirRHa9";
const BOOKING_IFRAME_ID = "hL9JJd6aLvJg41rzL5N8_1778982853958";

export default function CalendarPage() {
  return (
    <main className="min-h-screen py-12 sm:py-16 lg:py-20">
      {/* Header + headline — wider centered column so the headline gets
          room to breathe before it has to wrap */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Minimal header — exit ramp + brand anchor */}
        <div className="mb-12 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm text-white/60 transition-colors hover:text-white"
          >
            ← Back to Scale SD
          </Link>
          <Link
            href="/"
            aria-label="home"
            className="relative inline-flex items-center"
          >
            <img
              src="/scalehere_logos/basic_logo.webp"
              alt=""
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-auto opacity-25 pointer-events-none select-none"
            />
            <span className="relative z-10 font-heading text-2xl font-black tracking-widest text-white">
              SCALE SD
            </span>
          </Link>
        </div>

        {/* Headline + description */}
        <div className="text-center">
          <h1 className="font-heading text-4xl font-bold leading-tight text-white text-balance md:text-5xl">
            Book&nbsp;your&nbsp;free marketing audit.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
            Our team will look at your business, figure out where the growth
            opportunities are, and walk you out with a plan you can run with.
          </p>
          <p className="mx-auto mt-4 max-w-xl text-sm text-white/60">
            No obligation. No pressure. No commitment.
          </p>
        </div>
      </div>

      {/* Calendar — wide framed card. iframe is wide enough to clear the
          widget's desktop breakpoint (~1280px) so it renders side-by-side
          and self-centers inside the card. Rounded border frames the
          whitespace so it reads as intentional card padding. */}
      <div className="mx-auto mt-12 max-w-[1536px] px-4 sm:px-6">
        <iframe
          src={BOOKING_EMBED_URL}
          id={BOOKING_IFRAME_ID}
          title="Book your free marketing audit with Scale SD"
          scrolling="no"
          className="block w-full overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl"
          style={{ minHeight: 400 }}
        />
        <Script
          src="https://link.msgsndr.com/js/form_embed.js"
          strategy="afterInteractive"
        />
      </div>

      {/* Footer — alt-contact + privacy link (privacy stays reachable on
          this route since the cookie notice is suppressed here) */}
      <p className="mx-auto mt-10 max-w-3xl px-4 text-center text-xs text-white/40 sm:px-6">
        Prefer email?{" "}
        <a
          href="mailto:media@scalehere.com"
          className="text-primary underline underline-offset-2 hover:text-white"
        >
          media@scalehere.com
        </a>
        <span className="mx-2 text-white/20" aria-hidden="true">
          ·
        </span>
        <Link
          href="/privacy"
          className="text-white/60 underline underline-offset-2 hover:text-white"
        >
          Privacy
        </Link>
      </p>
    </main>
  );
}
