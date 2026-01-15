import { db } from '$lib/db/database';
import { settings } from '$lib/db/schema';
import type { Settings } from '$lib/schema/settings';

export async function loadSettingsFromDb() {
	const rows = await db.select().from(settings);
	return Object.fromEntries(rows.map((s) => [s.key, JSON.parse(s.value)]));
}

export async function saveSettingsToDb(newSettings: Partial<Settings>) {
	if (Object.keys(newSettings).length === 0) return;

	try {
		for (const [key, value] of Object.entries(newSettings) as [
			keyof Settings,
			Settings[keyof Settings]
		][]) {
			await db
				.insert(settings)
				.values({
					key,
					value: JSON.stringify(value)
				})
				.onConflictDoUpdate({
					target: settings.key,
					set: { value: JSON.stringify(value) }
				});
		}
	} catch (error) {
		console.error('Fehler beim Speichern der Settings:', error);
	}
}
