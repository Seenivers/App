import { schema } from '$lib/db/schema';
import { error } from '@tauri-apps/plugin-log';
import { eq } from 'drizzle-orm';
import { db } from '$lib/db/database';
import { migrate } from '$lib/db/migrate';
import { updateCollections, updateMovies, updateOldDB } from './update';

export let loadedSettings: typeof schema.settings.$inferSelect | undefined;

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

	if (!loadedSettings) {
		const settings = await db.select().from(schema.settings).limit(1);
		loadedSettings = settings[0] ?? (await createDefaultSettings());
	}
}

await initializeSettings();

if (!loadedSettings) {
	throw new Error('Settings is not defined');
}

/**
 * Exportiert die `settings`-Variable, die einmalig geladen und synchron zugänglich ist.
 */
export const settings = loadedSettings;

(async () => {
	if (settings && import.meta.env.PROD) {
		await updateOldDB();
		await updateMovies();
		await updateCollections();
	}
})();

export async function addMovie(data: typeof schema.movies.$inferInsert) {
	return await db
		.insert(schema.movies)
		.values(data)
		.catch((err) => {
			error(`Add Movie: ` + err);
		});
}

export async function deleteMovie(id: number) {
	return await db
		.delete(schema.movies)
		.where(eq(schema.movies.id, id))
		.catch((err) => {
			error(`Delete Movie: ` + err);
		});
}

export async function updateMovie(id: number, data: typeof schema.movies.$inferInsert) {
	return await db
		.update(schema.movies)
		.set(data)
		.where(eq(schema.movies.id, id))
		.catch((err) => {
			error(`Update Movie: ` + err);
		});
}

export async function getMovie(id: number) {
	return await db.query.movies.findFirst({ where: eq(schema.movies.id, id) }).catch((err) => {
		error(`Get Movie: ` + err);
	});
}

export async function getAllMovies() {
	return await db
		.select()
		.from(schema.movies)
		.catch((err) => {
			error(`Get All Movies: ` + err);
		});
}

export async function isPathUnique(path: string): Promise<boolean> {
	const existingMovie = await db.query.movies
		.findFirst({
			where: eq(schema.movies.path, path)
		})
		.catch((err) => {
			error(`Is Path Unique: ` + err);
		});

	// Gibt `true` zurück, wenn kein Film mit diesem Pfad gefunden wurde (d.h., der Pfad ist eindeutig)
	return !existingMovie;
}

/**
 * Überprüft, ob ein Film mit der angegebenen `id` einzigartig in der Datenbank ist.
 * Gibt `true` zurück, wenn der Film mit dieser ID noch nicht existiert (d.h., der Film ist einzigartig),
 * andernfalls `false`.
 *
 * @param id - Die ID des Films, der überprüft werden soll.
 * @returns Ein `Promise`, das `true` zurückgibt, wenn der Film einzigartig ist (noch nicht vorhanden), andernfalls `false`.
 */
export async function isMovieIDUnique(id: number): Promise<boolean> {
	const existingMovie = await getMovie(id);
	return !existingMovie; // Gibt true zurück, wenn der Film nicht existiert, andernfalls false
}

// Add Collection to db
export async function addCollection(data: typeof schema.collections.$inferInsert) {
	return await db
		.insert(schema.collections)
		.values(data)
		.catch((err) => {
			error(`Add Collection: ` + err);
		});
}

export async function getCollection(id: number) {
	return await db.query.collections
		.findFirst({ where: eq(schema.collections.id, id) })
		.catch((err) => {
			error('Get Collection: ' + err);
		});
}

export async function getAllCollections() {
	return await db
		.select()
		.from(schema.collections)
		.catch((err) => {
			error('Get All Collections: ' + err);
		});
}

/**
 * Überprüft, ob eine Sammlung mit der angegebenen `id` einzigartig in der Datenbank ist.
 * Gibt `true` zurück, wenn keine Sammlung mit dieser ID existiert (d.h., die Sammlung ist einzigartig),
 * andernfalls `false`.
 *
 * @param id - Die ID der Sammlung, die überprüft werden soll.
 * @returns Ein `Promise`, das `true` zurückgibt, wenn die Sammlung einzigartig ist (noch nicht vorhanden), andernfalls `false`.
 */
export async function isCollectionIDUnique(id: number): Promise<boolean> {
	const existingCollection = await getCollection(id);
	return !existingCollection;
}
