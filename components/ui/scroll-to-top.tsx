"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronUp } from "lucide-react";

const STORAGE_KEY = "scalesd-cookie-notice-dismissed";
const NARROW = "(max-width: 639px)";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [suppressedByNotice, setSuppressedByNotice] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia(NARROW);
    const isNarrow = () => mq.matches;

    // On mount: suppress if notice is still active on a narrow screen
    const alreadyDismissed = localStorage.getItem(STORAGE_KEY) === "1";
    if (!alreadyDismissed && isNarrow()) setSuppressedByNotice(true);

    const onShown = () => { if (isNarrow()) setSuppressedByNotice(true); };
    const onDismissed = () => setSuppressedByNotice(false);
    const onResize = (e: MediaQueryListEvent) => {
      if (!e.matches) setSuppressedByNotice(false);
      else if (localStorage.getItem(STORAGE_KEY) !== "1") setSuppressedByNotice(true);
    };

    window.addEventListener("cookie-notice-shown", onShown);
    window.addEventListener("cookie-notice-dismissed", onDismissed);
    mq.addEventListener("change", onResize);
    return () => {
      window.removeEventListener("cookie-notice-shown", onShown);
      window.removeEventListener("cookie-notice-dismissed", onDismissed);
      mq.removeEventListener("change", onResize);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && !suppressedByNotice && (
        <motion.button
          key="scroll-to-top"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
          className="
            fixed bottom-6 right-6 z-[250]
            w-10 h-10 md:w-12 md:h-12
            rounded-full
            bg-primary text-white
            flex items-center justify-center
            shadow-lg shadow-primary/30
            hover:bg-primary/80
            transition-colors duration-200
            cursor-pointer
          "
        >
          <ChevronUp className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
