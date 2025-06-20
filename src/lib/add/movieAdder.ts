import { searchList } from '$lib/stores.svelte';
import { collection } from '$lib/utils/db/collection';
import { movie } from '$lib/utils/db/movie';
import { error } from '@tauri-apps/plugin-log';
import { online } from 'svelte/reactivity/window';
import { loadImages } from './imageLoader';
import { updateSearchStatus } from './utils';
import type { Movie } from '$lib/types/movie';
import * as tmdb from '$lib/utils/tmdb';

export async function addNewMovies(entries: { id: number; index: number }[]) {
	if (!entries?.length || !online.current) return;

	const uniqueEntries: { id: number; index: number }[] = [];

	for (const { id, index } of entries) {
		if (await movie.isIDUnique(id)) {
			uniqueEntries.push({ id, index });
		} else {
			await movie.update(id, { path: searchList[index].options.path });
			updateSearchStatus(index, 'downloaded');
		}
	}

	if (uniqueEntries.length === 0) return;

	uniqueEntries.forEach(({ index }) => updateSearchStatus(index, 'downloading'));

	try {
		const response = await tmdb.getMovies(uniqueEntries.map((entry) => entry.id));

		const movies = response.movies ?? [];
		const errors = response.errors ?? [];

		// Map für schnellen Zugriff von id zu index
		const idToIndexMap = new Map(uniqueEntries.map(({ id, index }) => [id, index]));

		// Paralleles Speichern und Laden von Bildern
		await Promise.all(
			movies.map(async (movie) => {
				const index = idToIndexMap.get(movie.id);
				if (index !== undefined) {
					await addMovieToDatabase(movie.data, index);
					updateSearchStatus(index, 'downloaded');
				}
			})
		);

		// Fehlerhafte Filme markieren
		errors.forEach(({ id }) => {
			const index = idToIndexMap.get(id);
			if (index !== undefined) updateSearchStatus(index, 'notFound');
		});
	} catch (err) {
		uniqueEntries.forEach(({ index }) => updateSearchStatus(index, 'notFound'));
		error(
			`Fehler beim Abrufen der Filme: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`
		);
	}
}

export async function addMovieToDatabase(result: Movie, index: number) {
	await movie.add({
		id: result.id,
		path: searchList[index].options.path,
		tmdb: result
	});

	if (
		result.belongs_to_collection?.id &&
		(await collection.isIDUnique(result.belongs_to_collection.id))
	) {
		const collectionResult = await tmdb.getCollection(result.belongs_to_collection.id);
		if (collectionResult) {
			await collection.add({ ...collectionResult });
		}
	}

	await loadImages(result);
}
