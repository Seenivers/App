import type { Cardscale } from '$lib/types/cardscale';

export const scaleClasses = {
	1: { width: 'min-w-32 max-w-48', text: 'text-base' },
	2: { width: 'min-w-48 max-w-[18rem]', text: 'text-lg' },
	3: { width: 'min-w-[16rem] max-w-[24rem]', text: 'text-2xl' }
};

export const CARD_SCALE: Cardscale[] = [
	{ number: 1, size: 'Small' },
	{ number: 2, size: 'Medium' },
	{ number: 3, size: 'Large' }
];
