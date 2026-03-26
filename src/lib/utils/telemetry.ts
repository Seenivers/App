import * as Sentry from '@sentry/sveltekit';
import { app } from '@tauri-apps/api';
import {
	arch,
	family,
	platform,
	type as osType,
	version,
	hostname,
	locale
} from '@tauri-apps/plugin-os';
import { online } from 'svelte/reactivity/window';
import { api } from '$lib/trpc';

let sessionId: string | null = sessionStorage.getItem('sessionId');
let clientId: string | null = localStorage.getItem('clientId');

/* ================================
 * Types
 * ================================ */
export type ClientEnvironment = {
	appVersion: string;

	platform: ReturnType<typeof platform>;
	os: ReturnType<typeof osType>;
	osVersion: string;
	family: ReturnType<typeof family>;
	arch: ReturnType<typeof arch>;

	hostname?: string | null;
	locale?: string | null;
};

async function collectClientEnvironment(): Promise<ClientEnvironment> {
	return {
		appVersion: await app.getVersion(),

		platform: platform(),
		os: osType(),
		osVersion: version(),
		family: family(),
		arch: arch(),

		hostname: await hostname(),
		locale: await locale()
	};
}

/* ================================
 * Public API
 * ================================ */

/**
 * Startet eine neue Client-Session (Tauri).
 */
export async function startClientSession(): Promise<void> {
	if (!online.current || import.meta.env.PROD) return;

	const env = await collectClientEnvironment();
	const res = await api.telemetry.startSession.mutate({
		clientId,
		sessionId,
		...env
	});

	clientId = res.clientId;
	sessionId = res.sessionId;

	Sentry.withScope((scope) => {
		scope.setUser({ id: clientId?.toString() });

		scope.setTag('session_id', sessionId);
		scope.setTag('runtime', 'tauri');

		scope.setContext('client', {
			clientId,
			sessionId,
			appVersion: env.appVersion
		});

		scope.setContext('os', env);
	});

	localStorage.setItem('clientId', clientId);
	sessionStorage.setItem('sessionId', sessionId);
}

/**
 * Beendet die Client-Session.
 */
export async function endClientSession(): Promise<void> {
	if (!sessionId || !online.current || import.meta.env.PROD) return;

	await api.telemetry.endSession.mutate({ clientId, sessionId });

	sessionStorage.removeItem('sessionId');
	sessionId = null;
}
