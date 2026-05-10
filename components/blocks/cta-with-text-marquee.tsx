"use client";

import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { BlueButton } from "@/components/ui/blue-button";
import { useContactDialog } from "@/lib/contact-dialog-context";
import { captureUTMs, getStoredUTMs, type UTMData } from "@/lib/utm-capture";

// Types of businesses Scale SD serves
const dialItems = [
  "Local Businesses",
  "E-commerce Brands",
  "Restaurants & Food",
  "Real Estate Agents",
  "Service Providers",
  "Startups & Founders",
];

// Watch dial — items orbit on a 3D cylinder. List is repeated around the
// cylinder for density. All knobs live in `dialConfig` below — tweak freely.
const dialConfig = {
  // How many times to repeat the item list around the cylinder.
  // More repeats = more items packed angularly = smaller gap between them.
  // 1 = 6 slots @ 60° apart   2 = 12 slots @ 30°   3 = 18 slots @ 20°
  repeats: 2,

  // Cylinder radius in pixels. Bigger = items spread further vertically =
  // taller dial visually. Smaller = tighter, more compact dial.
  radius: 220,

  // Perspective depth in pixels. Bigger = flatter, less dramatic 3D scaling.
  // Smaller = more pronounced depth (items at front appear much larger).
  perspective: 1200,

  // Outer container height. Should be at least 2× radius so items don't clip.
  containerHeight: 500,

  // Inner slot height — the height of each item's bounding box. Should be
  // roughly the line height of your text size (text-3xl ≈ 36px line, give padding).
  slotHeight: 120,

  // Full rotation duration in seconds. Bigger = slower spin.
  rotationSeconds: 50,

  // Tailwind class for item text size. e.g. "text-2xl" / "text-3xl" / "text-4xl".
  // Note: bigger text may clip if items don't fit the column at perspective scale.
  textSizeClass: "text-3xl",

  // Left padding on the whole dial column — pushes the dial right, away from
  // the left content. e.g. "lg:pl-8 xl:pl-12" or "" for none.
  leftPadding: "lg:pl-8 xl:pl-12",

  // Edge fade strength — how aggressively items dim at top/bottom of the dial.
  // 0 = no fade, 1 = items at edges go fully transparent, 1.5 = fade kicks in earlier.
  edgeFadeStrength: 1,

  // Center color zone size — fraction of the dial's half-height where items
  // tint toward electric blue (0 to 1). Smaller = tighter blue band, items
  // only briefly turn blue as they pass through. Larger = wider band, items
  // are blue for more of their travel.
  colorZoneSize: 0.6,

  // Vertical accent line on the left of each item — a thin blue bar.
  // Set to false to hide.
  showAccentLine: true,

  // Width of the accent line in pixels.
  accentLineWidth: 6,

  // Gap in pixels between the accent line and the text.
  accentLineGap: 16,
};

// Electric blue (matches site primary). Pre-parsed for the rAF interp loop.
const BLUE_RGB = { r: 59, g: 130, b: 246 };

function CylinderDial() {
  const containerRef = useRef<HTMLDivElement>(null);
  const allItems = Array.from({ length: dialConfig.repeats }).flatMap(() => dialItems);
  const N = allItems.length;
  const ANGLE_PER_ITEM = 360 / N;

  // Edge fade — rAF loop sets per-item opacity based on how far from the
  // dial's vertical center each item currently is. Mask-image was clipping
  // perspective-scaled items horizontally, so we fade per-item instead.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const items = container.querySelectorAll<HTMLElement>('.dial-item');

    const update = () => {
      const rect = container.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;
      const maxDistance = rect.height / 2;

      items.forEach((item) => {
        const itemRect = item.getBoundingClientRect();
        const itemY = itemRect.top + itemRect.height / 2;
        const distance = Math.abs(itemY - centerY);
        const normalized = Math.min(distance / maxDistance, 1);
        const opacity = Math.max(0, 1 - normalized * dialConfig.edgeFadeStrength);
        item.style.opacity = opacity.toString();

        // Center color zone — items inside the zone tint toward electric blue,
        // smoothly interpolating back to white as they exit.
        const t = Math.min(1, normalized / dialConfig.colorZoneSize);
        const r = Math.round(BLUE_RGB.r + (255 - BLUE_RGB.r) * t);
        const g = Math.round(BLUE_RGB.g + (255 - BLUE_RGB.g) * t);
        const b = Math.round(BLUE_RGB.b + (255 - BLUE_RGB.b) * t);
        item.style.color = `rgb(${r}, ${g}, ${b})`;
      });

      frameId = requestAnimationFrame(update);
    };

    let frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <div className={cn("hidden lg:flex flex-col gap-4 animate-fade-in-up [animation-delay:400ms]", dialConfig.leftPadding)}>
      <div
        ref={containerRef}
        className="relative flex items-center justify-center"
        style={{
          height: `${dialConfig.containerHeight}px`,
          perspective: `${dialConfig.perspective}px`,
          transformStyle: 'preserve-3d',
        }}
      >
        <div
          className="relative w-full"
          style={{
            height: `${dialConfig.slotHeight}px`,
            transformStyle: 'preserve-3d',
            animation: `cylinder-rotate ${dialConfig.rotationSeconds}s linear infinite`,
          }}
        >
          {allItems.map((item, idx) => (
            <div
              key={idx}
              className={cn(
                "dial-item absolute inset-0 flex items-center justify-start font-heading font-black tracking-tight whitespace-nowrap text-white",
                dialConfig.textSizeClass
              )}
              style={{
                transform: `rotateX(${ANGLE_PER_ITEM * idx}deg) translateZ(${dialConfig.radius}px)`,
                backfaceVisibility: 'hidden',
                gap: `${dialConfig.accentLineGap}px`,
              }}
            >
              {dialConfig.showAccentLine && (
                <div
                  className="self-stretch bg-primary rounded-full shrink-0"
                  style={{ width: `${dialConfig.accentLineWidth}px` }}
                />
              )}
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

type FormStatus = "idle" | "loading" | "success" | "error";

export default function CTAWithVerticalMarquee() {
  // Dialog state from context — shared with navbar
  const { open: dialogOpen, openDialog, closeDialog } = useContactDialog();

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const [utms, setUtms] = useState<UTMData>({
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_content: "",
    utm_term: "",
    gclid: "",
    fbclid: "",
  });

  useEffect(() => {
    // React fires deeply-nested effects before shallow ones, so this effect
    // could otherwise read sessionStorage before UTMCaptureClient writes it.
    // captureUTMs() is idempotent — duplicating the call here is harmless.
    captureUTMs();
    setUtms(getStoredUTMs());
  }, []);

  const resetForm = useCallback(() => {
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
    setStatus("idle");
    setErrorMsg("");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          message,
          utm_source: utms.utm_source,
          utm_medium: utms.utm_medium,
          utm_campaign: utms.utm_campaign,
          utm_content: utms.utm_content,
          utm_term: utms.utm_term,
          fbclid: utms.fbclid,
          gclid_custom: utms.gclid,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong.");
      }

      setStatus("success");
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  };

  // Shared input class — glass panel language consistent with site.
  // Font is text-base (16px) — under 16px iOS Safari auto-zooms inputs on focus,
  // which triggers the visual-viewport shift cascade (page scroll, blur cutoff, stuck zoom).
  const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-md px-4 py-2.5 text-base text-foreground placeholder:text-white/30 focus:outline-none focus:border-primary/70 focus:ring-1 focus:ring-primary/40 transition-colors duration-200";

  return (
    <div className="min-h-screen text-foreground flex items-center justify-center px-6 py-12 overflow-hidden">
      <div className="w-full max-w-7xl animate-fade-in-up">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Left Content */}
          <div className="space-y-8 max-w-xl mx-auto lg:mx-0">
            <h2 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-foreground text-center lg:text-left animate-fade-in-up [animation-delay:200ms]">
              Ready to Stop Guessing and Start Growing?
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-center lg:text-left animate-fade-in-up [animation-delay:400ms]">
              Get a free marketing audit for your business. We'll show you exactly where your marketing dollars are going — and where they should be. Month-to-month. No contracts. You own everything.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start animate-fade-in-up [animation-delay:600ms]">
              <BlueButton
                size="cta"
                onClick={() => { resetForm(); openDialog(); }}
              >
                GET MY FREE AUDIT
              </BlueButton>
              <BlueButton size="cta" variant="secondary" href="tel:7604437876">
                CALL 760-443-7876
              </BlueButton>
            </div>
          </div>

          {/* Right cylinder dial — hidden on mobile, visible lg+ */}
          <CylinderDial />
        </div>
      </div>

      {/* Contact form dialog */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => { if (!open) closeDialog(); }}
        // Reset deferred until close animation completes — otherwise the success view flashes empty during fadeout.
        onOpenChangeComplete={(open) => { if (!open) resetForm(); }}
      >
        <DialogContent className="bg-zinc-950 border border-white/10 text-foreground sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl font-bold">Get Your Free Audit</DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              Tell us about your business — we'll be in touch within one business day.
            </DialogDescription>
          </DialogHeader>

          {status === "success" ? (
            <p className="text-sm text-primary font-medium py-4">
              Thank you — we'll be in touch soon.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 mt-2">
              <input type="hidden" name="utm_source" value={utms.utm_source} />
              <input type="hidden" name="utm_medium" value={utms.utm_medium} />
              <input type="hidden" name="utm_campaign" value={utms.utm_campaign} />
              <input type="hidden" name="utm_content" value={utms.utm_content} />
              <input type="hidden" name="utm_term" value={utms.utm_term} />
              <input type="hidden" name="fbclid" value={utms.fbclid} />
              {/* GHL reserves contact.gclid as a standard field; our custom field is contact.gclid_custom */}
              <input type="hidden" name="gclid_custom" value={utms.gclid} />

              {/* Name + Email row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  name="first_name"
                  placeholder="Name *"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email *"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>

              <input
                type="tel"
                name="phone"
                placeholder="Phone (optional)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
              />

              <textarea
                name="message"
                placeholder="Message *"
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={cn(inputClass, "resize-none")}
              />

              {status === "error" && (
                <p className="text-sm text-red-400">{errorMsg}</p>
              )}

              <BlueButton
                size="send"
                fullWidth
                type="submit"
                disabled={status === "loading"}
              >
                {status === "loading" ? "Sending…" : "SEND MESSAGE"}
              </BlueButton>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
