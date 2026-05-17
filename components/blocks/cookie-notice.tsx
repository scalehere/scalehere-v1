"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PIXEL_LIVE } from "@/lib/feature-flags";

const STORAGE_KEY = "scalesd-cookie-notice-dismissed";

// Routes that suppress the cookie notice. /calendar is an ad-driven funnel
// where the GHL booking widget needs the bottom of the viewport free on
// mobile (keyboard + input would collide with the toast). Privacy is still
// reachable from /calendar's footer link, so the disclosure path stays open.
const SUPPRESSED_PATHS = new Set(["/calendar"]);

// Server-rendered into the initial HTML so visitors see the notice before
// Microsoft Clarity (and Meta Pixel, when live) fire. The localStorage check
// runs in useEffect after hydration — return visitors get a brief flash of
// the toast before it unmounts. Acceptable for V1; cookie-based dismissal
// is the polish-tier upgrade if the flash becomes a UX issue.
export function CookieNotice() {
  const pathname = usePathname();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY) === "1") {
      setDismissed(true);
    } else if (!pathname?.startsWith("/privacy")) {
      // Skip "shown" event if the landing page is /privacy — the pathname
      // effect below will auto-dismiss this render anyway.
      window.dispatchEvent(new Event("cookie-notice-shown"));
    }
    // pathname intentionally excluded — initial-mount decision only; the
    // pathname-change effect below handles subsequent navigation to /privacy.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Visiting /privacy from any path is implicit cookie-notice acknowledgment.
  // Covers direct landings + footer link clicks + the in-notice link below.
  useEffect(() => {
    if (typeof window === "undefined" || dismissed) return;
    if (!pathname?.startsWith("/privacy")) return;
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // localStorage can throw in private mode / quota — fail silently.
    }
    window.dispatchEvent(new Event("cookie-notice-dismissed"));
    setDismissed(true);
  }, [pathname, dismissed]);

  if (pathname && SUPPRESSED_PATHS.has(pathname)) return null;
  if (dismissed) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // localStorage can throw in private mode / quota — fail silently, banner just hides for the session.
    }
    window.dispatchEvent(new Event("cookie-notice-dismissed"));
    setDismissed(true);
  };

  return (
    <div
      role="region"
      aria-label="Cookie notice"
      className="fixed bottom-4 left-4 z-[280] w-[360px] max-w-[calc(100vw-2rem)] rounded-xl border border-white/15 bg-zinc-900/95 px-4 py-3 shadow-2xl backdrop-blur-md"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm leading-relaxed text-white/75">
          We use cookies for analytics{PIXEL_LIVE ? " and advertising" : ""}. {" "}
          <Link
            href="/privacy"
            onClick={dismiss}
            className="text-primary underline underline-offset-2 hover:text-white transition-colors"
          >
            Privacy Policy
          </Link>
        </p>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss notice"
          className="shrink-0 cursor-pointer text-white/40 transition-colors hover:text-white"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
