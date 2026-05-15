'use client';

import { ZoomParallax, type Quote, type BodySegment } from '@/components/ui/zoom-parallax';

// All available quotes — assign to any layout slot freely.
// Changing a quote here only affects the layouts that reference its index.
const quotes: Quote[] = [
	{ quote: 'I never knew what I was paying for.', sub: 'Never got a straight answer. I just had to trust them.' },                            // 0
	{ quote: 'Same copy-paste ads they run for everybody.', sub: 'None of it was made specifically for me.' },                                  // 1
	{ quote: 'I was just another small account to them.', sub: 'The expert won me over but then gave it to a rookie.' },                        // 2
	{ quote: 'More excuses than results.', sub: "Every month: 'give it more time, give us more budget.'" },                                     // 3
	{ quote: 'They disappeared after the first invoice.', sub: "Couldn't get a call back. Couldn't even get an email." },                       // 4
	{ quote: "I paid for all of it, but I didn't own any of it.", sub: 'When I left, they kept the accounts. I started from zero.' },           // 5
	{ quote: 'Signed for a year. Regretted it by month two.', sub: "Couldn't get out. I was stuck paying for nothing." },                       // 6
	{ quote: 'Paid them thousands. Barely anything booked.', sub: 'Reports full of clicks and views. My calendar stayed empty.' },              // 7
];

// Each segment fades in sequentially. Highlighted phrases draw the eye.
const bodySegments: BodySegment[] = [
	{ text: 'They sell you on a ' },
	{ text: '"very big"', highlight: 'primary' },
	{ text: ' plan, send a bunch of ' },
	{ text: 'confusing reports', highlight: 'primary' },
	{ text: ', and ' },
	{ text: 'disappear', highlight: 'primary' },
	{ text: " as soon as you start asking real questions. When it's over, your calendar is " },
	{ text: 'just as empty', highlight: 'primary' },
	{ text: ' as it was before you even hired them.' },
];

// Each inner array = one line. Lines fade in sequentially; highlighted spans draw the eye within each line.
const promiseLines: BodySegment[][] = [
	[{ text: 'None of that happens ' }, { text: 'here', highlight: 'primary' }, { text: '.' }],
	[{ text: "Don't believe us?" }],
	[{ text: 'Let us show you.', highlight: 'primary' }],
];

export function SoundFamiliar() {
	return (
		<section>
			<ZoomParallax
				quotes={quotes}
				bodySegments={bodySegments}
				promiseLines={promiseLines}
			/>
		</section>
	);
}
