"use client";

import { useCallback, useEffect, useState } from "react";
import { Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

type Step = {
  iconSrc: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  detail: string;
  stat: string;
};

const steps: Step[] = [
  {
    iconSrc: "/vectors/call_icon.svg",
    number: "01",
    title: "Free Strategy Call",
    subtitle: "15 minutes - no strings attached.",
    description:
      "We audit what's working and what's burning money. You walk away with a clear plan.",
    detail: "No pitch. No pressure. No catch.",
    stat: "QUICK DIAGNOSTIC",
  },
  {
    iconSrc: "/vectors/website_icon.svg",
    number: "02",
    title: "We Get to Work",
    subtitle: "Ads, content, reporting.",
    description:
      "Our team builds your campaigns and runs them weekly. You give us one hour a week. We do the rest.",
    detail: "Month-to-month. You own every account from day one.",
    stat: "WEEKLY SESSIONS",
  },
  {
    iconSrc: "/vectors/growth_icon.svg",
    number: "03",
    title: "Your Calendar Fills Up",
    subtitle: "Real reporting. Real revenue.",
    description:
      "Track every lead, every call, every dollar. Stay aligned with monthly check-ins. Not delivering? Fire us.",
    detail: "We report in customers and revenue — not clicks and impressions.",
    stat: "REAL GROWTH",
  },
];

const TOTAL_STEPS = steps.length;
const AUTO_CYCLE_MS = 6000;
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function useStepCycler(totalSteps: number, interval: number, paused: boolean) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (paused) return;
    const timer = setTimeout(() => {
      setCurrentStep((prev) => (prev + 1) % totalSteps);
    }, interval);
    return () => clearTimeout(timer);
  }, [currentStep, totalSteps, interval, paused]);

  const goToStep = useCallback(
    (i: number) => setCurrentStep(i % totalSteps),
    [totalSteps],
  );

  return { currentStep, goToStep };
}

export function HowItWorks() {
  const [isHovered, setIsHovered] = useState(false);
  const { currentStep, goToStep } = useStepCycler(
    TOTAL_STEPS,
    AUTO_CYCLE_MS,
    isHovered,
  );
  const step = steps[currentStep];
  const progressFraction = currentStep / (TOTAL_STEPS - 1);

  return (
    <section className="w-full py-16 md:py-24 lg:py-32 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Section header */}
        <div className="text-center md:text-left">
          <p className="text-xs uppercase tracking-[0.35em] text-primary/70 mb-4 font-medium">
            The Process
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg mb-10 md:mb-16 max-w-xl mx-auto md:mx-0">
            Simple, transparent, and built around your results.
          </p>
        </div>

        <div
          className="flex flex-col gap-8 md:gap-10"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Progress rail — section spine */}
          <nav aria-label="Process steps">
            <div className="relative max-w-xl mx-auto">
              <ol
                className="relative flex items-center justify-between"
                role="list"
              >
                {/* Gray track behind circles */}
                <div
                  aria-hidden
                  className="absolute top-1/2 left-6 right-6 h-px -translate-y-1/2 bg-white/10"
                />
                {/* Animated active progress line */}
                <motion.div
                  aria-hidden
                  className="absolute top-1/2 left-6 h-[2px] -translate-y-1/2 bg-primary origin-left"
                  style={{ width: "calc(100% - 3rem)" }}
                  initial={false}
                  animate={{ scaleX: progressFraction }}
                  transition={{ duration: 0.5, ease: EASE }}
                />

                {steps.map((s, i) => {
                  const isCompleted = currentStep > i;
                  const isCurrent = currentStep === i;
                  return (
                    <li key={s.number} className="relative z-10">
                      <button
                        type="button"
                        onClick={() => goToStep(i)}
                        aria-current={isCurrent ? "step" : undefined}
                        aria-label={`Step ${i + 1}: ${s.title}`}
                        className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background rounded-full"
                      >
                        <motion.span
                          animate={{ scale: isCurrent ? 1.1 : 1 }}
                          transition={{ duration: 0.3, ease: EASE }}
                          className={cn(
                            "flex h-12 w-12 items-center justify-center rounded-full border-2 font-heading text-base font-bold transition-colors duration-300",
                            isCurrent
                              ? "bg-white border-white text-primary shadow-[0_0_18px_var(--primary)]"
                              : isCompleted
                                ? "bg-primary border-primary text-primary-foreground"
                                : "bg-background border-white/25 text-foreground/50 group-hover:border-white/40",
                          )}
                        >
                          {isCompleted ? (
                            <Check className="h-5 w-5" strokeWidth={3} />
                          ) : (
                            s.number
                          )}
                        </motion.span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          </nav>

          {/* Card */}
          <article
            aria-live="polite"
            aria-atomic="true"
            className="relative overflow-hidden rounded-2xl border border-primary/25 bg-white/5 backdrop-blur-sm shadow-[inset_4px_0_16px_-6px_var(--primary)]"
          >
            {/* Step numeral watermark — bleeds off top-right corner */}
            <AnimatePresence mode="wait">
              <motion.span
                key={`numeral-watermark-${currentStep}`}
                aria-hidden
                className="pointer-events-none select-none absolute -top-6 sm:-top-8 -right-3 sm:-right-5 z-0 font-heading font-black leading-none tracking-tight text-[10rem] sm:text-[13rem] md:text-[15rem] text-primary/[0.10]"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                {step.number}
              </motion.span>
            </AnimatePresence>

            {/* Step icon watermark — SVG mask-tinted, bleeds off bottom-left corner */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`icon-watermark-${currentStep}`}
                aria-hidden
                className="pointer-events-none select-none absolute -bottom-6 sm:-bottom-10 md:-bottom-15 -left-4 sm:-left-8 z-0 h-40 w-40 sm:h-52 sm:w-52 md:h-64 md:w-64 bg-primary/[0.10]"
                style={{
                  maskImage: `url(${step.iconSrc})`,
                  maskSize: "contain",
                  maskRepeat: "no-repeat",
                  maskPosition: "center",
                  WebkitMaskImage: `url(${step.iconSrc})`,
                  WebkitMaskSize: "contain",
                  WebkitMaskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5, ease: EASE }}
              />
            </AnimatePresence>

            <div className="relative z-10 flex flex-col gap-6 p-6 sm:p-8">
              {/* Top row: text + stat */}
              <div className="grid grid-cols-1 sm:grid-cols-[3fr_2fr] gap-6 sm:gap-8 items-center min-h-[180px] sm:min-h-[200px]">
                {/* Left: text content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`text-${currentStep}`}
                    className="flex flex-col gap-2 md:gap-3"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.4, ease: EASE }}
                  >
                    <motion.p
                      className="text-xs sm:text-sm uppercase tracking-[0.22em] font-medium text-primary"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05, duration: 0.3, ease: EASE }}
                    >
                      {step.subtitle}
                    </motion.p>
                    <motion.h3
                      className="font-heading text-xl sm:text-2xl md:text-3xl font-bold tracking-tight leading-tight"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1, duration: 0.3, ease: EASE }}
                    >
                      {step.title}
                    </motion.h3>
                    <motion.p
                      className="text-sm sm:text-base text-muted-foreground leading-relaxed"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15, duration: 0.3, ease: EASE }}
                    >
                      {step.description}
                    </motion.p>
                  </motion.div>
                </AnimatePresence>

                {/* Right: stat */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`stat-${currentStep}`}
                    className="hidden sm:flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ duration: 0.4, ease: EASE }}
                  >
                    <span className="font-heading text-3xl lg:text-4xl xl:text-5xl font-black text-primary tracking-tight leading-none text-center break-words">
                      {step.stat}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Bottom: centered promise line */}
              <div className="border-t border-primary/15 pt-5 sm:pt-6">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={`promise-${currentStep}`}
                    className="text-center text-primary/95 text-sm sm:text-base font-semibold uppercase tracking-[0.18em]"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.4, ease: EASE }}
                  >
                    {step.detail}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
