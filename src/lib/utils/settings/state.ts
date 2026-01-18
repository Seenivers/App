import { settingsSchema, type Settings } from '$lib/schema/settings';
import { loadSettingsFromDb, saveSettingsToDb } from './storage';

let settings: Settings = settingsSchema.parse({});
let init = false;

export async function initSettings() {
	if (init) return;
	init = true;

	const raw = await loadSettingsFromDb();
	settings = settingsSchema.parse(raw);
	applySettings();
}

export function getSettings(): Settings {
	if (!settings) {
		throw new Error('Settings nicht initialisiert. initSettings() fehlt.');
	}
	return settings;
}

export async function saveSettings(patch: Partial<Settings>) {
	const current = getSettings();

	const next = settingsSchema.parse({
		...current,
		...patch
	});

	settings = next;
	applySettings();
	await saveSettingsToDb(patch);
}

import { setTheme } from '$lib/utils/themeUtils';
import * as Sentry from '@sentry/sveltekit';
import { getLocale } from '$lib/paraglide/runtime';

function applySettings() {
	// UI
	setTheme(settings.theme);

	// --- Telemetrie ---
	const client = Sentry.getClient();
	if (!client) return;

	const options = client.getOptions();

	// Global Enable / Disable
	options.enabled = !!settings.sentryEnabled;

	// Tracing (runtime-safe)
	options.tracesSampleRate = settings.sentrySampleRate / 100;

	// PII
	options.sendDefaultPii = !!settings.sentrySendDefaultPii;

	// Kontext setzen (dafür ist Scope gedacht)
	Sentry.getCurrentScope().setContext('settings', {
		sentryEnabled: settings.sentryEnabled,
		theme: settings.theme,
		language: getLocale(),
		replayEnabled: settings.sentryReplaySampleRate > 0
	});
}
