import type { Theme } from '$lib/types/settings';

export function setTheme(theme: Theme) {
	document.documentElement.setAttribute('data-theme', theme);
}
