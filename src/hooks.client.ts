import { handleErrorWithSentry, replayIntegration } from '@sentry/sveltekit';
import * as Sentry from '@sentry/sveltekit';

Sentry.init({
	dsn: 'https://4983cf9f418940b5a637ff576f3c8d4b@glitchtip.webretter.com/5',

	environment: import.meta.env.MODE,

	tracesSampleRate: 1.0,

	// Enable logs to be sent to Sentry
	enableLogs: import.meta.env.PROD,

	// This sets the sample rate to be 10%. You may want this to be 100% while
	// in development and sample at a lower rate in production
	replaysSessionSampleRate: import.meta.env.PROD ? 0.1 : 0.0,

	// If the entire session is not sampled, use the below sample rate to sample
	// sessions when an error occurs.
	replaysOnErrorSampleRate: import.meta.env.PROD ? 1.0 : 0.0,

	integrations: [
		replayIntegration({
			maxReplayDuration: 60 * 1000, // 1 minutes
			blockAllMedia: true
		})
	],

	// Enable sending user PII (Personally Identifiable Information)
	// https://docs.sentry.io/platforms/javascript/guides/sveltekit/configuration/options/#sendDefaultPii
	sendDefaultPii: true
});

// If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError = handleErrorWithSentry();
