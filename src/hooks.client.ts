import * as Sentry from '@sentry/sveltekit';
import { replayIntegration } from '@sentry/sveltekit';
import { handleErrorWithSentry } from '@sentry/sveltekit';

Sentry.init({
	enabled: true,
	dsn: 'https://4983cf9f418940b5a637ff576f3c8d4b@glitchtip.webretter.com/5',
	tracesSampleRate: 0.05, // 5 % aller Aktionen
	replaysSessionSampleRate: 0.05, // 5 % aller Sessions
	replaysOnErrorSampleRate: 1, // alle Fehler
	integrations: [
		replayIntegration({
			maxReplayDuration: 30_000, // 30 Sekunden
			blockAllMedia: true
		})
	],
	sendDefaultPii: false, // besser datenschutzfreundlich
	environment: import.meta.env.MODE,
	enableLogs: import.meta.env.PROD
});

export const handleError = handleErrorWithSentry();
