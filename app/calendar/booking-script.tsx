"use client";

import { useEffect } from "react";

// GHL's form_embed.js auto-resizes the booking iframe via postMessage.
// `next/script` dedupes by src — on Link-based remount of /calendar
// (back-button → re-click) the script doesn't re-execute, leaving the
// remounted iframe without an active resize listener. Imperative load
// in useEffect re-fires init on every mount; cleanup removes the tag
// so document.body doesn't accumulate one per visit.
export function BookingScript() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://link.msgsndr.com/js/form_embed.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);
  return null;
}
