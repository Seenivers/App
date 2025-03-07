import type { Settings } from '../types/settings';

export function setTheme(theme: Settings['theme']) {
	document.documentElement.setAttribute('data-theme', theme);
}
