import { error } from '@tauri-apps/plugin-log';
import { eq } from 'drizzle-orm';
import { db } from './database';
import {
	addActor,
	addCollection,
	addMovie,
	getAllActors,
	getAllCollections,
	getAllMovies,
	getCollection,
	loadedSettings,
	settings
} from './funktion';
import { BaseDirectory, exists, readTextFile, remove } from '@tauri-apps/plugin-fs';
import type { OldData } from '$lib/types';
import {
	getMovie as getMovieTmdb,
	getCollection as getCollectionTmdb,
	getActor as getActorTmdb
} from '$lib/tmdb';
import { schema } from './schema';

const WEEKS = 1; // Anzahl der Wochen, nach der die Filme aktualisiert werden sollen
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
	entity:
		| typeof schema.movies.$inferSelect
		| typeof schema.collections.$inferSelect
		| typeof schema.actors.$inferSelect,
	entityType: 'movies' | 'collections' | 'actors'
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
						? await getMovieTmdb(entity.id, settings?.language)
						: entityType === 'collections'
							? await getCollectionTmdb(entity.id, settings?.language)
							: await getActorTmdb(entity.id, settings?.language);

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

export async function updateMovies() {
	try {
		const movies = await getAllMovies();
		if (movies && movies.length > 0) {
			for (const movie of movies) {
				await updateEntity(movie, 'movies');
				if (movie.tmdb.belongs_to_collection) {
					await processCollection(movie.tmdb.belongs_to_collection.id);
				}
				if (movie.tmdb.credits.cast) {
					for (const actor of movie.tmdb.credits.cast) {
						await processActor(actor.id);
					}
				}
			}
		}
	} catch (err) {
		error('Fehler beim Aktualisieren der Filme: ' + err);
	}
}

async function processCollection(collectionId: number) {
	const collection = await getCollection(collectionId);
	if (!collection) {
		const result = await getCollectionTmdb(collectionId, settings?.language);
		if (result) {
			await addCollection({ ...result, updated: new Date() });
		}
	}
}

async function processActor(actorId: number) {
	const actor = await getCollection(actorId);
	if (!actor) {
		const result = await getActorTmdb(actorId, settings?.language);
		if (result) {
			await addActor({ id: result.id, name: result.name, tmdb: result, updated: new Date() });
		}
	}
}

export async function updateCollections() {
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

export async function updateActors() {
	try {
		const actors = await getAllActors();
		if (actors && actors.length > 0) {
			for (const actor of actors) {
				await updateEntity(actor, 'actors');
			}
		}
	} catch (err) {
		error('Fehler beim Aktualisieren der Schauspieler: ' + err);
	}
}
