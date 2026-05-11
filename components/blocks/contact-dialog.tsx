"use client";

import { cn } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
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

type FormStatus = "idle" | "loading" | "success" | "error";

// Glass panel input — text-base (16px) prevents iOS Safari auto-zoom on focus,
// which triggers the visual-viewport shift cascade (page scroll, blur cutoff, stuck zoom).
const inputClass =
  "w-full bg-white/5 border border-white/10 rounded-md px-4 py-2.5 text-base text-foreground placeholder:text-white/30 focus:outline-none focus:border-primary/70 focus:ring-1 focus:ring-primary/40 transition-colors duration-200";

/**
 * ContactDialog — mounted once at the root inside ContactDialogProvider so the
 * Dialog markup is always in the DOM, independent of which page section is
 * currently rendered. Triggers (hero CTA, navbar Free Audit, CTA-section CTA)
 * all open it via useContactDialog().openDialog().
 *
 * Was previously inlined in cta-with-text-marquee.tsx, which is wrapped in
 * <LazySection> — on a fresh visit the dialog wouldn't render until the user
 * scrolled near the CTA section and IntersectionObserver mounted it. Lifting
 * it to root makes openDialog() work from the first paint.
 */
export function ContactDialog() {
  const { open: dialogOpen, closeDialog } = useContactDialog();

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

  return (
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
            Tell us about your business — we&apos;ll be in touch within one business day.
          </DialogDescription>
        </DialogHeader>

        {status === "success" ? (
          <p className="text-sm text-primary font-medium py-4">
            Thank you — we&apos;ll be in touch soon.
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
  );
}
