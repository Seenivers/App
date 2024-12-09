import { schema } from '$lib/db/schema';
import { error } from '@tauri-apps/plugin-log';
import { eq } from 'drizzle-orm';
import { db } from '$lib/db/database';
import { migrate } from '$lib/db/migrate';
import { BaseDirectory, exists, readTextFile, remove } from '@tauri-apps/plugin-fs';
import type { OldData } from '$lib/types';
import { getMovie as getMovieTmdb, getCollection as getCollectionTmdb } from '$lib/tmdb';

const WEEKS = 1; // Anzahl der Wochen, nach der die Filme aktualisiert werden sollen
const WEEK_IN_MILLIS = 6.048e8; // 1 Woche in Millisekunden
const WEEKS_IN_MILLIS = WEEK_IN_MILLIS * WEEKS; // Dauer in Millisekunden für die gewünschte Wochen

let loadedSettings: typeof schema.settings.$inferSelect | undefined;

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

	const dataLibExists = await exists('data.lib', { baseDir: BaseDirectory.AppConfig });
	if (dataLibExists) {
		const content = (await readTextFile('data.lib', { baseDir: BaseDirectory.AppConfig })).trim();

		if (content) {
			const data: OldData = JSON.parse(content);

			await Promise.all(
				data.movies.map(async (movie) => {
					const result = await getMovieTmdb(movie.id, loadedSettings?.language);

					if (!result) {
						throw new Error(`Movie with ID ${movie.id} could not be fetched.`);
					}

					await addMovie({
						id: movie.id,
						path: movie.path,
						tmdb: result,
						watched: movie.watched,
						watchTime: movie.watchTime
					});
				})
			);

			await remove('data.lib', { baseDir: BaseDirectory.AppConfig });
		}
	}
}

async function updateEntity(
	entity: typeof schema.movies.$inferSelect | typeof schema.collections.$inferSelect,
	entityType: 'movies' | 'collections'
) {
	try {
		const currentDate = new Date();

		// Falls "updated" nicht gesetzt ist, aktualisiere es auf den aktuellen Zeitpunkt
		if (!entity.updated) {
			await db
				.update(schema[entityType])
				.set({ updated: currentDate })
				.where(eq(schema[entityType].id, entity.id));
		} else {
			// Überprüfen, ob das "updated"-Datum älter als die definierte Zeitspanne ist
			const updatedDate = new Date(entity.updated);
			if (updatedDate.getTime() + WEEKS_IN_MILLIS < currentDate.getTime()) {
				const result =
					entityType === 'movies'
						? await getMovieTmdb(entity.id, loadedSettings?.language)
						: await getCollectionTmdb(entity.id, loadedSettings?.language);

				if (result) {
					await db
						.update(schema[entityType])
						.set({ ...result, updated: currentDate })
						.where(eq(schema[entityType].id, entity.id));
				}
			}
		}
	} catch (err) {
		error(`Fehler beim Aktualisieren der ${entityType}: ` + err);
	}
}

async function updateMovies() {
	try {
		const movies = await getAllMovies();
		if (movies && movies.length > 0) {
			for (const movie of movies) {
				await updateMovieIfNeeded(movie);
			}
		}
	} catch (err) {
		error('Fehler beim Aktualisieren der Filme: ' + err);
	}
}

async function updateMovieIfNeeded(movie: typeof schema.movies.$inferSelect) {
	await updateEntity(movie, 'movies');
	if (movie.tmdb.belongs_to_collection) {
		await processCollection(movie.tmdb.belongs_to_collection.id);
	}
}

async function processCollection(collectionId: number) {
	const collection = await getCollection(collectionId);
	if (!collection) {
		const result = await getCollectionTmdb(collectionId, loadedSettings?.language);
		if (result) {
			await addCollection({ ...result, updated: new Date() });
		}
	}
}

async function updateCollections() {
	try {
		const collections = await getAllCollections();
		if (collections && collections.length > 0) {
			// Collectionen nacheinander durchgehen
			for (const collection of collections) {
				// Aktualisiere Collection, wenn nötig
				await updateEntity(collection, 'collections');
			}
		}
	} catch (err) {
		error('Fehler beim Aktualisieren der Collections: ' + err);
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

updateMovies();
updateCollections();

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
