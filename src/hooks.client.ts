import { getSettings } from '$lib/utils/settings/state';
import * as Sentry from '@sentry/sveltekit';
import { replayIntegration } from '@sentry/sveltekit';
import { handleErrorWithSentry } from '@sentry/sveltekit';

const settings = getSettings();

Sentry.init({
	enabled: settings.sentryEnabled,
	dsn: 'https://4983cf9f418940b5a637ff576f3c8d4b@glitchtip.webretter.com/5',
	tracesSampleRate: settings.sentrySampleRate / 100,
	replaysSessionSampleRate: settings.sentryReplaySampleRate / 100,
	replaysOnErrorSampleRate: settings.sentryReplayOnErrorSampleRate / 100,
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
