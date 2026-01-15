import { initSentry } from '$lib/utils/sentry';
import { initSettings } from '$lib/utils/settings/state';
import { handleErrorWithSentry } from '@sentry/sveltekit';

await initSettings();

initSentry();

export const handleError = handleErrorWithSentry();
