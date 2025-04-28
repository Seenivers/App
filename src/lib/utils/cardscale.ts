import type { Cardscale } from '$lib/types/cardscale';
import { _ } from 'svelte-i18n';
import { get } from 'svelte/store';

export const scaleClasses = {
	1: { width: 'min-w-[8rem] max-w-[12rem]', text: 'text-base' },
	2: { width: 'min-w-[12rem] max-w-[18rem]', text: 'text-lg' },
	3: { width: 'min-w-[16rem] max-w-[24rem]', text: 'text-2xl' }
};

export const CARD_SCALE: Cardscale[] = [
	// @ts-expect-error This is fine
	{ number: 1, size: get(_)('cardscale.small') },
	// @ts-expect-error This is fine
	{ number: 2, size: get(_)('cardscale.medium') },
	// @ts-expect-error This is fine
	{ number: 3, size: get(_)('cardscale.large') }
];
