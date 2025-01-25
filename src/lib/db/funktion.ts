import { schema } from '$lib/db/schema';
import { error } from '@tauri-apps/plugin-log';
import { eq } from 'drizzle-orm';
import { db } from '$lib/db/database';
import { migrate } from '$lib/db/migrate';
import { updateActors, updateCollections, updateMovies, updateOldDB } from './update';

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
	if (settings && import.meta.env.PROD) {
		await updateOldDB();
		await updateMovies();
		await updateCollections();
		await updateActors();
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

export async function deleteCollection(id: number) {
	return await db
		.delete(schema.collections)
		.where(eq(schema.collections.id, id))
		.catch((err) => {
			error(`Delete Collection: ` + err);
		});
}

export async function updateCollection(id: number, data: typeof schema.collections.$inferInsert) {
	return await db
		.update(schema.collections)
		.set(data)
		.where(eq(schema.collections.id, id))
		.catch((err) => {
			error(`Update Collection: ` + err);
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
