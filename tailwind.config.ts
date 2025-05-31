import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			minHeight: {
				unset: 'unset'
			},
			minWidth: {
				unset: 'unset'
			}
		}
	}
} satisfies Config;
