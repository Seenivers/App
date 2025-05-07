import { init, register } from 'svelte-i18n';

export const fallbackLocale = 'default';
const initialLocale = 'en';

register(fallbackLocale, () => import('./locales/default.json'));
register('de', () => import('./locales/de.json'));

init({
	fallbackLocale,
	initialLocale
});
