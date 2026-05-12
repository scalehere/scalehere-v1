"use client"

import { useRef, useState } from 'react';
import { FaLinkedinIn, FaTwitter, FaInstagram } from 'react-icons/fa';
import { cn } from '@/lib/utils';

// ── Sizing knobs ──────────────────────────────────────────────────────────
// All per-card text + icon sizes live here. Edit a value, save, the browser
// hot-reloads. Format is mobile-first: `<mobile> md:<desktop>`. Bump the
// number inside the brackets / size-X scale and you're done.
//   text-[14px]   → name font size (14px on phones)
//   md:text-[16px] → name font size on tablet+ (≥768px wide)
//   size-4         → icon dimensions on mobile (16×16px; Tailwind scale)
//   size-5         → icon dimensions on desktop (20×20px)
//   p-2 / p-2.5    → padding inside each circular icon button
const NAME_TEXT = 'text-[16px] md:text-[18px]';   // peek + slide-up name
const ROLE_TEXT = 'text-[10px] md:text-[12px]';   // role label (uppercase, slide-up only)
const ICON_BTN  = 'p-2 md:p-2.5';                 // padding around each social icon
const ICON_SIZE = 'size-6 md:size-7';             // social icon width/height
const ICON_GAP  = 'gap-2 md:gap-2.5';             // spacing between social icons

// Contrast knobs for the slide-up panel (text-legibility against bright photos):
//   PEEK_GRADIENT     → fade behind always-visible name strip at card bottom
//   SLIDEUP_GRADIENT  → fade behind name+role+icons when card is active
//                       Format: from-<bottom> via-<mid> to-<top>. Black/90 ≈ near-opaque, /50 ≈ half.
//   SLIDEUP_FADE      → top padding = vertical height of the fade region. Bigger = softer transition.
const PEEK_GRADIENT    = 'bg-gradient-to-t from-black/90 to-transparent';
const SLIDEUP_GRADIENT = 'bg-gradient-to-t from-black/99 via-black/90 to-transparent';
const SLIDEUP_FADE     = 'pt-15';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
}

// Photos live in /public/team/ as firstname_lastname.webp (800×800).
// Pending handles are marked inline so we know what's still missing.
const TEAM: TeamMember[] = [
  {
    id: 'daniel-loarca',
    name: 'Daniel Loarca',
    role: 'Client Acquisition + Strategy',
    image: '/team/daniel_loarca.webp',
    social: {
      linkedin: 'https://www.linkedin.com/in/daniel-j-loarca-341a49205/',
      // instagram pending
    },
  },
  {
    id: 'ashenafew-daniel',
    name: 'Ashenafew Daniel',
    role: 'Media Buyer + Developer',
    image: '/team/ashenafew_daniel.webp',
    social: {
      linkedin: 'https://www.linkedin.com/in/ashenafew-daniel-33a416282/',
      instagram: 'https://www.instagram.com/ashenafew/',
    },
  },
  {
    id: 'justin-goff',
    name: 'Justin Goff',
    role: 'Project Manager + Sales',
    image: '/team/justin_goff.webp',
    social: {
      instagram: 'https://www.instagram.com/justintgoff/',
      // linkedin pending
    },
  },
  {
    id: 'peter-jung',
    name: 'Peter Jung',
    role: 'Ads Strategist + Systems',
    image: '/team/peter_jung.webp',
    social: {
      linkedin: 'https://www.linkedin.com/in/pjung12/',
      instagram: 'https://www.instagram.com/peterjung.ai/',
    },
  },
  {
    id: 'tad-jimenez',
    name: 'Tad Jimenez',
    role: 'AI Strategist + Designer',
    image: '/team/tad_jimenez.webp',
    social: {
      linkedin: 'https://www.linkedin.com/in/tadjimenez/',
      instagram: 'https://www.instagram.com/tadj.imenez/',
    },
  },
];

export default function TeamShowcase({ members = TEAM }: { members?: TeamMember[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  // Mobile: 2 columns, simple alternation.
  const mob1 = members.filter((_, i) => i % 2 === 0);
  const mob2 = members.filter((_, i) => i % 2 === 1);

  // Desktop: 2 rows — original trio on top, newer additions on bottom row
  // offset right. Adjust the slice when roster grows past 5.
  const dskTop = members.slice(0, 3);
  const dskBot = members.slice(3);

  const onHover = (id: string | null) => setActiveId(id);
  const onTap   = (id: string) => setActiveId(prev => prev === id ? null : id);

  return (
    <div className="flex justify-center w-full max-w-5xl mx-auto py-8 px-0 md:px-6 select-none" onClick={() => setActiveId(null)}>

      {/* ── Mobile layout: 2 columns ── */}
      <div className="flex gap-3 md:hidden">
        <div className="flex flex-col gap-3">
          {mob1.map(m => (
            <PhotoCard key={m.id} member={m} activeId={activeId} onHover={onHover} onTap={onTap}
              className="w-[130px] h-[148px] min-[375px]:w-[155px] min-[375px]:h-[175px]"
            />
          ))}
        </div>
        {/* Column 2 — offset down */}
        <div className="flex flex-col gap-3 mt-[56px]">
          {mob2.map(m => (
            <PhotoCard key={m.id} member={m} activeId={activeId} onHover={onHover} onTap={onTap}
              className="w-[140px] h-[158px] min-[375px]:w-[165px] min-[375px]:h-[185px]"
            />
          ))}
        </div>
      </div>

      {/* ── Desktop layout: 2 rows (mobile transposed) ── */}
      <div className="hidden md:flex flex-col gap-4 lg:gap-5">
        {/* Top row — 3 cards */}
        <div className="flex gap-4 lg:gap-5">
          {dskTop.map(m => (
            <PhotoCard key={m.id} member={m} activeId={activeId} onHover={onHover} onTap={onTap}
              className="md:w-[195px] md:h-[220px] lg:w-[240px] lg:h-[270px]"
            />
          ))}
        </div>
        {/* Bottom row — 2 cards offset right (horizontal analog of mobile's mt offset) */}
        <div className="flex gap-4 lg:gap-5 md:ml-[80px] lg:ml-[100px]">
          {dskBot.map(m => (
            <PhotoCard key={m.id} member={m} activeId={activeId} onHover={onHover} onTap={onTap}
              className="md:w-[210px] md:h-[235px] lg:w-[255px] lg:h-[285px]"
            />
          ))}
        </div>
      </div>

    </div>
  );
}

/* ─────────────────────────────────────────
   Photo card with slide-up info strip
───────────────────────────────────────── */

function PhotoCard({
  member, className, activeId, onHover, onTap,
}: {
  member: TeamMember;
  className: string;
  activeId: string | null;
  onHover: (id: string | null) => void;
  onTap: (id: string) => void;
}) {
  const isActive = activeId === member.id;
  const isDimmed = activeId !== null && !isActive;
  const hasSocial = member.social?.twitter ?? member.social?.linkedin ?? member.social?.instagram;

  // Track touchstart Y so we can distinguish a tap from a scroll in touchEnd.
  // Without this, onTouchEnd fires after any vertical scroll that started on a
  // card, accidentally toggling the slide-up strip.
  const touchStartY = useRef<number | null>(null);

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl cursor-pointer flex-shrink-0 transition-opacity duration-300',
        className,
        isDimmed ? 'opacity-50' : 'opacity-100',
      )}
      onMouseEnter={() => onHover(member.id)}
      onMouseLeave={() => onHover(null)}
      onTouchStart={(e) => { touchStartY.current = e.touches[0].clientY; }}
      onTouchEnd={(e) => {
        // Tap landed on a social link — let the anchor's default click fire.
        // Without this, the preventDefault() below cancels the synthetic click
        // and the link never opens on touch devices.
        if ((e.target as HTMLElement).closest('a')) {
          touchStartY.current = null;
          return;
        }
        const startY = touchStartY.current;
        const endY = e.changedTouches[0].clientY;
        touchStartY.current = null;
        // > 10px vertical movement = scroll, not tap — leave default behavior alone
        if (startY !== null && Math.abs(endY - startY) > 10) return;
        e.preventDefault();
        onTap(member.id);
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <img
        src={member.image}
        alt={member.name}
        className="w-full h-full object-cover transition-[filter] duration-500"
        style={{
          filter: isDimmed ? 'grayscale(1) brightness(0.77)' : 'grayscale(0) brightness(1)',
        }}
      />

      {/* Peek — name always visible at bottom on all devices, hides when full strip is active */}
      <div className={cn("absolute bottom-0 inset-x-0 px-3 pb-2.5 pt-6", PEEK_GRADIENT, isActive && "hidden")}>
        <p className={cn("text-white font-bold leading-tight", NAME_TEXT)}>
          {member.name}
        </p>
      </div>

      {/* Full info strip — slides up on tap (mobile) or hover (desktop)
          Covers the peek div when active                                  */}
      <div className={cn(
        'absolute bottom-0 inset-x-0 px-3 pb-3',
        SLIDEUP_FADE,
        SLIDEUP_GRADIENT,
        'transition-transform duration-300 ease-out',
        isActive ? 'translate-y-0' : 'translate-y-full',
      )}>
        <p className={cn("text-white font-bold leading-tight", NAME_TEXT)}>
          {member.name}
        </p>
        <p className={cn("text-white/65 uppercase tracking-[0.14em] font-medium mt-1 leading-snug", ROLE_TEXT)}>
          {member.role}
        </p>

        {hasSocial && (
          <div className={cn("flex items-center mt-2.5", ICON_GAP)}>
            {member.social?.twitter && (
              <a href={member.social.twitter} target="_blank" rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className={cn("rounded-full bg-white/10 text-white/70 hover:bg-primary/20 hover:text-primary transition-colors duration-150", ICON_BTN)}>
                <FaTwitter className={ICON_SIZE} />
              </a>
            )}
            {member.social?.linkedin && (
              <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className={cn("rounded-full bg-white/10 text-white/70 hover:bg-primary/20 hover:text-primary transition-colors duration-150", ICON_BTN)}>
                <FaLinkedinIn className={ICON_SIZE} />
              </a>
            )}
            {member.social?.instagram && (
              <a href={member.social.instagram} target="_blank" rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className={cn("rounded-full bg-white/10 text-white/70 hover:bg-primary/20 hover:text-primary transition-colors duration-150", ICON_BTN)}>
                <FaInstagram className={ICON_SIZE} />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
