import { error } from '@tauri-apps/plugin-log';
import { eq } from 'drizzle-orm';
import { db } from './database';
import { settings } from './funktion';
import { BaseDirectory, exists, readTextFile, remove } from '@tauri-apps/plugin-fs';
import type { OldData } from '$lib/types/types';
import {
	getMovie as getMovieTmdb,
	getCollection as getCollectionTmdb,
	getActor as getActorTmdb
} from '$lib/utils/tmdb';
import { schema } from './schema';
import { WEEKS } from '$lib';
import { movie as movieDB } from '$lib/utils/db/movie';
import { collection } from '$lib/utils/db/collection';
import { actor } from '$lib/utils/db/actor';

const WEEK_IN_MILLIS = 6.048e8; // 1 Woche in Millisekunden
const WEEKS_IN_MILLIS = WEEK_IN_MILLIS * WEEKS; // Dauer in Millisekunden für die gewünschte Wochen

export async function updateOldDB() {
	const dataLibExists = await exists('data.lib', { baseDir: BaseDirectory.AppConfig });
	if (dataLibExists) {
		const content = (await readTextFile('data.lib', { baseDir: BaseDirectory.AppConfig })).trim();

		if (content) {
			const data: OldData = JSON.parse(content);

			await Promise.all(
				data.movies.map(async (movie) => {
					const result = await getMovieTmdb(movie.id, settings.language);

					if (!result) {
						throw new Error(`Movie with ID ${movie.id} could not be fetched.`);
					}

					await movieDB.add({
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
	entity:
		| typeof schema.movies.$inferSelect
		| typeof schema.collections.$inferSelect
		| typeof schema.actors.$inferSelect,
	entityType: 'movies' | 'collections' | 'actors'
) {
	try {
		const currentDate = new Date();

		// Aktualisiere das "updated"-Feld, wenn es fehlt
		if (!entity.updated) {
			await db
				.update(schema[entityType])
				.set({ updated: currentDate })
				.where(eq(schema[entityType].id, entity.id));
			return;
		}

		// Aktualisiere die Entität, wenn das "updated"-Datum zu alt ist
		const updatedDate = new Date(entity.updated);
		if (updatedDate.getTime() + WEEKS_IN_MILLIS >= currentDate.getTime()) {
			return;
		}

		// Abrufen der aktuellen Daten basierend auf dem Typ
		const fetchTmdbData = {
			movies: getMovieTmdb,
			collections: getCollectionTmdb,
			actors: getActorTmdb
		}[entityType];

		const result = await fetchTmdbData(entity.id, settings?.language);

		if (result) {
			await db
				.update(schema[entityType])
				.set({ ...result, updated: currentDate })
				.where(eq(schema[entityType].id, entity.id));
		}
	} catch (err) {
		error(`Fehler beim Aktualisieren der ${entityType}: ${err}`);
	}
}

export async function updateMovies() {
	try {
		const movies = await movieDB.getAll();
		if (movies && movies.length > 0) {
			for (const movie of movies) {
				await updateEntity(movie, 'movies');
				if (movie.tmdb.belongs_to_collection) {
					await processCollection(movie.tmdb.belongs_to_collection.id);
				}
				if (movie.tmdb.credits.cast) {
					// `castImages` bestimmen: 0 bedeutet alle Bilder laden
					const imagesToLoad =
						settings.castImages === 0
							? movie.tmdb.credits.cast.length
							: Math.min(settings.castImages, movie.tmdb.credits.cast.length);
					for (let i = 0; i < imagesToLoad; i++) {
						await processActor(movie.tmdb.credits.cast[i].id);
					}
				}
			}
		}
	} catch (err) {
		error('Fehler beim Aktualisieren der Filme: ' + err);
	}
}

async function processCollection(collectionId: number) {
	const collectionResult = await collection.get(collectionId);
	if (!collectionResult) {
		const result = await getCollectionTmdb(collectionId, settings?.language);
		if (result) {
			await collection.add({ ...result, updated: new Date() });
		}
	}
}

async function processActor(actorId: number) {
	const actorResult = await actor.get(actorId);
	if (!actorResult) {
		const result = await getActorTmdb(actorId, settings?.language);
		if (result) {
			await actor.add({ id: result.id, name: result.name, tmdb: result, updated: new Date() });
		}
	}
}

export async function updateCollections() {
	try {
		const collections = await collection.getAll();
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

export async function updateActors() {
	try {
		const actors = await actor.getAll();

		if (actors && actors.length > 0 && settings.castImages !== -1) {
			// `castImages` bestimmen: 0 bedeutet alle Bilder laden
			const imagesToLoad =
				settings.castImages === 0 ? actors.length : Math.min(settings.castImages, actors.length);
			for (let i = 0; i < imagesToLoad; i++) {
				await updateEntity(actors[i], 'actors');
			}
		}
	} catch (err) {
		error('Fehler beim Aktualisieren der Schauspieler: ' + err);
	}
}
