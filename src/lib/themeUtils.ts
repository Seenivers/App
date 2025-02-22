import { themes } from '$lib';
import type { Settings } from './types/settings';

export function setTheme(theme: Settings['theme']) {
	if (!themes.includes(theme as Settings['theme'])) {
		console.warn(`Ungültiges Theme: ${theme}, Standard-Theme wird gesetzt.`);
		theme = 'default';
	}

	document.documentElement.setAttribute('data-theme', theme);
}
