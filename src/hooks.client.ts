import { init, replayIntegration } from '@sentry/sveltekit';
import { handleErrorWithSentry } from '@sentry/sveltekit';

init({
	enabled: true,
	dsn: 'https://92496a96fb734b209acafa4fdb59de6f@glitchtip.seenivers.com/1',
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
