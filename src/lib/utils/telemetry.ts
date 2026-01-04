import { seeniversURL } from '$lib';
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

/* ================================
 * Endpoints
 * ================================ */
const START_ENDPOINT = seeniversURL + '/api/client/session/start';
const END_ENDPOINT = seeniversURL + '/api/client/session/end';

/* ================================
 * Helpers
 * ================================ */
async function postJson<T>(url: string, data: unknown): Promise<T> {
	const res = await fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
		credentials: 'include'
	});

	if (!res.ok) {
		throw new Error(`Telemetry request failed: ${res.status}`);
	}

	return res.json() as Promise<T>;
}

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
	if (!online.current) return;
	const env = await collectClientEnvironment();

	const res = await postJson<{ clientId: string; sessionId: string }>(START_ENDPOINT, {
		clientId,
		sessionId,
		...env
	});

	clientId = res.clientId;
	sessionId = res.sessionId;

	// IDs speichern
	localStorage.setItem('clientId', clientId);
	sessionStorage.setItem('sessionId', sessionId);
}

/**
 * Beendet die Client-Session.
 */
export async function endClientSession(): Promise<void> {
	if (!sessionId || !online.current) return;

	await postJson(END_ENDPOINT, { clientId, sessionId });

	sessionStorage.removeItem('sessionId');
	sessionId = null;
}
