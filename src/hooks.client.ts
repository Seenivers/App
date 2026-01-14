import { initSentry } from '$lib/utils/sentry';
import { handleErrorWithSentry } from '@sentry/sveltekit';

initSentry();

export const handleError = handleErrorWithSentry();
