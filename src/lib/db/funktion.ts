import { schema } from '$lib/db/schema';
import { newToast } from '$lib/toast/toast';
import { eq } from 'drizzle-orm';
import { db } from './database';
import { migrate } from './migrate';

let loadedSettings: typeof schema.settings.$inferSelect | undefined;

/**
 * Initialisiert die Settings nur einmal und speichert sie in `loadedSettings`.
 */
async function initializeSettings() {
	await migrate();
	if (!loadedSettings) {
		const settings = (await db.select().from(schema.settings).limit(1))[0];
		if (!settings) {
			await db.insert(schema.settings).values({ id: 1, language: window.navigator.language });
			loadedSettings = (await db.select().from(schema.settings).limit(1))[0];
		} else {
			loadedSettings = settings;
		}
	}
}

await initializeSettings();

/**
 * Exportiert die `settings`-Variable, die einmalig geladen und synchron zugänglich ist.
 */
export const settings = loadedSettings!;

export async function addMovie(data: typeof schema.movies.$inferInsert) {
	return await db
		.insert(schema.movies)
		.values(data)
		.catch((error) => {
			console.error(error), newToast('error', `Add Movie: `, error);
		});
}

export async function deleteMovie(id: number) {
	return await db
		.delete(schema.movies)
		.where(eq(schema.movies.id, id))
		.catch((error) => {
			console.error(error), newToast('error', `Delete Movie: `, error);
		});
}

export async function updateMovie(id: number, data: typeof schema.movies.$inferInsert) {
	return await db
		.update(schema.movies)
		.set(data)
		.where(eq(schema.movies.id, id))
		.catch((error) => {
			console.error(error), newToast('error', `Update Movie: `, error);
		});
}

export async function getMovie(id: number) {
	return await db.query.movies.findFirst({ where: eq(schema.movies.id, id) }).catch((error) => {
		console.error(error), newToast('error', `Get Movie: `, error);
	});
}

export async function getAllMovies() {
	try {
		return await db.select().from(schema.movies);
	} catch (error) {
		console.error(error), newToast('error', `Get All Movies: `, error);
	}
}

export async function isPathUnique(path: string): Promise<boolean> {
	const existingMovie = await db.query.movies.findFirst({
		where: eq(schema.movies.path, path)
	});

	// Gibt `true` zurück, wenn kein Film mit diesem Pfad gefunden wurde (d.h., der Pfad ist eindeutig)
	return !existingMovie;
}
