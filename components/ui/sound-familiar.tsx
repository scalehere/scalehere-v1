'use client';

import React from 'react';
import Lenis from 'lenis';
import { ZoomParallax } from '@/components/ui/zoom-parallax';

const panels = [
	{ type: 'center' as const },
	{ type: 'quote' as const, quote: 'More excuses than results.', sub: 'Always "we need more time, more budget." Month after month.' },
	{ type: 'quote' as const, quote: 'I spent thousands and got nothing.', sub: 'Reports full of clicks and impressions. Phone never rang.' },
	{ type: 'quote' as const, quote: 'They ghosted me after month one.', sub: 'Emails ignored. Account rep gone. Basic communication paywalled.' },
	{ type: 'quote' as const, quote: 'Cookie-cutter campaigns, copy-pasted.', sub: 'No strategy built around my business. Just a recycled formula.' },
	{ type: 'quote' as const, quote: 'They held my accounts hostage.', sub: "Couldn't access my own Google or Meta accounts when I left." },
	{ type: 'quote' as const, quote: 'I felt like a small fish.', sub: 'Pitched by the expert, handed off to the most junior person.' },
];

export function SoundFamiliar() {
	React.useEffect(() => {
		const lenis = new Lenis();

		function raf(time: number) {
			lenis.raf(time);
			requestAnimationFrame(raf);
		}

		requestAnimationFrame(raf);

		return () => lenis.destroy();
	}, []);

	return (
		<section>
			<ZoomParallax panels={panels} />
		</section>
	);
}
