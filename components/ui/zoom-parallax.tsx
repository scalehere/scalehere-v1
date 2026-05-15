'use client';

import { useTransform, motion, useMotionValue, MotionValue } from 'motion/react';
import { useRef, useEffect, useState } from 'react';

export interface Quote {
	quote: string;
	sub: string;
}

export interface BodySegment {
	text: string;
	highlight?: 'primary' | 'bold' | 'italic-primary';
}

interface ZoomParallaxProps {
	quotes: Quote[];
	bodySegments?: BodySegment[];
	promiseLines?: BodySegment[][];
}

function getHighlightClass(highlight?: string): string {
	switch (highlight) {
		case 'primary': return 'text-primary font-bold';
		case 'bold': return 'font-bold text-foreground';
		case 'italic-primary': return 'italic text-primary font-bold';
		default: return 'text-muted-foreground';
	}
}


export function ZoomParallax({ quotes, bodySegments, promiseLines }: ZoomParallaxProps) {
	const container = useRef<HTMLDivElement>(null);
	const scrollYProgress = useMotionValue(0);
	const [bodyProgress, setBodyProgress] = useState(0);
	const [promiseProgress, setPromiseProgress] = useState(0);

	const BODY_START = 0.11;
	const BODY_END = 0.54;
	const PROMISE_START = 0.70;
	const PROMISE_END = 1.0;

	useEffect(() => {
		const updateProgress = () => {
			const el = container.current;
			if (!el) return;
			const rect = el.getBoundingClientRect();
			const totalScrollable = rect.height - window.innerHeight;
			const scrolled = -rect.top;
			const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));
			scrollYProgress.set(progress);

			const bodyP = (progress - BODY_START) / (BODY_END - BODY_START);
			setBodyProgress(Math.max(0, Math.min(1, bodyP)));

			const promP = (progress - PROMISE_START) / (PROMISE_END - PROMISE_START);
			setPromiseProgress(Math.max(0, Math.min(1, promP)));
		};

		window.addEventListener('scroll', updateProgress, { passive: true });
		updateProgress();
		return () => window.removeEventListener('scroll', updateProgress);
	}, [scrollYProgress]);

	// Center headline grows gently while quotes zoom past
	const scaleCenter = useTransform(scrollYProgress, [0, 1], [1, 2]);
	const scaleCenterMobile = useTransform(scrollYProgress, [0, 1], [1, 1.3]); // mobile — stays within viewport

	// Quote card scales — scale2 (subtle) through scale10 (rushes toward viewer)
	const scale2  = useTransform(scrollYProgress, [0, 1], [1,  2]);
	const scale3  = useTransform(scrollYProgress, [0, 1], [1,  3]);
	const scale4  = useTransform(scrollYProgress, [0, 1], [1,  4]);
	const scale5  = useTransform(scrollYProgress, [0, 1], [1,  5]);
	const scale6  = useTransform(scrollYProgress, [0, 1], [1,  6]);
	const scale7  = useTransform(scrollYProgress, [0, 1], [1,  7]);
	const scale8  = useTransform(scrollYProgress, [0, 1], [1,  8]);
	const scale9  = useTransform(scrollYProgress, [0, 1], [1,  9]);
	const scale10 = useTransform(scrollYProgress, [0, 1], [1, 10]);

	// Body text fades out as promise window opens — clean handoff
	const bodyFadeOut = useTransform(scrollYProgress, [0.66, 0.70], [1, 0]);

	// Per-segment opacity: each phrase fades in sequentially
	const N = bodySegments?.length ?? 0;
	const getSegmentOpacity = (i: number): number => {
		if (N === 0) return 1;
		const segStart = i / N;
		const segEnd = Math.min(1, (i + 1.5) / N);
		return Math.max(0, Math.min(1, (bodyProgress - segStart) / (segEnd - segStart)));
	};

	// Per-line opacity for the promise. For the 3-line case, hand-tuned timings
	// produce a linger AFTER line 2 finishes, before the climax line fades in.
	// Falls back to an even stagger for any other length.
	const L = promiseLines?.length ?? 0;
	const PROMISE_TIMINGS_3: Array<[number, number]> = [
		[0.00, 0.12], // Line 0 ("None of that happens here.") — snappy
		// LINGER 0.12 → 0.31 — Line 0 fully visible, matches the DBU linger below
		[0.31, 0.44], // Line 1 ("Don't believe us?")
		// LINGER 0.44 → 0.63 — DBU fully visible, climax invisible
		[0.63, 0.86], // Line 2 ("Let us show you.") — slow climax
		// POST-CLIMAX LINGER 0.86 → 1.0 — all lines visible before sticky releases
	];
	const getPromiseLineOpacity = (i: number): number => {
		if (L === 0) return 1;
		const [segStart, segEnd] = L === 3
			? PROMISE_TIMINGS_3[i]
			: [i / L, Math.min(1, (i + 1.5) / L)];
		return Math.max(0, Math.min(1, (promiseProgress - segStart) / (segEnd - segStart)));
	};

	// Center panel — accepts scale, optional outer class (vertical offset), optional content class (sizing)
	const makeCenterPanel = (scale: MotionValue<number>, extraClass = '', contentClass = 'w-[75vw] px-0') => (
		<motion.div
			style={{ scale }}
			className={`absolute inset-0 flex items-center justify-center z-20 pointer-events-none ${extraClass}`}
		>
			<div className={`flex flex-col items-center text-center ${contentClass}`}>
				<p className="text-xs uppercase tracking-[0.35em] text-primary/70 mb-4 font-medium">
					Sound Familiar?
				</p>
				<h2 className="font-heading text-2xl md:text-5xl font-bold leading-tight">
					Most Agencies Fail Their Clients.
				</h2>
				{(bodySegments || promiseLines) && (
					<div className="relative mt-6 h-40 w-full max-w-[68vw] md:max-w-[50vw]">
						{bodySegments && (
							<motion.div
								style={{ opacity: bodyFadeOut }}
								className="absolute inset-0 text-base md:text-lg leading-relaxed"
							>
								{bodySegments.map((seg, i) => (
									<span
										key={i}
										style={{
											opacity: getSegmentOpacity(i),
											transition: 'opacity 0.5s ease',
										}}
										className={`${getHighlightClass(seg.highlight)}${seg.highlight ? ' whitespace-nowrap' : ''}`}
									>
										{seg.text}
									</span>
								))}
							</motion.div>
						)}
						{promiseLines && (
							<div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-lg md:text-2xl text-foreground font-bold tracking-wide text-center">
								{promiseLines.map((lineSegments, lineIdx) => (
									<div
										key={lineIdx}
										style={{
											opacity: getPromiseLineOpacity(lineIdx),
											transition: 'opacity 0.5s ease',
										}}
										className={lineIdx === promiseLines.length - 1 ? 'mt-4' : ''}
									>
										{lineSegments.map((seg, segIdx) => (
											<span
												key={segIdx}
												className={seg.highlight ? getHighlightClass(seg.highlight) : ''}
											>
												{seg.text}
											</span>
										))}
									</div>
								))}
							</div>
						)}
					</div>
				)}
			</div>
		</motion.div>
	);

	// Shared zero motion value — used wherever a card needs no translate
	const zero = useMotionValue(0);

	// Mobile scale values — depth stepping: top far back, bottom closest
	const scaleMobile1 = useTransform(scrollYProgress, [0, 1], [1, 2]);
	const scaleMobile2 = useTransform(scrollYProgress, [0, 1], [1, 8]);
	const scaleMobile3 = useTransform(scrollYProgress, [0, 1], [1, 12]);

	// Mobile translate — middle drifts slightly left, bottom slightly right
	const mobileMidX    = useTransform(scrollYProgress, [0, 1], [0, -120]);
	const mobileBottomX = useTransform(scrollYProgress, [0, 1], [0,  120]);

	// ── MOBILE CARDS ───────────────────────────────────────────────────────────
	// Pick any 3 quotes by index — fully independent of tablet and desktop.
	const mobileCards = [
		{ quote: quotes[4], scale: scaleMobile1, x: zero,         y: zero, pos: '[&>div]:!-top-[38vh] [&>div]:!h-[14vh] [&>div]:!w-[78vw]' },
		{ quote: quotes[7], scale: scaleMobile2, x: mobileMidX,   y: zero, pos: '[&>div]:!top-[16vh] [&>div]:!h-[14vh] [&>div]:!w-[78vw]' },
		{ quote: quotes[5], scale: scaleMobile3, x: mobileBottomX,y: zero, pos: '[&>div]:!top-[33vh] [&>div]:!h-[14vh] [&>div]:!w-[78vw]' },
	];

	// Tablet scale — depth via stepping: row 1 far back, row 3 closest
	const scaleTablet1 = useTransform(scrollYProgress, [0, 1], [1, 3]);
	const scaleTablet2 = useTransform(scrollYProgress, [0, 1], [1, 5]);
	const scaleTablet3 = useTransform(scrollYProgress, [0, 1], [1, 8]);

	// Tablet translate — rows 2 and 3 same lateral speed, row 3 also drifts down
	const tabletXLeft  = useTransform(scrollYProgress, [0, 1], [0, -450]);
	const tabletXRight = useTransform(scrollYProgress, [0, 1], [0,  450]);
	const tabletYDown  = useTransform(scrollYProgress, [0, 1], [0,  280]);

	// ── TABLET CARDS ───────────────────────────────────────────────────────────
	// Pick any 6 quotes by index — fully independent of mobile and desktop.
	const tabletCards = [
		// Row 1 — scale only, no translate (far back)
		{ quote: quotes[2], scale: scaleTablet1, x: zero,        y: zero,       pos: '[&>div]:!-top-[38vh] [&>div]:!-left-[24vw] [&>div]:!h-[16vh] [&>div]:!w-[42vw]' },
		{ quote: quotes[0], scale: scaleTablet1, x: zero,        y: zero,       pos: '[&>div]:!-top-[38vh] [&>div]:!left-[24vw] [&>div]:!h-[16vh] [&>div]:!w-[42vw]' },
		// Row 2 — flies left/right, mid depth
		{ quote: quotes[4], scale: scaleTablet2, x: tabletXLeft, y: zero,       pos: '[&>div]:!top-[12vh] [&>div]:!-left-[24vw] [&>div]:!h-[16vh] [&>div]:!w-[42vw]' },
		{ quote: quotes[6], scale: scaleTablet2, x: tabletXRight,y: zero,       pos: '[&>div]:!top-[12vh] [&>div]:!left-[24vw] [&>div]:!h-[16vh] [&>div]:!w-[42vw]' },
		// Row 3 — same lateral speed as row 2, also drifts down, closest/most zoom
		{ quote: quotes[5], scale: scaleTablet3, x: tabletXLeft, y: tabletYDown,pos: '[&>div]:!top-[30vh] [&>div]:!-left-[24vw] [&>div]:!h-[16vh] [&>div]:!w-[42vw]' },
		{ quote: quotes[7], scale: scaleTablet3, x: tabletXRight,y: tabletYDown,pos: '[&>div]:!top-[30vh] [&>div]:!left-[24vw] [&>div]:!h-[16vh] [&>div]:!w-[42vw]' },
	];

	// ── DESKTOP CARDS ──────────────────────────────────────────────────────────
	// Scale only — depth conveyed through zoom, no directional translate.
	const desktopCards = [
		{ quote: quotes[2], scale: scale3, x: zero, y: zero, pos: '[&>div]:!-top-[20vh] [&>div]:!-left-[34vw] [&>div]:!h-[45vh] [&>div]:!w-[13vw] z-[3]'  }, // slot 1 — far-left tall
		{ quote: quotes[7], scale: scale5, x: zero, y: zero, pos: '[&>div]:!-top-[33vh] [&>div]:!-left-[8vw] [&>div]:!h-[18vh] [&>div]:!w-[30vw] z-[5]'   }, // slot 2 — top-left wide
		{ quote: quotes[3], scale: scale8, x: zero, y: zero, pos: '[&>div]:!-top-[6vh] [&>div]:!-left-[20vw] [&>div]:!h-[30vh] [&>div]:!w-[12vw] z-[8]'   }, // slot 3 — left narrow (tightest)
		{ quote: quotes[0], scale: scale4, x: zero, y: zero, pos: '[&>div]:!top-[22vh] [&>div]:!-left-[28vw] [&>div]:!h-[20vh] [&>div]:!w-[22vw] z-[4]'   }, // slot 4 — lower-left
		{ quote: quotes[1], scale: scale2, x: zero, y: zero, pos: '[&>div]:!-top-[36vh] [&>div]:!left-[25vw] [&>div]:!h-[18vh] [&>div]:!w-[26vw] z-[2]'   }, // slot 5 — top center-right
		{ quote: quotes[6], scale: scale4, x: zero, y: zero, pos: '[&>div]:!-top-[5vh] [&>div]:!left-[20vw] [&>div]:!h-[38vh] [&>div]:!w-[13vw] z-[4]'    }, // slot 6 — right narrow
		{ quote: quotes[5], scale: scale10, x: zero, y: zero, pos: '[&>div]:!top-[26vh] [&>div]:!left-[5vw] [&>div]:!h-[18vh] [&>div]:!w-[38vw] z-[10]'     }, // slot 7 — lower-right wide (closest)
		{ quote: quotes[4], scale: scale6, x: zero, y: zero, pos: '[&>div]:!top-[10vh] [&>div]:!left-[34vw] [&>div]:!h-[55vh] [&>div]:!w-[12vw] z-[6]'    }, // slot 8 — far-right tall
	];

	// Both layouts rendered simultaneously — CSS breakpoints toggle visibility
	// instantly on paint, eliminating the JS-state flash on page refresh.
	return (
		<div ref={container} className="relative h-[510vh]">

			{/* ── MOBILE LAYOUT (hidden at md+) ─────────────────────────────── */}
			<div className="md:hidden sticky top-0 h-screen overflow-hidden">
				{makeCenterPanel(scaleCenterMobile)}
				{mobileCards.map(({ quote, scale, x, y, pos }, i) => (
					<motion.div
						key={i}
						style={{ scale, x, y }}
						className={`absolute top-0 flex h-full w-full items-center justify-center ${pos}`}
					>
						<div className="relative flex flex-col justify-between p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
							<span className="absolute top-1 right-1 text-[17rem] leading-none text-primary/10 font-serif select-none">
								&ldquo;
							</span>
							<p style={{ fontSize: 'clamp(0.9rem, 3.5vw, 1.1rem)' }} className="italic text-foreground leading-snug relative z-10">
								&ldquo;{quote.quote}&rdquo;
							</p>
							<p style={{ fontSize: 'clamp(0.65rem, 2.8vw, 0.85rem)' }} className="text-muted-foreground leading-relaxed mt-2">
								{quote.sub}
							</p>
						</div>
					</motion.div>
				))}
			</div>

			{/* ── TABLET LAYOUT (md to lg) ──────────────────────────────────── */}
			<div className="hidden md:block lg:hidden sticky top-0 h-screen overflow-hidden">
				{makeCenterPanel(scaleCenterMobile, 'pb-[12vh]')}
				{tabletCards.map(({ quote, scale, x, y, pos }, i) => (
					<motion.div
						key={i}
						style={{ scale, x, y }}
						className={`absolute top-0 flex h-full w-full items-center justify-center ${pos}`}
					>
						<div className="relative flex flex-col justify-between p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
							<span className="absolute top-1 right-1 text-[17rem] leading-none text-primary/10 font-serif select-none">
								&ldquo;
							</span>
							<p style={{ fontSize: 'clamp(0.85rem, 2vw, 1.1rem)' }} className="italic text-foreground leading-snug relative z-10">
								&ldquo;{quote.quote}&rdquo;
							</p>
							<p style={{ fontSize: 'clamp(0.65rem, 1.5vw, 0.85rem)' }} className="text-muted-foreground leading-relaxed mt-2">
								{quote.sub}
							</p>
						</div>
					</motion.div>
				))}
			</div>

			{/* ── DESKTOP LAYOUT (hidden below lg) ──────────────────────────── */}
			<div className="hidden lg:block sticky top-0 h-screen overflow-hidden">
				{makeCenterPanel(scaleCenter, '', 'max-w-md px-8')}
				{desktopCards.map(({ quote, scale, x, y, pos }, i) => (
					<motion.div
						key={i}
						style={{ scale, x, y }}
						className={`absolute top-0 flex h-full w-full items-center justify-center ${pos}`}
					>
						<div className="relative flex flex-col justify-between p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
							<span className="absolute top-1 right-1 text-[17rem] leading-none text-primary/10 font-serif select-none">
								&ldquo;
							</span>
							<p style={{ fontSize: 'clamp(0.9rem, 1.5vw, 2.2rem)' }} className="italic text-foreground leading-snug relative z-10">
								&ldquo;{quote.quote}&rdquo;
							</p>
							<p style={{ fontSize: 'clamp(0.65rem, 0.85vw, 1rem)' }} className="text-muted-foreground leading-relaxed mt-2">
								{quote.sub}
							</p>
						</div>
					</motion.div>
				))}
			</div>

		</div>
	);
}
