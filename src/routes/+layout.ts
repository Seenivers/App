// Tauri doesn't have a Node.js server to do proper SSR
// so we will use adapter-static to prerender the app (SSG)
// See: https://v2.tauri.app/start/frontend/sveltekit/ for more info
export const prerender = true;
export const ssr = false;

import { browser } from '$app/environment';
import '$lib/i18n';
import { locale, locales, waitLocale } from 'svelte-i18n';
import type { LayoutLoad } from './$types';
import { error } from '@sveltejs/kit';
import { get } from 'svelte/store';

export const load: LayoutLoad = async () => {
	if (!browser) {
		error(500, 'This operation is only supported in the browser');
	}

	const { settings } = await import('$lib/stores.svelte');

	const userLang = window.navigator.language.split('-')[0];
	locale.set(get(locales).includes(settings.language) ? settings.language : userLang);

	await waitLocale();
};
