import { settingsSchema, type Settings } from '$lib/schema/settings';
import { loadSettingsFromDb, saveSettingsToDb } from './storage';

let settings: Settings | null = null;

export async function initSettings() {
	if (settings) return settings;

	const raw = await loadSettingsFromDb();
	settings = settingsSchema.parse(raw);
	return settings;
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

	await saveSettingsToDb(patch);
	settings = next;
}
