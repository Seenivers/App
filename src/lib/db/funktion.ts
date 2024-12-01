import { schema } from '$lib/db/schema';
import { error } from '@tauri-apps/plugin-log';
import { eq } from 'drizzle-orm';
import { db } from './database';
import { migrate } from './migrate';
import { BaseDirectory, exists, readTextFile, remove } from '@tauri-apps/plugin-fs';
import type { oldData } from '$lib/types';
import { getMovie as getMovieTmdb } from '$lib/tmdb';

let loadedSettings: typeof schema.settings.$inferSelect | undefined;

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
			const data: oldData = JSON.parse(content);

			await Promise.all(
				data.movies.map(async (movie) => {
					const result = await getMovieTmdb(movie.id, loadedSettings?.language);

					if (!result) {
						throw new Error(`Movie with ID ${movie.id} could not be fetched.`);
					}

					addMovie({
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

async function updated() {
	try {
		const movies = await getAllMovies();
		if (movies && movies.length > 0) {
			// Dauer in Millisekunden für 2 Wochen
			const twoWeeksInMillis = 6.048e8 * 2;
			// Aktuelles Datum einmalig berechnen
			const currentDate = new Date();

			// Filme nacheinander durchgehen
			for (const movie of movies) {
				// Falls "updated" nicht gesetzt ist, aktualisiere es auf den aktuellen Zeitpunkt
				if (!movie.updated) {
					await db
						.update(schema.movies)
						.set({ updated: currentDate })
						.where(eq(schema.movies.id, movie.id));
				} else {
					// Überprüfen, ob das "updated"-Datum älter als 2 Wochen ist
					const updatedDate = new Date(movie.updated);
					if (updatedDate.getTime() + twoWeeksInMillis < currentDate.getTime()) {
						const result = await getMovieTmdb(movie.id, loadedSettings?.language);
						await db
							.update(schema.movies)
							.set({ tmdb: result, updated: currentDate })
							.where(eq(schema.movies.id, movie.id));
					} else {
					}
				}
			}
		}
	} catch (err) {
		console.error('Fehler beim Aktualisieren der Filme:', err);
	}
}

async function createDefaultSettings() {
	await db.insert(schema.settings).values({ id: 1, language: window.navigator.language });
	return (await db.select().from(schema.settings).limit(1))[0];
}

await initializeSettings();

/**
 * Exportiert die `settings`-Variable, die einmalig geladen und synchron zugänglich ist.
 */
export const settings = loadedSettings!;

updated();

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
