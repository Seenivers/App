import { init, register } from 'svelte-i18n';

register('af', () => import('./locales/af.json'));
register('ar', () => import('./locales/ar.json'));
register('ca', () => import('./locales/ca.json'));
register('cs', () => import('./locales/cs.json'));
register('da', () => import('./locales/da.json'));
register('de', () => import('./locales/de.json'));
register('el', () => import('./locales/el.json'));
register('en', () => import('./locales/en.json'));
register('es', () => import('./locales/es.json'));
register('fi', () => import('./locales/fi.json'));
register('fr', () => import('./locales/fr.json'));
register('he', () => import('./locales/he.json'));
register('hu', () => import('./locales/hu.json'));
register('it', () => import('./locales/it.json'));
register('ja', () => import('./locales/ja.json'));
register('ko', () => import('./locales/ko.json'));
register('nl', () => import('./locales/nl.json'));
register('no', () => import('./locales/no.json'));
register('pl', () => import('./locales/pl.json'));
register('pt', () => import('./locales/pt.json'));
register('ro', () => import('./locales/ro.json'));
register('ru', () => import('./locales/ru.json'));
register('sr', () => import('./locales/sr.json'));
register('sv', () => import('./locales/sv.json'));
register('tr', () => import('./locales/tr.json'));
register('uk', () => import('./locales/uk.json'));
register('vi', () => import('./locales/vi.json'));
register('zh', () => import('./locales/zh.json'));

init({
	fallbackLocale: 'en',
	initialLocale: 'en'
});
