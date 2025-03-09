import { schema } from '$lib/db/schema';
import { error } from '@tauri-apps/plugin-log';
import { eq } from 'drizzle-orm';
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

/**
 * Get Actor from db
 */
export async function getActor(id: number) {
	return await db.query.actors.findFirst({ where: eq(schema.actors.id, id) }).catch((err) => {
		error('Get Actor: ' + err);
	});
}

/**
 * Add Actor to db
 */
export async function addActor(data: typeof schema.actors.$inferInsert) {
	return await db
		.insert(schema.actors)
		.values(data)
		.catch((err) => {
			error('Add Actor: ' + err);
		});
}

/**
 * Get all actors from db
 */
export async function getAllActors(): Promise<void | (typeof schema.actors.$inferSelect)[]> {
	return await db
		.select()
		.from(schema.actors)
		.catch((err) => {
			error('Get All Actors: ' + err);
		});
}

export async function deleteActor(id: number) {
	return await db
		.delete(schema.actors)
		.where(eq(schema.actors.id, id))
		.catch((err) => {
			error(`Delete Actor: ` + err);
		});
}

export async function updateActor(id: number, data: typeof schema.actors.$inferInsert) {
	return await db
		.update(schema.actors)
		.set(data)
		.where(eq(schema.actors.id, id))
		.catch((err) => {
			error(`Update Actor: ` + err);
		});
}

export async function isActorIDUnique(id: number): Promise<boolean> {
	const existingActor = await getActor(id);
	return !existingActor;
}

export async function isSeriePathUnique(path: string): Promise<boolean> {
	const existingSerie = await db.query.serie
		.findFirst({
			where: eq(schema.serie.path, path)
		})
		.catch((err) => {
			error(`Is Path Unique: ` + err);
		});

	// Gibt `true` zurück, wenn keine Serie mit diesem Pfad gefunden wurde (d.h., der Pfad ist eindeutig)
	return !existingSerie;
}

/**
 * Get Serie from db
 */
export async function getSerie(id: number) {
	return await db.query.serie.findFirst({ where: eq(schema.serie.id, id) }).catch((err) => {
		error('Get Serie: ' + err);
	});
}

/**
 * Überprüft, ob eine Serie mit der angegebenen `id` einzigartig in der Datenbank ist.
 * Gibt `true` zurück, wenn die Serie mit dieser ID noch nicht existiert (d.h., die Serie ist einzigartig),
 * andernfalls `false`.
 *
 * @param id - Die ID der Serie, der überprüft werden soll.
 * @returns Ein `Promise`, das `true` zurückgibt, wenn die Serie einzigartig ist (noch nicht vorhanden), andernfalls `false`.
 */
export async function isSerieIDUnique(id: number): Promise<boolean> {
	const existingSerie = await getSerie(id);
	return !existingSerie; // Gibt true zurück, wenn die Serie nicht existiert, andernfalls false
}
