"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PIXEL_LIVE } from "@/lib/feature-flags";

const STORAGE_KEY = "scalesd-cookie-notice-dismissed";

// Server-rendered into the initial HTML so visitors see the notice before
// Microsoft Clarity (and Meta Pixel, when live) fire. The localStorage check
// runs in useEffect after hydration — return visitors get a brief flash of
// the banner before it unmounts. Acceptable for V1; cookie-based dismissal
// is the polish-tier upgrade if the flash becomes a UX issue.
export function CookieNotice() {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY) === "1") {
      setDismissed(true);
    }
  }, []);

  if (dismissed) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // localStorage can throw in private mode / quota — fail silently, banner just hides for the session.
    }
    setDismissed(true);
  };

  return (
    <div
      role="region"
      aria-label="Cookie notice"
      className="fixed bottom-0 left-0 right-0 z-[280] border-t border-white/10 bg-zinc-950/95 px-4 py-3 backdrop-blur-md sm:px-6 sm:py-4"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <p className="text-xs leading-relaxed text-white/80 sm:text-sm">
          We use cookies for analytics{PIXEL_LIVE ? " and advertising" : ""}. See our{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-white">
            Privacy Policy
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss notice"
          className="-my-1 -mr-2 cursor-pointer px-2 py-1 text-xl leading-none text-white/60 hover:text-white sm:-mr-1"
        >
          ×
        </button>
      </div>
    </div>
  );
}
