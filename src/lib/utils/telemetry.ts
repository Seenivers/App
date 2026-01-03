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

let sessionId: string;

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
 * Internal helpers
 * ================================ */

const START_ENDPOINT = seeniversURL + '/api/client/session/start';
const END_ENDPOINT = seeniversURL + '/api/client/session/end';

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

/* ================================
 * Environment collector (Tauri)
 * ================================ */

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
 * Public API (Client)
 * ================================ */

/**
 * Startet eine neue Client-Session (Tauri).
 */
export async function startClientSession(): Promise<void> {
	const env = await collectClientEnvironment();
	sessionId = (await postJson<{ sessionId: string }>(START_ENDPOINT, env)).sessionId;
}

/**
 * Beendet eine Client-Session.
 * Wird beim App-Close verwendet.
 */
export function endClientSession(): void {
	if (!sessionId) {
		throw new Error('No sessionId set.');
	}

	if (navigator.sendBeacon) {
		const blob = new Blob([JSON.stringify({ sessionId })], { type: 'application/json' });

		navigator.sendBeacon(END_ENDPOINT, blob);
		return;
	}

	void fetch(END_ENDPOINT, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ sessionId }),
		credentials: 'include'
	});
}
