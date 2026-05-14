"use client";

import React, { useEffect, useRef, useState } from "react";
import { PhoneCall, Zap, TrendingUp } from "lucide-react";

type Step = {
  icon: React.ComponentType<{ className?: string }>;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  detail: string;
};

const steps: Step[] = [
  {
    icon: PhoneCall,
    number: "01",
    title: "Free Strategy Call",
    subtitle: "15 minutes. Free diagnostic - no strings attached.",
    description:
      "We audit what's working and what's burning money. You walk away with a clear plan.",
    detail: "No pitch. No pressure. No catch.",
  },
  {
    icon: Zap,
    number: "02",
    title: "We Get to Work",
    subtitle: "Ads, content, strategy, reporting — all taken care of.",
    description:
      "Our team builds your campaigns and runs them weekly. You give us one hour a week. We do the rest.",
    detail:
      "Month-to-month. No contracts. You own every account from day one.",
  },
  {
    icon: TrendingUp,
    number: "03",
    title: "Watch Your Calendar Fill Up",
    subtitle: "Real reporting. Real revenue. No fluff.",
    description:
      "Track every lead, every call, every dollar. Stay aligned with monthly check-ins. Not delivering? Fire us.",
    detail: "We report in customers and revenue — not clicks and impressions.",
  },
];

export function HowItWorks() {
  const [activeIndex, setActiveIndex] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  const setStepRef = (el: HTMLDivElement | null, i: number) => {
    stepRefs.current[i] = el;
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = stepRefs.current.findIndex((el) => el === entry.target);
          if (index !== -1) setActiveIndex(index);
        });
      },
      { rootMargin: "-33% 0px -67% 0px", threshold: 0 },
    );
    stepRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="w-full py-16 md:py-24 lg:py-32 px-6">
      <div className="max-w-3xl mx-auto">

        {/* Section header */}
        <p className="text-xs uppercase tracking-[0.35em] text-primary/70 mb-4 font-medium">
          The Process
        </p>
        <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
          How It Works
        </h2>
        <p className="text-muted-foreground text-lg mb-10 md:mb-16 max-w-xl">
          Simple, transparent, and built around your results.
        </p>

        {/* Timeline steps */}
        <div className="space-y-12 md:space-y-16 lg:space-y-24">
          {steps.map((step, index) => {
            const isActive = index === activeIndex;

            return (
              <div
                key={step.number}
                ref={(el) => setStepRef(el, index)}
                className="relative flex flex-col gap-4 md:flex-row md:gap-16"
                aria-current={isActive ? "true" : "false"}
              >
                {/* Left: independently sticky label */}
                <div className="top-24 flex h-min w-full md:w-56 md:shrink-0 items-center gap-3 md:sticky">
                  <div
                    className={`p-2 rounded-lg transition-colors duration-300 ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-white/5 text-muted-foreground"
                    }`}
                  >
                    <step.icon className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={`text-sm font-medium font-heading transition-colors duration-300 ${
                        isActive ? "text-foreground" : "text-foreground/50"
                      }`}
                    >
                      {step.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {step.subtitle}
                    </span>
                  </div>
                </div>

                {/* Right: content card — expands when active */}
                <article
                  className={`flex flex-col rounded-2xl border p-6 transition-all duration-300 ${
                    isActive
                      ? "border-primary/30 bg-white/5 backdrop-blur-sm shadow-lg"
                      : "border-border/20 bg-white/[0.02]"
                  }`}
                >
                  <span
                    className={`font-heading text-5xl font-bold leading-none select-none mb-4 transition-colors duration-300 ${
                      isActive ? "text-primary/30" : "text-white/10"
                    }`}
                  >
                    {step.number}
                  </span>

                  <h3
                    className={`font-heading text-xl font-bold leading-snug mb-2 transition-colors duration-200 ${
                      isActive ? "text-foreground" : "text-foreground/60"
                    }`}
                  >
                    {step.title}
                  </h3>

                  <p
                    className={`text-sm leading-relaxed transition-colors duration-300 ${
                      isActive ? "text-muted-foreground" : "text-muted-foreground/60"
                    }`}
                  >
                    {step.description}
                  </p>

                  {/* Detail line fades in when active; height always reserved */}
                  <div
                    aria-hidden={!isActive}
                    className={`mt-4 transition-opacity duration-500 ease-out ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <p className="text-primary/80 text-xs font-medium uppercase tracking-wider">
                      {step.detail}
                    </p>
                  </div>
                </article>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
