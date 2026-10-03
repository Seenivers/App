import { settingsSchema, type Settings } from '$lib/schema/settings';
import { loadSettingsFromDb, saveSettingsToDb } from './storage';
import { setTheme } from '$lib/utils/themeUtils';

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

function applySettings() {
	setTheme(settings.theme);
}
