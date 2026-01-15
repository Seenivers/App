import type { Settings } from '$lib/schema/settings';

export function setTheme(theme: Settings['theme']) {
	document.documentElement.setAttribute('data-theme', theme);
}
