import { browser } from '$app/environment';
import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

// Tauri doesn't have a Node.js server to do proper SSR
// so we will use adapter-static to prerender the app (SSG)
// See: https://v2.tauri.app/start/frontend/sveltekit/ for more info
export const prerender = true;
export const ssr = false;

export const load = (() => {
	if (!browser) {
		error(500, 'This operation is only supported in the browser');
	}
	if (!localStorage.getItem('PARAGLIDE_LOCALE')) {
		localStorage.setItem('PARAGLIDE_LOCALE', 'en');
	}

	return {};
}) satisfies LayoutLoad;
