import { browser } from '$app/environment';
import { init, register } from 'svelte-i18n';

const defaultLocale = 'default';

register('de', () => import('./locales/default.json'));

init({
	fallbackLocale: defaultLocale,
	initialLocale: defaultLocale
});
