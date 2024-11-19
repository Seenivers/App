import type { Config } from 'tailwindcss';
import daisyui from 'daisyui';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {}
	},

	plugins: [daisyui],

	safelist: [
		'contents',
		'toast-start',
		'toast-center',
		'toast-end',
		'toast-top',
		'toast-middle',
		'toast-bottom',
		'alert-info',
		'alert-success',
		'alert-warning',
		'alert-error'
	]
} as Config;
