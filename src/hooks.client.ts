import { settings } from '$lib/stores.svelte';
import { handleErrorWithSentry, replayIntegration } from '@sentry/sveltekit';
import * as Sentry from '@sentry/sveltekit';

Sentry.init({
	enabled: settings.sentryEnabled,
	dsn: 'https://4983cf9f418940b5a637ff576f3c8d4b@glitchtip.webretter.com/5',
	tracesSampleRate: (settings.sentrySampleRate ?? 100) / 100,
	replaysSessionSampleRate: (settings.sentryReplaySampleRate ?? 0) / 100,
	replaysOnErrorSampleRate: (settings.sentryReplayOnErrorSampleRate ?? 100) / 100,
	integrations: [
		replayIntegration({
			maxReplayDuration: settings.sentryMaxReplayDuration,
			blockAllMedia: !!settings.sentryBlockAllMedia
		})
	],
	sendDefaultPii: !!settings.sentrySendDefaultPii,
	environment: import.meta.env.MODE,
	enableLogs: import.meta.env.PROD
});

export const handleError = handleErrorWithSentry();
