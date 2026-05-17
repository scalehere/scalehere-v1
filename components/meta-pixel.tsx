import Script from "next/script";
import { PIXEL_LIVE, ADVANCED_MATCHING_LIVE } from "@/lib/feature-flags";

const PIXEL_ID = "953993577706046";

// Base Meta Pixel — fires PageView on every route. Gated by PIXEL_LIVE so
// the script never loads while the privacy disclosure copy is also hidden.
// Mirrors the Clarity loader pattern in layout.tsx (afterInteractive).
export function MetaPixel() {
  if (!PIXEL_LIVE) return null;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}

declare global {
  interface Window {
    fbq?: (
      command: "track" | "trackCustom" | "init",
      eventName: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

export type LeadUserData = {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
};

// Safe to call unconditionally from form handlers — no-ops when PIXEL_LIVE is
// off, when fbevents.js hasn't loaded yet (afterInteractive can lag first
// paint), or when the user blocks the pixel via ad-blocker / privacy extension.
//
// Manual Advanced Matching: when ADVANCED_MATCHING_LIVE is on AND userData
// carries at least one non-empty field, re-init the pixel with the user_data
// params before firing Lead so Meta can attribute the conversion to a specific
// user account. Meta's pixel auto-hashes plaintext client-side per their spec
// (lowercase + trim email; digit-only + country-code phone; etc.) — we pass
// plaintext and trust the normalization. Do NOT pre-hash here.
export function trackLead(userData?: LeadUserData) {
  if (!PIXEL_LIVE) return;
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;

  if (ADVANCED_MATCHING_LIVE && userData) {
    const params: Record<string, string> = {};
    if (userData.email) params.em = userData.email;
    if (userData.phone) params.ph = userData.phone;
    if (userData.firstName) params.fn = userData.firstName;
    if (userData.lastName) params.ln = userData.lastName;
    if (Object.keys(params).length > 0) {
      window.fbq("init", PIXEL_ID, params);
    }
  }

  window.fbq("track", "Lead");
}
