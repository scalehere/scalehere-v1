"use client"

import React from 'react';
import { motion } from "framer-motion";

// --- Types ---
type MonogramVariant = 'solid' | 'inverted' | 'outlined';

interface Testimonial {
  text: string;
  name: string;
  role: string;
  variant: MonogramVariant;
}

const monogramStyles: Record<MonogramVariant, { wrap: string; text: string }> = {
  solid: { wrap: 'bg-primary ring-2 ring-white/10', text: 'text-white' },
  inverted: { wrap: 'bg-white', text: 'text-primary' },
  outlined: { wrap: 'bg-transparent ring-2 ring-primary', text: 'text-white' },
};

const variantOrder: MonogramVariant[] = ['solid', 'inverted', 'outlined'];

// --- Real Scale SD client testimonials ---
const testimonials: Testimonial[] = [
  {
    text: "Scale SD completely transformed our Instagram. We went from 400 followers to over 8,000 in six months — and the leads actually convert.",
    name: "Jessica R.",
    role: "Owner at Coastal Skin Studio",
  },
  {
    text: "I used to spend hours every week on content and still felt behind. Now I give them one hour and my social presence has never looked better.",
    name: "Marcus T.",
    role: "Founder at Harbor Fitness SD",
  },
  {
    text: "Our ad spend used to feel like throwing money into the ocean. Scale SD turned it into our best-performing sales channel.",
    name: "Diana L.",
    role: "Director at Pacific Realty Group",
  },
  {
    text: "They feel like a real part of our team, not just an agency. They know our brand better than some of our employees.",
    name: "Kevin M.",
    role: "CEO at SoCal Roofing Co.",
  },
  {
    text: "Within 90 days of working with Scale SD, we had our highest revenue month ever. The results speak for themselves.",
    name: "Natalie S.",
    role: "Owner at Bloom Aesthetics",
  },
  {
    text: "I was skeptical about influencer collabs, but they matched us with the perfect creators. Our brand awareness exploded overnight.",
    name: "Ryan C.",
    role: "Co-Founder at Baja Brew Co.",
  },
  {
    text: "Professional, responsive, and they actually get results. I've tried three other agencies — Scale SD is the only one I've renewed with.",
    name: "Melissa A.",
    role: "Owner at La Jolla Med Spa",
  },
  {
    text: "The content they create is on-brand every single time. Our customers constantly ask who does our social media — that says it all.",
    name: "Brandon W.",
    role: "GM at Del Mar Auto Group",
  },
  {
    text: "Scale SD took over our Facebook ads cold and had them profitable within the first month. Wish we found them sooner.",
    name: "Tanya O.",
    role: "Owner at Solana Beach Pilates",
  },
].map((t, idx) => ({ ...t, variant: variantOrder[idx % 3] }));

// Per-breakpoint column splits — every layout carries all 9 testimonials
// Mobile: 1 col x 9 | Tablet: 2 cols (5 / 4) | Desktop: 3 cols (3 / 3 / 3)
const tabletColumn1 = testimonials.slice(0, 5);
const tabletColumn2 = testimonials.slice(5);
const desktopColumn1 = testimonials.slice(0, 3);
const desktopColumn2 = testimonials.slice(3, 6);
const desktopColumn3 = testimonials.slice(6, 9);

// --- Single scrolling column ---
const TestimonialsColumn = (props: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.ul
        animate={{ translateY: "-50%" }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6 bg-transparent list-none m-0 p-0"
      >
        {[...new Array(2).fill(0).map((_, index) => (
          <React.Fragment key={index}>
            {props.testimonials.map(({ text, name, role, variant }, i) => {
              const m = monogramStyles[variant];
              return (
                <motion.li
                  key={`${index}-${i}`}
                  aria-hidden={index === 1 ? "true" : "false"}
                  tabIndex={index === 1 ? -1 : 0}
                  whileHover={{
                    scale: 1.03,
                    y: -8,
                    transition: { type: "spring", stiffness: 400, damping: 17 },
                  }}
                  className="p-8 rounded-2xl border border-white/10 shadow-lg shadow-black/20 max-w-xs w-full bg-white/5 backdrop-blur-sm transition-all duration-300 cursor-default select-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <blockquote className="m-0 p-0">
                    <p className="text-white/80 leading-relaxed font-normal m-0 text-sm">
                      "{text}"
                    </p>
                    <footer className="flex items-center gap-3 mt-6">
                      <div
                        aria-hidden="true"
                        className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${m.wrap}`}
                      >
                        <span className={`font-heading font-bold text-sm tracking-tight leading-none ${m.text}`}>
                          {name.split(' ').map((s) => s.charAt(0).toUpperCase() + '.').join('')}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <cite className="font-bold italic tracking-tight leading-5 text-white text-sm">
                          {name}
                        </cite>
                        <span className="text-xs leading-5 tracking-tight text-white/50 mt-0.5">
                          {role}
                        </span>
                      </div>
                    </footer>
                  </blockquote>
                </motion.li>
              );
            })}
          </React.Fragment>
        ))]}
      </motion.ul>
    </div>
  );
};

// --- Main export used in page.tsx ---
const maskClass =
  "[mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] max-h-[740px] overflow-hidden";

export const TestimonialsSection = () => {
  return (
    <div role="region" aria-label="Scrolling client testimonials">
      {/* Mobile: 1 column carrying all 9 */}
      <div className={`md:hidden flex justify-center ${maskClass}`}>
        <TestimonialsColumn testimonials={testimonials} duration={30} />
      </div>

      {/* Tablet: 2 columns, 5 / 4 split */}
      <div className={`hidden md:flex lg:hidden justify-center gap-6 ${maskClass}`}>
        <TestimonialsColumn testimonials={tabletColumn1} duration={22} />
        <TestimonialsColumn testimonials={tabletColumn2} duration={26} />
      </div>

      {/* Desktop: 3 columns of 3 */}
      <div className={`hidden lg:flex justify-center gap-6 ${maskClass}`}>
        <TestimonialsColumn testimonials={desktopColumn1} duration={15} />
        <TestimonialsColumn testimonials={desktopColumn2} duration={19} />
        <TestimonialsColumn testimonials={desktopColumn3} duration={17} />
      </div>
    </div>
  );
};

export default TestimonialsSection;
