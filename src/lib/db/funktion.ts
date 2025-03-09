import { schema } from '$lib/db/schema';
import { db } from '$lib/db/database';
import { migrate } from '$lib/db/migrate';
import { updateActors, updateCollections, updateMovies, updateOldDB } from './update';
import { setTheme } from '$lib/utils/themeUtils';

async function createDefaultSettings() {
	const language = navigator.language.substring(0, 2);
	await db.insert(schema.settings).values({ id: 1, language });
	return (await db.select().from(schema.settings).limit(1))[0];
}

/**
 * Initialisiert die Settings nur einmal und speichert sie in `loadedSettings`.
 */
async function initializeSettings() {
	await migrate();

	const settings = await db.select().from(schema.settings).limit(1);
	return settings[0] ?? (await createDefaultSettings());
}

/**
 * Exportiert die `settings`-Variable, die einmalig geladen und synchron zugänglich ist.
 */
export const settings = await initializeSettings();

(async () => {
	setTheme(settings.theme);
	if (settings && import.meta.env.PROD) {
		await updateOldDB();
		await updateMovies();
		await updateCollections();
		await updateActors();
	}
})();
