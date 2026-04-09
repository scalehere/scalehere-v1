'use client';

import { useScroll, useTransform, motion } from 'motion/react';
import { useRef } from 'react';

interface Panel {
	type: 'center' | 'quote';
	quote?: string;
	sub?: string;
}

interface ZoomParallaxProps {
	panels: Panel[];
}

export function ZoomParallax({ panels }: ZoomParallaxProps) {
	const container = useRef(null);
	const { scrollYProgress } = useScroll({
		target: container,
		offset: ['start start', 'end end'],
	});

	const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
	const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
	const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
	const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
	const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);

	const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

	return (
		<div ref={container} className="relative h-[300vh]">
			<div className="sticky top-0 h-screen overflow-hidden">
				{panels.map((panel, index) => {
					const scale = scales[index % scales.length];

					return (
						<motion.div
							key={index}
							style={{ scale }}
							className={`absolute top-0 flex h-full w-full items-center justify-center ${index === 1 ? '[&>div]:!-top-[30vh] [&>div]:!left-[5vw] [&>div]:!h-[30vh] [&>div]:!w-[35vw]' : ''} ${index === 2 ? '[&>div]:!-top-[10vh] [&>div]:!-left-[25vw] [&>div]:!h-[45vh] [&>div]:!w-[20vw]' : ''} ${index === 3 ? '[&>div]:!left-[27.5vw] [&>div]:!h-[25vh] [&>div]:!w-[25vw]' : ''} ${index === 4 ? '[&>div]:!top-[27.5vh] [&>div]:!left-[5vw] [&>div]:!h-[25vh] [&>div]:!w-[20vw]' : ''} ${index === 5 ? '[&>div]:!top-[27.5vh] [&>div]:!-left-[22.5vw] [&>div]:!h-[25vh] [&>div]:!w-[30vw]' : ''} ${index === 6 ? '[&>div]:!top-[22.5vh] [&>div]:!left-[25vw] [&>div]:!h-[15vh] [&>div]:!w-[15vw]' : ''}`}
						>
							{panel.type === 'center' ? (
								<div className="relative h-[25vh] w-[25vw] flex flex-col items-center justify-center text-center">
									<p className="text-xs uppercase tracking-[0.35em] text-primary/70 mb-2 font-medium">
										Sound Familiar?
									</p>
									<h2 className="font-heading text-2xl md:text-4xl font-bold leading-tight">
										Most Agencies Fail Their Clients.
									</h2>
								</div>
							) : (
								<div className="relative h-[25vh] w-[25vw] flex flex-col justify-center p-5 rounded-xl border border-border/40 bg-background/90 backdrop-blur-sm">
									<p className="font-accent italic font-semibold text-foreground text-sm md:text-base leading-snug mb-2">
										&ldquo;{panel.quote}&rdquo;
									</p>
									<p className="text-muted-foreground text-xs leading-relaxed">
										{panel.sub}
									</p>
								</div>
							)}
						</motion.div>
					);
				})}
			</div>
		</div>
	);
}
